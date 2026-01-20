import { useCallback } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import type { KeyboardEvent } from 'react';
import { Button } from '../ui/button';

export type ChatInputFormData = {
  prompt: string;
};

type ChatInputProps = {
  onSubmit: (data: ChatInputFormData) => void;
};

function ChatInput({ onSubmit }: ChatInputProps) {
  const { register, handleSubmit, reset, formState } =
    useForm<ChatInputFormData>();

  const submitForm = useCallback(
    (data: ChatInputFormData) => {
      reset({ prompt: '' });
      onSubmit(data);
    },
    [reset, onSubmit]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key == 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(submitForm)();
      }
    },
    [handleSubmit, submitForm]
  );

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
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
  );
}

export default ChatInput;
