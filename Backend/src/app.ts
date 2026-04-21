import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";
import { statelessHandler } from "express-mcp-handler";
import expressRateLimit from "express-rate-limit";

import { appConfig } from "./2-utils/app-config";
import { authController } from "./5-controllers/auth-controller";
import { vacationsController } from "./5-controllers/vacations-controller";
import { likesController } from "./5-controllers/likes-controller";
import { recommendationController } from "./5-controllers/recommendation-controller";
import { aiController } from "./5-controllers/ai-controller";
import { pingController } from "./5-controllers/ping-controller";
import { errorsMiddleware } from "./6-middleware/errors-middleware";
import { vacationsMcpServer } from "./Mcp/mcp-server";

// Application bootstrap: wires middleware, HTTP routes, static assets, and the MCP endpoint.
const server = express();

server.use(cors());
server.use(express.json());
server.use(fileUpload({ createParentPath: true }));
server.use(expressRateLimit({
    windowMs: 1000,
    limit: 20,
    // Image requests are static file reads and do not need the same throttling as API mutations.
    skip: (request) => request.path.startsWith("/api/images/")
}));

server.use(authController.router);
server.use(vacationsController.router);
server.use(likesController.router);
server.use(recommendationController.router);
server.use(aiController.router);
server.use(pingController.router);

server.use("/api/images", express.static(path.join(__dirname, "../src/1-assets/images")));

// A fresh MCP server instance is created per request so tool registration stays stateless.
server.post("/mcp", statelessHandler(() => vacationsMcpServer.createMcpServer() as any));

server.use(errorsMiddleware.routeNotFound);
server.use(errorsMiddleware.catchAll);

server.listen(appConfig.port, () => {
    console.log(`Listening on http://localhost:${appConfig.port}`);
});
