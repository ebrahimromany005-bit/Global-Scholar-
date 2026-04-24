import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  useGetStatsOverview,
  useListFeaturedOpportunities,
  useListRecommendedOpportunities,
  useGetTopCountries,
  useListUpcomingDeadlines,
  useListCountries,
} from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { AdSlot } from "@/components/AdSlot";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  GraduationCap,
  Plane,
  Globe,
  Calendar,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { t, lang } = useLang();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");

  const stats = useGetStatsOverview();
  const featured = useListFeaturedOpportunities();
  const recommended = useListRecommendedOpportunities({});
  const topCountries = useGetTopCountries();
  const deadlines = useListUpcomingDeadlines();
  const countries = useListCountries();

  const flagFor = (code: string) =>
    countries.data?.find((c) => c.code === code)?.flag;

  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setLocation(q ? `/opportunities?q=${encodeURIComponent(q)}` : "/opportunities");
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground py-16 md:py-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-9xl">🌍</div>
          <div className="absolute bottom-10 right-10 text-9xl">🎓</div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            {lang === "ar"
              ? "بوابتك إلى المنح والهجرة حول العالم"
              : "Your gateway to scholarships and migration worldwide"}
          </h1>
          <p className="text-base md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            {lang === "ar"
              ? "استكشف آلاف الفرص في 160+ دولة، تتبع طلباتك، واحصل على إرشادات ذكية."
              : "Discover thousands of opportunities in 160+ countries, track your applications, get AI guidance."}
          </p>

          <form
            onSubmit={onSearch}
            className="max-w-2xl mx-auto flex gap-2 bg-background/95 rounded-xl p-2 shadow-2xl"
          >
            <Search className="h-5 w-5 text-muted-foreground self-center mx-2" />
            <Input
              type="search"
              placeholder={t("search_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Button type="submit" size="lg" className="rounded-lg">
              {lang === "ar" ? "ابحث" : "Search"}
            </Button>
          </form>

          {stats.data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
              {[
                { label: lang === "ar" ? "فرصة" : "Opportunities", val: stats.data.totalOpportunities, icon: TrendingUp },
                { label: lang === "ar" ? "منحة دراسية" : "Scholarships", val: stats.data.totalScholarships, icon: GraduationCap },
                { label: lang === "ar" ? "برنامج هجرة" : "Migration Programs", val: stats.data.totalMigration, icon: Plane },
                { label: lang === "ar" ? "دولة" : "Countries", val: stats.data.totalCountries, icon: Globe },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-background/15 backdrop-blur rounded-xl p-4 border border-background/20"
                >
                  <s.icon className="h-5 w-5 mb-2 mx-auto opacity-80" />
                  <div className="text-2xl md:text-3xl font-extrabold">
                    {s.val.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                  </div>
                  <div className="text-xs opacity-80 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <AdSlot slot="home_top_banner" size="banner" />
      </div>

      {/* Featured */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              {t("featured_opportunities")}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {lang === "ar"
                ? "أبرز الفرص المختارة هذا الموسم"
                : "Hand-picked opportunities this season"}
            </p>
          </div>
          <Link href="/opportunities?featured=true">
            <Button variant="ghost" size="sm" className="gap-1">
              {t("view_all")}
              <Arrow className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featured.data?.slice(0, 8).map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} flag={flagFor(opp.countryCode)} />
          ))}
        </div>
      </section>

      {/* Top Countries */}
      <section className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary" />
            {t("top_destinations")}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
            {topCountries.data?.slice(0, 20).map((c) => (
              <Link key={c.countryCode} href={`/countries/${c.countryCode}`}>
                <Card className="p-3 text-center hover-elevate cursor-pointer hover:border-primary/40 transition-all">
                  <div className="text-3xl mb-1">{c.flag}</div>
                  <div className="text-xs font-medium truncate">
                    {lang === "ar" ? c.countryNameAr : c.countryName}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {c.count} {lang === "ar" ? "فرصة" : "opps"}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended with inline ad */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t("recommended_for_you")}</h2>
          <Link href="/opportunities">
            <Button variant="ghost" size="sm" className="gap-1">
              {t("view_all")}
              <Arrow className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recommended.data?.slice(0, 4).map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} flag={flagFor(opp.countryCode)} />
          ))}
        </div>
        <div className="my-6">
          <AdSlot slot="home_recommended_inline" size="inline" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recommended.data?.slice(4, 8).map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} flag={flagFor(opp.countryCode)} />
          ))}
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-accent" />
            {t("upcoming_deadlines")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deadlines.data?.slice(0, 8).map((opp) => {
              const days = Math.ceil(
                (new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              );
              return (
                <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                  <Card className="p-4 flex items-center gap-4 hover-elevate cursor-pointer">
                    <span className="text-4xl">{flagFor(opp.countryCode) ?? "🌍"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {lang === "ar" ? opp.titleAr : opp.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lang === "ar" ? opp.countryNameAr : opp.countryName} · {opp.organization}
                      </div>
                    </div>
                    <div className={`text-center px-3 py-1.5 rounded-lg ${days < 30 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                      <div className="font-bold text-lg leading-none">{days}</div>
                      <div className="text-[10px]">{lang === "ar" ? "يوم" : "days"}</div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/opportunities?type=scholarship">
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 hover-elevate cursor-pointer border-primary/20">
              <GraduationCap className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-bold text-2xl mb-1">{t("scholarships")}</h3>
              <p className="text-muted-foreground text-sm">
                {lang === "ar"
                  ? "آلاف المنح الممولة كاملاً وجزئياً للبكالوريوس والماجستير والدكتوراه."
                  : "Thousands of fully and partially funded opportunities for Bachelor's, Master's, and PhD."}
              </p>
            </Card>
          </Link>
          <Link href="/opportunities?type=migration">
            <Card className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 hover-elevate cursor-pointer border-secondary/20">
              <Plane className="h-10 w-10 text-secondary mb-3" />
              <h3 className="font-bold text-2xl mb-1">{t("migration")}</h3>
              <p className="text-muted-foreground text-sm">
                {lang === "ar"
                  ? "تأشيرات عمل، إقامة دائمة، رحالة رقمي، ومستثمر — كل المسارات في مكان واحد."
                  : "Skilled visas, PR, digital nomad, investor pathways — all routes in one place."}
              </p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
