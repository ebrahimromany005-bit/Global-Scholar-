import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/AdSlot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, FileText, GraduationCap, Globe, Users, Star, Target, Sparkles } from "lucide-react";

const ARTICLES = [
  {
    icon: FileText,
    titleAr: "كيف تكتب CV احترافي للمنح الدولية",
    titleEn: "How to write a professional CV for scholarships",
    descAr: "دليل خطوة بخطوة لإعداد سيرة ذاتية تجذب لجان المنح.",
    descEn: "Step-by-step guide to crafting a CV that wins committees.",
    category: "ar",
    contentAr: `# كيف تكتب CV احترافي للمنح

السيرة الذاتية هي أول ما تراه لجنة المنحة. إليك المبادئ الأساسية:

## 1. ابدأ بمعلومات واضحة
- الاسم الكامل
- البريد الإلكتروني الاحترافي
- رقم هاتف صالح للتواصل الدولي
- رابط LinkedIn (إن وجد)

## 2. الهدف المهني (Personal Statement)
3-4 أسطر تلخص: من أنت، ماذا درست، إلى أين تريد أن تصل، ولماذا هذه المنحة تحديداً.

## 3. التعليم
- اذكر شهاداتك من الأحدث للأقدم
- المعدل التراكمي (إن كان جيداً)
- المشاريع البحثية المهمة

## 4. الخبرات
- ركز على الإنجازات لا الواجبات
- استخدم أرقاماً وقياسات حقيقية
- الأفعال القوية (قُدت، طوّرت، أنجزت)

## 5. المهارات
- لغوية (مع المستوى)
- تقنية
- شخصية

## نصائح ذهبية
- صفحة أو صفحتان كحد أقصى
- خط واضح (Calibri, Arial)
- صياغة بالإنجليزية حتى لو كانت المنحة عربية
- راجع الأخطاء الإملائية أكثر من مرة`,
    contentEn: `# How to write a professional CV for scholarships

Your CV is the first thing the committee sees. Key principles:

## 1. Clear contact info
Name, professional email, phone with country code, LinkedIn.

## 2. Personal Statement (3-4 lines)
Who you are, what you studied, where you're going, why this scholarship.

## 3. Education
List from newest to oldest. Include GPA if strong.

## 4. Experience
Focus on achievements with numbers. Use action verbs.

## 5. Skills
Languages, technical, soft skills.

## Golden tips
- 1-2 pages max
- Clean font (Calibri, Arial)
- Always English even for Arabic scholarships
- Proofread multiple times`,
  },
  {
    icon: Globe,
    titleAr: "كيف تختار الدولة المناسبة للدراسة أو الهجرة",
    titleEn: "How to choose the right country",
    descAr: "معايير عملية لاتخاذ أهم قرار في رحلتك.",
    descEn: "Practical criteria for the most important decision.",
    category: "country",
    contentAr: `# كيف تختار الدولة المناسبة

اختيار الدولة قرار يؤثر على سنوات من حياتك. اعتمد على هذه المعايير:

## 1. اللغة
- هل تتقن لغة الدولة؟
- كم وقت تحتاج لتعلمها؟
- هل توجد برامج بالإنجليزية؟

## 2. التكلفة
- الرسوم الدراسية
- تكلفة المعيشة الشهرية
- تكاليف التأشيرة والتأمين

## 3. سوق العمل
- هل يسمحون للطلاب بالعمل؟
- ما فرص العمل بعد التخرج؟
- متوسط الراتب في تخصصك

## 4. الاعتراف بالشهادة
- هل شهادة الدولة معترف بها في بلدك؟
- هل تساعد في الهجرة لاحقاً؟

## 5. الثقافة والمناخ
- مدى التقبل الثقافي
- المناخ السياسي والديني
- المسافة من العائلة

## نصيحتنا
لا تختر دولة لمجرد سمعتها. اختر بناءً على معاييرك الشخصية.`,
    contentEn: `# How to choose the right country

This decision affects years of your life. Use these criteria:

## 1. Language
Do you speak it? How long to learn it? English programs available?

## 2. Cost
Tuition + monthly living + visa + insurance.

## 3. Job market
Student work allowed? Post-graduation prospects? Average salaries.

## 4. Degree recognition
Recognized in your home country? Helps with future migration?

## 5. Culture & climate
Cultural openness, political climate, distance from family.

## Our advice
Don't pick by reputation alone. Pick by your personal criteria.`,
  },
  {
    icon: Users,
    titleAr: "إعداد مقابلات السفارة",
    titleEn: "Embassy interview preparation",
    descAr: "كيف تتجاوز مقابلة التأشيرة بثقة.",
    descEn: "Pass your visa interview with confidence.",
    category: "interview",
    contentAr: `# إعداد مقابلات السفارة

مقابلة السفارة لحظة حاسمة. كن مستعداً:

## قبل المقابلة
- جهز كل المستندات الأصلية ونسخ
- ارتدِ ملابس رسمية بسيطة
- احضر قبل الموعد بـ30 دقيقة على الأقل

## خلال المقابلة
- ابتسم وحافظ على التواصل البصري
- أجوبتك مختصرة ومباشرة
- لا تكذب أبداً، فالموظف خبير في كشف الأكاذيب
- جاوب باللغة المطلوبة (إنجليزية غالباً)

## أكثر الأسئلة شيوعاً
- لماذا اخترت هذه الدولة؟
- لماذا اخترت هذه الجامعة؟
- كيف ستمول دراستك؟
- ما خططك بعد التخرج؟
- هل لديك أقارب في تلك الدولة؟

## نصيحة
حضّر إجاباتك مسبقاً ومرّن نفسك بصوت عالٍ. ثقتك بنفسك = نصف الفوز.`,
    contentEn: `# Embassy interview preparation

A decisive moment. Be ready:

## Before the interview
Prep all original docs + copies. Wear simple formal clothes. Arrive 30 min early.

## During
Smile, maintain eye contact. Short, direct answers. Never lie. Answer in the required language (usually English).

## Most common questions
Why this country? Why this university? How will you fund? Plans after graduation? Family in that country?

## Advice
Prepare answers in advance, practice aloud. Your confidence = half the win.`,
  },
  {
    icon: GraduationCap,
    titleAr: "كتابة خطاب الدوافع المثالي",
    titleEn: "Writing the perfect motivation letter",
    descAr: "هيكل وأسرار خطاب يفتح لك الأبواب.",
    descEn: "Structure and secrets of a winning letter.",
    category: "motivation",
    contentAr: `# كتابة خطاب الدوافع المثالي

خطاب الدوافع هو فرصتك للتميز. هيكل ناجح:

## الفقرة الأولى - الافتتاحية القوية
ابدأ بقصة قصيرة أو سؤال يجذب الانتباه. اربطه بالبرنامج.

## الفقرة الثانية - التعليم والخبرة
لخص أبرز إنجازاتك الأكاديمية والمهنية المرتبطة بالتخصص.

## الفقرة الثالثة - لماذا هذا البرنامج تحديداً
- لماذا هذه الجامعة؟
- لماذا هذا التخصص؟
- كيف يخدم أهدافك؟
- اذكر أسماء أساتذة محددين أو مواد مميزة

## الفقرة الرابعة - أهدافك المستقبلية
كيف ستستفيد من الشهادة؟ كيف ستخدم بلدك أو مجالك؟

## الفقرة الخامسة - الخاتمة
أعد التأكيد على شغفك واستعدادك. اشكر اللجنة على وقتها.

## أخطاء شائعة تجنبها
- المبالغة والكلمات المعقدة
- نسخ نموذج جاهز بدون تخصيص
- التركيز على نفسك دون ربط بالبرنامج
- الأخطاء الإملائية والنحوية`,
    contentEn: `# Writing the perfect motivation letter

Your chance to stand out. Winning structure:

## Para 1 — Strong opening
Short story or hook. Tie to the program.

## Para 2 — Education & experience
Top achievements relevant to the field.

## Para 3 — Why this program
Why this university? This major? How it serves your goals? Name specific professors/courses.

## Para 4 — Future goals
How will you use the degree? Serve your country/field?

## Para 5 — Closing
Reaffirm passion. Thank the committee.

## Common mistakes
Pompous words. Generic templates. All about you with no program fit. Typos.`,
  },
  {
    icon: Target,
    titleAr: "كيف تحضر لاختبار IELTS",
    titleEn: "How to prepare for IELTS",
    descAr: "خطة 60 يوم للحصول على 7.0+",
    descEn: "60-day plan to score 7.0+",
    category: "language",
    contentAr: `# كيف تحضر لـ IELTS

اختبار IELTS مفتاح كثير من المنح والهجرات. خطة عملية:

## الأسبوع 1-2: التشخيص
- جرب اختبار تجريبي كامل
- حدد نقاط ضعفك (Listening / Reading / Writing / Speaking)

## الأسابيع 3-6: العمل المركز
- يومياً: ساعة استماع + ساعة قراءة
- 3 مرات أسبوعياً: كتابة Essay كامل (Task 2)
- يومياً: تحدث 15 دقيقة بصوت عالٍ مع تسجيل صوتي

## الأسبوع 7: المراجعة
- اختبارات تجريبية كاملة كل يومين
- راجع أخطاءك وافهم سبب كل خطأ

## الأسبوع 8: التهيئة النفسية
- نم جيداً
- اعرف مكان الاختبار قبلها بيومين
- جهز مستنداتك

## مصادر مجانية
- IELTS Liz (YouTube)
- British Council Cambridge tests
- Magoosh blog`,
    contentEn: `# How to prepare for IELTS

A practical plan:

## Weeks 1-2: Diagnosis
Take full mock test. Identify weak skill.

## Weeks 3-6: Focused work
Daily: 1h listening + 1h reading. 3x/week: full Task 2 essay. Daily: 15 min speaking aloud, recorded.

## Week 7: Review
Mock tests every other day. Analyze every mistake.

## Week 8: Mental prep
Sleep well. Visit the test center. Prepare documents.

## Free resources
IELTS Liz, British Council, Cambridge tests, Magoosh.`,
  },
  {
    icon: Star,
    titleAr: "أفضل المنح للطلاب العرب 2026",
    titleEn: "Best scholarships for Arab students 2026",
    descAr: "قائمة محدثة لأهم الفرص هذا العام.",
    descEn: "Updated list of top opportunities this year.",
    category: "scholarships",
    contentAr: `# أفضل المنح للطلاب العرب لعام 2026

## في أوروبا
- منحة DAAD الألمانية - تمويل كامل ماجستير ودكتوراه
- منحة شيفنينغ البريطانية - ماجستير سنة كاملة
- منحة إيفل الفرنسية - تمويل كامل
- منح إيراسموس موندوس - مشتركة بين دول أوروبية

## في أمريكا
- منحة فولبرايت - من أعرق المنح للماجستير والدكتوراه
- منح Knight-Hennessy في ستانفورد

## في آسيا
- منحة MEXT اليابانية - تمويل كامل
- منحة GKS الكورية - تمويل كامل
- منحة CSC الصينية - شائعة جداً
- منحة Taiwan Scholarship

## في أستراليا
- جوائز أستراليا الحكومية

## في تركيا
- منحة تركيا (Türkiye Bursları)

## في الإمارات والسعودية
- منح الجامعات الخاصة
- منح خادم الحرمين

## نصيحة
ابدأ التحضير قبل الموعد بـ8 أشهر على الأقل!`,
    contentEn: `# Best scholarships for Arab students 2026

## Europe
DAAD (Germany), Chevening (UK), Eiffel (France), Erasmus Mundus.

## Americas
Fulbright, Knight-Hennessy (Stanford).

## Asia
MEXT (Japan), GKS (Korea), CSC (China), Taiwan Scholarship.

## Australia
Australia Awards.

## Turkey
Türkiye Bursları.

## Middle East
Private university scholarships, King Salman scholarships.

## Tip
Start prep at least 8 months before deadline!`,
  },
];

