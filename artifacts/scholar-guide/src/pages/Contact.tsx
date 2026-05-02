import { Link } from 'wouter';
import { useLang } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Globe, MessageSquare, Clock, HelpCircle } from 'lucide-react';

export default function Contact() {
  const { lang } = useLang();
  const isAr = lang === 'ar';

  const faqs = isAr ? [
    { q: 'كيف أتواصل معكم؟', a: 'أرسل بريداً إلكترونياً على contact@scholar-guide.app وسنرد خلال 48 ساعة.' },
    { q: 'كيف أُبلّغ عن خطأ في فرصة دراسية؟', a: 'أرسل لنا البريد الإلكتروني مع تفاصيل الفرصة والخطأ الذي وجدته وسنتحقق منه فوراً.' },
    { q: 'هل يمكنني إضافة منحة أو برنامج هجرة غير موجود؟', a: 'نعم، راسلنا ببيانات المنحة (الاسم، الرابط، الدولة، التفاصيل) وسنضيفها خلال أسبوع.' },
    { q: 'كيف يمكنني الإعلان على المنصة؟', a: 'تواصل معنا عبر البريد الإلكتروني للحصول على تفاصيل خيارات الإعلان المتاحة.' },
    { q: 'هل المنصة مجانية للاستخدام؟', a: 'نعم، المنصة مجانية الاستخدام. توجد نسخة مدفوعة تُزيل الإعلانات وتُضيف مميزات متقدمة.' },
  ] : [
    { q: 'How can I contact you?', a: 'Send an email to contact@scholar-guide.app and we will respond within 48 hours.' },
    { q: 'How do I report an error in an opportunity?', a: 'Email us with the opportunity details and the error you found, and we will verify it immediately.' },
    { q: 'Can I add a scholarship or migration program not listed?', a: 'Yes, email us the program details (name, link, country, details) and we will add it within a week.' },
    { q: 'How can I advertise on the platform?', a: 'Contact us via email to get details on available advertising options.' },
    { q: 'Is the platform free to use?', a: 'Yes, the platform is free. There is a paid version that removes ads and adds advanced features.' },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary to-secondary text-primary-foreground py-10">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Mail className="h-12 w-12 mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            {isAr ? 'اتصل بنا' : 'Contact Us'}
          </h1>
          <p className="text-sm opacity-80 max-w-md mx-auto">
            {isAr
              ? 'نسعد بسماعك — لأسئلتك، اقتراحاتك، أو أي ملاحظة تودّ مشاركتها'
              : 'We love hearing from you — for questions, suggestions, or any feedback'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">

        {/* Contact card */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6 pb-5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center md:text-start flex-1">
                <h2 className="text-xl font-bold mb-1">
                  {isAr ? 'البريد الإلكتروني' : 'Email'}
                </h2>
                <p className="text-muted-foreground text-sm mb-3">
                  {isAr
                    ? 'للاستفسارات العامة، الشراكات، والدعم الفني'
                    : 'For general inquiries, partnerships, and technical support'}
                </p>
                <a
                  href="mailto:contact@scholar-guide.app"
                  className="text-primary font-bold text-lg hover:underline"
                >
                  contact@scholar-guide.app
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response time */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted rounded-xl px-4 py-3">
          <Clock className="h-4 w-4 shrink-0" />
          <span>
            {isAr
              ? 'نسعى للرد على جميع الرسائل خلال 48 ساعة من أيام العمل.'
              : 'We aim to respond to all messages within 48 business hours.'}
          </span>
        </div>

        {/* AI Assistant */}
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">
                  {isAr ? 'المساعد الذكي' : 'AI Assistant'}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {isAr
                    ? 'للأسئلة الفورية عن المنح والهجرة، جرّب مساعدنا الذكي — يرد بشكل فوري على مدار الساعة.'
                    : 'For instant questions about scholarships and migration, try our AI assistant — available 24/7.'}
                </p>
                <Link href="/assistant">
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {isAr ? 'افتح المساعد' : 'Open Assistant'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i}>
                <CardContent className="pt-4 pb-4">
                  <p className="font-bold text-sm mb-1">{faq.q}</p>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex justify-center">
          <Link href="/">
            <Button>
              <Globe className="h-4 w-4 me-2" />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
