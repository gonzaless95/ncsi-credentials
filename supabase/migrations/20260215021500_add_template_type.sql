-- Migration to add missing 'type' column to certificate_templates
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='certificate_templates' AND column_name='type') THEN
        ALTER TABLE certificate_templates ADD COLUMN type text DEFAULT 'certificate' CHECK (type IN ('certificate', 'badge'));
    END IF;
END $$;
