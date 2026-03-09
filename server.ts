import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // DeepSeek API Proxy
  app.post("/api/chat", async (req, res) => {
    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // The user explicitly requested to hardcode this key for the prototype
          "Authorization": "Bearer sk-d2416a7794194b83bf5123a5a35c2629"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: req.body.messages,
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} ${errText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
