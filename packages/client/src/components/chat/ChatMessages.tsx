import { useCallback, useEffect, useRef } from 'react';
import type { ClipboardEvent } from 'react';
import ReactMarkDown from 'react-markdown';

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

type ChatMessagesProps = {
  messages: Message[];
};

function ChatMessages({ messages }: ChatMessagesProps) {
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onCopy = useCallback((e: ClipboardEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
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
    </div>
  );
}

export default ChatMessages;
