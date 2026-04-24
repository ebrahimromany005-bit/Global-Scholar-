import { useLang } from "@/lib/i18n";
import { usePremium } from "@/hooks/usePremium";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, X, Sparkles, Bell, Bot, FileCheck, Map, Filter, Star } from "lucide-react";

const FEATURES_AR = [
  { icon: X, label: "إزالة جميع الإعلانات" },
  { icon: Bot, label: "اقتراحات ذكية متقدمة من ScholarBot" },
  { icon: FileCheck, label: "مراجعة المستندات بالذكاء الاصطناعي" },
  { icon: Bell, label: "إشعارات فورية وتذكيرات للمواعيد" },
  { icon: Filter, label: "فلاتر بحث متقدمة (التمويل، نسبة القبول، المنح القديمة)" },
  { icon: Map, label: "خريطة تفاعلية متقدمة بكل التفاصيل" },
  { icon: Star, label: "أولوية في عرض الفرص الجديدة قبل الجميع" },
  { icon: Sparkles, label: "تحليلات شخصية لمسارك ومقترحات بنسبة قبول عالية" },
];

const FEATURES_EN = [
  { icon: X, label: "Remove all ads" },
  { icon: Bot, label: "Advanced ScholarBot suggestions" },
  { icon: FileCheck, label: "AI document review" },
  { icon: Bell, label: "Real-time alerts and deadline reminders" },
  { icon: Filter, label: "Advanced search filters (funding, acceptance, archives)" },
  { icon: Map, label: "Advanced interactive map with full details" },
  { icon: Star, label: "Priority access to new opportunities" },
  { icon: Sparkles, label: "Personal analytics and high-fit suggestions" },
];

export default function Premium() {
  const { lang } = useLang();
  const { isPremium, setPremium } = usePremium();
  const features = lang === "ar" ? FEATURES_AR : FEATURES_EN;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="text-center mb-10">
        <div className="bg-accent text-accent-foreground w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          {lang === "ar" ? "افتح كامل قوة المنصة" : "Unlock the full platform"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {lang === "ar"
            ? "النسخة المدفوعة تمنحك تجربة بدون إعلانات، أدوات ذكية متقدمة، وأولوية في كل شيء."
            : "Premium gives you an ad-free experience, advanced AI tools, and priority access to everything."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card className="p-6 relative">
          <div className="text-xs font-bold text-muted-foreground mb-1 uppercase">{lang === "ar" ? "مجاني" : "Free"}</div>
          <div className="font-extrabold text-3xl mb-1">
            {lang === "ar" ? "0$" : "$0"}<span className="text-base font-normal text-muted-foreground">/{lang === "ar" ? "للأبد" : "forever"}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {lang === "ar" ? "كل الأساسيات بشكل مجاني" : "All essentials for free"}
          </p>
          <ul className="space-y-2 text-sm">
            {[
              lang === "ar" ? "بحث في كل الفرص" : "Browse all opportunities",
              lang === "ar" ? "تتبع الطلبات" : "Application tracker",
              lang === "ar" ? "ScholarBot الأساسي" : "Basic ScholarBot",
              lang === "ar" ? "تنبيهات أسبوعية" : "Weekly digest",
              lang === "ar" ? "إعلانات بسيطة" : "Light ads",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 relative bg-gradient-to-br from-accent/5 to-orange-50/50 dark:from-accent/15 dark:to-orange-950/30 border-accent/40 shadow-xl">
          <Badge className="absolute -top-3 right-6 bg-accent text-accent-foreground">
            {lang === "ar" ? "الأكثر شعبية" : "Most Popular"}
          </Badge>
          <div className="text-xs font-bold text-accent mb-1 uppercase flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Premium
          </div>
          <div className="font-extrabold text-3xl mb-1">
            {lang === "ar" ? "9.99$" : "$9.99"}<span className="text-base font-normal text-muted-foreground">/{lang === "ar" ? "شهرياً" : "month"}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {lang === "ar" ? "كل ما تحتاجه للنجاح" : "Everything you need to succeed"}
          </p>
          <ul className="space-y-2 text-sm">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-2">
                <f.icon className="h-4 w-4 text-accent" />
                {f.label}
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
          {lang === "ar" ? "اشترك الآن" : "Subscribe Now"}
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
