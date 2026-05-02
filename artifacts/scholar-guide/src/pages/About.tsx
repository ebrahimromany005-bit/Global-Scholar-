import { Link } from 'wouter';
import { useLang } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Mail, Shield, FileText, BookOpen, Users, Heart } from 'lucide-react';

export default function About() {
  const { lang } = useLang();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary to-secondary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Globe className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-extrabold mb-3">
            {isAr ? 'عن دليل المنح والهجرة العالمي' : 'About Global Scholar & Migration Guide'}
          </h1>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            {isAr
              ? 'منصتك الموثوقة لاستكشاف الفرص الدراسية والهجرة حول العالم'
              : 'Your trusted platform for discovering scholarships and migration opportunities worldwide'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-3xl space-y-12">

        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            {isAr ? 'رسالتنا' : 'Our Mission'}
          </h2>
          <Card>
            <CardContent className="pt-5 text-sm leading-relaxed text-foreground/90 space-y-3">
              <p>
                {isAr
                  ? 'نؤمن بأن التعليم حق لكل إنسان وليس امتيازاً لفئة معينة. لذلك أسّسنا دليل المنح والهجرة العالمي ليكون المرجع الأول للطلاب العرب الطامحين للدراسة والعيش في الخارج.'
                  : 'We believe education is a right for everyone, not a privilege. We built this platform to be the primary reference for Arab students aspiring to study and live abroad.'}
              </p>
              <p>
                {isAr
                  ? 'نجمع في مكان واحد أكثر من 4500 فرصة دراسية وهجرة في 191 دولة، ونُقدّم محتوى عربياً متخصصاً يُساعدك في اتخاذ أفضل القرارات.'
                  : 'We aggregate over 4,500 study and migration opportunities across 191 countries, providing specialized Arabic content to help you make the best decisions.'}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What we offer */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {isAr ? 'ما نقدمه' : 'What We Offer'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Globe, ar: '191 دولة', en: '191 Countries', desc_ar: 'فرص دراسية وهجرة في كل دول العالم', desc_en: 'Study & migration opportunities worldwide' },
              { icon: FileText, ar: '+4500 فرصة', en: '4500+ Opportunities', desc_ar: 'منح دراسية وبرامج هجرة متنوعة', desc_en: 'Diverse scholarships and migration programs' },
              { icon: BookOpen, ar: '30 مقالاً', en: '30 Articles', desc_ar: 'محتوى متخصص عن المنح والدراسة', desc_en: 'Expert content on scholarships & study' },
              { icon: Users, ar: 'مجتمع داعم', en: 'Supportive Community', desc_ar: 'مساعد ذكي يجيب على كل أسئلتك', desc_en: 'Smart assistant answering all your questions' },
            ].map((item, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <item.icon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{isAr ? item.ar : item.en}</div>
                    <div className="text-sm text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            {isAr ? 'اتصل بنا' : 'Contact Us'}
          </h2>
          <Card>
            <CardContent className="pt-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                {isAr
                  ? 'هل لديك سؤال أو اقتراح أو تريد الإبلاغ عن خطأ؟ يسعدنا سماعك.'
                  : 'Have a question, suggestion, or want to report an issue? We\'d love to hear from you.'}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-primary font-medium">contact@scholar-guide.app</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {isAr
                  ? 'نسعى للرد على جميع الرسائل خلال 48 ساعة.'
                  : 'We aim to respond to all messages within 48 hours.'}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Privacy Policy */}
        <section id="privacy">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h2>
          <Card>
            <CardContent className="pt-5 space-y-4 text-sm text-foreground/90 leading-relaxed">
              <div>
                <h3 className="font-bold mb-1">{isAr ? 'المعلومات التي نجمعها' : 'Information We Collect'}</h3>
                <p className="text-muted-foreground">
                  {isAr
                    ? 'نحن نجمع فقط المعلومات الضرورية لتشغيل الخدمة: بيانات استخدام مجهولة الهوية (مثل الصفحات المزارة والبحثات)، وبيانات الطلبات التي تدخلها في أداة التتبع (المخزّنة محلياً فقط).'
                    : 'We only collect information necessary to operate the service: anonymous usage data (pages visited, searches), and application data you enter in the tracker (stored locally only).'}
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">{isAr ? 'كيف نستخدم البيانات' : 'How We Use Data'}</h3>
                <p className="text-muted-foreground">
                  {isAr
                    ? 'نستخدم البيانات المجمّعة فقط لتحسين المنصة وتخصيص المحتوى. لا نبيع بياناتك لأي طرف ثالث.'
                    : 'We use aggregated data only to improve the platform and personalize content. We never sell your data to third parties.'}
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">{isAr ? 'ملفات تعريف الارتباط' : 'Cookies'}</h3>
                <p className="text-muted-foreground">
                  {isAr
                    ? 'نستخدم ملفات تعريف الارتباط الأساسية فقط لحفظ تفضيلاتك (اللغة، الوضع الليلي). لا نستخدم ملفات تتبع تجارية.'
                    : 'We use only essential cookies to save your preferences (language, dark mode). We do not use commercial tracking cookies.'}
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">{isAr ? 'حقوقك' : 'Your Rights'}</h3>
                <p className="text-muted-foreground">
                  {isAr
                    ? 'يحق لك في أي وقت: طلب حذف بياناتك، الاطلاع على ما نجمعه، أو التواصل معنا لأي استفسار يتعلق بخصوصيتك.'
                    : 'You have the right at any time to: request deletion of your data, see what we collect, or contact us for any privacy-related inquiry.'}
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">{isAr ? 'الإعلانات' : 'Advertisements'}</h3>
                <p className="text-muted-foreground">
                  {isAr
                    ? 'قد تظهر إعلانات في النسخة المجانية من الخدمة. الإعلانات لا تُؤثر على محتوى الفرص أو المعلومات المقدمة.'
                    : 'Ads may appear in the free version. Advertisements do not influence the opportunities or information presented.'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground border-t pt-3">
                {isAr ? 'آخر تحديث: مايو 2025' : 'Last updated: May 2025'}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Terms */}
        <section id="terms">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {isAr ? 'شروط الاستخدام' : 'Terms of Use'}
          </h2>
          <Card>
            <CardContent className="pt-5 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>{isAr ? 'باستخدامك هذه المنصة، أنت توافق على الشروط التالية:' : 'By using this platform, you agree to the following terms:'}</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>{isAr ? 'المعلومات المقدمة للأغراض التثقيفية فقط ولا تُعدّ استشارة قانونية أو مهنية.' : 'Information is for educational purposes only and does not constitute legal or professional advice.'}</li>
                <li>{isAr ? 'نحن لسنا مسؤولين عن قرارات الجامعات أو المنح بشأن طلبات المستخدمين.' : 'We are not responsible for university or scholarship decisions regarding user applications.'}</li>
                <li>{isAr ? 'المحتوى قد يتغير وننصح بالتحقق دائماً من المصادر الرسمية.' : 'Content may change and we advise always verifying from official sources.'}</li>
                <li>{isAr ? 'يُحظر استخدام المنصة لأغراض غير مشروعة أو ضارة.' : 'Using the platform for illegal or harmful purposes is prohibited.'}</li>
              </ul>
              <p className="text-xs border-t pt-3">{isAr ? 'آخر تحديث: مايو 2025' : 'Last updated: May 2025'}</p>
            </CardContent>
          </Card>
        </section>

        <div className="text-center pb-4">
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <Globe className="h-4 w-4" />
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
