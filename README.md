# MCP Smart Contract Analyst / 智能合约分析器

@author Ry @RockRockDay

Implements a Model Context Protocol (MCP) server to interact with the Monad blockchain for smart contract source code analysis, including functionality and security evaluation.

实现了一个 Model Context Protocol (MCP) 服务器，用于与 Monad 区块链交互，进行智能合约源代码的功能性与安全性分析。

**For unverified contracts, decompilation is used to assist in source code recovery and review.**

**对于未验证的合约，将尝试进行反编译以辅助恢复和审查源代码。**

## What is MCP? / 什么是 MCP？

The Model Context Protocol (MCP) is a standard that allows AI models to interact with external tools and services. 

Model Context Protocol（模型上下文协议，简称 MCP）是一种标准，允许 AI 模型与外部工具和服务进行交互。

## Prerequisites

- Node.js (v16 or later)
- `npm` or `yarn`
- Claude Desktop / Cursor ide / more...

## Getting Started

1. Clone this repository

```shell
git clone https://github.com/rockyuan/mcp-contract-analyst.git
```

2. Install dependencies:

```
npm install
```

3. Build the project

```shell
npm run build
```

## The server is now ready to use!

### Adding the MCP server to Cursor

1. Open "Cursor".

2. Open Settings.

Cursor > Settings > Cursor Settings > MCP

3. Click "Add a new global MCP server".

4. Add details about the MCP server and save the file.

```json
{
  "mcpServers": {
    "mcp-contract-analyst": {
      "command": "node",
      "args": ["/<path-to-project>/build/index.js"],
      "env": {
        "API_URL": "https://api.blockvision.org/v2/monad/contract/source/code?address=",
        "API_KEY": "xxxxxxxxxxx",
        "DECOMPILE_URL": "https://www.ethervm.io/decompile"
      }
    }
  }
}
```

5. Refresh Cursor.

### Using the MCP server


### Adding the MCP server to Claude Desktop

1. Open "Claude Desktop"


2. Open Settings

Claude > Settings > Developer


3. Open `claude_desktop_config.json` 


4. Add details about the MCP server and save the file.

```json
{
  "mcpServers": {
    "mcp-contract-analyst": {
      "command": "node",
      "args": ["/<path-to-project>/build/index.js"],
      "env": {
        "API_URL": "https://api.blockvision.org/v2/monad/contract/source/code?address=",
        "API_KEY": "xxxxxxxxxxx",
        "DECOMPILE_URL": "https://www.ethervm.io/decompile"
      }
    }
  }
}
```

5. Restart "Claude Desktop"


## Further Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction)
- [Monad Documentation](https://docs.monad.xyz/)
- [Viem Documentation](https://viem.sh/)
- [Monad MCP Tutorial](https://github.com/monad-developers/monad-mcp-tutorial)

## Thanks
- [Monad Developers](https://discord.com/channels/1263596865233096714/1362426760821473430)
