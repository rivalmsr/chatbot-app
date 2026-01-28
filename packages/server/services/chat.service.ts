import fs from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../llm/prompts/chatbot.txt';
import { llmClient } from '../llm/client';

type ChatResponse = {
  id: string;
  message: string;
};

const currentTime = new Date().toLocaleString('en-GB', {
  timeZone: 'Asia/Jakarta',
  hour12: false,
});
const parkInfo = fs.readFileSync(
  path.join(__dirname, '..', 'llm', 'prompts', 'WonderWorld.md'),
  'utf-8'
);
const instructions = template
  .replace('{{currentTime}}', currentTime)
  .replace('{{parkInfo}}', parkInfo);

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await llmClient.generateText({
      model: 'gpt-4o-mini',
      instructions,
      prompt,
      temperature: 0.2,
      maxOutputTokens: 250,
      previousResponseId:
        conversationRepository.getLastConversationId(conversationId),
    });

    conversationRepository.setLastConversationId(conversationId, response.id);

    return { id: response.id, message: response.text };
  },
};
