import { useState, useEffect } from 'react';
import { Award, Users, LogOut, CheckCircle, Layout, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganization } from '../hooks/useOrganization';
import Templates from './Templates';
import Recipients from './Recipients';
import Certificates from './Certificates';
import AdminSettings from './AdminSettings';
import { supabase } from '../lib/supabase';

type Tab = 'templates' | 'recipients' | 'certificates' | 'settings';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('templates');
  const [stats, setStats] = useState({
    templates: 0,
    recipients: 0,
    certificates: 0,
  });
  const { signOut, isAdmin } = useAuth();
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization) {
      loadStats();
    }
  }, [organization]);

  const loadStats = async () => {
    if (!organization) return;

    try {
      const [templatesRes, recipientsRes, certificatesRes] = await Promise.all([
        supabase
          .from('certificate_templates')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', organization.id),
        supabase
          .from('recipients')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', organization.id),
        supabase
          .from('certificates')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', organization.id),
      ]);

      setStats({
        templates: templatesRes.count || 0,
        recipients: recipientsRes.count || 0,
        certificates: certificatesRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const tabs = [
    { id: 'templates' as Tab, label: 'Templates', icon: Layout, count: stats.templates, adminOnly: true },
    { id: 'recipients' as Tab, label: 'Recipients', icon: Users, count: stats.recipients, adminOnly: true },
    { id: 'certificates' as Tab, label: 'Certificates', icon: CheckCircle, count: stats.certificates, adminOnly: false },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings, count: null, adminOnly: true },
  ].filter(tab => !tab.adminOnly || isAdmin);

  // Auto-switch to certificates if viewer
  useEffect(() => {
    if (!isAdmin && activeTab !== 'certificates') {
      setActiveTab('certificates');
    }
  }, [isAdmin, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CertifyHub</h1>
                <div className="flex flex-col">
                  {organization && (
                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-tighter">{organization.name}</p>
                  )}
                  {useAuth().user?.user_metadata?.full_name && (
                    <p className="text-sm text-gray-500 font-bold leading-none mt-1">
                      Welcome, {useAuth().user?.user_metadata.full_name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <div
                key={tab.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{tab.label}</p>
                    {tab.count !== null && <p className="text-3xl font-bold text-gray-900">{tab.count}</p>}
                    {tab.id === 'settings' && <p className="text-xs text-gray-400 font-medium">Manage Account</p>}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex -mb-px whitespace-nowrap min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <Templates onUpdate={loadStats} />
                <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                  <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-2">Emergency Data Recovery</h4>
                  <p className="text-xs text-amber-700 mb-4 font-medium">If you are missing templates, they might be under a different organization ID. Click the button below to search and restore them.</p>

                  <button
                    onClick={async () => {
                      const { data, error } = await supabase.from('certificate_templates').select('*');
                      if (error) {
                        alert('Search failed: ' + error.message);
                        return;
                      }

                      const orphans = (data || []).filter(t => t.organization_id !== organization?.id);
                      console.log('--- ORPHAN SEARCH ---', orphans);

                      if (orphans.length === 0) {
                        alert('No other templates found in the database.');
                        return;
                      }

                      const list = orphans.map(t => `- ${t.name}`).join('\n');
                      if (confirm(`Found ${orphans.length} other templates:\n${list}\n\nWould you like to recover them to your current organization?`)) {
                        for (const template of orphans) {
                          await supabase
                            .from('certificate_templates')
                            .update({ organization_id: organization?.id })
                            .eq('id', template.id);
                        }
                        alert('Restored successfully! Refreshing dashboard...');
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
                  >
                    Scan & Restore My Data
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'recipients' && <Recipients onUpdate={loadStats} />}
            {activeTab === 'certificates' && <Certificates onUpdate={loadStats} />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
