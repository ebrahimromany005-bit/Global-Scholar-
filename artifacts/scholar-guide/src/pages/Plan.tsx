import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLang } from "@/lib/i18n";
import { useListCountries } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Compass,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  Wallet,
  ListChecks,
  Target,
  GraduationCap,
  Plane,
  Briefcase,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

type PlanResult = {
  summary: string;
  bestPath: { type: "study" | "migration" | "work"; title: string; reasoning: string };
  successProbability: { percentage: number; level: string; factors: string[] };
  steps: Array<{ order: number; title: string; description: string; duration: string }>;
  costBreakdown: { total: string; items: Array<{ category: string; amount: string; notes?: string }> };
  timeline: Array<{ month: string; milestone: string }>;
  recommendedOpportunityIds: number[];
  recommendedOpportunities: Array<{
    id: number;
    titleAr: string;
    type: string;
    organization: string;
    funding: string;
    degreeLevel: string;
  }>;
  tips: string[];
  warnings?: string[];
  country: { code: string; name: string; nameAr: string; flag: string } | null;
};

export default function Plan() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const countries = useListCountries({});
  const [location] = useLocation();
  const [form, setForm] = useState({
    targetCountry: "",
    educationLevel: "",
    languageLevel: "",
    budget: "",
    goal: "",
    fieldOfStudy: "",
    age: "",
    experience: "",
    currentCountry: "",
  });

  useEffect(() => {
    const idx = location.indexOf("?");
    if (idx === -1) return;
    const sp = new URLSearchParams(location.slice(idx + 1));
    const c = sp.get("country");
    if (c) setForm((f) => ({ ...f, targetCountry: c.toUpperCase() }));
  }, [location]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const isValid =
    form.targetCountry.trim() &&
    form.educationLevel.trim() &&
    form.languageLevel.trim() &&
    form.budget.trim();

    async function generate() {
    if (!isValid) {
      alert("البيانات ناقصة! لازم تختار: الدولة، مستوى التعليم، اللغة، والميزانية.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/plan', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // بنقرأ البيانات مرة واحدة بس هنا عشان الكود مايهنجش
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ في السيرفر");
      }

      setResult(data);

      setTimeout(() => {
        document.getElementById('plan-result')?.scrollIntoView({
          behavior: "smooth", 
          block: "start"
        });
      }, 100);

    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
    }
  

  function reset() {
    setResult(null);
    setError(null);
  }

  const PathIcon =
    result?.bestPath.type === "study"
      ? GraduationCap
      : result?.bestPath.type === "migration"
        ? Plane
        : Briefcase;

  return (
    <div className="bg-gradient-to-b from-background via-primary/5 to-background min-h-screen">
      <section className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            {isAr ? "مساعد ذكي بالذكاء الاصطناعي" : "AI-Powered Assistant"}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isAr ? "خطة السفر الذكية" : "Smart Travel Plan"}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {isAr
              ? "أدخل بياناتك واحصل على خطة شخصية كاملة: المسار الأنسب لك، خطوات التنفيذ، التكاليف، الجدول الزمني، الفرص الموصى بها، ونسبة النجاح."
              : "Enter your details and get a personalized plan: best path, action steps, costs, timeline, recommended opportunities, and success rate."}
          </p>
        </div>

        {!result && (
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Compass className="h-5 w-5 text-primary" />
                {isAr ? "بياناتك الشخصية" : "Your details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">
                    {isAr ? "الدولة المستهدفة *" : "Target country *"}
                  </Label>
                 <input 
  list="countries-list"
  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  placeholder={isAr ? "ابحث عن الدولة..." : "Search country..."}
  onChange={(e) => {
    const val = e.target.value;
    const found = (countries.data?.items ?? []).find(c => (isAr ? c.nameAr : c.name) === val);
    if (found) update("targetCountry", found.code);
  }}
/>
<datalist id="countries-list">
  {(countries.data?.items ?? []).map((c) => (
    <option key={c.code} value={isAr ? c.nameAr : c.name} />
  ))}
</datalist>
                    
                </div>

                <div>
                  <Label className="mb-1.5 block">
                    {isAr ? "المؤهل الدراسي الحالي *" : "Current education *"}
                  </Label>
                  <Select value={form.educationLevel} onValueChange={(v) => update("educationLevel", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={isAr ? "اختر المؤهل..." : "Select level..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ثانوية عامة">{isAr ? "ثانوية عامة" : "High school"}</SelectItem>
                      <SelectItem value="دبلوم">{isAr ? "دبلوم" : "Diploma"}</SelectItem>
                      <SelectItem value="بكالوريوس">{isAr ? "بكالوريوس" : "Bachelor"}</SelectItem>
                      <SelectItem value="ماجستير">{isAr ? "ماجستير" : "Master"}</SelectItem>
                      <SelectItem value="دكتوراه">{isAr ? "دكتوراه" : "PhD"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1.5 block">
                    {isAr ? "مستوى اللغة *" : "Language level *"}
                  </Label>
                  <Select value={form.languageLevel} onValueChange={(v) => update("languageLevel", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={isAr ? "اختر المستوى..." : "Select level..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مبتدئ (A1-A2)">{isAr ? "مبتدئ (A1-A2)" : "Beginner (A1-A2)"}</SelectItem>
                      <SelectItem value="متوسط (B1-B2)">{isAr ? "متوسط (B1-B2)" : "Intermediate (B1-B2)"}</SelectItem>
                      <SelectItem value="متقدم (C1)">{isAr ? "متقدم (C1)" : "Advanced (C1)"}</SelectItem>
                      <SelectItem value="ممتاز (C2)">{isAr ? "ممتاز (C2)" : "Proficient (C2)"}</SelectItem>
                      <SelectItem value="IELTS 6.5+">IELTS 6.5+</SelectItem>
                      <SelectItem value="TOEFL 90+">TOEFL 90+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1.5 block">
                    {isAr ? "الميزانية المتاحة *" : "Available budget *"}
                  </Label>
                  <Select value={form.budget} onValueChange={(v) => update("budget", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={isAr ? "اختر الميزانية..." : "Select budget..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أقل من $5,000">{isAr ? "أقل من $5,000" : "Under $5,000"}</SelectItem>
                      <SelectItem value="$5,000 - $15,000">$5,000 - $15,000</SelectItem>
                      <SelectItem value="$15,000 - $30,000">$15,000 - $30,000</SelectItem>
                      <SelectItem value="$30,000 - $50,000">$30,000 - $50,000</SelectItem>
                      <SelectItem value="أكثر من $50,000">{isAr ? "أكثر من $50,000" : "Over $50,000"}</SelectItem>
                      <SelectItem value="أحتاج تمويل كامل">{isAr ? "أحتاج تمويل كامل" : "Need full funding"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1.5 block">
                    {isAr ? "هدفك الأساسي" : "Main goal"}
                  </Label>
                  <Select value={form.goal} onValueChange={(v) => update("goal", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={isAr ? "اختر هدفك..." : "Select goal..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الدراسة">{isAr ? "الدراسة" : "Study"}</SelectItem>
                      <SelectItem value="العمل">{isAr ? "العمل" : "Work"}</SelectItem>
                      <SelectItem value="الإقامة الدائمة">{isAr ? "الإقامة الدائمة" : "Permanent residency"}</SelectItem>
                      <SelectItem value="لم 결정 بعد">{isAr ? "لم أقرر بعد" : "Not decided yet"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1.5 block">
                    {isAr ? "التخصص أو المجال" : "Field / specialty"}
                  </Label>
                  <Input
                    placeholder={isAr ? "مثل: هندسة، طب، تكنولوجيا..." : "e.g. Engineering, Medicine..."}
                    value={form.fieldOfStudy}
                    onChange={(e) => update("fieldOfStudy", e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">{isAr ? "العمر" : "Age"}</Label>
                  <Input
                    type="number"
                    placeholder={isAr ? "مثل: 25" : "e.g. 25"}
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-1.5 block">
                    {isAr ? "الدولة الحالية" : "Current country"}
                  </Label>
                  <Input
                    placeholder={isAr ? "مثل: المغرب" : "e.g. Morocco"}
                    value={form.currentCountry}
                    onChange={(e) => update("currentCountry", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">
                  {isAr ? "الخبرة العملية (اختياري)" : "Work experience (optional)"}
                </Label>
                <Input
                  placeholder={isAr ? "مثل: 3 سنوات في تطوير البرمجيات" : "e.g. 3 years in software"}
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
                  {error}
                </div>
              )}

              <Button
                onClick={generate}
                disabled={ loading}
                className="w-full h-12 text-base font-bold gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isAr ? "جاري إنشاء خطتك الشخصية..." : "Building your personal plan..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    {isAr ? "أنشئ خطتي الذكية" : "Generate My Smart Plan"}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {isAr
                  ? "* الحقول الإلزامية. كلما زادت بياناتك، كانت الخطة أدق."
                  : "* Required fields. The more you share, the more accurate the plan."}
              </p>
            </CardContent>
          </Card>
        )}

        {result && (
          <div id="plan-result" className="space-y-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {result.country && <span className="text-3xl">{result.country.flag}</span>}
                <div>
                  <div className="text-xs text-muted-foreground">
                    {isAr ? "خطتك إلى" : "Plan for"}
                  </div>
                  <div className="font-bold text-lg">
                    {result.country ? (isAr ? result.country.nameAr : result.country.name) : form.targetCountry}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
                <RefreshCw className="h-4 w-4" />
                {isAr ? "خطة جديدة" : "New plan"}
              </Button>
            </div>

            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="pt-6">
                <p className="text-base leading-relaxed">{result.summary}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <PathIcon className="h-5 w-5 text-primary" />
                    {isAr ? "المسار الأنسب لك" : "Best path for you"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="mb-2 bg-primary text-primary-foreground">{result.bestPath.title}</Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.bestPath.reasoning}</p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    {isAr ? "نسبة احتمالية النجاح" : "Success probability"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="text-4xl font-extrabold text-emerald-600">
                      {result.successProbability.percentage}%
                    </div>
                    <Badge variant="outline">{result.successProbability.level}</Badge>
                  </div>
                  <Progress value={result.successProbability.percentage} className="h-2 mb-3" />
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {result.successProbability.factors.map((f, i) => (
                      <li key={i} className="flex gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-secondary" />
                  {isAr ? "خطوات التنفيذ" : "Action steps"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.steps.map((s) => (
                    <div key={s.order} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                          {s.order}
                        </div>
                        {s.order < result.steps.length && (
                          <div className="w-px flex-1 bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-bold">{s.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {s.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-amber-600" />
                    {isAr ? "تقدير التكلفة" : "Cost estimate"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-lg p-3 mb-3">
                    <div className="text-xs text-muted-foreground">
                      {isAr ? "التكلفة الإجمالية المتوقعة" : "Estimated total"}
                    </div>
                    <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">
                      {result.costBreakdown.total}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {result.costBreakdown.items.map((item, i) => (
                      <li key={i} className="flex items-start justify-between gap-2 text-sm border-b last:border-0 pb-2">
                        <div className="flex-1">
                          <div className="font-medium">{item.category}</div>
                          {item.notes && (
                            <div className="text-xs text-muted-foreground">{item.notes}</div>
                          )}
                        </div>
                        <div className="font-bold text-amber-700 dark:text-amber-400">{item.amount}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-secondary" />
                    {isAr ? "الجدول الزمني" : "Timeline"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.timeline.map((t, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-bold text-xs whitespace-nowrap h-fit mt-0.5">
                          {t.month}
                        </div>
                        <div className="text-sm flex-1">{t.milestone}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {result.recommendedOpportunities.length > 0 && (
              <Card className="shadow-md border-2 border-secondary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-secondary" />
                    {isAr ? "فرص موصى بها للتقديم" : "Recommended opportunities"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.recommendedOpportunities.map((opp) => (
                      <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                        <div className="border rounded-lg p-3 hover:border-primary hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                          <Badge
                            className={`mb-2 w-fit ${opp.type === "scholarship" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}
                          >
                            {opp.type === "scholarship"
                              ? isAr
                                ? "منحة دراسية"
                                : "Scholarship"
                              : isAr
                                ? "هجرة"
                                : "Migration"}
                          </Badge>
                          <h4 className="font-bold text-sm mb-1 line-clamp-2">{opp.titleAr}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{opp.organization}</p>
                          <div className="flex gap-1 flex-wrap mt-auto">
                            <Badge variant="outline" className="text-[10px]">
                              {opp.funding}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {opp.degreeLevel}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-end mt-2 text-xs text-primary font-medium gap-1">
                            {isAr ? "التفاصيل" : "Details"}
                            <ArrowRight className={`h-3 w-3 ${isAr ? "rotate-180" : ""}`} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {result.tips.length > 0 && (
              <Card className="shadow-md bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="h-5 w-5" />
                    {isAr ? "نصائح شخصية لك" : "Personal tips"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.warnings && result.warnings.length > 0 && (
              <Card className="shadow-md bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-5 w-5" />
                    {isAr ? "تنبيهات مهمة" : "Important warnings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center pt-4">
              <Button onClick={reset} size="lg" variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {isAr ? "أنشئ خطة أخرى" : "Generate another plan"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
