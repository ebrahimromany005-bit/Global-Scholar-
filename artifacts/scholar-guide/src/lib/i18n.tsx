import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ar' | 'en';

const translations = {
  ar: {
    home: 'الرئيسية',
    opportunities: 'الفرص',
    countries: 'الدول',
    tracker: 'الطلبات',
    assistant: 'المساعد',
    documents: 'المستندات',
    academy: 'الأكاديمية',
    premium: 'النسخة المدفوعة',
    search_placeholder: 'ابحث عن منحة، دولة، أو تخصص...',
    featured_opportunities: 'فرص مميزة',
    recommended_for_you: 'مقترح لك',
    top_destinations: 'أبرز الوجهات',
    upcoming_deadlines: 'مواعيد قريبة',
    view_all: 'عرض الكل',
    track_application: 'تتبع الطلب',
    apply_now: 'قدم الآن',
    share: 'مشاركة',
    ad_space: 'مساحة إعلانية - جاهز لربط Google AdSense',
    scholarships: 'منح دراسية',
    migration: 'هجرة',
    all: 'الكل',
    applications_empty: 'لا توجد طلبات بعد — ابدأ رحلتك من صفحة الفرص',
    smart_assistant: 'مساعد ذكي يجاوب على كل أسئلتك حول المنح والهجرة',
    premium_benefits: 'إزالة الإعلانات، اقتراحات AI متقدمة، مراجعة المستندات بالذكاء الاصطناعي',
    try_ad_free: 'تجربة بدون إعلانات',
    not_found: 'الصفحة غير موجودة',
    back_home: 'العودة للرئيسية',
    about: 'عن المنصة',
    resources: 'الموارد',
    platform: 'المنصة',
    copyright: 'جميع الحقوق محفوظة',
    calendar: 'التقويم',
    notifications: 'الإشعارات',
    profile: 'الملف الشخصي',
    deadline: 'الموعد النهائي',
    funding: 'التمويل',
    degree: 'الدرجة',
    field: 'التخصص',
    requirements: 'الشروط',
    benefits: 'المميزات',
    eligibility: 'الأهلية',
    related_opportunities: 'فرص مشابهة',
    explore_countries: 'استكشف الدول',
    scholarship: 'منحة دراسية',
    status_planning: 'تخطيط',
    status_in_progress: 'قيد التجهيز',
    status_submitted: 'تم التقديم',
    status_accepted: 'مقبول',
    status_rejected: 'مرفوض',
    download_available: 'متاح للتحميل',
    ai_review: 'مراجعة بالذكاء الاصطناعي',
    premium_only: 'متاح في النسخة المدفوعة',
    recent_alerts: 'أحدث الإشعارات',
    blog: 'المقالات',
  },
  en: {
    home: 'Home',
    opportunities: 'Opportunities',
    countries: 'Countries',
    tracker: 'Tracker',
    assistant: 'Assistant',
    documents: 'Documents',
    academy: 'Academy',
    premium: 'Premium',
    search_placeholder: 'Search scholarships, countries, or fields...',
    featured_opportunities: 'Featured Opportunities',
    recommended_for_you: 'Recommended for You',
    top_destinations: 'Top Destinations',
    upcoming_deadlines: 'Upcoming Deadlines',
    view_all: 'View All',
    track_application: 'Track Application',
    apply_now: 'Apply Now',
    share: 'Share',
    ad_space: 'Ad Space — Ready for Google AdSense',
    scholarships: 'Scholarships',
    migration: 'Migration',
    all: 'All',
    applications_empty: 'No applications yet — start your journey from the Opportunities page',
    smart_assistant: 'Smart assistant to answer all your scholarship and migration questions',
    premium_benefits: 'Remove ads, advanced AI suggestions, AI document review',
    try_ad_free: 'Try Ad-Free',
    not_found: 'Page not found',
    back_home: 'Back to Home',
    about: 'About',
    resources: 'Resources',
    platform: 'Platform',
    copyright: 'All rights reserved',
    calendar: 'Calendar',
    notifications: 'Notifications',
    profile: 'Profile',
    deadline: 'Deadline',
    funding: 'Funding',
    degree: 'Degree Level',
    field: 'Field of Study',
    requirements: 'Requirements',
    benefits: 'Benefits',
    eligibility: 'Eligibility',
    related_opportunities: 'Related Opportunities',
    explore_countries: 'Explore Countries',
    scholarship: 'Scholarship',
    status_planning: 'Planning',
    status_in_progress: 'In Progress',
    status_submitted: 'Submitted',
    status_accepted: 'Accepted',
    status_rejected: 'Rejected',
    download_available: 'Available to Download',
    ai_review: 'AI Review',
    premium_only: 'Premium Only',
    recent_alerts: 'Recent Alerts',
    blog: 'Articles',
  }
};

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['ar']) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('scholar_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  const setLang = (newLang: Language) => {
    localStorage.setItem('scholar_lang', newLang);
    setLangState(newLang);
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: keyof typeof translations['ar']) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLang() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLang must be used within an I18nProvider');
  }
  return context;
}
