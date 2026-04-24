import { Link } from "wouter";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Sparkles, Trophy, Globe, Clock } from "lucide-react";

const ALERTS = [
  { icon: Trophy, type: "highlight", titleAr: "فرص جديدة في كندا!", titleEn: "New opportunities in Canada!", descAr: "تم إضافة 12 فرصة جديدة عبر Express Entry هذا الأسبوع.", descEn: "12 new Express Entry opportunities added this week.", time: "2h" },
  { icon: Calendar, type: "reminder", titleAr: "ينتهي التقديم لمنحة DAAD خلال 14 يوم", titleEn: "DAAD scholarship deadline in 14 days", descAr: "لا تفوت فرصة التقديم — جهز ملفك الآن.", descEn: "Don't miss out — prepare your file now.", time: "1d" },
  { icon: Sparkles, type: "feature", titleAr: "ميزة جديدة: تتبع الطلبات بنظام Kanban", titleEn: "New feature: Kanban application tracker", descAr: "نظم طلباتك بشكل أفضل مع لوحة الكانبان الجديدة.", descEn: "Organize your applications with our new board view.", time: "3d" },
  { icon: Globe, type: "highlight", titleAr: "إضافة 8 دول جديدة إلى المنصة", titleEn: "8 new countries added", descAr: "استكشف الفرص في دول إضافية حول العالم.", descEn: "Explore opportunities in additional countries worldwide.", time: "5d" },
  { icon: Bell, type: "reminder", titleAr: "تأكيد بريدك الإلكتروني للحصول على إشعارات فورية", titleEn: "Verify your email for instant alerts", descAr: "تفعيل البريد يضمن وصولك لإشعارات المواعيد النهائية.", descEn: "Enable instant deadline notifications.", time: "1w" },
  { icon: Trophy, type: "highlight", titleAr: "تهانينا! حصل 3 من مستخدمينا على منح هذا الشهر", titleEn: "Congrats! 3 of our users won scholarships this month", descAr: "اقرأ قصصهم في قسم الأكاديمية.", descEn: "Read their stories in the Academy section.", time: "2w" },
  { icon: Clock, type: "reminder", titleAr: "حدث ملفك الشخصي للحصول على توصيات أفضل", titleEn: "Update your profile for better recommendations", descAr: "أضف اهتماماتك ومجالك للحصول على فرص مخصصة.", descEn: "Add your interests for personalized opportunities.", time: "3w" },
];

const TYPE_COLOR: Record<string, string> = {
  highlight: "bg-primary/15 text-primary",
  reminder: "bg-accent/15 text-accent",
  feature: "bg-secondary/15 text-secondary",
};

export default function Notifications() {
  const { lang, t } = useLang();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center gap-2">
        <Bell className="h-8 w-8 text-primary" />
        {lang === "ar" ? "الإشعارات" : "Notifications"}
      </h1>
      <p className="text-muted-foreground mb-8">{t("recent_alerts")}</p>

      <Card className="p-4 mb-6 bg-gradient-to-br from-accent/10 to-amber-100/30 border-accent/30">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-accent shrink-0" />
          <div className="flex-1">
            <div className="font-bold text-sm">
              {lang === "ar" ? "إشعارات فورية متاحة في النسخة المدفوعة" : "Real-time push alerts in Premium"}
            </div>
            <div className="text-xs text-muted-foreground">
              {lang === "ar" ? "احصل على تنبيهات فورية لأي منحة جديدة في مجالك" : "Get instant alerts for any new opportunity in your field"}
            </div>
          </div>
          <Link href="/premium">
            <Button size="sm">
              {lang === "ar" ? "ترقية" : "Upgrade"}
            </Button>
          </Link>
        </div>
      </Card>

      <div className="space-y-3">
        {ALERTS.map((a, i) => (
          <Card key={i} className="p-4 flex items-start gap-3 hover-elevate">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TYPE_COLOR[a.type]}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{lang === "ar" ? a.titleAr : a.titleEn}</div>
              <div className="text-sm text-muted-foreground">{lang === "ar" ? a.descAr : a.descEn}</div>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">{a.time}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
