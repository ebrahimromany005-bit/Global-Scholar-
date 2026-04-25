import { useParams, Link } from "wouter";
import {
  useGetOpportunity,
  useListRecommendedOpportunities,
  useListCountries,
  useCreateApplication,
  getListApplicationsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { useGuestUserId } from "@/hooks/useGuestUserId";
import { useToast } from "@/hooks/use-toast";
import { AdSlot } from "@/components/AdSlot";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BookmarkPlus,
  Calendar,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";

export default function OpportunityDetail() {
  const params = useParams();
  const id = Number(params["id"]);
  const { lang, t } = useLang();
  const userId = useGuestUserId();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const opp = useGetOpportunity(id);
  const countries = useListCountries();
  const related = useListRecommendedOpportunities({ interests: opp.data?.field });

  const createApp = useCreateApplication();

  if (opp.isLoading || !opp.data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="h-96 animate-pulse bg-muted" />
      </div>
    );
  }

  const o = opp.data;
  const flag = countries.data?.find((c) => c.code === o.countryCode)?.flag;
  const title = lang === "ar" ? o.titleAr : o.title;
  const country = lang === "ar" ? o.countryNameAr : o.countryName;
  const days = Math.ceil((new Date(o.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const isFakeUrl = (url?: string) => !url || /example\.com|partner\.example/i.test(url);
  const applyHref = isFakeUrl(o.applicationUrl)
    ? `https://www.google.com/search?q=${encodeURIComponent(`${o.title} ${o.organization} official application`)}`
    : o.applicationUrl;

  const onTrack = () => {
    createApp.mutate(
      {
        data: {
          userId,
          opportunityId: o.id,
          status: "planning",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey({ userId }) });
          toast({
            title: lang === "ar" ? "تمت إضافة الطلب" : "Application tracked",
            description: lang === "ar" ? "ستجدها في صفحة الطلبات" : "Find it on your tracker page",
          });
        },
        onError: () => {
          toast({
            title: lang === "ar" ? "تعذر إضافة الطلب" : "Could not track",
            variant: "destructive",
          });
        },
      },
    );
  };

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: lang === "ar" ? "تم نسخ الرابط" : "Link copied",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-6xl leading-none">{flag ?? "🌍"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-3 w-3" />
                  {country}
                  <span>•</span>
                  {o.organization}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{title}</h1>
              </div>
              {o.featured && (
                <Badge className="bg-accent text-accent-foreground gap-1">
                  <Sparkles className="h-3 w-3" />
                  {lang === "ar" ? "مميزة" : "Featured"}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline"><GraduationCap className="h-3 w-3 mr-1" />{o.degreeLevel}</Badge>
              <Badge variant="secondary">{o.type === "scholarship" ? t("scholarship") : t("migration")}</Badge>
              <Badge variant="outline">{o.funding}</Badge>
              <Badge variant="outline">{o.field}</Badge>
              {o.amount && <Badge variant="outline">{o.amount}</Badge>}
              {o.duration && <Badge variant="outline">{o.duration}</Badge>}
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">{o.description}</p>
          </Card>

          {o.eligibility && (
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {t("eligibility")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{o.eligibility}</p>
            </Card>
          )}

          {o.benefits.length > 0 && (
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-3">{t("benefits")}</h2>
              <ul className="space-y-2">
                {o.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {o.requirements.length > 0 && (
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-3">{t("requirements")}</h2>
              <ul className="space-y-2">
                {o.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="bg-secondary/15 text-secondary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <AdSlot slot="detail_inpage" size="inline" />

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-bold">
                {lang === "ar" ? "كيف تقدم على هذه الفرصة" : "How to apply"}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {lang === "ar"
                ? "اضغط زر «قدم الآن» في الشريط الجانبي للوصول إلى صفحة التقديم الرسمية، أو احفظ الفرصة في طلباتك لمتابعتها لاحقاً."
                : "Use the Apply Now button in the sidebar to reach the official application page, or save it to your tracker to follow up later."}
            </p>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "💡 نصيحة: تأكد من قراءة شروط الأهلية والمستندات المطلوبة قبل التقديم."
                : "💡 Tip: review eligibility and required documents carefully before applying."}
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6 sticky top-20">
            <div className="text-center mb-4">
              <div className="text-xs text-muted-foreground mb-1">{t("deadline")}</div>
              <div className="text-2xl font-extrabold">
                {new Date(o.deadline).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className={`text-sm mt-1 ${days < 30 ? "text-destructive" : "text-primary"}`}>
                <Calendar className="h-3 w-3 inline mr-1" />
                {days > 0
                  ? lang === "ar"
                    ? `متبقي ${days} يوم`
                    : `${days} days left`
                  : lang === "ar"
                    ? "انتهى"
                    : "Closed"}
              </div>
            </div>

            {o.acceptanceRate !== undefined && (
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{lang === "ar" ? "نسبة القبول التقديرية" : "Acceptance Rate"}</span>
                  <span className="font-bold">{o.acceptanceRate}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${Math.min(100, o.acceptanceRate)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button asChild className="w-full gap-2" size="lg">
                <a href={applyHref} target="_blank" rel="noopener noreferrer">
                  {t("apply_now")}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button onClick={onTrack} variant="outline" className="w-full gap-2">
                <BookmarkPlus className="h-4 w-4" />
                {t("track_application")}
              </Button>
              <Button onClick={onShare} variant="ghost" className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                {t("share")}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Related */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t("related_opportunities")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {related.data
            ?.filter((r) => r.id !== o.id)
            .slice(0, 4)
            .map((r) => (
              <OpportunityCard
                key={r.id}
                opp={r}
                flag={countries.data?.find((c) => c.code === r.countryCode)?.flag}
              />
            ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/opportunities">
            <Button variant="outline">{t("view_all")}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
