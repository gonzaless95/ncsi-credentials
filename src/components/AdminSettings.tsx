import { useState } from 'react';
import { Shield, Mail, Lock, User as UserIcon, Building2, Globe, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganization } from '../hooks/useOrganization';

export default function AdminSettings() {
    const { user, updatePassword } = useAuth();
    const { organization, updateOrganization } = useOrganization();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [orgName, setOrgName] = useState(organization?.name || '');
    const [orgWebsite, setOrgWebsite] = useState(organization?.website || '');
    const [orgLoading, setOrgLoading] = useState(false);
    const [orgSuccess, setOrgSuccess] = useState(false);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        const { error } = await updatePassword(newPassword);
        if (error) {
            setPasswordError(error.message);
        } else {
            setPasswordSuccess('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const handleOrgUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrgLoading(true);
        setOrgSuccess(false);

        const { error } = await updateOrganization({ name: orgName, website: orgWebsite });
        if (error) {
            alert('Error updating organization: ' + error.message);
        } else {
            setOrgSuccess(true);
        }
        setOrgLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile & Role Section */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                        <h3 className="font-bold text-gray-800">Account Profile</h3>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                            {user?.user_metadata?.role || 'Admin'}
                        </span>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Full Name</label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-700">
                            <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="font-medium">{user?.user_metadata?.full_name || 'Not set'}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Email Address</label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-700">
                            <Mail className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="font-medium">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Password Management Section */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
                    <Lock className="w-5 h-5 text-gray-500 mr-2" />
                    <h3 className="font-bold text-gray-800">Security Settings</h3>
                </div>
                <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {passwordError && (
                        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 italic text-sm">
                            <AlertCircle size={16} />
                            <span>{passwordError}</span>
                        </div>
                    )}

                    {passwordSuccess && (
                        <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 italic text-sm">
                            <CheckCircle size={16} />
                            <span>{passwordSuccess}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="flex items-center justify-center space-x-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-sm"
                    >
                        <Lock size={16} />
                        <span>Update Secret Password</span>
                    </button>
                </form>
            </section>

            {/* Organization Settings */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
                    <Building2 className="w-5 h-5 text-gray-500 mr-2" />
                    <h3 className="font-bold text-gray-800">Organization Identity</h3>
                </div>
                <form onSubmit={handleOrgUpdate} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Display Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Official Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="url"
                                    value={orgWebsite}
                                    onChange={(e) => setOrgWebsite(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 max-w-md">
                            Updating these details will affect the branding of all past and future certificates issued by this authority.
                        </p>
                        <button
                            type="submit"
                            disabled={orgLoading}
                            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all"
                        >
                            {orgLoading ? <span>Saving...</span> : <><Save size={18} /><span>Apply Changes</span></>}
                        </button>
                    </div>

                    {orgSuccess && (
                        <div className="flex items-center justify-center space-x-2 text-emerald-600 font-bold text-sm bg-emerald-50 py-3 rounded-xl border border-emerald-100">
                            <CheckCircle size={18} />
                            <span>Identity Updated Successfully</span>
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
}
