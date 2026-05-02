import { Link } from 'wouter';
import { useLang } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Globe, ChevronRight } from 'lucide-react';

export default function Privacy() {
  const { lang } = useLang();
  const isAr = lang === 'ar';

  const sections = isAr ? [
    {
      title: 'المعلومات التي نجمعها',
      content: 'نجمع فقط المعلومات الضرورية لتشغيل الخدمة: بيانات استخدام مجهولة الهوية مثل الصفحات المزارة والبحثات. بيانات الطلبات التي تدخلها في أداة التتبع مخزّنة محلياً على جهازك فقط ولا تُرسل إلى خوادمنا.',
    },
    {
      title: 'كيف نستخدم البيانات',
      content: 'نستخدم البيانات المجمّعة فقط لتحسين المنصة وتخصيص المحتوى المعروض. لا نبيع بياناتك لأي طرف ثالث ولا نشاركها مع أي جهة تسويقية.',
    },
    {
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: 'نستخدم ملفات تعريف الارتباط الأساسية فقط لحفظ تفضيلاتك كاللغة والوضع الليلي. لا نستخدم ملفات تتبع تجارية أو إعلانية من طرف ثالث.',
    },
    {
      title: 'الإعلانات',
      content: 'قد تظهر إعلانات في النسخة المجانية من الخدمة عبر خدمة Google AdSense. هذه الإعلانات لا تؤثر على محتوى الفرص أو المعلومات المقدمة، ولا تُطلع المعلنين على بياناتك الشخصية.',
    },
    {
      title: 'حقوقك',
      content: 'يحق لك في أي وقت: طلب حذف بياناتك، الاطلاع على ما نجمعه، أو التواصل معنا لأي استفسار يتعلق بخصوصيتك. راسلنا على contact@scholar-guide.app.',
    },
    {
      title: 'أمان البيانات',
      content: 'نتخذ إجراءات أمنية معقولة لحماية بياناتك من الوصول غير المصرح به أو الإفصاح أو التغيير أو الحذف.',
    },
    {
      title: 'التغييرات على هذه السياسة',
      content: 'قد نُحدّث سياسة الخصوصية من وقت لآخر. سنُبلّغك بأي تغييرات جوهرية عبر إشعار بارز على الموقع. مواصلتك في استخدام الخدمة بعد التغييرات تعني قبولك للسياسة الجديدة.',
    },
  ] : [
    {
      title: 'Information We Collect',
      content: 'We only collect information necessary to operate the service: anonymous usage data such as pages visited and searches. Application tracking data you enter is stored locally on your device only and is never sent to our servers.',
    },
    {
      title: 'How We Use Data',
      content: 'We use aggregated data only to improve the platform and personalize displayed content. We never sell your data to any third party or share it with any marketing entity.',
    },
    {
      title: 'Cookies',
      content: 'We use only essential cookies to save your preferences like language and dark mode. We do not use commercial or third-party advertising tracking cookies.',
    },
    {
      title: 'Advertisements',
      content: 'Ads may appear in the free version of the service via Google AdSense. These ads do not influence the opportunities or information presented, and advertisers are not given access to your personal data.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right at any time to: request deletion of your data, view what we collect, or contact us for any privacy-related inquiry. Email us at contact@scholar-guide.app.',
    },
    {
      title: 'Data Security',
      content: 'We take reasonable security measures to protect your data from unauthorized access, disclosure, alteration, or deletion.',
    },
    {
      title: 'Changes to This Policy',
      content: 'We may update this privacy policy from time to time. We will notify you of any significant changes via a prominent notice on the site. Continued use of the service after changes means you accept the new policy.',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary to-secondary text-primary-foreground py-10">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Shield className="h-12 w-12 mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="text-sm opacity-80">
            {isAr ? 'آخر تحديث: مايو 2025' : 'Last updated: May 2025'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-4">
        {sections.map((section, i) => (
          <Card key={i}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start gap-2 mb-2">
                <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                <h2 className="font-bold text-base">{section.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed ps-6">{section.content}</p>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/contact">
            <Button variant="outline">
              {isAr ? 'اتصل بنا' : 'Contact Us'}
            </Button>
          </Link>
          <Link href="/">
            <Button>
              <Globe className="h-4 w-4 me-2" />
              {isAr ? 'الرئيسية' : 'Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
