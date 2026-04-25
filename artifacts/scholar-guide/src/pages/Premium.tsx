import { useLang } from "@/lib/i18n";
import { usePremium } from "@/hooks/usePremium";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Bell,
  Bot,
  FileCheck,
  Map,
  Filter,
  Star,
  Calendar,
  GraduationCap,
  Search,
  BookmarkPlus,
} from "lucide-react";

const FREE_AR = [
  { icon: Search, label: "بحث متقدم في كل الفرص (4,500+ منحة وبرنامج)" },
  { icon: GraduationCap, label: "كل المنح وبرامج الهجرة في 191 دولة" },
  { icon: BookmarkPlus, label: "تتبع غير محدود لطلباتك" },
  { icon: Bot, label: "ScholarBot الذكي للأسئلة والاقتراحات" },
  { icon: FileCheck, label: "مراجعة المستندات بالذكاء الاصطناعي" },
  { icon: Bell, label: "تذكيرات المواعيد النهائية" },
  { icon: Calendar, label: "تقويم شخصي لكل المواعيد" },
  { icon: Filter, label: "فلاتر متقدمة (التمويل، التخصص، الدولة، الدرجة)" },
];

const PREMIUM_AR = [
  { icon: X, label: "إزالة جميع الإعلانات تماماً" },
  { icon: Star, label: "وصول مبكر للفرص الجديدة قبل الجميع بـ48 ساعة" },
  { icon: Sparkles, label: "تحليل ذكي لمسارك مع توصيات بنسبة قبول عالية" },
  { icon: Map, label: "خريطة تفاعلية موسعة بإحصائيات كل دولة" },
];

const FREE_EN = [
  { icon: Search, label: "Advanced search across all opportunities (4,500+)" },
  { icon: GraduationCap, label: "All scholarships & migration programs in 191 countries" },
  { icon: BookmarkPlus, label: "Unlimited application tracking" },
  { icon: Bot, label: "ScholarBot AI assistant for questions and suggestions" },
  { icon: FileCheck, label: "AI document review" },
  { icon: Bell, label: "Deadline reminders" },
  { icon: Calendar, label: "Personal calendar for all deadlines" },
  { icon: Filter, label: "Advanced filters (funding, field, country, degree)" },
];

const PREMIUM_EN = [
  { icon: X, label: "Remove all ads completely" },
  { icon: Star, label: "Early access to new opportunities — 48 hours before everyone" },
  { icon: Sparkles, label: "Smart path analysis with high-fit recommendations" },
  { icon: Map, label: "Extended interactive map with full country stats" },
];

export default function Premium() {
  const { lang } = useLang();
  const { isPremium, setPremium } = usePremium();
  const freeFeatures = lang === "ar" ? FREE_AR : FREE_EN;
  const premiumFeatures = lang === "ar" ? PREMIUM_AR : PREMIUM_EN;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="text-center mb-10">
        <div className="bg-accent text-accent-foreground w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          {lang === "ar" ? "كل المميزات المهمة مجاناً" : "All the essentials, free"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {lang === "ar"
            ? "النسخة المجانية قوية وكاملة. النسخة المدفوعة تضيف فقط بعض اللمسات الإضافية بسعر رمزي."
            : "Our free tier is powerful and complete. Premium adds just a few extras at a symbolic price."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card className="p-6 relative">
          <Badge className="absolute -top-3 right-6 bg-primary text-primary-foreground">
            {lang === "ar" ? "موصى به" : "Recommended"}
          </Badge>
          <div className="text-xs font-bold text-muted-foreground mb-1 uppercase">{lang === "ar" ? "مجاني" : "Free"}</div>
          <div className="font-extrabold text-3xl mb-1">
            {lang === "ar" ? "0$" : "$0"}<span className="text-base font-normal text-muted-foreground">/{lang === "ar" ? "للأبد" : "forever"}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {lang === "ar" ? "كل ما تحتاجه فعلاً للنجاح" : "Everything you actually need to succeed"}
          </p>
          <ul className="space-y-2.5 text-sm">
            {freeFeatures.map((f) => (
              <li key={f.label} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 relative bg-gradient-to-br from-accent/5 to-orange-50/50 dark:from-accent/15 dark:to-orange-950/30 border-accent/40 shadow-xl">
          <Badge className="absolute -top-3 right-6 bg-accent text-accent-foreground">
            {lang === "ar" ? "إزالة الإعلانات" : "Ad-Free"}
          </Badge>
          <div className="text-xs font-bold text-accent mb-1 uppercase flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Premium
          </div>
          <div className="font-extrabold text-3xl mb-1">
            {lang === "ar" ? "2$" : "$2"}<span className="text-base font-normal text-muted-foreground">/{lang === "ar" ? "شهرياً" : "month"}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {lang === "ar" ? "كل ما في المجاني + لمسات إضافية" : "Everything in Free + a few extras"}
          </p>
          <ul className="space-y-2.5 text-sm">
            {premiumFeatures.map((f) => (
              <li key={f.label} className="flex items-start gap-2">
                <f.icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6 mb-10 bg-muted/40">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              {lang === "ar" ? "تجربة بدون إعلانات" : "Try Ad-Free Experience"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === "ar"
                ? "فعّل هذا الخيار لتختبر تجربة Premium في الموقع — كل الإعلانات ستختفي."
                : "Toggle this to preview the Premium experience — all ads will disappear."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{isPremium ? (lang === "ar" ? "مفعّل" : "On") : (lang === "ar" ? "مغلق" : "Off")}</span>
            <Switch checked={isPremium} onCheckedChange={setPremium} />
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-12">
          {lang === "ar" ? "اشترك بـ 2$ شهرياً" : "Subscribe for $2/month"}
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          {lang === "ar"
            ? "إلغاء في أي وقت. ضمان استرداد لمدة 7 أيام."
            : "Cancel anytime. 7-day money-back guarantee."}
        </p>
      </div>
    </div>
  );
}
