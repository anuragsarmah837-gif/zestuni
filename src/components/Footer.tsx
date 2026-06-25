import { Milestone, HelpCircle, GraduationCap, Inbox, ArrowUp } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface FooterProps {
  settings: WebsiteSettings;
  setActiveView: (view: string) => void;
  setSelectedInstitutionSlug: (slug: string | null) => void;
}

export default function Footer({ settings, setActiveView, setSelectedInstitutionSlug }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (view: string) => {
    setActiveView(view);
    setSelectedInstitutionSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-white dark:bg-black border-t border-neutral-100 dark:border-neutral-900 py-16 text-neutral-800 dark:text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              {settings.logoImage ? (
                <img src={settings.logoImage} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm">
                  {settings.logoText.substring(0, 2).toUpperCase()}
                </div>
              )}
              <span className="font-sans font-extrabold text-base tracking-widest text-black dark:text-white uppercase leading-none">
                {settings.logoText} <span className="text-neutral-400">{settings.logoSubText}</span>
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Premium school, coaching, and varsity level digital ordering platform managing supply constraints and official compliance. Authorized by administrative boards.
            </p>
            <div className="text-xs font-mono text-neutral-400">
              © {new Date().getFullYear()} Zestwear Uniforms. All Rights Reserved.
            </div>
          </div>

          {/* Quick links: Products */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">Products</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-none">
              <li>
                <button onClick={() => handleLinkClick('uniforms')} className="hover:text-black dark:hover:text-white transition-colors">
                  School Boys Kits
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('uniforms')} className="hover:text-black dark:hover:text-white transition-colors">
                  School Girls Dress
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('uniforms')} className="hover:text-black dark:hover:text-white transition-colors">
                  University Blazers
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('uniforms')} className="hover:text-black dark:hover:text-white transition-colors">
                  Sports Tracksuits
                </button>
              </li>
            </ul>
          </div>

          {/* Quick links: Institutions */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">Institutions</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-none">
              <li>
                <button onClick={() => handleLinkClick('institutions')} className="hover:text-black dark:hover:text-white transition-colors">
                  Bahona College
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('institutions')} className="hover:text-black dark:hover:text-white transition-colors">
                  Cotton University
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('institutions')} className="hover:text-black dark:hover:text-white transition-colors">
                  Dibrugarh University
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('institutions')} className="hover:text-black dark:hover:text-white transition-colors">
                  Don Bosco Guwahati
                </button>
              </li>
            </ul>
          </div>

          {/* Quick links: Support */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">Support</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-none">
              <li>
                <button onClick={() => handleLinkClick('how-it-works')} className="hover:text-black dark:hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-black dark:hover:text-white transition-colors">
                  About Textiles
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('contact')} className="hover:text-black dark:hover:text-white transition-colors">
                  Submit Partners
                </button>
              </li>
            </ul>
          </div>

          {/* Scroll to Top */}
          <div className="md:col-span-2 flex flex-col md:items-end justify-between self-stretch">
            <button
              onClick={scrollToTop}
              className="p-3 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 rounded-xl text-neutral-500 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1.5 self-start md:self-auto "
              title="Scroll to Top"
            >
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom notes line */}
        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            Official Platform Partner Code: <span className="font-bold text-neutral-700 dark:text-neutral-300">ZESTWEAR-2026</span>
          </div>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
