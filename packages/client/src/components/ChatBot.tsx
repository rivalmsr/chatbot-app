import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkDown from 'react-markdown';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { Button } from './ui/button';

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
  const conversationId = useRef(crypto.randomUUID());
  const formRef = useRef<HTMLFormElement | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = useCallback(
    async ({ prompt }: FormData) => {
      setMessages((prevState) => [
        ...prevState,
        { content: prompt, role: 'user' },
      ]);
      setIsBotTyping(true);

      reset();

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });
      setMessages((prevState) => [
        ...prevState,
        { content: data.message, role: 'bot' },
      ]);
      setIsBotTyping(false);
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
    <div>
      <div className="flex flex-col gap-2 mb-5">
        {messages.map((message, index) => (
          <p
            key={index}
            onCopy={onCopy}
            className={`px-3 py-2 rounded-3xl ${
              message.role === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            <ReactMarkDown>{message.content}</ReactMarkDown>
          </p>
        ))}

        {isBotTyping && (
          <div className="flex gap-1 px-3 py-2 rounded-3xl bg-gray-200 self-start">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]" />
          </div>
        )}
      </div>
      <form
        // eslint-disable-next-line react-hooks/refs
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        ref={formRef}
        className="flex flex-col gap-2 items-end border-2 rounded-3xl p-4"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
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
