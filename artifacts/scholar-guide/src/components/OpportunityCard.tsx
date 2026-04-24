import { Link } from "wouter";
import { Calendar, MapPin, GraduationCap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

type Opp = {
  id: number;
  title: string;
  titleAr: string;
  type: string;
  countryCode: string;
  countryName: string;
  countryNameAr: string;
  organization: string;
  degreeLevel: string;
  field: string;
  funding: string;
  deadline: string;
  featured?: boolean;
};

export function OpportunityCard({ opp, flag }: { opp: Opp; flag?: string }) {
  const { lang, t } = useLang();
  const title = lang === "ar" ? opp.titleAr : opp.title;
  const country = lang === "ar" ? opp.countryNameAr : opp.countryName;

  const daysUntil = Math.ceil(
    (new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const urgent = daysUntil < 30 && daysUntil > 0;

  return (
    <Link href={`/opportunities/${opp.id}`}>
      <Card className="group h-full p-5 hover-elevate transition-all cursor-pointer border-border/60 hover:border-primary/40 hover:shadow-lg flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl leading-none">{flag ?? "🌍"}</span>
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {country}
              </div>
            </div>
          </div>
          {opp.featured && (
            <Badge className="bg-accent text-accent-foreground gap-1">
              <Sparkles className="h-3 w-3" />
              {lang === "ar" ? "مميزة" : "Featured"}
            </Badge>
          )}
        </div>

        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-1">
          {opp.organization}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          <Badge variant="outline" className="text-xs">
            <GraduationCap className="h-3 w-3 mr-1" />
            {opp.degreeLevel}
          </Badge>
          <Badge
            variant={opp.type === "scholarship" ? "secondary" : "default"}
            className="text-xs"
          >
            {opp.type === "scholarship" ? t("scholarship") : t("migration")}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {opp.funding}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
          <div className={`flex items-center gap-1 ${urgent ? "text-destructive font-medium" : "text-muted-foreground"}`}>
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(opp.deadline).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          {daysUntil > 0 && (
            <span className={`text-xs ${urgent ? "text-destructive" : "text-muted-foreground"}`}>
              {lang === "ar" ? `بعد ${daysUntil} يوم` : `${daysUntil}d left`}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
