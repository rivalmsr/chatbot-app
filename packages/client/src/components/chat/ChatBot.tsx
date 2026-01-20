import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkDown from 'react-markdown';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { Button } from '../ui/button';
import TypingIndicator from './TypingIndicator';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const conversationId = useRef(crypto.randomUUID());
  const messageRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const onCopy = useCallback((e: ClipboardEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-y-auto gap-2 mb-5">
        {messages.map((message, index) => (
          <div
            key={index}
            onCopy={onCopy}
            ref={index === messages.length - 1 ? messageRef : null}
            className={`px-3 py-2 rounded-3xl ${
              message.role === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            <ReactMarkDown>{message.content}</ReactMarkDown>
          </div>
        ))}

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
