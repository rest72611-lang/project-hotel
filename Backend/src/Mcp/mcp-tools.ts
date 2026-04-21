import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { mcpHelper } from "./mcp-helper";
import { vacationsService } from "../4-services/vacations-service";

// Adapts existing vacation services into MCP-friendly tool responses instead of duplicating logic.
class McpTools {

    public async getAllVacationsTool(args: { userId: number }): Promise<CallToolResult> {
        console.log("starting getAllVacationsTool, userId: " + args.userId);

        try {
            const vacations = await vacationsService.getAllVacations(args.userId);
            return mcpHelper.getToolResult(vacations);
        }
        catch (err: any) {
            return mcpHelper.getErrorResult(err.message);
        }
    }

    public async getVacationByIdTool(args: { vacationId: number }): Promise<CallToolResult> {
        console.log("starting getVacationByIdTool, vacationId: " + args.vacationId);

        try {
            const vacation = await vacationsService.getOneVacation(args.vacationId);
            return mcpHelper.getToolResult(vacation);
        }
        catch (err: any) {
            return mcpHelper.getErrorResult(err.message);
        }
    }

    public async getVacationsReportTool(args: { userId: number }): Promise<CallToolResult> {
        console.log("starting getVacationsReportTool, userId: " + args.userId);

        try {
            const vacations = await vacationsService.getAllVacations(args.userId);

            // The report tool deliberately exposes only chart-friendly fields.
            const report = vacations.map(v => ({
                destination: v.destination,
                likesCount: Number(v.likesCount)
            }));

            return mcpHelper.getToolResult(report);
        }
        catch (err: any) {
            return mcpHelper.getErrorResult(err.message);
        }
    }
}

export const mcpTools = new McpTools();
