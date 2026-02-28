/*
  # Certificate Platform Database Schema

  ## Overview
  This migration creates a complete certificate management platform similar to Accredible.
  
  ## 1. New Tables
  
  ### `organizations`
  - `id` (uuid, primary key) - Unique organization identifier
  - `name` (text) - Organization/issuer name
  - `logo_url` (text, nullable) - Organization logo
  - `website` (text, nullable) - Organization website
  - `owner_id` (uuid) - References auth.users
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `certificate_templates`
  - `id` (uuid, primary key) - Unique template identifier
  - `organization_id` (uuid) - References organizations
  - `name` (text) - Template name
  - `title` (text) - Certificate title
  - `description` (text, nullable) - Certificate description
  - `design_config` (jsonb) - Template design configuration (colors, fonts, layout)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `recipients`
  - `id` (uuid, primary key) - Unique recipient identifier
  - `organization_id` (uuid) - References organizations
  - `email` (text) - Recipient email
  - `first_name` (text) - First name
  - `last_name` (text) - Last name
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `certificates`
  - `id` (uuid, primary key) - Unique certificate identifier
  - `certificate_id` (text, unique) - Public verification ID
  - `template_id` (uuid) - References certificate_templates
  - `organization_id` (uuid) - References organizations
  - `recipient_id` (uuid) - References recipients
  - `recipient_name` (text) - Recipient full name (denormalized)
  - `recipient_email` (text) - Recipient email (denormalized)
  - `issued_date` (date) - Date of issuance
  - `title` (text) - Certificate title
  - `description` (text, nullable) - Certificate description
  - `custom_fields` (jsonb, nullable) - Additional custom data
  - `status` (text) - Certificate status (issued, revoked)
  - `created_at` (timestamptz) - Creation timestamp
  
  ## 2. Security
  - Enable RLS on all tables
  - Organizations: Users can manage their own organizations
  - Templates: Users can manage templates for their organizations
  - Recipients: Users can manage recipients for their organizations
  - Certificates: Users can manage certificates for their organizations
  - Public read access for certificate verification by certificate_id
  
  ## 3. Indexes
  - Index on certificates.certificate_id for fast verification lookups
  - Index on recipients.email for fast email lookups
  - Index on organizations.owner_id for fast owner lookups
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website text,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create certificate_templates table
CREATE TABLE IF NOT EXISTS certificate_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  title text NOT NULL,
  description text,
  design_config jsonb DEFAULT '{"color": "#1e40af", "accentColor": "#3b82f6"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id text UNIQUE NOT NULL DEFAULT substring(md5(random()::text || clock_timestamp()::text) from 1 for 16),
  template_id uuid REFERENCES certificate_templates(id) ON DELETE SET NULL,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES recipients(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  issued_date date DEFAULT CURRENT_DATE,
  title text NOT NULL,
  description text,
  custom_fields jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'issued' CHECK (status IN ('issued', 'revoked')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_recipients_email ON recipients(email);
CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_certificates_org_id ON certificates(organization_id);
CREATE INDEX IF NOT EXISTS idx_templates_org_id ON certificate_templates(organization_id);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view own organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create own organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own organizations"
  ON organizations FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Public can view organization basic info" ON organizations;
CREATE POLICY "Public can view organization basic info"
  ON organizations FOR SELECT
  USING (true);

-- Certificate templates policies
CREATE POLICY "Users can view templates for their organizations"
  ON certificate_templates FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Public can view template design config" ON certificate_templates;
CREATE POLICY "Public can view template design config"
  ON certificate_templates FOR SELECT
  USING (true);

CREATE POLICY "Users can create templates for their organizations"
  ON certificate_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update templates for their organizations"
  ON certificate_templates FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete templates for their organizations"
  ON certificate_templates FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

-- Recipients policies
CREATE POLICY "Users can view recipients for their organizations"
  ON recipients FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create recipients for their organizations"
  ON recipients FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update recipients for their organizations"
  ON recipients FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete recipients for their organizations"
  ON recipients FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

-- Certificates policies
CREATE POLICY "Users can view certificates for their organizations"
  ON certificates FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can view issued certificates for verification" ON certificates;
CREATE POLICY "Anyone can view issued certificates for verification"
  ON certificates FOR SELECT
  USING (status = 'issued');

CREATE POLICY "Users can create certificates for their organizations"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update certificates for their organizations"
  ON certificates FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete certificates for their organizations"
  ON certificates FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );