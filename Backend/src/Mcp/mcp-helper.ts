import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

// Small formatter layer so every MCP tool returns a consistent text payload shape.
class McpHelper {

    public getToolResult(data: any): CallToolResult {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2)
                }
            ]
        };
    }

    public getErrorResult(message: string): CallToolResult {
        return {
            content: [
                {
                    type: "text",
                    text: message
                }
            ],
            isError: true
        };
    }
}

export const mcpHelper = new McpHelper();
