import { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import type { KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import TypingIndicator from './TypingIndicator';
import ChatMessages from './ChatMessages';
import type { Message } from './ChatMessages';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = useCallback(
    async ({ prompt }: FormData) => {
      try {
        setMessages((prevState) => [
          ...prevState,
          { content: prompt, role: 'user' },
        ]);
        setIsBotTyping(true);
        setError('');

        reset({ prompt: '' });

        const { data } = await axios.post<ChatResponse>('/api/chat', {
          prompt,
          conversationId: conversationId.current,
        });
        setMessages((prevState) => [
          ...prevState,
          { content: data.message, role: 'bot' },
        ]);
      } catch (error) {
        console.error(error);
        setError('Something went wrong, try again!');
      } finally {
        setIsBotTyping(false);
      }
    },
    [reset]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key == 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }
    },
    [handleSubmit, onSubmit]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-y-auto gap-2 mb-5">
        <ChatMessages messages={messages} />

        {isBotTyping && <TypingIndicator />}

        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 rounded-3xl p-4"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          autoFocus
          placeholder="Ask anything"
          className="w-full focus:outline-0 resize-none"
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
}

export default ChatBot;
