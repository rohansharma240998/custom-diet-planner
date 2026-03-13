export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 4000,
        messages: req.body.messages
      })
    });
    const data = await response.json();
    const result = {
      content: [{ type: "text", text: data.choices[0].message.content }]
    };
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}