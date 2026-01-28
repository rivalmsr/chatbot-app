import { Ollama } from 'ollama';
import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import summaryTemplate from '../llm/prompts/summarize-reviews.txt';

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const inferenceClient = new InferenceClient(process.env.HF_TOKEN);
const ollamaClient = new Ollama();

const summaryPrompt = summaryTemplate
  .replace(':', '.')
  .replace('{{reviews}}', '');

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
    const response = await openAIClient.responses.create({
      model,
      input: prompt,
      instructions,
      temperature,
      max_output_tokens: maxOutputTokens,
      previous_response_id: previousResponseId,
    });

    return { id: response.id, text: response.output_text };
  },

  async summarizeReviews(reviews: string) {
    // summarize reviews with tinyllama model
    const response = await ollamaClient.chat({
      model: 'tinyllama',
      messages: [
        {
          role: 'system',
          content: summaryPrompt,
        },
        {
          role: 'user',
          content: reviews,
        },
      ],
    });

    return response.message.content;

    // summarize reviews with meta-llama/Llama-3.1-8B-Instruct:novita model
    // const response = await inferenceClient.chatCompletion({
    //   model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: summaryPrompt,
    //     },
    //     {
    //       role: 'user',
    //       content: reviews,
    //     },
    //   ],
    // });
    //
    // return response.choices[0]?.message.content || '';
  },

  async summarize(inputs: string) {
    const response = await inferenceClient.summarization({
      model: 'facebook/bart-large-cnn',
      inputs,
      provider: 'hf-inference',
    });

    return response.summary_text;
  },
};