export default function Learn() {
  const { lang } = useLang();
  const [active, setActive] = useState<typeof ARTICLES[number] | null>(null);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center gap-2">
        <BookOpen className="h-8 w-8 text-primary" />
        {lang === "ar" ? "أكاديمية المنح والهجرة" : "Scholar Academy"}
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        {lang === "ar"
          ? "محتوى تعليمي مكثّف، نصائح خبراء، ومقالات شاملة لمساعدتك في كل خطوة من رحلتك."
          : "In-depth educational content and expert advice for every step of your journey."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {ARTICLES.map((a) => (
          <Card
            key={a.titleEn}
            onClick={() => setActive(a)}
            className="p-6 hover-elevate cursor-pointer group"
          >
            <div className="bg-secondary/15 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:bg-secondary/25 transition-colors">
              <a.icon className="h-6 w-6 text-secondary" />
            </div>
            <Badge variant="outline" className="mb-2 text-xs">{a.category}</Badge>
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              {lang === "ar" ? a.titleAr : a.titleEn}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lang === "ar" ? a.descAr : a.descEn}
            </p>
            <Button variant="link" className="px-0 mt-2 text-primary">
              {lang === "ar" ? "اقرأ المقال" : "Read article"} →
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 mb-6">
        <Sparkles className="h-6 w-6 text-primary mb-2" />
        <h3 className="font-bold text-lg mb-1">
          {lang === "ar" ? "اسأل ScholarBot أي سؤال" : "Ask ScholarBot anything"}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {lang === "ar"
            ? "مساعد ذكي متاح 24/7 يجيب على كل أسئلتك حول المنح والهجرة."
            : "AI assistant available 24/7 for all your scholarship and migration questions."}
        </p>
        <Button asChild>
          <a href="/assistant">{lang === "ar" ? "ابدأ المحادثة" : "Start chatting"}</a>
        </Button>
      </Card>

      <AdSlot slot="learn_inline" size="banner" />

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{active && (lang === "ar" ? active.titleAr : active.titleEn)}</DialogTitle>
            <DialogDescription>{active && (lang === "ar" ? active.descAr : active.descEn)}</DialogDescription>
          </DialogHeader>
          {active && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
              {lang === "ar" ? active.contentAr : active.contentEn}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
