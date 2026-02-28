
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwexsstmxvcrrtunibun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZXhzc3RteHZjcnJ0dW5pYnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMjA0OTgsImV4cCI6MjA4Nzc5NjQ5OH0.BHhsvlKAehLCA5SD3Yll8fRmK_bC27zR4NPIKxcCYFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnostic() {
    console.log('STARTING DIAGNOSTIC...');

    try {
        const { data: orgs, error: orgError } = await supabase.from('organizations').select('*');
        if (orgError) {
            console.error('Org Error:', orgError);
        } else {
            console.log('Organizations:', orgs?.length);
            orgs?.forEach(o => console.log(`ORG: ${o.name} (ID: ${o.id}) OWNER: ${o.owner_id}`));
        }

        const { data: templates, error: tempError } = await supabase.from('certificate_templates').select('id, name, organization_id');
        if (tempError) {
            console.error('Template Error:', tempError);
        } else {
            console.log('Templates:', templates?.length);
            templates?.forEach(t => console.log(`TEMPLATE: ${t.name} (ID: ${t.id}) ORG: ${t.organization_id}`));
        }
    } catch (e) {
        console.error('Runtime Error:', e);
    }

    console.log('DIAGNOSTIC COMPLETE.');
}

diagnostic();
