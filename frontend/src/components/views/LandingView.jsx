import React from 'react';
import { User } from 'lucide-react';
import ConstellationCanvas from '../ui/ConstellationCanvas';

export default function LandingView({ setView, onOpenHelp, onOpenSettings }) {
  return (
    <div className="bg-background text-on-surface min-h-screen relative overflow-x-hidden">
      <ConstellationCanvas />

      <header className="w-full top-0 sticky bg-surface-container-lowest/80 backdrop-blur border-b border-outline-variant z-50">
        <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
          <div className="text-headline-md font-headline-md font-black text-primary">Chronos</div>
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setView('landing')} 
              className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => setView('dashboard')} 
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('archive')} 
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Archive
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => { setView('dashboard'); onOpenHelp(); }} 
              className="material-symbols-outlined text-on-surface-variant hover:text-primary active:opacity-80 transition-all"
              aria-label="Help and Notifications"
            >
              notifications
            </button>
            <button 
              onClick={() => { setView('dashboard'); onOpenSettings(); }} 
              className="material-symbols-outlined text-on-surface-variant hover:text-primary active:opacity-80 transition-all"
              aria-label="Settings"
            >
              settings
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant flex items-center justify-center text-primary">
              <User size={18} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-desktop grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 bg-primary text-on-primary rounded-lg">
                <span className="font-label-md text-[10px] uppercase tracking-wider">v2.4 Clinical Update</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg md:text-[56px] md:leading-[64px] text-primary max-w-xl">
                Master Your Workflow, Minus the Friction
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                The professional task management suite designed for high-density information and zero-latency execution. Focus on what matters, discard the noise.
              </p>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setView('dashboard')} 
                  className="px-8 py-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Go to Dashboard
                </button>
                <button className="px-8 py-4 bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-all">
                  View Documentation
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-surface-container-lowest/90 backdrop-blur border border-outline-variant rounded-xl overflow-hidden clinical-shadow">
                <div className="h-10 bg-surface-container-low border-b border-outline-variant flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-error/20"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary-fixed/40"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary/20"></div>
                  <div className="ml-4 font-label-md text-[11px] text-on-surface-variant">chronos_dashboard_v1.sys</div>
                </div>
                <div className="p-6 space-y-4">
                  <div 
                    className="flex items-center justify-between p-3 border border-outline-variant rounded bg-surface-bright hover:border-[#4648d4] transition-all cursor-pointer" 
                    onClick={() => setView('dashboard')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-[#E11D48]"></div>
                      <span className="font-body-md text-body-md font-semibold">Q3 Financial Audit Preparation</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant">Today, 4:00 PM</span>
                  </div>
                  <div 
                    className="flex items-center justify-between p-3 border border-outline-variant rounded bg-surface-bright hover:border-[#4648d4] transition-all cursor-pointer" 
                    onClick={() => setView('dashboard')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                      <span className="font-body-md text-body-md">Refactor API Authentication Layer</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant">Tomorrow</span>
                  </div>
                  <div 
                    className="flex items-center justify-between p-3 border border-outline-variant rounded bg-surface-bright hover:border-[#4648d4] transition-all cursor-pointer" 
                    onClick={() => setView('dashboard')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                      <span className="font-body-md text-body-md">Documentation review for Project Alpha</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant">Jul 24</span>
                  </div>
                  <div className="h-px bg-outline-variant/30 w-full"></div>
                  <div className="flex items-center justify-between p-3 opacity-40">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-outline"></div>
                      <div className="h-4 w-32 bg-outline-variant rounded"></div>
                    </div>
                    <div className="h-4 w-12 bg-outline-variant rounded"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low/60 backdrop-blur py-24">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-headline-lg text-headline-lg text-primary">Engineered for Precision</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                High-performance tools shouldn't look like toys. Chronos uses a clinical design system to maximize your output.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="md:col-span-2 bg-surface-container-lowest/80 backdrop-blur border border-outline-variant p-8 rounded-xl flex flex-col justify-between hover:bg-white transition-colors group">
                <div className="space-y-4">
                  <span className="material-symbols-outlined text-secondary text-3xl">view_timeline</span>
                  <h3 className="font-headline-md text-headline-md text-primary">Dynamic Timeline Projection</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                    Automatically project your roadmap completion dates based on current velocity and task weights.
                  </p>
                </div>
                <div className="mt-8 flex space-x-2">
                  <div className="flex-1 h-1 bg-secondary rounded-full"></div>
                  <div className="flex-1 h-1 bg-secondary/40 rounded-full"></div>
                  <div className="flex-1 h-1 bg-secondary/10 rounded-full"></div>
                </div>
              </div>

              <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="material-symbols-outlined text-secondary-fixed text-3xl">bolt</span>
                  <h3 className="font-headline-md text-headline-md">High Velocity Execution</h3>
                  <p className="font-body-md text-body-md opacity-80">
                    Track milestone status updates, filter values instantly, and stay ahead of deadlines.
                  </p>
                </div>
                <button 
                  onClick={() => setView('dashboard')} 
                  className="mt-8 flex items-center font-label-md text-label-md space-x-2 hover:translate-x-2 transition-transform"
                >
                  <span>Go to Live Dashboard</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest/80 backdrop-blur border border-outline-variant p-8 rounded-xl flex flex-col justify-between hover:bg-white transition-colors">
                <div className="space-y-4">
                  <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                  <h3 className="font-headline-md text-headline-md text-primary">Granular Reports</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Audit your time down to the second with automated task logging.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 bg-surface-container-lowest/80 backdrop-blur border border-outline-variant p-8 rounded-xl relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="space-y-4 flex-1">
                    <h3 className="font-headline-md text-headline-md text-primary">High-Density Data Views</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Switch between clinical list views and high-level board views without losing context.
                    </p>
                  </div>
                  <div className="flex-1 w-full bg-surface-container-high h-32 rounded border border-outline-variant flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-2 w-full p-4">
                      <div className="h-12 bg-white border border-outline-variant rounded"></div>
                      <div className="h-12 bg-white border border-outline-variant rounded"></div>
                      <div className="h-12 bg-white border border-outline-variant rounded"></div>
                      <div className="h-12 bg-white border border-outline-variant rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-surface-container-lowest/40 backdrop-blur">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="bg-surface-bright/90 backdrop-blur border border-outline-variant rounded-2xl p-16 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
              <div className="space-y-4">
                <h2 className="font-headline-lg text-headline-lg text-primary">Ready to eliminate the noise?</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Join 20k+ power users who have mastered their schedule.</p>
              </div>
              <div className="mt-8 md:mt-0 flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => setView('dashboard')} 
                  className="px-10 py-5 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-all"
                >
                  Start Dashboard
                </button>
                <button className="px-10 py-5 bg-transparent text-primary font-label-md text-label-md border border-primary rounded-lg hover:bg-surface-container-low transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant py-16 relative z-10">
        <div className="max-w-container-max mx-auto px-margin-desktop grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="text-headline-md font-headline-md font-black text-primary">Chronos</div>
            <p className="font-body-md text-body-md text-on-surface-variant">Precision-engineered workspace for professional teams.</p>
            <div className="flex space-x-4">
              <a className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all" href="#">
                <span className="material-symbols-outlined text-sm">public</span>
              </a>
              <a className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all" href="#">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-primary font-bold uppercase mb-6">Product</h4>
            <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Integrations</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-primary font-bold uppercase mb-6">Support</h4>
            <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">API Reference</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-primary font-bold uppercase mb-6">Company</h4>
            <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-margin-desktop mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <span className="font-label-md text-label-md text-on-surface-variant">© 2024 Chronos Productivity Suite. All rights reserved.</span>
          <div className="flex space-x-6 font-label-md text-label-md text-on-surface-variant">
            <a className="hover:text-primary" href="#">System Status</a>
            <a className="hover:text-primary" href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
