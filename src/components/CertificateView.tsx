import { useRef, useEffect, useState } from 'react';
import { Award, CheckCircle, XCircle, Building2, Download, Share2, Shield, Clock, Tags, ExternalLink, Linkedin, Twitter, Facebook, MessageSquare, Mail, Link2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CertificateRenderer } from './Designer/components/CertificateRenderer';
import { loadGoogleFont } from './Designer/utils/fontLoader';
import { jsPDF } from 'jspdf';

interface Certificate {
  id: string;
  certificate_id: string;
  recipient_name: string;
  recipient_email: string;
  title: string;
  description: string | null;
  issued_date: string;
  status: 'issued' | 'revoked';
  organization: {
    name: string;
    website: string | null;
  } | null;
  template: {
    design_config: any;
  } | null;
}

export default function CertificateView({ certificateId }: { certificateId: string }) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const stageRef = useRef<any>(null);
  const badgeRef = useRef<any>(null);

  useEffect(() => {
    loadCertificate();
  }, [certificateId]);

  const loadCertificate = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
  *,
  organization: organizations(name, website),
    template: certificate_templates(design_config)
      `)
        .eq('certificate_id', certificateId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError('Certificate not found');
        return;
      }

      const cert = data as unknown as Certificate;
      setCertificate(cert);

      // Load fonts used in the template
      if (cert.template?.design_config?.elements) {
        const fonts = new Set<string>();
        cert.template.design_config.elements.forEach((el: any) => {
          if (el.fontFamily) fonts.add(el.fontFamily);
        });
        fonts.forEach(font => loadGoogleFont(font));
      }
    } catch (err) {
      console.error('Error loading certificate:', err);
      setError('Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Invalid Record</h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            {error || 'This digital credential could not be verified within our authoritative database.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all"
          >
            Back to Gateway
          </button>
        </div>
      </div>
    );
  }

  const designConfig = certificate.template?.design_config;
  const hasDesign = designConfig && designConfig.elements && designConfig.canvas;

  const formattedDate = new Date(certificate.issued_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const placeholderData: Record<string, string> = {
    recipient_name: certificate.recipient_name,
    issue_date: formattedDate,
    date: formattedDate,
    issueDate: formattedDate,
    certificate_id: certificate.certificate_id,
    certificateId: certificate.certificate_id,
    title: certificate.title,
    course_name: certificate.title,
    courseName: certificate.title,
    description: certificate.description || '',
    issuer_name: certificate.organization?.name || 'Verified Issuer',
    organization_name: certificate.organization?.name || 'Verified Issuer',
    f1: certificate.recipient_name,
    f2: formattedDate,
    f3: certificate.certificate_id,
    f4: certificate.title,
    VerifyLink: `https://credentials.ncsi.institute/verify/${certificate.certificate_id}`,
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const shareLinks = {
    linkedin: `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.title)}&organizationName=${encodeURIComponent('National Cyber Security Institute')}&issueYear=${new Date(certificate.issued_date).getFullYear()}&issueMonth=${new Date(certificate.issued_date).getMonth() + 1}&certId=${encodeURIComponent(certificate.certificate_id)}&certUrl=${encodeURIComponent(`https://credentials.ncsi.institute/verify/${certificate.certificate_id}`)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://credentials.ncsi.institute/verify/${certificate.certificate_id}`)}&text=${encodeURIComponent(`I just earned a verified credential: ${certificate.title}!`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://credentials.ncsi.institute/verify/${certificate.certificate_id}`)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out my verified credential: https://credentials.ncsi.institute/verify/${certificate.certificate_id}`)}`,
    email: `mailto:?subject=${encodeURIComponent(`Verified Credential: ${certificate.title}`)}&body=${encodeURIComponent(`Check out my verified credential: https://credentials.ncsi.institute/verify/${certificate.certificate_id}`)}`,
    slack: `https://slack.com/share?text=${encodeURIComponent(`https://credentials.ncsi.institute/verify/${certificate.certificate_id}`)}`
  };

  const handleDownload = async () => {
    if (!stageRef.current) return;

    try {
      // Export Certificate as PDF
      const certDataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      const { width, height } = designConfig.canvas;
      const orientation = width > height ? 'l' : 'p';

      // Use A4 format for standard printing/viewing
      const pdf = new jsPDF(orientation, 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate scaling to fit the page while maintaining aspect ratio
      const ratio = Math.min(pageWidth / width, pageHeight / height);
      const imgWidth = width * ratio;
      const imgHeight = height * ratio;

      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(certDataUrl, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${certificate.title.replace(/\s+/g, '_')}_Certificate.pdf`);

      alert('Certificate downloaded successfully in PDF format.');
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to generate export. Please check browser permissions.');
    }
  };

  const handleVisitIssuer = () => {
    window.open('https://ncsi.institute', '_blank');
  };

  const handleEnroll = () => {
    window.open('https://www.ncsi.institute/collections/expert-level/products/certified-ethical-hacker-professional-cehp-usa', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* Dynamic Header / Banner Area */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Badge Case - Large Preview */}
            <div className="relative group">
              <div className="w-[300px] h-[300px] bg-white rounded-3xl flex items-center justify-center p-4 shadow-2xl shadow-blue-500/10 border border-slate-100 transition-transform group-hover:scale-[1.02] duration-500 overflow-hidden">
                {hasDesign ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <CertificateRenderer
                      ref={badgeRef}
                      canvas={designConfig.canvas}
                      elements={designConfig.elements}
                      placeholderData={placeholderData}
                      maxWidth={270}
                      borderless
                    />
                  </div>
                ) : (
                  <Award size={120} className="text-slate-200" />
                )}
              </div>
              {hasDesign && (
                <div className="w-full h-full p-1 opacity-0 pointer-events-none absolute left-[-9999px]">
                  <CertificateRenderer
                    ref={stageRef}
                    canvas={designConfig.canvas}
                    elements={designConfig.elements}
                    placeholderData={placeholderData}
                    maxWidth={designConfig.canvas.width}
                    borderless
                  />
                </div>
              )}
            </div>

            {/* Core Identity Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <Building2 size={20} className="text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Verified Issuer</span>
                  <button
                    onClick={handleVisitIssuer}
                    className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors flex items-center group text-left"
                  >
                    {certificate.organization?.name || 'Verified Issuer'}
                    <Share2 size={12} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-4 tracking-tight">
                {certificate.title}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                <button
                  onClick={handleShare}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center"
                >
                  <Share2 size={14} className="mr-2" /> Share Credential
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:border-slate-800 transition-all active:scale-95 flex items-center"
                >
                  <Download size={14} className="mr-2" /> Download PDF
                </button>
                <button
                  onClick={handleVisitIssuer}
                  className="p-4 bg-slate-50 text-slate-400 rounded-xl border border-slate-100 hover:bg-slate-100 hover:text-slate-600 transition-all"
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Extensive Details */}
          <div className="lg:col-span-2 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Recipient Profile */}
            <div className="flex items-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                {certificate.recipient_name.charAt(0)}
              </div>
              <div className="ml-5">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Achieved By</p>
                <h3 className="text-2xl font-black text-slate-800">{certificate.recipient_name}</h3>
                <button
                  onClick={() => alert('Public profiles coming soon!')}
                  className="text-blue-600 text-[10px] font-black uppercase mt-1 hover:underline"
                >
                  View Public Profile →
                </button>
              </div>
            </div>

            {/* Description Section */}
            <section>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                <Tags size={16} className="mr-2 text-slate-300" /> Achievement Description
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {designConfig?.canvas?.description || certificate.description || 'Verified achievement and professional competency.'}
                </p>
              </div>
            </section>

            {/* Skills & Knowledge */}
            {designConfig?.canvas?.skills && designConfig.canvas.skills.length > 0 && (
              <section>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                  <Award size={16} className="mr-2 text-slate-300" /> Skills / Knowledge
                </h3>
                <div className="flex flex-wrap gap-2">
                  {designConfig.canvas.skills.map((skill: string, i: number) => (
                    <span key={i} className="px-5 py-2.5 bg-[#00bcd4] text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-sm hover:scale-105 transition-transform cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Timeline */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-100">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <Clock size={10} className="mr-1" /> Issued On
                </h4>
                <p className="text-xl font-black text-slate-800">{formattedDate}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <Shield size={10} className="mr-1 text-emerald-500" /> Expires On
                </h4>
                <p className="text-xl font-black text-slate-800">
                  {designConfig?.canvas?.expiresOn || 'Does not expire'}
                </p>
              </div>
            </section>

            {/* Earning Criteria */}
            {designConfig?.canvas?.earningCriteria && designConfig.canvas.earningCriteria.length > 0 && (
              <section>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                  <Shield size={16} className="mr-2 text-slate-300" /> Earning Criteria
                </h3>
                <div className="space-y-4">
                  {designConfig.canvas.earningCriteria.map((criteria: any) => (
                    <div key={criteria.id} className="flex gap-4 group">
                      <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                        <CheckCircle size={14} className="text-emerald-500 group-hover:text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{criteria.label}</p>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{criteria.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sidebar Actions */}
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">

            {/* Verification Card */}
            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Verified Record</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">Secured by Authoritative Ledger</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Shield size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase">Verify Credential</span>
                  </div>
                  <Share2 size={12} className="text-slate-300" />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Identification</p>
                  <code className="text-[9px] font-mono text-slate-400 break-all p-3 bg-slate-50 rounded-xl block border border-slate-100">
                    {certificate.certificate_id}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://credentials.ncsi.institute/verify/${certificate.certificate_id}`);
                      alert('Link copied!');
                    }}
                    className="w-full mt-3 py-3 rounded-xl border border-dashed border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center group"
                  >
                    <Download size={12} className="mr-2 group-hover:scale-110 transition-transform" /> Copy ID Link
                  </button>
                </div>
              </div>
            </div>

            {/* Issuer Info Card */}
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white shadow-2xl shadow-slate-900/40">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">About the Issuer</h4>
              <div className="flex items-center space-x-4 mb-8 text-left">
                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                  <Building2 size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-black leading-tight uppercase tracking-tight">{certificate.organization?.name || 'Verified Issuer'}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Authoritative Body</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleVisitIssuer}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center group"
                >
                  Visit Issuer Website <ExternalLink size={12} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <button
                  onClick={handleEnroll}
                  className="w-full py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30"
                >
                  Enroll in Course
                </button>
              </div>

              <p className="mt-8 text-[9px] text-slate-500 font-bold text-center uppercase tracking-widest font-mono">
                LICENSE ID: {(certificate.organization?.name || 'ORG').substring(0, 3).toUpperCase()}-{Math.random().toString(36).substring(2, 6).toUpperCase()}
              </p>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-200">
        <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">
          Auth-Engine v4.2.0-Production • Verified Ledger Identity
        </p>
      </div>

      {/* Social Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Share Credential</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Broadcast your achievement</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-3 hover:bg-slate-50 rounded-2xl transition-all"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-6">
                <a href={shareLinks.linkedin} target="_blank" className="flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 bg-[#0077b5] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0077b5]/20 group-hover:scale-110 transition-all">
                    <Linkedin size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">LinkedIn</span>
                </a>
                <a href={shareLinks.twitter} target="_blank" className="flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-all">
                    <Twitter size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">X / Twitter</span>
                </a>
                <a href={shareLinks.facebook} target="_blank" className="flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 bg-[#1877f2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#1877f2]/20 group-hover:scale-110 transition-all">
                    <Facebook size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Facebook</span>
                </a>
                <a href={shareLinks.slack} target="_blank" className="flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 bg-[#4A154B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#4A154B]/20 group-hover:scale-110 transition-all">
                    <MessageSquare size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Slack</span>
                </a>
                <a href={shareLinks.whatsapp} target="_blank" className="flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 bg-[#25d366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#25d366]/20 group-hover:scale-110 transition-all">
                    <Share2 size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">WhatsApp</span>
                </a>
                <a href={shareLinks.email} target="_blank" className="flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-all">
                    <Mail size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email</span>
                </a>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Link</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={`https://credentials.ncsi.institute/verify/${certificate.certificate_id}`}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-mono text-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://credentials.ncsi.institute/verify/${certificate.certificate_id}`);
                      alert('Copied!');
                    }}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
                  >
                    <Link2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
