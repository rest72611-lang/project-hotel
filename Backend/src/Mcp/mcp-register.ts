import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { mcpTools } from "./mcp-tools";
import z from "zod";

class McpRegister {

    public registerGetAllVacationsTool(mcpServer: McpServer): void {
        const config = {
            description: "Get all vacations for a specific user.",
            inputSchema: z.object({
                userId: z.number()
            })
        };

        mcpServer.registerTool("getAllVacations", config, mcpTools.getAllVacationsTool);
    }

    public registerGetVacationByIdTool(mcpServer: McpServer): void {
        const config = {
            description: "Get one vacation by id.",
            inputSchema: z.object({
                vacationId: z.number()
            })
        };

        mcpServer.registerTool("getVacationById", config, mcpTools.getVacationByIdTool);
    }
}

export const mcpRegister = new McpRegister();