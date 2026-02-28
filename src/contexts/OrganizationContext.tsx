import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Organization {
    id: string;
    name: string;
    logo_url: string | null;
    website: string | null;
    owner_id: string;
    created_at: string;
}

interface OrganizationContextType {
    organization: Organization | null;
    loading: boolean;
    createOrganization: (name: string, website?: string) => Promise<{ data: Organization | null; error: Error | null }>;
    updateOrganization: (updates: Partial<Organization>) => Promise<{ data: Organization | null; error: Error | null }>;
    reload: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadOrganization = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .eq('owner_id', user.id)
                .maybeSingle();

            if (error) throw error;
            setOrganization(data);
        } catch (error) {
            console.error('Error loading organization:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrganization();
    }, [user]);

    const createOrganization = async (name: string, website?: string) => {
        if (!user) return { data: null, error: new Error('User not authenticated') };

        try {
            const { data, error } = await supabase
                .from('organizations')
                .insert({
                    name,
                    website,
                    owner_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            setOrganization(data);
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    };

    const updateOrganization = async (updates: Partial<Organization>) => {
        if (!organization) return { data: null, error: new Error('No organization found') };

        try {
            const { data, error } = await supabase
                .from('organizations')
                .update(updates)
                .eq('id', organization.id)
                .select()
                .single();

            if (error) throw error;
            setOrganization(data);
            return { data, error: null };
        } catch (error) {
            return { data: null, error: error as Error };
        }
    };

    return (
        <OrganizationContext.Provider
            value={{
                organization,
                loading,
                createOrganization,
                updateOrganization,
                reload: loadOrganization,
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganizationContext() {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganizationContext must be used within an OrganizationProvider');
    }
    return context;
}
