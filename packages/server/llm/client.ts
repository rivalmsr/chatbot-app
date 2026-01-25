import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type GenerateTextOptions = {
  model?: string;
  prompt: string;
  instructions?: string;
  temperature?: number;
  maxOutputTokens?: number;
  previousResponseId?: string;
};

export const llmClient = {
  async generateText({
    model = 'gpt-4.1',
    prompt,
    instructions,
    temperature = 0.2,
    maxOutputTokens = 300,
    previousResponseId,
  }: GenerateTextOptions) {
    const response = await client.responses.create({
      model,
      input: prompt,
      instructions,
      temperature,
      max_output_tokens: maxOutputTokens,
      previous_response_id: previousResponseId,
    });

    return { id: response.id, text: response.output_text };
  },
};
