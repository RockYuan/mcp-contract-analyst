/**
 * MCP Smart Contract Analyst
 * 
 * @author Ry @RockRockDay
 * 
 * Implements a Model Context Protocol (MCP) server to interact with the Monad blockchain
 * for smart contract source code analysis, including functionality and security evaluation.
 * For unverified contracts, decompilation is used to assist in source code recovery and review.
 */

// Import necessary dependencies
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createPublicClient, http } from "viem";
import { monadTestnet } from "viem/chains";

// Create a public client to interact with the Monad testnet
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

// Initialize the MCP server with a name, version, and capabilities
const server = new McpServer({
  name: "mcp-contract-analyst",
  version: "0.0.1",
  capabilities: ["analyze-verified-contract", "analyze-unverified-contract"]
});

server.tool(
  "analyze-verified-contract",
  "Analyze a verified contract from an address on the Monad testnet.",
  {
    address: z.string().describe("Monad testnet address to analyze verified contract for"),
  },
  async ({ address }) => {
    try {
      const apiUrl = process.env.API_URL
      const apiKey = process.env.API_KEY;

      if (!apiUrl) {
        throw new Error("API_URL not set.");
      }

      if (!apiKey) {
        throw new Error("API_KEY not set.");
      }

      const url = `${apiUrl}${address}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "accept": "application/json",
          "x-api-key": apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 0) {
        throw new Error(`API request failed with error: ${data.message}`);
      }

      const sourceCodeList = data.result.sourceCode;

      if (sourceCodeList && sourceCodeList.length > 0) {
        const allSourceCode = sourceCodeList
          .map((item: { content: string }) => item.content)
          .join('\n\n');

        return {
          content: [
            {
              type: "text",
              text: `Analyze the source code of smart contract, including its core functionalities, main logic flow, and security aspects:\n\`\`\`\n${allSourceCode}\n\`\`\``,
            },
          ],
        };
      } else {
        throw new Error(`Failed to retrieve source code`);
      }
    } catch (error) {
      console.error("Error getting contract sourceCode:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve contract sourceCode for address: ${address}. Error: ${error instanceof Error ? error.message : String(error)
              }`,
          },
        ],
      };
    }
  }
);

server.tool(
  "analyze-unverified-contract",
  "Analyze a unverified contract from an address on the Monad testnet.",
  {
    address: z.string().describe("Monad testnet address to analyze unverified contract for"),
  },
  async ({ address }) => {
    try {
      const bytecode = await publicClient.getCode({
        address: address as `0x${string}`,
      })

      console.debug("contract bytecode:", bytecode);

      const decompileUrl = process.env.DECOMPILE_URL;
      if (!decompileUrl) {
        throw new Error("DECOMPILE_URL not set.");
      }

      const formData = new FormData();
      formData.append('bytecode', `${bytecode}`);

      const response = await fetch(decompileUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const html = await response.text();

      const regex = /<div class="code javascript" style="border: 1px solid gray; padding: 0.5em; white-space: pre; font-family: monospace; line-height: 1.2">([\s\S]*?)<\/div>/;
      const match = html.match(regex);

      if (match) {
        const sourceCodeWithHtml = match[1];
        const sourceCode = sourceCodeWithHtml.replace(/<[^>]*>/g, '');

        return {
          content: [
            {
              type: "text",
              text: `Analyze the decompiled source code of contract ${address}, including its core functionalities, main logic flow, and security aspects:\n\`\`\`\n${sourceCode}\n\`\`\` `,
            },
          ],
        };
      } else {
        throw new Error(`Failed to retrieve source code: ${html}`);
      }
    } catch (error) {
      console.error("Error getting contract bytecode:", error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve contract bytecode for address: ${address}. Error: ${error instanceof Error ? error.message : String(error)
              }`,
          },
        ],
      };
    }
  }
);

/**
 * Main function to start the MCP server
 * Uses stdio for communication with LLM clients
 */
async function main() {
  // Create a transport layer using standard input/output
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  await server.connect(transport);

  console.log("Monad testnet MCP Server running on stdio");
}

// Start the server and handle any fatal errors
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
