import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useLang } from '@/lib/i18n';
import { articles } from '@/data/articles';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Clock, Globe, GraduationCap, Plane } from 'lucide-react';

const CATEGORY_LABELS = {
  europe: { ar: 'أوروبا', en: 'Europe', icon: Globe, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  americas: { ar: 'أمريكا وأوقيانوسيا', en: 'Americas & Oceania', icon: GraduationCap, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  asia: { ar: 'آسيا', en: 'Asia', icon: Plane, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
} as const;

export default function Blog() {
  const { lang } = useLang();
  const isAr = lang === 'ar';
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'all' | 'europe' | 'americas' | 'asia'>('all');

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchCat = cat === 'all' || a.category === cat;
      const matchQ = !q.trim() ||
        a.title.includes(q) ||
        a.summary.includes(q) ||
        a.tags.some(t => t.includes(q));
      return matchCat && matchQ;
    });
  }, [q, cat]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-primary-foreground py-12">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            {isAr ? '30 مقالاً موثوقاً' : '30 Trusted Articles'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {isAr ? 'مقالات المنح والدراسة' : 'Scholarship & Study Articles'}
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
            {isAr
              ? 'أكثر من 30 مقالاً متخصصاً عن المنح الدراسية في أوروبا وأمريكا وكندا وأستراليا وآسيا'
              : 'Over 30 expert articles on scholarships in Europe, Americas, and Asia'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 ms-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={isAr ? 'ابحث في المقالات...' : 'Search articles...'}
              className="ps-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'europe', 'americas', 'asia'] as const).map(c => {
              const active = cat === c;
              return (
                <Button
                  key={c}
                  size="sm"
                  variant={active ? 'default' : 'outline'}
                  onClick={() => setCat(c)}
                  className={active ? 'bg-primary text-primary-foreground' : ''}
                >
                  {c === 'all'
                    ? isAr ? `الكل (${articles.length})` : `All (${articles.length})`
                    : isAr
                      ? `${CATEGORY_LABELS[c].ar} (${articles.filter(a => a.category === c).length})`
                      : `${CATEGORY_LABELS[c].en} (${articles.filter(a => a.category === c).length})`}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {isAr
            ? `عرض ${filtered.length} مقال`
            : `Showing ${filtered.length} articles`}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(article => {
            const catInfo = CATEGORY_LABELS[article.category];
            return (
              <Link key={article.id} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer group">
                  <CardContent className="pt-5 pb-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`text-xs ${catInfo.color} border-0`}>
                        {isAr ? catInfo.ar : catInfo.en}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.readTime} {isAr ? 'د' : 'min'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base mb-2 leading-relaxed group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3 flex-1">
                      {article.summary}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {article.tags.slice(0, 3).map(t => (
                        <Badge key={t} variant="outline" className="text-[10px] px-1.5">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>{isAr ? 'لا توجد مقالات تطابق بحثك' : 'No articles match your search'}</p>
          </div>
        )}
      </section>
    </div>
  );
}
