# Playwright MCP Server Setup

This project includes Playwright MCP (Model Context Protocol) servers with multi-agent support for browser automation.

## Installed MCP Servers

1. **@playwright/mcp** - Official Playwright MCP server
2. **ultimate-playwright-mcp** - Multi-agent Playwright MCP server with tab isolation

## Quick Start

### 1. Run MCP Servers

```bash
# Official Playwright MCP server
npm run mcp:playwright

# Ultimate Playwright MCP server (multi-agent support)
npm run mcp:ultimate
```

### 2. MCP Configuration

The `mcp-config.json` file contains the configuration for both MCP servers. You can use this configuration with MCP-compatible clients like:

- Cursor IDE
- Claude Desktop
- Other MCP-enabled applications

### 3. Integration with IDE

To use with Cursor IDE or similar MCP-enabled clients:

1. Copy the configuration from `mcp-config.json`
2. Add it to your IDE's MCP configuration
3. Restart your IDE to load the MCP servers

## Features

### Official Playwright MCP (@playwright/mcp)
- Standard Playwright automation
- Page navigation and interaction
- Element selection and manipulation
- Screenshot and PDF generation
- Form filling and submission

### Ultimate Playwright MCP (ultimate-playwright-mcp)
- Multi-agent support
- Tab isolation via targetId
- Chrome DevTools Protocol (CDP) integration
- Enhanced browser automation
- Concurrent session management

## Environment Variables

- `PLAYWRIGHT_BROWSERS_PATH` - Path to Playwright browsers (defaults to `./node_modules/.playwright`)

## Available Scripts

- `npm run mcp:playwright` - Start official Playwright MCP server
- `npm run mcp:ultimate` - Start ultimate Playwright MCP server
- `npm run test` - Run Playwright tests
- `npm run test:headed` - Run tests in headed mode
- `npm run test:ui` - Run tests with UI mode
- `npm run codegen` - Generate Playwright code

## Usage Examples

Once the MCP server is running, you can use it for:

- Automated web testing
- Web scraping
- Form automation
- Screenshot capture
- PDF generation
- Browser interaction monitoring

## Troubleshooting

1. **Browser not found**: Run `npx playwright install` to install browsers
2. **Permission issues**: Ensure the MCP server has access to the browser installation
3. **Port conflicts**: Check if the MCP server ports are available

## Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Ultimate Playwright MCP](https://www.npmjs.com/package/ultimate-playwright-mcp)
