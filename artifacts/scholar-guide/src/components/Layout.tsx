import { Link, useLocation } from 'wouter';
import { useLang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Globe, Search, Home, LayoutList, Map, MessageSquare, Menu, X, BookOpen, Crown, FileText, Bell, User, Newspaper } from 'lucide-react';
import { useState } from 'react';
import { AdSlot } from './AdSlot';

export function Layout({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang } = useLang();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');

  const navLinks = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/opportunities', label: t('opportunities'), icon: Search },
    { href: '/countries', label: t('countries'), icon: Map },
    { href: '/blog', label: t('blog'), icon: Newspaper },
    { href: '/applications', label: t('tracker'), icon: LayoutList },
    { href: '/documents', label: t('documents'), icon: FileText },
    { href: '/learn', label: t('academy'), icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="bg-primary p-1.5 rounded-lg">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                {lang === 'ar' ? 'دليل المنح والهجرة' : 'Scholar Guide'}
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1 mx-6">
            {navLinks.map(link => {
              const isActive = location === link.href || (link.href === '/blog' && location.startsWith('/blog'));
              const cls = `text-sm font-medium gap-1.5 ${isActive ? 'bg-secondary/20 text-secondary' : 'text-muted-foreground'}`;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cls}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/notifications" className="hidden sm:block">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={toggleLang} className="font-bold px-3">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </Button>
            <Link href="/premium">
              <Button variant="default" size="sm" className="hidden sm:flex gap-1.5 bg-gradient-to-r from-accent to-amber-400 text-accent-foreground border-none hover:opacity-90">
                <Crown className="h-4 w-4" />
                {t('premium')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className={`fixed inset-y-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-3/4 max-w-sm bg-background border-${lang === 'ar' ? 'l' : 'r'} shadow-xl p-6 overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Globe className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Scholar Guide</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${location === link.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </div>
                </Link>
              ))}
              <div className="my-4 border-t" />
              <Link href="/premium" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500">
                  <Crown className="h-5 w-5" />
                  {t('premium')}
                </div>
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted">
                  <Globe className="h-5 w-5" />
                  {t('about')}
                </div>
              </Link>
            </nav>

            {/* Privacy & Contact Info */}
            <div className="mt-6 border-t pt-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                  <span>🔒</span>
                  {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {lang === 'ar'
                    ? 'في Global Scholar Guide، نولي أهمية قصوى لخصوصية زوارنا. نحن نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة المستخدم ولعرض إعلانات مخصصة عبر شركائنا مثل Google AdSense. لا نقوم بجمع بيانات شخصية دون موافقتك، وهدفنا هو توفير محتوى تعليمي مفيد وآمن.'
                    : 'At Global Scholar Guide, we prioritize your privacy. We use cookies to improve user experience and display personalized ads via partners like Google AdSense. We do not collect personal data without your consent.'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                  <span>✉️</span>
                  {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                  {lang === 'ar'
                    ? 'إذا كان لديك أي استفسار بخصوص المنح الدراسية أو محتوى الموقع، لا تتردد في التواصل معنا:'
                    : 'For any inquiries about scholarships or site content, feel free to reach out:'}
                </p>
                <a
                  href="mailto:romanye75@gmail.com"
                  className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 hover:bg-primary/20 transition-colors"
                >
                  <span className="text-base">📧</span>
                  <span className="text-xs font-bold text-primary break-all">romanye75@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Floating Chat Bubble */}
      {location !== '/assistant' && (
        <div className={`fixed bottom-20 md:bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-50`}>
          <Link href="/assistant">
            <Button size="icon" className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              <MessageSquare className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-around h-16 px-2 safe-area-bottom">
        {[
          { href: '/', icon: Home, label: t('home') },
          { href: '/opportunities', icon: Search, label: t('opportunities') },
          { href: '/blog', icon: Newspaper, label: t('blog') },
          { href: '/applications', icon: LayoutList, label: t('tracker') },
          { href: '/profile', icon: User, label: t('profile') },
        ].map(item => (
          <Link key={item.href} href={item.href}>
            <div className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${location === item.href || (item.href === '/blog' && location.startsWith('/blog')) ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon className={`h-5 w-5 ${location === item.href ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <footer className="bg-muted border-t mt-auto mb-16 md:mb-0 py-6">
        <div className="container mx-auto px-4">
          <AdSlot slot="footer_banner" size="footer" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="font-bold">Scholar Guide</span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
              <Link href="/opportunities" className="hover:text-primary transition-colors">{t('opportunities')}</Link>
              <Link href="/countries" className="hover:text-primary transition-colors">{t('countries')}</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">{t('blog')}</Link>
              <Link href="/about" className="hover:text-primary transition-colors">{t('about')}</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">{lang === 'ar' ? 'اتصل بنا' : 'Contact'}</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
