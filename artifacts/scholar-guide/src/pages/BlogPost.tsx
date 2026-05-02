import { useParams, Link } from 'wouter';
import { useLang } from '@/lib/i18n';
import { getArticleBySlug, articles } from '@/data/articles';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Clock, BookOpen, ChevronRight } from 'lucide-react';

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-2xl font-extrabold mt-8 mb-4 text-foreground">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-lg font-bold mt-6 mb-2 text-foreground">{line.slice(4)}</h3>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={key++} className="font-bold my-2">{line.slice(2, -2)}</p>);
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="flex gap-2 my-1 text-sm md:text-base text-foreground/90">
          <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-1" />
          <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </li>
      );
    } else if (line.startsWith('| ')) {
      // simple table row skip (handled below)
    } else if (line.trim() === '' || line.startsWith('---')) {
      elements.push(<div key={key++} className="my-1" />);
    } else {
      elements.push(
        <p key={key++} className="text-sm md:text-base text-foreground/90 leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
        />
      );
    }
  }

  return elements;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();
  const isAr = lang === 'ar';
  const article = getArticleBySlug(slug!);
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{isAr ? 'المقال غير موجود' : 'Article not found'}</h1>
        <Link href="/blog">
          <Button>{isAr ? 'العودة للمقالات' : 'Back to Articles'}</Button>
        </Link>
      </div>
    );
  }

  const related = articles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-1 mb-6 text-muted-foreground hover:text-foreground">
            <Arrow className="h-4 w-4" />
            {isAr ? 'كل المقالات' : 'All Articles'}
          </Button>
        </Link>

        <article className="bg-background border rounded-2xl shadow-sm p-6 md:p-10 mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge className="bg-primary/10 text-primary border-0">
              {article.region}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {article.readTime} {isAr ? 'دقيقة قراءة' : 'min read'}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold leading-snug mb-4">
            {article.title}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-8 pb-8 border-b">
            {article.summary}
          </p>

          <div className="prose-like">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {renderContent(article.content)}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
            {article.tags.map(t => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">
              {isAr ? 'مقالات ذات صلة' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(rel => (
                <Link key={rel.id} href={`/blog/${rel.slug}`}>
                  <Card className="p-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full">
                    <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {rel.readTime} {isAr ? 'د' : 'min'}
                    </div>
                    <h3 className="text-sm font-bold leading-snug line-clamp-3">{rel.title}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
