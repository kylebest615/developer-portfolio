export async function POST(request) {
  try {
    const body = await request.json();
    const token = "8513855392:AAFm-id8SiUnxk_oqYEq6vS-IkQnQuR137I";
    const chatId = "8316632899";

    if (!token || !chatId) {
      return new Response(JSON.stringify({ error: "Missing Telegram credentials" }), { status: 500 });
    }

    // Try to find the client's IP from common headers
    const xfwd = request.headers.get("x-forwarded-for");
    const ipHeader = xfwd || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || request.headers.get("true-client-ip") || request.headers.get("fastly-client-ip");
    const ip = ipHeader ? ipHeader.split(",")[0].trim() : "Unknown";

    const text = `New visitor OS: ${body.os}\nIP: ${ip}\nTime: ${body.timestamp}`;


    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    let tgJson = null;
    try {
      tgJson = await tgRes.json();
    } catch (e) {
      console.error("Telegram response parse error", e);
    }

    if (!tgRes.ok) {
      console.error("Telegram API error", tgRes.status, tgJson);
      return new Response(JSON.stringify({ ok: false, telegramStatus: tgRes.status, telegramBody: tgJson }), { status: 502 });
    }
    return new Response(JSON.stringify({ ok: true, telegram: tgJson }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
