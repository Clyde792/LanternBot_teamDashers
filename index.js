
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const sessions = {};
const CRISIS_WORDS = ["suicide", "kill myself", "end my life", "run away", "hurt myself", "self harm"];

function isCrisis(text) {
  return CRISIS_WORDS.some(w => text.toLowerCase().includes(w));
}

async function sendTelegram(chatId, text) {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
    });
    const data = await res.json();
    if (!data.ok) console.error("Telegram send error:", JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("sendTelegram failed:", err.message);
  }
}

async function callClaude(system, userMessage) {
  if (!ANTHROPIC_KEY) {
    console.error("ANTHROPIC_API_KEY is not set!");
    return null;
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 200,
        system,
        messages: [{ role: "user", content: userMessage }]
      })
    });
    const data = await res.json();
    console.log("Claude response status:", res.status);
    if (data.error) {
      console.error("Claude API error:", JSON.stringify(data.error));
      return null;
    }
    return data.content?.[0]?.text || null;
  } catch (err) {
    console.error("callClaude failed:", err.message);
    return null;
  }
}

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const message = req.body?.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id;
    const text = message.text;
    const username = message.from?.first_name || "there";

    console.log(`Message from ${username} (${chatId}): ${text}`);

    if (!sessions[chatId]) {
      sessions[chatId] = { username, chatId, messages: [], startTime: new Date().toISOString() };
    }

    sessions[chatId].messages.push({ role: "user", content: text, time: new Date().toISOString() });

    if (isCrisis(text)) {
      await sendTelegram(chatId,
        `${username}, I can hear that things are really hard right now. Please reach out immediately:\n\n` +
        `📞 *SOS Crisis Line* — 1800-221-4444\n` +
        `📞 *CHAT* — 1800-353-5800\n\n` +
        `Your worker will also be alerted. You are not alone. 💙`
      );
      sessions[chatId].crisis = true;
      return;
    }

    if (text === "/start") {
      await sendTelegram(chatId,
        `Hey ${username} 👋 I'm ReachOut, a support companion from Singapore Children's Society.\n\n` +
        `Workers are offline right now but I'm here to listen. Your messages are safe and your worker will follow up with you.\n\n` +
        `How are you feeling tonight?`
      );
      return;
    }

    const system = `You are a warm, supportive AI companion for youths at Singapore Children's Society in Singapore.
Workers are offline. Your job is to listen and provide emotional support only.
Keep responses short — 2-3 sentences max. Be warm and non-judgmental.
Never give medical advice. Never pretend to be a human worker.
End with a gentle question. Remind them their worker will follow up.`;

    const history = sessions[chatId].messages
      .slice(-6)
      .map(m => `${m.role === "user" ? username : "Assistant"}: ${m.content}`)
      .join("\n");

    const reply = await callClaude(system, history);

    if (reply) {
      await sendTelegram(chatId, reply);
      sessions[chatId].messages.push({ role: "assistant", content: reply, time: new Date().toISOString() });
    } else {
      await sendTelegram(chatId,
        `I'm here and listening, ${username}. It sounds like you have something on your mind — would you like to share more? Your worker will follow up with you tomorrow. 💙`
      );
    }
  } catch (err) {
    console.error("Webhook handler error:", err.message);
  }
});

app.get("/sessions", (req, res) => {
  const key = req.headers["x-api-key"];
  if (key !== process.env.DASHBOARD_API_KEY) return res.status(401).json({ error: "Unauthorised" });
  const result = Object.values(sessions).map(s => ({
    chatId: s.chatId,
    username: s.username,
    startTime: s.startTime,
    crisis: s.crisis || false,
    messageCount: s.messages.length,
    lastMessage: s.messages.filter(m => m.role === "user").slice(-1)[0]?.content || "",
    lastTime: s.messages.slice(-1)[0]?.time || s.startTime
  }));
  res.json(result);
});

app.post("/reply", async (req, res) => {
  const key = req.headers["x-api-key"];
  if (key !== process.env.DASHBOARD_API_KEY) return res.status(401).json({ error: "Unauthorised" });
  const { chatId, message, workerName } = req.body;
  if (!chatId || !message) return res.status(400).json({ error: "Missing chatId or message" });
  await sendTelegram(chatId, `💬 *${workerName || "Your worker"}*: ${message}\n\n_Reply here to continue the conversation._`);
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.json({
    status: "ReachOut bot running",
    hasToken: !!BOT_TOKEN,
    hasAnthropicKey: !!ANTHROPIC_KEY,
    sessions: Object.keys(sessions).length
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
  console.log(`BOT_TOKEN set: ${!!BOT_TOKEN}`);
  console.log(`ANTHROPIC_KEY set: ${!!ANTHROPIC_KEY}`);
});