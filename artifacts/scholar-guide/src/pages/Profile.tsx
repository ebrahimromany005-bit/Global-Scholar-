import { Link } from "wouter";
import { useLang } from "@/lib/i18n";
import { useGuestUserId } from "@/hooks/useGuestUserId";
import { usePremium } from "@/hooks/usePremium";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Globe, Crown, Bell, User as UserIcon, Languages, Check } from "lucide-react";

export default function Profile() {
  const { lang, setLang, t } = useLang();
  const userId = useGuestUserId();
  const { isPremium } = usePremium();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
        {lang === "ar" ? "الملف الشخصي" : "Profile"}
      </h1>

      <Card className="p-6 mb-4 flex items-center gap-4">
        <div className="bg-primary/15 w-16 h-16 rounded-full flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg">
            {lang === "ar" ? "زائر" : "Guest"}
          </div>
          <div className="text-xs text-muted-foreground truncate">{userId}</div>
        </div>
        {isPremium ? (
          <Badge className="bg-accent text-accent-foreground gap-1">
            <Crown className="h-3 w-3" /> Premium
          </Badge>
        ) : (
          <Badge variant="outline">{lang === "ar" ? "مجاني" : "Free"}</Badge>
        )}
      </Card>

      <Card className="p-6 mb-4">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          {lang === "ar" ? "اللغة" : "Language"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={lang === "ar" ? "default" : "outline"}
            onClick={() => setLang("ar")}
            className="flex-1 gap-2"
          >
            {lang === "ar" && <Check className="h-4 w-4" />}
            🇸🇦 العربية
          </Button>
          <Button
            variant={lang === "en" ? "default" : "outline"}
            onClick={() => setLang("en")}
            className="flex-1 gap-2"
          >
            {lang === "en" && <Check className="h-4 w-4" />}
            🇬🇧 English
          </Button>
        </div>
      </Card>

      <Card className="p-6 mb-4">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          {lang === "ar" ? "الإشعارات" : "Notifications"}
        </h2>
        <div className="space-y-3">
          {[
            { key: "deadlines", labelAr: "تذكيرات بالمواعيد النهائية", labelEn: "Deadline reminders" },
            { key: "new", labelAr: "فرص جديدة في مجالك", labelEn: "New opportunities in your field" },
            { key: "weekly", labelAr: "ملخص أسبوعي", labelEn: "Weekly digest" },
            { key: "tips", labelAr: "نصائح وإرشادات", labelEn: "Tips and guidance" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm">{lang === "ar" ? item.labelAr : item.labelEn}</span>
              <Switch defaultChecked={item.key !== "tips"} />
            </div>
          ))}
        </div>
      </Card>

      {!isPremium && (
        <Card className="p-6 bg-gradient-to-br from-accent/10 via-amber-50 to-orange-50 border-accent/30 dark:from-accent/15 dark:via-amber-950/40 dark:to-orange-950/40">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-accent text-accent-foreground w-12 h-12 rounded-xl flex items-center justify-center">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">
                {lang === "ar" ? "ترقية للنسخة المدفوعة" : "Upgrade to Premium"}
              </h2>
              <p className="text-sm text-muted-foreground">{t("premium_benefits")}</p>
            </div>
          </div>
          <Link href="/premium">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {lang === "ar" ? "اكتشف المزايا" : "See benefits"}
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
