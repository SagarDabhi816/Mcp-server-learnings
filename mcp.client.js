import { config } from "dotenv";
config();
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenAI } from "@google/genai";
// import { properties } from "zod";
// import { required } from "zod/mini";

const weatherTool = {
  type: "function",
  name: "get_current_temperature",
  description: "Gets the current temperature for a given location.",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The city name, e.g. San Francisco",
      },
    },
    required: ["location"],
  },
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});
const transport = new StdioClientTransport({
  command: "node",
  args: ["./mcp.server.js"],
});

const tools = [];

const client = new Client({ name: "my-client", version: "1.0.0" });
await client.connect(transport);

client.listTools().then(async (response) => {
  response.tools.forEach((tool) => {
    tools.push({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "OBJECT",
        properties: tool.inputSchema.properties,
        required: tool.inputSchema.required || [],
      },
    });
  });

  //  const contents = [{
  //   role: 'user',
  //   parts: [{ text: "What's the temperature in London?" }]
  // }];

  const aiResponse = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: "add 5 and 10 ",
    config: {
      tools: [{ functionDeclarations: tools }],
    },
  });

  console.log("ai response function calls",aiResponse.functionCalls);

  aiResponse.functionCalls
    .forEach(async call => {
      const toolResponse = await client.callTool({
        name: call.name,
        arguments: call.args,
      });
      console.log("tool response", toolResponse);
    });
});
