import { getClient } from "@/lib/claude";
import { getAgent } from "@/lib/agents";
import { routeToAgent } from "@/lib/router";
import { ChatRequest, Agent } from "@/lib/types";
import { resolveColor } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    // Check API key first
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured. Add it to your environment variables." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body: ChatRequest = await req.json();
    const { messages, agentSlug } = body;

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Determine the agent
    let agent: Agent | undefined;

    if (agentSlug) {
      agent = getAgent(agentSlug);
    }

    if (!agent) {
      const firstUserMsg = messages.find((m) => m.role === "user");
      if (firstUserMsg) {
        agent = await routeToAgent(firstUserMsg.content);
      }
    }

    if (!agent) {
      return new Response(
        JSON.stringify({ error: "Could not find a matching agent" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build Claude messages (strip custom fields)
    const claudeMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const client = getClient();

    // Stream the response
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: agent.body,
      messages: claudeMessages,
    });

    const encoder = new TextEncoder();
    const selectedAgent = agent;

    const readable = new ReadableStream({
      async start(controller) {
        // Send agent metadata as first event
        const agentMeta = JSON.stringify({
          type: "agent",
          slug: selectedAgent.slug,
          name: selectedAgent.name,
          emoji: selectedAgent.emoji,
          color: resolveColor(selectedAgent.color),
          vibe: selectedAgent.vibe,
        });
        controller.enqueue(encoder.encode(`data: ${agentMeta}\n\n`));

        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({
                type: "text",
                text: event.delta.text,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        } catch (error) {
          const errMsg =
            error instanceof Error ? error.message : "Stream error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Chat API error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
