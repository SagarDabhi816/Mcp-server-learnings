import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const server = new McpServer({ name: "greeting-server", version: "1.0.0" });

server.registerTool(
    'greet',
    {
        title:"additional tool",
        description: 'Greet someone by name',
        inputSchema: z.object({ name: z.string() })
    },
    async ({ name }) => ({
        content: [{ type: 'text', text: `Hello, ${name}!` }]
    })
);

server.registerTool('addTwoNumbers',{
    title: "add Two Numbers",
    description: "adds Two Numbers Together",
    inputSchema: z.object({
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    }),
  },
  async({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
