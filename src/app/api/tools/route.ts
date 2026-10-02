import { NextResponse } from "next/server";
import { AGENT_TOOLS } from "@/lib/tools";
import { resolveMode, resolveRpcUrl } from "@/lib/solana";

export async function GET() {
  return NextResponse.json({
    name: "solana-agent-desk",
    track: "Colosseum Crypto World's Fair · Solana",
    mode: resolveMode(),
    rpc: resolveRpcUrl(),
    protocol: "MCP-compatible tool descriptors for agent workflows",
    tools: AGENT_TOOLS,
  });
}
