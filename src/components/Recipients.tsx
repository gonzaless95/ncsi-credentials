import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOrganization } from '../hooks/useOrganization';

interface Recipient {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export default function Recipients({ onUpdate }: { onUpdate: () => void }) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization) {
      loadRecipients();
    }
  }, [organization]);

  const loadRecipients = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error('Error loading recipients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;

    try {
      if (editingId) {
        const { error } = await supabase
          .from('recipients')
          .update({
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('recipients')
          .insert({
            organization_id: organization.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
          });

        if (error) throw error;
      }

      await loadRecipients();
      onUpdate();
      resetForm();
    } catch (error) {
      console.error('Error saving recipient:', error);
    }
  };

  const handleEdit = (recipient: Recipient) => {
    setFormData({
      email: recipient.email,
      firstName: recipient.first_name,
      lastName: recipient.last_name,
    });
    setEditingId(recipient.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipient?')) return;

    try {
      const { error } = await supabase
        .from('recipients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadRecipients();
      onUpdate();
    } catch (error) {
      console.error('Error deleting recipient:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading recipients...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recipients</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recipient</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Recipient' : 'Add Recipient'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="recipient@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update Recipient' : 'Add Recipient'}
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

      {recipients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No recipients yet</p>
          <p className="text-sm">Add recipients to issue certificates to them</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Added</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((recipient) => (
                <tr key={recipient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {recipient.first_name} {recipient.last_name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{recipient.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(recipient.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(recipient)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(recipient.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
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
