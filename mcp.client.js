import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY || ""
})
const transport = new StdioClientTransport({
  command: "node",
  args: ["./mcp.server.js"],
  // env: { NODE_ENV: 'production' },
  // cwd: '/path/to/server'
});

const client = new Client({ name: "my-client", version: "1.0.0" });
await client.connect(transport);

client.listTools().then((response) => {
  console.log(response);
});
