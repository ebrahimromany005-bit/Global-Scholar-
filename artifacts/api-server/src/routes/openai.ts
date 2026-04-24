import { Router, type IRouter } from "express";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  CreateOpenaiConversationBody,
  GetOpenaiConversationParams,
  SendOpenaiMessageParams,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SYSTEM_PROMPT = `أنت ScholarBot — مساعد ذكي ودود وخبير في منصة "دليل المنح والهجرة العالمي".

مهمتك:
- مساعدة المستخدمين العرب على فهم الفرص الدراسية والمنح وبرامج الهجرة حول العالم.
- الإجابة على أي سؤال حول: المنح الدراسية، التأشيرات، تأشيرات العمل، تأشيرات الطلاب، اختبارات اللغة (IELTS، TOEFL، DELF)، كتابة CV وخطاب الدوافع، التحضير للمقابلات، اختيار الدولة المناسبة، متطلبات الهجرة، برامج الإقامة الدائمة، فرص العمل في الخارج، تكاليف المعيشة، وأي موضوع متعلق.
- اقتراح خطوات عملية واضحة.
- تقديم معلومات دقيقة ومحدثة قدر الإمكان، وعند عدم اليقين قل ذلك بوضوح.

أسلوبك:
- دائماً أجب باللغة العربية الفصحى البسيطة، إلا إذا طلب المستخدم لغة أخرى.
- أجوبتك واضحة، منظمة، عملية. استخدم النقاط والقوائم عند الحاجة.
- ودود ومتحمس ومشجع، لكن واقعي.
- لا ترفض أي سؤال له علاقة بالتعليم أو السفر أو الهجرة. أجب دائماً بأفضل ما لديك.
- إذا سُئلت عن موضوع خارج تخصصك، حاول المساعدة بشكل عام أو وجّه المستخدم لمصدر مناسب.

ابدأ كل محادثة جديدة بترحيب موجز إذا كانت أول رسالة.`;

router.post("/openai/conversations", async (req, res) => {
  const body = CreateOpenaiConversationBody.parse(req.body);
  const [created] = await db
    .insert(conversationsTable)
    .values({ title: body.title })
    .returning();

  if (!created) {
    res.status(500).json({ error: "Failed to create conversation" });
    return;
  }

  res.status(201).json({
    id: created.id,
    title: created.title,
    createdAt: created.createdAt.toISOString(),
  });
});

router.get("/openai/conversations/:id", async (req, res) => {
  const { id } = GetOpenaiConversationParams.parse({ id: Number(req.params["id"]) });

  const [conv] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));

  if (!conv) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(asc(messagesTable.createdAt));

  res.json({
    id: conv.id,
    title: conv.title,
    createdAt: conv.createdAt.toISOString(),
    messages: msgs.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
  });
});

router.post("/openai/conversations/:id/messages", async (req, res) => {
  const { id } = SendOpenaiMessageParams.parse({ id: Number(req.params["id"]) });
  const body = SendOpenaiMessageBody.parse(req.body);

  const [conv] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));

  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  await db.insert(messagesTable).values({
    conversationId: id,
    role: "user",
    content: body.content,
  });

  const history = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(asc(messagesTable.createdAt));

  const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  let fullResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    if (fullResponse) {
      await db.insert(messagesTable).values({
        conversationId: id,
        role: "assistant",
        content: fullResponse,
      });
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "OpenAI streaming failed");
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    res.write(
      `data: ${JSON.stringify({ error: errMsg })}\n\n`,
    );
    res.end();
  }
});

export default router;
