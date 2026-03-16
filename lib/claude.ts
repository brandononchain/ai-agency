import Anthropic from "@anthropic-ai/sdk";

/**
 * Create an Anthropic client with the given API key.
 * If no key is provided, falls back to the environment variable.
 */
export function getClient(apiKey?: string): Anthropic {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  return new Anthropic({ apiKey: key });
}
