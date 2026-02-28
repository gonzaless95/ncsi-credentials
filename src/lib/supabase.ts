import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website: string | null;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website?: string | null;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website?: string | null;
          owner_id?: string;
          created_at?: string;
        };
      };
      certificate_templates: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          title: string;
          description: string | null;
          type: 'certificate' | 'badge';
          design_config: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          title: string;
          description?: string | null;
          type: 'certificate' | 'badge';
          design_config?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          title?: string;
          description?: string | null;
          type?: 'certificate' | 'badge';
          design_config?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipients: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          created_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          certificate_id: string;
          template_id: string | null;
          organization_id: string;
          recipient_id: string;
          recipient_name: string;
          recipient_email: string;
          issued_date: string;
          title: string;
          description: string | null;
          custom_fields: Record<string, unknown>;
          status: 'issued' | 'revoked';
          created_at: string;
        };
        Insert: {
          id?: string;
          certificate_id?: string;
          template_id?: string | null;
          organization_id: string;
          recipient_id: string;
          recipient_name: string;
          recipient_email: string;
          issued_date?: string;
          title: string;
          description?: string | null;
          custom_fields?: Record<string, unknown>;
          status?: 'issued' | 'revoked';
          created_at?: string;
        };
        Update: {
          id?: string;
          certificate_id?: string;
          template_id?: string | null;
          organization_id?: string;
          recipient_id?: string;
          recipient_name?: string;
          recipient_email?: string;
          issued_date?: string;
          title?: string;
          description?: string | null;
          custom_fields?: Record<string, unknown>;
          status?: 'issued' | 'revoked';
          created_at?: string;
        };
      };
    };
  };
};
