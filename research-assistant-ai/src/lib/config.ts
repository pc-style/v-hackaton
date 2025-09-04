export const config = {
  gatewayUrl: process.env.AI_GATEWAY_URL ?? '',
  gatewayKey: process.env.AI_GATEWAY_API_KEY ?? '',
  model: process.env.AI_MODEL ?? 'gpt-4o-mini',
  webSearchUrl: process.env.WEB_SEARCH_URL ?? '/api/tools/web-search',
}

