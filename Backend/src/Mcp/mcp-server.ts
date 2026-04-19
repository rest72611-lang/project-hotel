import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpRegister } from "./mcp-register";

class VacationsMcpServer {

    public createMcpServer(): McpServer {
        const mcpServer = new McpServer({
            name: "vacations-mcp",
            version: "1.0.0"
        });

        mcpRegister.registerGetAllVacationsTool(mcpServer);
        mcpRegister.registerGetVacationByIdTool(mcpServer);

        return mcpServer;
    }
}

export const vacationsMcpServer = new VacationsMcpServer();