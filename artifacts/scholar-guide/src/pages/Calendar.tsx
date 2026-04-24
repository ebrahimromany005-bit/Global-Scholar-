import { Link } from "wouter";
import { useState, useMemo } from "react";
import { useListUpcomingDeadlines, useListCountries } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";

export default function CalendarPage() {
  const { lang } = useLang();
  const deadlines = useListUpcomingDeadlines();
  const countries = useListCountries();
  const flagFor = (code: string) => countries.data?.find((c) => c.code === code)?.flag;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const monthName = new Date(year, month, 1).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const oppsByDate = useMemo(() => {
    const map = new Map<string, typeof deadlines.data>();
    (deadlines.data ?? []).forEach((o) => {
      const arr = map.get(o.deadline) ?? [];
      arr.push(o);
      map.set(o.deadline, arr);
    });
    return map;
  }, [deadlines.data]);

  const navigate = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
  };

  const selectedOpps = selected ? oppsByDate.get(selected) ?? [] : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center gap-2">
        <CalIcon className="h-8 w-8 text-primary" />
        {lang === "ar" ? "تقويم المواعيد النهائية" : "Deadlines Calendar"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {lang === "ar"
          ? "اضغط على تاريخ لرؤية كل الفرص المنتهية في ذلك اليوم."
          : "Click any date to see opportunities ending that day."}
      </p>

      <Card className="p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-bold text-xl">{monthName}</h2>
          <Button variant="ghost" size="icon" onClick={() => navigate(1)}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2 font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const opps = oppsByDate.get(dateStr) ?? [];
            const isToday = dateStr === today.toISOString().slice(0, 10);
            const isSelected = dateStr === selected;
            return (
              <button
                key={i}
                onClick={() => setSelected(dateStr)}
                className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-center transition-all relative ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : opps.length
                      ? "bg-accent/15 hover:bg-accent/25"
                      : "hover:bg-muted"
                } ${isToday && !isSelected ? "ring-2 ring-primary" : ""}`}
              >
                <span className="font-medium text-sm">{day}</span>
                {opps.length > 0 && (
                  <span className={`text-[10px] mt-0.5 ${isSelected ? "" : "text-accent font-bold"}`}>
                    {opps.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {selected && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-3">
            {lang === "ar" ? `فرص تنتهي يوم ${selected}` : `Opportunities ending ${selected}`}
            <Badge variant="outline" className="ms-2">{selectedOpps.length}</Badge>
          </h3>
          {selectedOpps.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {lang === "ar" ? "لا توجد فرص تنتهي في هذا اليوم." : "No deadlines on this date."}
            </p>
          ) : (
            <div className="space-y-2">
              {selectedOpps.map((o) => (
                <Link key={o.id} href={`/opportunities/${o.id}`}>
                  <Card className="p-3 hover-elevate cursor-pointer flex items-center gap-3">
                    <span className="text-3xl">{flagFor(o.countryCode) ?? "🌍"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {lang === "ar" ? o.titleAr : o.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lang === "ar" ? o.countryNameAr : o.countryName} · {o.organization}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
