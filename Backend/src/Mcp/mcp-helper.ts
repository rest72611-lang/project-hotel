import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

class McpHelper {

    // Return tool result:
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

    // Return tool error:
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