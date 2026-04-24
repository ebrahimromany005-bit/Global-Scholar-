import { useState, useMemo, Fragment } from "react";
import { useLocation } from "wouter";
import {
  useListOpportunities,
  useListCountries,
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
import { Search, Filter, X } from "lucide-react";

function useQueryParam(key: string): string {
  const [location] = useLocation();
  return useMemo(() => {
    const idx = location.indexOf("?");
    if (idx < 0) return "";
    const sp = new URLSearchParams(location.slice(idx + 1));
    return sp.get(key) ?? "";
  }, [location, key]);
}

export default function Opportunities() {
  const { lang, t } = useLang();
  const initialType = useQueryParam("type") as "scholarship" | "migration" | "";
  const initialQ = useQueryParam("q");
  const initialCountry = useQueryParam("countryCode");

  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState<string>(initialType || "all");
  const [countryCode, setCountryCode] = useState<string>(initialCountry || "all");
  const [degreeLevel, setDegreeLevel] = useState<string>("all");
  const [funding, setFunding] = useState<string>("all");
  const [sort, setSort] = useState<string>("featured");
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
    setDegreeLevel("all");
    setFunding("all");
    setSort("featured");
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {lang === "ar" ? "استكشف الفرص" : "Explore Opportunities"}
        </h1>
        <p className="text-muted-foreground">
          {list.data
            ? lang === "ar"
              ? `${list.data.total.toLocaleString("ar-EG")} فرصة متاحة`
              : `${list.data.total.toLocaleString("en-US")} opportunities available`
            : ""}
        </p>
      </div>

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
              placeholder={t("search_placeholder")}
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
                <SelectItem value="featured">{lang === "ar" ? "المميزة أولاً" : "Featured first"}</SelectItem>
                <SelectItem value="deadline">{lang === "ar" ? "حسب الموعد النهائي" : "By deadline"}</SelectItem>
                <SelectItem value="newest">{lang === "ar" ? "الأحدث" : "Newest"}</SelectItem>
                <SelectItem value="popular">{lang === "ar" ? "الأكثر شعبية" : "Popular"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{lang === "ar" ? "النوع" : "Type"}</label>
              <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  <SelectItem value="scholarship">{t("scholarships")}</SelectItem>
                  <SelectItem value="migration">{t("migration")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{lang === "ar" ? "الدولة" : "Country"}</label>
              <Select value={countryCode} onValueChange={(v) => { setCountryCode(v); setPage(1); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="all">{lang === "ar" ? "كل الدول" : "All Countries"}</SelectItem>
                  {countries.data?.slice().sort((a, b) => (lang === "ar" ? a.nameAr.localeCompare(b.nameAr, "ar") : a.name.localeCompare(b.name))).map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {lang === "ar" ? c.nameAr : c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
