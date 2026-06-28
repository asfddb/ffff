import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization of Gemini client to prevent startup crash if GEMINI_API_KEY is not immediately present.
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please add it to your secrets panel.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Analyze Indian Governance / BJP Criticisms and Flaws
app.post("/api/analyze", async (req, res) => {
  try {
    const { query, useHighThinking, selectedSector } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGeminiClient();

    // Construct the customized prompt focusing on independent media, YouTube channels, and critical investigative articles
    const systemInstruction = `You are an elite, independent political analyst and investigative research assistant specializing in Indian governance, public policy, and democratic institutions.

The user wants a highly analytical, deep, and critical evaluation of the current Bharatiya Janata Party (BJP) led Indian government, focusing specifically on its biggest flaws, policy failures, and structural challenges.

CRITICAL DIRECTIVES:
1. FOCUS ON INDEPENDENT MEDIA & CRITICAL SCHOLARSHIP: Avoid relying on mainstream TV 'studio media' channels (which the user identifies as being heavily biased or pro-government). Instead, actively look for and prioritize reporting from independent digital journalism (such as The Wire, Newslaundry, Scroll.in, The Caravan, Article 14, Deccan Herald, etc.), international academic/independent indices, and prominent independent YouTube analytical journalists/critics (such as Ravish Kumar, Dhruv Rathee, The DeshBhakt, Ajit Anjum, etc.).
2. ANALYZE CONTROVERSIES DEEPLY: Investigate major systemic issues, policy backfires, and criticisms including:
   - Economic Distress: Youth unemployment crisis, rising wealth inequality, hurdles from Demonetization & GST, and agrarian distress (farmer protests).
   - Democratic Institutions & Liberties: Press freedom decline, misuse of federal law enforcement agencies (ED, CBI, IT) against political opposition, erosion of judicial autonomy, and Pegasus spyware allegations.
   - Social Cohesion: Rising polarization, hate speech spikes, treatment of minorities, the Manipur ethnic crisis, and issues surrounding the CAA-NRC.
   - Policy & Governance Scams/Lapses: The Electoral Bonds scheme (ruled unconstitutional), questionable corporate favors/crony capitalism, and lack of parliamentary debates/scrutiny on key bills.
3. BE SPECIFIC AND SOURCE-DRIVEN: Reference specific data points, independent reports (like CMIE, Oxfam, V-Dem, Reporters Without Borders, Freedom House), articles, and critical YouTube investigative themes.
4. STRUCTURE: Use highly readable Markdown with elegant headings, bullet points, pull quotes, and structured comparison or timeline tables. Citing diverse independent views adds immense weight to the research.`;

    const promptText = `Perform a comprehensive, critical, independent analytical report on the following query regarding the current BJP government of India:
    
Query: "${query}"
${selectedSector ? `Focused Sector: ${selectedSector}` : ""}

Please search the live web using Google Search grounding. Prioritize finding independent analytical journalism, fact-checked critical articles, and YouTube analytical videos. Break down the biggest flaws, systemic criticisms, and alternative independent counter-perspectives, citing specific indices and sources where possible. Keep it objective, rigorous, and deeply investigative. Do not sugarcoat or rely on mainstream televised PR.`;

    const isHigh = !!useHighThinking;
    const modelToUse = isHigh ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

    console.log(`Analyzing query: "${query}" using model: ${modelToUse} (High Thinking: ${isHigh})`);

    // Config setup
    const config: any = {
      systemInstruction,
      tools: [{ googleSearch: {} }],
    };

    if (isHigh) {
      // For gemini-3.1-pro-preview thinking configuration
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH
      };
      // Do NOT set maxOutputTokens as instructed
    }

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: promptText,
      config,
    });

    const reportText = response.text || "No analysis could be generated.";
    
    // Extract search grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = chunks.map((chunk: any) => {
      if (chunk.web) {
        return {
          title: chunk.web.title,
          url: chunk.web.uri,
        };
      }
      return null;
    }).filter(Boolean);

    res.json({
      report: reportText,
      sources: webSources,
      model: modelToUse,
    });

  } catch (error: any) {
    console.error("Error in /api/analyze:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred during critical analysis.",
      needsApiKey: !process.env.GEMINI_API_KEY
    });
  }
});

// Serve Vite dev server in development, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static files from /dist in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
