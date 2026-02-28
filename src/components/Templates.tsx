import { useState, useEffect, Suspense, lazy } from 'react';
import { Plus, Edit2, Trash2, Layout, Palette, X, Award, Shield, History } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../hooks/useOrganization';
import { ErrorBoundary } from './Designer/ErrorBoundary';
import { SAMPLE_TEMPLATES } from './Designer/data/sampleTemplates';

// Lazy load to prevent Konva header crashes from breaking the whole app
const CertificateDesigner = lazy(() => import('./Designer'));

interface Template {
  id: string;
  name: string;
  title: string;
  description: string | null;
  type: 'certificate' | 'badge';
  design_config: any;
  created_at: string;
}

export default function Templates({ onUpdate }: { onUpdate: () => void }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDesigner, setShowDesigner] = useState(false);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'certificate' | 'badge'>('all');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    type: 'certificate' as 'certificate' | 'badge',
    design_config: null as any,
  });
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization) {
      loadTemplates();
    }
  }, [organization]);

  const loadTemplates = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('certificate_templates')
        .select('*');

      const filteredData = (data || []).filter(t => t.organization_id === organization.id);

      if (error) throw error;

      const mappedData = filteredData.map(t => ({
        ...t,
        type: t.type || t.design_config?.canvas?.designType || 'certificate'
      }));

      setTemplates(mappedData);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreSamples = async () => {
    if (!organization) return;
    setSaving(true);
    setStatusMessage({ type: 'success', text: 'Checking existing templates...' });

    try {
      // 1. Get existing templates to avoid duplicates
      const { data: existingTemplates } = await supabase
        .from('certificate_templates')
        .select('name')
        .eq('organization_id', organization.id);

      const existingNames = new Set(existingTemplates?.map(t => t.name) || []);

      // 2. Filter out already existing samples
      const payloads = SAMPLE_TEMPLATES
        .filter(sample => !existingNames.has(sample.name))
        .map(sample => {
          const titleElement = sample.elements.find(e => e.id === 'title-full' || e.id === 'title' || e.id === 'cert-title');
          // Safely access content by casting if it exists
          const titleContent = (titleElement as any)?.content;

          return {
            organization_id: organization.id,
            name: sample.name,
            title: titleContent || sample.name,
            description: `Imported from legacy templates (${sample.id})`,
            design_config: {
              canvas: sample.canvas,
              elements: sample.elements
            }
          };
        });

      if (payloads.length === 0) {
        setStatusMessage({ type: 'success', text: 'All available templates are already restored.' });
        return;
      }

      setStatusMessage({ type: 'success', text: `Restoring ${payloads.length} new templates...` });

      const { error } = await supabase
        .from('certificate_templates')
        .insert(payloads);

      if (error) throw error;

      setStatusMessage({ type: 'success', text: `Successfully restored ${payloads.length} new templates!` });
      await loadTemplates();
      onUpdate();
    } catch (err) {
      console.error('Error restoring templates:', err);
      setStatusMessage({ type: 'error', text: 'Failed to restore templates.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    setSaving(true);
    setStatusMessage(null);

    try {
      const finalConfig = formData.design_config ? {
        ...formData.design_config,
        canvas: {
          ...formData.design_config.canvas,
          designType: formData.type
        }
      } : null;

      const payload = {
        organization_id: organization.id,
        name: formData.name,
        title: formData.title,
        description: formData.description || null,
        design_config: finalConfig,
      };

      if (editingId) {
        const { error } = await supabase
          .from('certificate_templates')
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        setStatusMessage({ type: 'success', text: 'Template updated successfully!' });
      } else {
        const { error } = await supabase
          .from('certificate_templates')
          .insert(payload);

        if (error) throw error;
        setStatusMessage({ type: 'success', text: 'Template created successfully!' });
      }

      await loadTemplates();
      onUpdate();
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
      setStatusMessage({ type: 'error', text: 'Failed to save template. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDesignerSave = (designJson: any) => {
    setFormData({ ...formData, design_config: designJson });
    setShowDesigner(false);
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      title: template.title,
      description: template.description || '',
      type: template.type,
      design_config: template.design_config,
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('certificate_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTemplates();
      onUpdate();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      type: 'certificate',
      design_config: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredTemplates = templates.filter(t =>
    activeFilter === 'all' ? true : t.type === activeFilter
  );

  if (loading) {
    return <div className="text-center py-8 text-gray-500 font-medium">Loading templates...</div>;
  }

  if (showDesigner) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center h-screen font-black text-blue-600 animate-pulse uppercase tracking-widest text-lg">Loading visual engine...</div>}>
          <CertificateDesigner
            initialConfig={formData.design_config}
            type={formData.type}
            onSave={handleDesignerSave}
            onClose={() => setShowDesigner(false)}
            organizationName={organization?.name}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-8 relative">
      {statusMessage && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top-8 duration-500 border-2 font-black uppercase tracking-widest text-sm
          ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
          {statusMessage.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Design and manage your digital credentials</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center mr-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${activeFilter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('certificate')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${activeFilter === 'certificate' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Certificates
            </button>
            <button
              onClick={() => setActiveFilter('badge')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${activeFilter === 'badge' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Badges
            </button>
          </div>
          {!showForm && (
            <>
              <button
                onClick={handleRestoreSamples}
                disabled={saving}
                className="flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-100 transition-all border border-indigo-100 disabled:opacity-50"
                title="Restore legacy templates"
              >
                <History className="w-5 h-5" />
                <span>Restore Old</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <Plus className="w-5 h-5" />
                <span>Create New</span>
              </button>
            </>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingId ? 'Edit Template' : 'New Template Setup'}
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X className="w-7 h-7" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all font-medium"
                    placeholder="e.g. Cyber Security Practitioner 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Default Credential Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all font-medium"
                    placeholder="e.g. Certificate of Excellence"
                  />
                </div>
              </div>

              <div className="col-span-1 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Template Type
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'certificate' })}
                      className={`flex flex-col items-center py-4 px-2 rounded-lg transition-all ${formData.type === 'certificate' ? 'bg-white text-blue-600 shadow-md border border-blue-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                    >
                      <Layout className="w-6 h-6 mb-1" />
                      <span className="text-xs font-bold uppercase">Certificate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'badge' })}
                      className={`flex flex-col items-center py-4 px-2 rounded-lg transition-all ${formData.type === 'badge' ? 'bg-white text-blue-600 shadow-md border border-blue-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                    >
                      <Shield className="w-6 h-6 mb-1" />
                      <span className="text-xs font-bold uppercase">Badge</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Internal Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all font-medium"
                placeholder="Internal notes about the credential's purpose..."
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Credential Design</label>
              <button
                type="button"
                onClick={() => setShowDesigner(true)}
                className="flex items-center justify-center space-x-6 w-full py-12 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform">
                  <Palette className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-xl text-blue-900 tracking-tight">
                    {formData.design_config ? 'Edit Visual Design' : 'Open Visual Designer'}
                  </span>
                  <span className="text-sm font-semibold text-blue-700/60 uppercase tracking-wider">
                    {formData.type === 'badge' ? 'Square Aspect Ratio • Hexagonal Presets' : 'A4 Landscape • Sidebar Layouts'}
                  </span>
                </div>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex-[2] bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="flex items-center justify-center space-x-3">
                  {saving && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>{saving ? 'Processing...' : (editingId ? 'Save Changes' : 'Confirm & Create Template')}</span>
                </div>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredTemplates.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] py-32 flex flex-col items-center justify-center text-center px-6">
          <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-100">
            {activeFilter === 'badge' ? <Shield className="w-10 h-10 text-gray-300" /> : <Layout className="w-10 h-10 text-gray-300" />}
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No {activeFilter === 'all' ? '' : activeFilter} templates found</h3>
          <p className="text-gray-500 max-w-sm mb-10 font-medium leading-relaxed">
            We found 17 of your old certificate and badge templates! Click the button below to restore them all to your new project.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleRestoreSamples}
              disabled={saving}
              className="group flex items-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl hoverShadow active:scale-95 disabled:opacity-50"
            >
              <History className="w-6 h-6" />
              <span>{saving ? 'Restoring...' : 'Restore All Old Templates'}</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="group flex items-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-2xl hoverShadow active:scale-95"
            >
              <Plus className="w-6 h-6" />
              <span>Create Fresh Template</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`relative aspect-[1.41] bg-gray-50 flex items-center justify-center border-b border-gray-100 overflow-hidden ${template.type === 'badge' ? 'aspect-square' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>

                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                  {template.type === 'badge' ? <Shield className="w-64 h-64 text-blue-900" /> : <Award className="w-64 h-64 text-blue-900" />}
                </div>

                <div className="absolute top-4 left-4 z-20">
                  <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${template.type === 'badge' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                    {template.type === 'badge' ? <Shield className="w-3 h-3" /> : <Layout className="w-3 h-3" />}
                    <span>{template.type}</span>
                  </span>
                </div>

                <div className="z-10 text-center px-8">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl mb-4 mx-auto group-hover:rotate-12 transition-transform duration-500">
                    <Layout className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-xl text-gray-900 tracking-tight leading-tight">{template.name}</h4>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">ID: {template.id.slice(0, 8)}</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{template.title}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 shadow-sm"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-400 shadow-sm relative -ml-3"></div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit Design"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Template"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
