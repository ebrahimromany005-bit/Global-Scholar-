import { useState, useMemo, Fragment } from "react";
import { Link, useLocation } from "wouter";
import {
  useListOpportunities,
  useListCountries,
  useListFeaturedOpportunities,
} from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { AdSlot } from "@/components/AdSlot";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, GraduationCap, Plane, Sparkles, MapPin } from "lucide-react";

function useQueryParam(key: string): string {
  const [location] = useLocation();
  return useMemo(() => {
    const idx = location.indexOf("?");
    if (idx < 0) return "";
    const sp = new URLSearchParams(location.slice(idx + 1));
    return sp.get(key) ?? "";
  }, [location, key]);
}

type TypeKey = "all" | "scholarship" | "migration";

export default function Opportunities() {
  const { lang, t } = useLang();
  const initialType = useQueryParam("type") as TypeKey | "";
  const initialQ = useQueryParam("q");
  const initialCountry = useQueryParam("countryCode");

  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState<TypeKey>((initialType as TypeKey) || "all");
  const [countryCode, setCountryCode] = useState<string>(initialCountry || "all");
  const [countrySearch, setCountrySearch] = useState("");
  const [degreeLevel, setDegreeLevel] = useState<string>("all");
  const [funding, setFunding] = useState<string>("all");
  const [sort, setSort] = useState<string>("deadline");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 18;

  const params: Record<string, unknown> = { page, pageSize, sort };
  if (q.trim()) params["q"] = q.trim();
  if (type !== "all") params["type"] = type;
  if (countryCode !== "all") params["countryCode"] = countryCode;
  if (degreeLevel !== "all") params["degreeLevel"] = degreeLevel;
  if (funding !== "all") params["funding"] = funding;

  const list = useListOpportunities(params);
  const countries = useListCountries();
  const featured = useListFeaturedOpportunities();
  const flagFor = (code: string) =>
    countries.data?.find((c) => c.code === code)?.flag;

  const totalPages = list.data ? Math.ceil(list.data.total / pageSize) : 0;

  const items = list.data?.items ?? [];

  const groups: Array<typeof items> = [];
  for (let i = 0; i < items.length; i += 6) {
    groups.push(items.slice(i, i + 6));
  }

  const resetFilters = () => {
    setQ("");
    setType("all");
    setCountryCode("all");
    setCountrySearch("");
    setDegreeLevel("all");
    setFunding("all");
    setSort("deadline");
    setPage(1);
  };

  const filteredCountries = useMemo(() => {
    const cs = countrySearch.trim().toLowerCase();
    const all = countries.data ?? [];
    if (!cs) return all;
    return all.filter(
      (c) =>
        c.name.toLowerCase().includes(cs) ||
        c.nameAr.includes(cs) ||
        c.code.toLowerCase().includes(cs),
    );
  }, [countries.data, countrySearch]);

  const featuredFiltered = useMemo(() => {
    const all = featured.data ?? [];
    if (type === "all") return all.slice(0, 6);
    return all.filter((f) => f.type === type).slice(0, 6);
  }, [featured.data, type]);

  const suggestedCountries = useMemo(() => {
    const all = countries.data ?? [];
    return all
      .slice()
      .sort((a, b) => {
        if (type === "scholarship") return b.scholarshipCount - a.scholarshipCount;
        if (type === "migration") return b.migrationCount - a.migrationCount;
        return b.opportunityCount - a.opportunityCount;
      })
      .slice(0, 10);
  }, [countries.data, type]);

  const headerTitle =
    type === "scholarship"
      ? lang === "ar"
        ? "كل المنح الدراسية"
        : "All Scholarships"
      : type === "migration"
        ? lang === "ar"
          ? "كل برامج الهجرة"
          : "All Migration Programs"
        : lang === "ar"
          ? "استكشف الفرص"
          : "Explore Opportunities";

  const headerSubtitle = list.data
    ? lang === "ar"
      ? `${list.data.total.toLocaleString("ar-EG")} نتيجة متاحة`
      : `${list.data.total.toLocaleString("en-US")} results available`
    : "";

  const TabButton = ({
    value,
    label,
    icon: Icon,
  }: {
    value: TypeKey;
    label: string;
    icon: typeof GraduationCap;
  }) => {
    const active = type === value;
    return (
      <button
        onClick={() => {
          setType(value);
          setPage(1);
        }}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
          active
            ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
            : "bg-card border border-border hover:border-primary/50 text-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {headerTitle}
        </h1>
        <p className="text-muted-foreground">{headerSubtitle}</p>
      </div>

      {/* Prominent type tabs */}
      <div className="flex gap-2 mb-6">
        <TabButton
          value="all"
          label={lang === "ar" ? "الكل" : "All"}
          icon={Sparkles}
        />
        <TabButton
          value="scholarship"
          label={lang === "ar" ? "المنح الدراسية" : "Scholarships"}
          icon={GraduationCap}
        />
        <TabButton
          value="migration"
          label={lang === "ar" ? "برامج الهجرة" : "Migration Programs"}
          icon={Plane}
        />
      </div>

      {/* Suggested countries strip - changes per tab */}
      {suggestedCountries.length > 0 && (
        <Card className="p-4 mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {type === "scholarship"
                ? lang === "ar"
                  ? "أفضل الدول للمنح الدراسية"
                  : "Top countries for scholarships"
                : type === "migration"
                  ? lang === "ar"
                    ? "أفضل الدول للهجرة"
                    : "Top countries for migration"
                  : lang === "ar"
                    ? "أفضل الوجهات"
                    : "Top destinations"}
            </h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {suggestedCountries.map((c) => {
              const count =
                type === "scholarship"
                  ? c.scholarshipCount
                  : type === "migration"
                    ? c.migrationCount
                    : c.opportunityCount;
              const active = countryCode === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setCountryCode(active ? "all" : c.code);
                    setPage(1);
                  }}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="text-sm font-medium">
                    {lang === "ar" ? c.nameAr : c.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="p-4 mb-6 sticky top-16 z-30 bg-background/95 backdrop-blur">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute top-1/2 -translate-y-1/2 ms-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder={
                type === "scholarship"
                  ? lang === "ar"
                    ? "ابحث في المنح: التخصص، الدولة، الجامعة..."
                    : "Search scholarships: field, country, university..."
                  : type === "migration"
                    ? lang === "ar"
                      ? "ابحث في برامج الهجرة: عمل، استثمار، عائلة..."
                      : "Search migration: work, investment, family..."
                    : t("search_placeholder")
              }
              className="ps-10"
              data-testid="input-search"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {lang === "ar" ? "فلاتر" : "Filters"}
            </Button>
            <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">{lang === "ar" ? "حسب الموعد النهائي" : "By deadline"}</SelectItem>
                <SelectItem value="newest">{lang === "ar" ? "الأحدث" : "Newest"}</SelectItem>
                <SelectItem value="popular">{lang === "ar" ? "الأكثر شعبية" : "Popular"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">
                {lang === "ar" ? "ابحث عن دولة" : "Search country"}
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 -translate-y-1/2 ms-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder={lang === "ar" ? "اكتب اسم الدولة..." : "Type country name..."}
                  className="ps-10"
                />
              </div>
              {countrySearch.trim() && (
                <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-1 bg-popover">
                  {filteredCountries.length === 0 && (
                    <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                      {lang === "ar" ? "لم يتم العثور على دول" : "No countries found"}
                    </div>
                  )}
                  {filteredCountries.slice(0, 30).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCountryCode(c.code);
                        setCountrySearch("");
                        setPage(1);
                      }}
                      className={`w-full text-start flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-sm ${countryCode === c.code ? "bg-primary/10 text-primary font-bold" : ""}`}
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span className="flex-1">{lang === "ar" ? c.nameAr : c.name}</span>
                      <Badge variant="outline" className="text-xs">{c.opportunityCount}</Badge>
                    </button>
                  ))}
                </div>
              )}
              {countryCode !== "all" && !countrySearch.trim() && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="gap-1">
                    {flagFor(countryCode)} {countries.data?.find((c) => c.code === countryCode)?.[lang === "ar" ? "nameAr" : "name"]}
                    <button onClick={() => setCountryCode("all")} className="ms-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("degree")}</label>
              <Select value={degreeLevel} onValueChange={(v) => { setDegreeLevel(v); setPage(1); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  <SelectItem value="Bachelor">{lang === "ar" ? "بكالوريوس" : "Bachelor"}</SelectItem>
                  <SelectItem value="Master">{lang === "ar" ? "ماجستير" : "Master"}</SelectItem>
                  <SelectItem value="PhD">{lang === "ar" ? "دكتوراه" : "PhD"}</SelectItem>
                  <SelectItem value="Diploma">{lang === "ar" ? "دبلوم" : "Diploma"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("funding")}</label>
              <Select value={funding} onValueChange={(v) => { setFunding(v); setPage(1); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  <SelectItem value="Full Funding">{lang === "ar" ? "تمويل كامل" : "Full Funding"}</SelectItem>
                  <SelectItem value="Partial">{lang === "ar" ? "تمويل جزئي" : "Partial"}</SelectItem>
                  <SelectItem value="Self-Funded">{lang === "ar" ? "غير ممول" : "Self-Funded"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 md:col-span-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
                <X className="h-4 w-4" />
                {lang === "ar" ? "إعادة ضبط" : "Reset"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Featured suggestions for current tab — only when not searching */}
      {!q.trim() && page === 1 && featuredFiltered.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              {type === "scholarship"
                ? lang === "ar"
                  ? "اقتراحات منح مميزة لك"
                  : "Featured scholarship picks"
                : type === "migration"
                  ? lang === "ar"
                    ? "برامج هجرة موصى بها"
                    : "Recommended migration programs"
                  : lang === "ar"
                    ? "اقتراحات مميزة"
                    : "Featured picks"}
            </h2>
            <Link href="/opportunities">
              <Button variant="ghost" size="sm">
                {lang === "ar" ? "تصفية النتائج" : "Refine"}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredFiltered.slice(0, 3).map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} flag={flagFor(opp.countryCode)} />
            ))}
          </div>
        </section>
      )}

      {list.isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-muted" />
          ))}
        </div>
      )}

      {!list.isLoading && items.length === 0 && (
        <Card className="p-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2">
            {lang === "ar" ? "لا توجد نتائج تطابق بحثك" : "No matching results"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {lang === "ar"
              ? "جرب تعديل الفلاتر أو ابحث بكلمات مفتاحية أخرى"
              : "Try adjusting your filters or search differently"}
          </p>
          <Button onClick={resetFilters}>{lang === "ar" ? "إعادة ضبط الفلاتر" : "Reset filters"}</Button>
        </Card>
      )}

      {groups.map((group, gi) => (
        <Fragment key={gi}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {group.map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} flag={flagFor(opp.countryCode)} />
            ))}
          </div>
          {gi < groups.length - 1 && (
            <div className="my-6">
              <AdSlot slot="results_inline" size="inline" />
            </div>
          )}
        </Fragment>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {lang === "ar" ? "السابق" : "Previous"}
          </Button>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {page} / {totalPages}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {lang === "ar" ? "التالي" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}
