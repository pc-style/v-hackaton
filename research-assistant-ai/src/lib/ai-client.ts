import OpenAI from 'openai';

// Initialize OpenAI client with Vercel AI Gateway
const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY || 'dummy-key',
  baseURL: process.env.AI_GATEWAY_BASE_URL || 'https://api.openai.com/v1',
});

export interface AICallOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export async function callAI(
  prompt: string, 
  options: AICallOptions = {}
): Promise<string> {
  const {
    model = 'gpt-4o',
    maxTokens = 1500,
    temperature = 0.3,
    systemPrompt
  } = options;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
    { role: 'user', content: prompt }
  ];

  try {
    const response = await client.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI call failed:', error);
    throw new Error(`AI call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function callAIWithJSON<T>(
  prompt: string,
  options: AICallOptions = {}
): Promise<T> {
  const response = await callAI(prompt, {
    ...options,
    temperature: 0.1, // Lower temperature for more consistent JSON
  });
  
  try {
    return JSON.parse(response) as T;
  } catch (error) {
    console.error('Failed to parse JSON response:', response);
    throw new Error('AI returned invalid JSON');
  }
}