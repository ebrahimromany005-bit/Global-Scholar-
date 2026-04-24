import { useParams, Link } from "wouter";
import { useGetCountry } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { OpportunityCard } from "@/components/OpportunityCard";
import { AdSlot } from "@/components/AdSlot";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plane, MapPin, ArrowRight, ArrowLeft } from "lucide-react";

export default function CountryDetail() {
  const params = useParams();
  const code = params["code"]!;
  const { lang } = useLang();

  const country = useGetCountry(code);

  if (country.isLoading || !country.data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="h-96 animate-pulse bg-muted" />
      </div>
    );
  }

  const c = country.data;
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-secondary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/countries">
            <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground mb-4 gap-1">
              <Arrow className="h-4 w-4" />
              {lang === "ar" ? "كل الدول" : "All Countries"}
            </Button>
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="text-8xl">{c.flag}</div>
            <div className="flex-1">
              <Badge className="bg-background/20 text-primary-foreground border-background/30 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                {c.region}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
                {lang === "ar" ? c.nameAr : c.name}
              </h1>
              <p className="text-base opacity-90 max-w-2xl">{c.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 text-center bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="text-3xl font-extrabold text-primary">{c.opportunityCount}</div>
            <div className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "إجمالي الفرص" : "Total opportunities"}</div>
          </Card>
          <Card className="p-5 text-center bg-gradient-to-br from-secondary/10 to-secondary/5">
            <GraduationCap className="h-6 w-6 mx-auto text-secondary mb-1" />
            <div className="text-2xl font-extrabold text-secondary">{c.scholarshipCount}</div>
            <div className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "منحة دراسية" : "Scholarships"}</div>
          </Card>
          <Card className="p-5 text-center bg-gradient-to-br from-accent/10 to-accent/5">
            <Plane className="h-6 w-6 mx-auto text-accent mb-1" />
            <div className="text-2xl font-extrabold text-accent">{c.migrationCount}</div>
            <div className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "برنامج هجرة" : "Migration"}</div>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">
          {lang === "ar" ? `الفرص في ${c.nameAr}` : `Opportunities in ${c.name}`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {c.opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} flag={c.flag} />
          ))}
        </div>

        <div className="my-8">
          <AdSlot slot="country_inline" size="banner" />
        </div>
      </section>
    </div>
  );
}
