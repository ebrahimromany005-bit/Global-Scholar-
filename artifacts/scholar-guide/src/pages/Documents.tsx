import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdSlot } from "@/components/AdSlot";
import { FileText, Lock, Download, FileEdit, ScrollText, Award, FileSignature, FileCheck } from "lucide-react";
import { Link } from "wouter";

const DOCS = [
  { icon: FileText, key: "cv", titleAr: "قوالب السيرة الذاتية CV", titleEn: "CV Templates", descAr: "5 قوالب احترافية لطلبات المنح والوظائف، بصيغة Word وPDF.", descEn: "5 professional templates for scholarship and job applications.", count: 5 },
  { icon: FileEdit, key: "motivation", titleAr: "خطاب الدوافع", titleEn: "Motivation Letter", descAr: "نماذج جاهزة لخطاب الدوافع لمختلف التخصصات والدول.", descEn: "Ready samples of motivation letters for various fields.", count: 8 },
  { icon: ScrollText, key: "rec", titleAr: "خطابات التوصية", titleEn: "Recommendation Letters", descAr: "نماذج لتوصيات أكاديمية ومهنية مع نصائح للمشرفين.", descEn: "Academic and professional recommendation samples.", count: 6 },
  { icon: Award, key: "research", titleAr: "مقترح البحث", titleEn: "Research Proposal", descAr: "قوالب لكتابة مقترح بحث للماجستير والدكتوراه.", descEn: "Templates for Master's and PhD research proposals.", count: 4 },
  { icon: FileSignature, key: "spp", titleAr: "خطة الدراسة", titleEn: "Study Plan", descAr: "نماذج خطط دراسية مفصلة ومرتبطة بأهدافك.", descEn: "Detailed study plans aligned with your goals.", count: 3 },
  { icon: FileCheck, key: "spp2", titleAr: "خطاب التعريف", titleEn: "Cover Letter", descAr: "خطابات تعريف مهنية للوظائف والمنح.", descEn: "Professional cover letters for jobs and scholarships.", count: 5 },
];

export default function Documents() {
  const { lang, t } = useLang();

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
        {lang === "ar" ? "📄 مكتبة المستندات" : "📄 Document Library"}
      </h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        {lang === "ar"
          ? "قوالب جاهزة وأمثلة عملية لكل مستندات تقديمك للمنح والهجرة."
          : "Ready-made templates and real examples for all your application documents."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {DOCS.map((d) => (
          <Card key={d.key} className="p-6 hover-elevate group">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <d.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-1">{lang === "ar" ? d.titleAr : d.titleEn}</h3>
            <p className="text-sm text-muted-foreground mb-3">{lang === "ar" ? d.descAr : d.descEn}</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="gap-1">
                <Download className="h-3 w-3" />
                {d.count} {lang === "ar" ? "ملف" : "files"}
              </Badge>
              <Button size="sm" variant="ghost" className="gap-1">
                {t("download_available")}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-accent/10 to-amber-100/30 border-accent/30 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-accent text-accent-foreground w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
            <Lock className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <Badge className="bg-accent text-accent-foreground mb-2">{t("premium_only")}</Badge>
            <h3 className="font-bold text-lg mb-1">
              {lang === "ar" ? "مراجعة المستندات بالذكاء الاصطناعي" : "AI Document Review"}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {lang === "ar"
                ? "ارفع سيرتك الذاتية أو خطاب دوافعك واحصل على مراجعة فورية ومقترحات للتحسين بناءً على أحدث معايير القبول."
                : "Upload your CV or motivation letter and get instant review with concrete improvements."}
            </p>
            <Link href="/premium">
              <Button>{lang === "ar" ? "ترقية للنسخة المدفوعة" : "Upgrade to Premium"}</Button>
            </Link>
          </div>
        </div>
      </Card>

      <AdSlot slot="documents_inline" size="banner" />
    </div>
  );
}
