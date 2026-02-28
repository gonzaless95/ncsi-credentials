import { useState, useEffect } from 'react';
import { Plus, Eye, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../hooks/useOrganization';

interface Certificate {
  id: string;
  certificate_id: string;
  recipient_name: string;
  recipient_email: string;
  title: string;
  issued_date: string;
  status: 'issued' | 'revoked';
}

interface Template {
  id: string;
  name: string;
  title: string;
  description: string | null;
}

interface Recipient {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function Certificates({ onUpdate }: { onUpdate: () => void }) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    templateId: '',
    recipientId: '',
    customTitle: '',
    customDescription: '',
    issuedDate: new Date().toISOString().split('T')[0],
  });
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization) {
      loadData();
    }
  }, [organization]);

  const loadData = async () => {
    if (!organization) return;

    try {
      const [certsRes, templatesRes, recipientsRes] = await Promise.all([
        supabase
          .from('certificates')
          .select('*')
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('certificate_templates')
          .select('id, name, title, description')
          .eq('organization_id', organization.id),
        supabase
          .from('recipients')
          .select('id, email, first_name, last_name')
          .eq('organization_id', organization.id),
      ]);

      if (certsRes.error) throw certsRes.error;
      if (templatesRes.error) throw templatesRes.error;
      if (recipientsRes.error) throw recipientsRes.error;

      setCertificates(certsRes.data || []);
      setTemplates(templatesRes.data || []);
      setRecipients(recipientsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    try {
      const recipient = recipients.find((r) => r.id === formData.recipientId);
      const template = templates.find((t) => t.id === formData.templateId);

      if (!recipient || !template) return;

      const { error } = await supabase.from('certificates').insert({
        organization_id: organization.id,
        template_id: formData.templateId,
        recipient_id: formData.recipientId,
        recipient_name: `${recipient.first_name} ${recipient.last_name}`,
        recipient_email: recipient.email,
        title: formData.customTitle || template.title,
        description: formData.customDescription || template.description,
        issued_date: formData.issuedDate,
      });

      if (error) throw error;

      await loadData();
      onUpdate();
      resetForm();
    } catch (error) {
      console.error('Error issuing certificate:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id);

      if (error) throw error;
      await loadData();
      onUpdate();
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this certificate?')) return;

    try {
      const { error } = await supabase
        .from('certificates')
        .update({ status: 'revoked' })
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error revoking certificate:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      templateId: '',
      recipientId: '',
      customTitle: '',
      customDescription: '',
      issuedDate: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const getVerificationUrl = (certificateId: string) => {
    return `${window.location.origin}/verify/${certificateId}`;
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading certificates...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Issued Certificates</h2>
        <button
          onClick={() => setShowForm(true)}
          disabled={templates.length === 0 || recipients.length === 0}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Certificate</span>
        </button>
      </div>

      {templates.length === 0 || recipients.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            {templates.length === 0 && 'Create at least one template'}
            {templates.length === 0 && recipients.length === 0 && ' and '}
            {recipients.length === 0 && 'add at least one recipient'} before issuing certificates.
          </p>
        </div>
      ) : null}

      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue New Certificate</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template *
                </label>
                <select
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient *
                </label>
                <select
                  value={formData.recipientId}
                  onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a recipient</option>
                  {recipients.map((recipient) => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.first_name} {recipient.last_name} ({recipient.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Title (optional)
              </label>
              <input
                type="text"
                value={formData.customTitle}
                onChange={(e) => setFormData({ ...formData, customTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave blank to use template title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Description (optional)
              </label>
              <textarea
                value={formData.customDescription}
                onChange={(e) => setFormData({ ...formData, customDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave blank to use template description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issuedDate}
                onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Issue Certificate
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No certificates issued yet</p>
          <p className="text-sm">Issue your first certificate to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Recipient
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Issued
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono text-gray-600">
                    {cert.certificate_id}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="text-gray-900">{cert.recipient_name}</div>
                    <div className="text-gray-500 text-xs">{cert.recipient_email}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{cert.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(cert.issued_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'issued'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <a
                        href={getVerificationUrl(cert.certificate_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="View Certificate"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(getVerificationUrl(cert.certificate_id));
                          alert('Verification link copied!');
                        }}
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                        title="Copy Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      {cert.status === 'issued' && (
                        <button
                          onClick={() => handleRevoke(cert.id)}
                          className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors"
                          title="Revoke"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
