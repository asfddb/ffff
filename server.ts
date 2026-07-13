// ============================================================================
//  Static/dev server for OVERWATCH PROTOCOL.
//  - Development: mounts Vite as middleware for HMR.
//  - Production:  serves the compiled bundle from /dist.
// ============================================================================
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static files from /dist in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OVERWATCH PROTOCOL running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
