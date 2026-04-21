import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register";

// Factory for a fully registered MCP server instance.
class VacationsMcpServer {

    public createMcpServer(): McpServer {
        const mcpServer = new McpServer({
            name: "vacations-mcp",
            version: "1.0.0"
        });

        // Tool registration stays centralized so future tools are added in one place.
        mcpRegister.registerGetAllVacationsTool(mcpServer);
        mcpRegister.registerGetVacationByIdTool(mcpServer);

        return mcpServer;
    }
}

export const vacationsMcpServer = new VacationsMcpServer();
