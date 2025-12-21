// import { Button } from '../ui/button';
// import { FaArrowUp } from 'react-icons/fa';
// import { useForm } from 'react-hook-form';
// import type { KeyboardEvent } from 'react';

// export type ChatFormData = {
//    prompt: string;
// };

// type Props = {
//    onSubmit: (data: ChatFormData) => void;
// };
// const ChatInput = ({ onSubmit }: Props) => {
//    const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

//    const handleFormSubmit = handleSubmit((data) => {
//       reset({ prompt: '' });
//       onSubmit(data);
//    });

//    const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
//       if (e.key === 'Enter' && !e.shiftKey) {
//          e.preventDefault();
//          handleFormSubmit();
//       }
//    };

//    return (
//       <form
//          onSubmit={handleFormSubmit}
//          onKeyDown={onKeyDown}
//          className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
//       >
//          <textarea
//             {...register('prompt', {
//                required: true,
//                validate: (data) => data.trim().length > 0,
//             })}
//             placeholder="Ask anything..."
//             className="w-full focus:outline-0 resize-none "
//          />
//          <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
//             <FaArrowUp />
//          </Button>
//       </form>
//    );
// };

// export default ChatInput;

import { createContext, useContext, type ReactNode } from 'react';
import { useForm, type UseFormRegister, type FormState } from 'react-hook-form';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import type { KeyboardEvent } from 'react';

export type ChatFormData = {
  prompt: string;
};

type ChatInputContextType = {
  register: UseFormRegister<ChatFormData>;
  handleFormSubmit: () => void;
  formState: FormState<ChatFormData>;
  onKeyDown: (e: KeyboardEvent<HTMLFormElement>) => void;
};

const ChatInputContext = createContext<ChatInputContextType | undefined>(
  undefined
);

export const useChatInput = () => {
  const context = useContext(ChatInputContext);
  if (!context) throw new Error('useChatInput must be used within a ChatInput');
  return context;
};

type ChatInputProps = {
  onSubmit: (data: ChatFormData) => void;
  children: ReactNode;
};

const ChatInput = ({ onSubmit, children }: ChatInputProps) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>({
    mode: 'onChange',
  });

  const handleFormSubmit = handleSubmit((data) => {
    reset({ prompt: '' });
    onSubmit(data);
  });

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <ChatInputContext.Provider
      value={{ register, handleFormSubmit, formState, onKeyDown }}
    >
      {children}
    </ChatInputContext.Provider>
  );
};

// Compound subcomponents
ChatInput.Form = ({ children }: { children: ReactNode }) => {
  const { handleFormSubmit, onKeyDown } = useChatInput();
  return (
    <form
      onSubmit={handleFormSubmit}
      onKeyDown={onKeyDown}
      className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
    >
      {children}
    </form>
  );
};

ChatInput.Textarea = () => {
  const { register } = useChatInput();
  return (
    <textarea
      {...register('prompt', {
        required: true,
        validate: (data) => data.trim().length > 0,
      })}
      placeholder="Ask anything..."
      className="w-full focus:outline-0 resize-none"
    />
  );
};

ChatInput.SubmitButton = () => {
  const { formState, handleFormSubmit } = useChatInput();
  return (
    <Button
      type="submit"
      disabled={!formState.isValid}
      className="rounded-full w-9 h-9"
      onClick={handleFormSubmit}
    >
      <FaArrowUp />
    </Button>
  );
};

export default ChatInput;
