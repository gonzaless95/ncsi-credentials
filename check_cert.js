
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const oldUrl = 'https://jjaxskbvulnnjsvjexpi.supabase.co';
const oldKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYXhza2J2dWxubmpzdmpleHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjI1OTgsImV4cCI6MjA4NjQ5ODU5OH0.BKQEsPVFFseFUYE-oa4ceT4iWu33TB8J9PiNpEMnya0';

const supabase = createClient(oldUrl, oldKey);

async function harvestData() {
    console.log('--- HARVESTING DATA FROM OLD PROJECT BY ID ---');

    // 1. Load the harvested IDs
    const raw = fs.readFileSync('old_project_harvest.json', 'utf8');
    const data = JSON.parse(raw);
    const certs = data.certificates;

    const orgIds = [...new Set(certs.map(c => c.organization_id))];
    const templateIds = [...new Set(certs.map(c => c.template_id))];

    console.log(`Searching for ${orgIds.length} Orgs and ${templateIds.length} Templates...`);

    const organizations = [];
    const templates = [];

    for (const id of orgIds) {
        if (!id) continue;
        const { data: org } = await supabase.from('organizations').select('*').eq('id', id).maybeSingle();
        if (org) organizations.push(org);
    }

    for (const id of templateIds) {
        if (!id) continue;
        const { data: template } = await supabase.from('certificate_templates').select('*').eq('id', id).maybeSingle();
        if (template) templates.push(template);
    }

    console.log(`Found ${organizations.length} organizations.`);
    console.log(`Found ${templates.length} templates.`);

    const finalBackup = {
        organizations,
        templates,
        certificates: certs
    };

    fs.writeFileSync('final_old_project_data.json', JSON.stringify(finalBackup, null, 2));
    console.log('Final data saved to final_old_project_data.json');
}

harvestData();
