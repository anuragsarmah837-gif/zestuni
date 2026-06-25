import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowUpRight } from 'lucide-react';
import { ContactSubmission, WebsiteSettings } from '../types';

interface ContactSectionProps {
  settings: WebsiteSettings;
  onNewSubmission: (submission: Omit<ContactSubmission, 'id' | 'date' | 'isRead'>) => void;
}

export default function ContactSection({ settings, onNewSubmission }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [message, setMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !institutionName || !message) return;

    try {
      await fetch("https://formsubmit.co/ajax/zestwearuniforms@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Institution: institutionName,
          Message: message
        })
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    onNewSubmission({
      name,
      email,
      institutionName,
      message
    });

    setName('');
    setEmail('');
    setInstitutionName('');
    setMessage('');
    setHasSubmitted(true);

    setTimeout(() => {
      setHasSubmitted(false);
    }, 5000);
  };

  return (
    <section id="contact" className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Background Soft Accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Contact Info Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase block">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold tracking-tight">
                Establish Your Portal
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md">
                Are you an administrator representing a school, board, college, or university? Launch an automated digital store for your students with zero setup cost.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-neutral-300" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase">OFFICIAL EMAIL</span>
                  <a href={`mailto:${settings.contactEmail}`} className="text-sm font-semibold hover:underline text-white transition-all">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-neutral-300" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase">PHONE SUPPORT</span>
                  <a href={`tel:${settings.contactPhone}`} className="text-sm font-semibold hover:underline text-white transition-all">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-neutral-300" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono tracking-wider text-neutral-500 uppercase">OFFICE HEADQUARTERS</span>
                  <p className="text-sm text-neutral-300 leading-relaxed max-w-xs font-sans">
                    {settings.contactAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-white/10 max-w-sm space-y-4">
              <span className="block text-[10px] font-mono tracking-widest text-neutral-500 uppercase">DIGITAL MEDIA</span>
              <div className="flex flex-wrap gap-4">
                {Object.entries(settings.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="text-xs font-mono hover:text-white text-neutral-400 capitalize transition-colors flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-md border border-white/5 hover:border-white/20"
                    >
                      {platform}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Submission Form */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 p-8 sm:p-10 rounded-3xl relative">
            {hasSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 bg-white/10 border border-white/25 rounded-2xl flex items-center justify-center mb-2">
                  <MessageSquare className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold font-sans tracking-tight">Submission Received</h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto">
                  Thank you for your partner proposal. Our chief uniform engineer will evaluate your institutional request and connect back within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-sans tracking-tight mb-2">Partner Application Form</h3>
                  <p className="text-neutral-400 text-xs sm:text-sm">Submit your credentials and custom criteria specs below.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Principal John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 focus:border-white/30 rounded-xl focus:outline-none transition-all placeholder:text-neutral-600 text-sm font-sans"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. principal@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 focus:border-white/30 rounded-xl focus:outline-none transition-all placeholder:text-neutral-600 text-sm font-sans"
                    />
                  </div>
                </div>

                {/* Institution Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">Institution Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bahona College, Jorhat"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 focus:border-white/30 rounded-xl focus:outline-none transition-all placeholder:text-neutral-600 text-sm font-sans"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400">Brief Message or Specific Criteria *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain what grades or custom items (Blazers, Tracksuits, Shirts) you are seeking to manage online..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 focus:border-white/30 rounded-xl focus:outline-none transition-all placeholder:text-neutral-600 text-sm font-sans resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black hover:bg-neutral-100 rounded-xl text-sm font-extrabold tracking-tight transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  Submit Partner Proposal
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
