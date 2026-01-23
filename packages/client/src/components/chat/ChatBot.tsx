import { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import TypingIndicator from './TypingIndicator';
import ChatMessages from './ChatMessages';
import type { Message } from './ChatMessages';
import ChatInput from './ChatInput';
import type { ChatInputFormData } from './ChatInput';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
  message: string;
};

function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const conversationId = useRef(crypto.randomUUID());

  const onSubmit = useCallback(async ({ prompt }: ChatInputFormData) => {
    try {
      setMessages((prevState) => [
        ...prevState,
        { content: prompt, role: 'user' },
      ]);
      setIsBotTyping(true);
      setError('');
      popAudio.play();

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });
      setMessages((prevState) => [
        ...prevState,
        { content: data.message, role: 'bot' },
      ]);
      notificationAudio.play();
    } catch (error) {
      console.error(error);
      setError('Something went wrong, try again!');
    } finally {
      setIsBotTyping(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-y-auto gap-2 mb-5">
        <ChatMessages messages={messages} />

        {isBotTyping && <TypingIndicator />}

        {error && <p className="text-red-500">{error}</p>}
      </div>

      <ChatInput onSubmit={onSubmit} />
    </div>
  );
}

export default ChatBot;
