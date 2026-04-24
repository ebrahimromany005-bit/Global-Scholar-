import { useEffect, useRef, useState } from "react";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, User, Loader2 } from "lucide-react";

const SUGGESTED_AR = [
  "ما هي أفضل المنح في ألمانيا؟",
  "كيف أهاجر إلى كندا عبر Express Entry؟",
  "ما هي شروط منحة شيفنينغ؟",
  "ساعدني في اختيار تخصص للماجستير",
  "كيف أحضّر نفسي لاختبار IELTS؟",
];

const SUGGESTED_EN = [
  "What are the best scholarships in Germany?",
  "How do I migrate to Canada via Express Entry?",
  "What are Chevening scholarship requirements?",
  "Help me choose a Master's major",
  "How to prep for IELTS?",
];

type Msg = { role: "user" | "assistant"; content: string };

export default function Assistant() {
  const { lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const createConv = useCreateOpenaiConversation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const saved = localStorage.getItem("scholar_conv_id");
    if (saved) {
      setConversationId(Number(saved));
      return;
    }
    createConv.mutate(
      { data: { title: lang === "ar" ? "محادثة ScholarBot" : "ScholarBot Chat" } },
      {
        onSuccess: (conv) => {
          setConversationId(conv.id);
          localStorage.setItem("scholar_conv_id", String(conv.id));
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string) => {
    if (!text.trim() || !conversationId || streaming) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const apiBase = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api`;
      const res = await fetch(`${apiBase}/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok || !res.body) throw new Error("network");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              setMessages((m) => {
                const next = [...m];
                const last = next[next.length - 1];
                if (last && last.role === "assistant") last.content += data.content;
                return next;
              });
            }
            if (data.done) {
              setStreaming(false);
            }
            if (data.error) {
              setMessages((m) => {
                const next = [...m];
                const last = next[next.length - 1];
                if (last && last.role === "assistant" && !last.content)
                  last.content = lang === "ar" ? "حدث خطأ أثناء التواصل. حاول مرة أخرى." : "Error contacting AI. Please retry.";
                return next;
              });
              setStreaming(false);
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch {
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last && last.role === "assistant" && !last.content)
          last.content = lang === "ar" ? "حدث خطأ أثناء التواصل. حاول مرة أخرى." : "Network error. Please retry.";
        return next;
      });
      setStreaming(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/15 w-12 h-12 rounded-full flex items-center justify-center">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-xl">ScholarBot</h1>
          <Badge variant="outline" className="text-xs gap-1">
            <Sparkles className="h-3 w-3" />
            {lang === "ar" ? "مساعد ذكي يجاوب على كل أسئلتك حول المنح والهجرة" : "Ask anything about scholarships & migration"}
          </Badge>
        </div>
      </div>

      <Card ref={scrollRef as never} className="flex-1 p-4 md:p-6 overflow-y-auto mb-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-bold text-2xl mb-2">
              {lang === "ar" ? "مرحباً بك في ScholarBot" : "Welcome to ScholarBot"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {lang === "ar"
                ? "اسألني أي سؤال حول المنح، الهجرة، التأشيرات، اختبارات اللغة، أو خططك المستقبلية."
                : "Ask me anything about scholarships, migration, visas, language tests, or your future plans."}
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
              {(lang === "ar" ? SUGGESTED_AR : SUGGESTED_EN).map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-sm bg-muted hover:bg-primary hover:text-primary-foreground px-3 py-2 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/15"}`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>
                {m.content ? (
                  <div className="whitespace-pre-wrap leading-relaxed text-sm">
                    {m.content}
                    {streaming && i === messages.length - 1 && (
                      <span className="inline-block w-2 h-4 bg-primary/50 animate-pulse ms-1" />
                    )}
                  </div>
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "ar" ? "اكتب سؤالك هنا..." : "Type your question..."}
          disabled={!conversationId || streaming}
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim() || !conversationId || streaming} className="gap-1">
          <Send className="h-4 w-4" />
          {lang === "ar" ? "إرسال" : "Send"}
        </Button>
      </form>
    </div>
  );
}
