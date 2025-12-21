// import { useState } from 'react';
// import axios from 'axios';
// import TypingIndicator from './TypingIndicator';
// import ChatMessages from './ChatMessages';
// import type { Message } from './ChatMessages';
// import ChatInput from './ChatInput';
// import type { ChatFormData } from './ChatInput';
// import popSound from '@/assets/sounds/pop.mp3';
// import notificationSound from '@/assets/sounds/notification.mp3';

// const popAudio = new Audio(popSound);
// popAudio.volume = 0.2;
// const notificationAudio = new Audio(notificationSound);
// notificationAudio.volume = 0.4;

// type ChatResponse = {
//    message: string;
// };

// const ChatBot = () => {
//    const [messages, setMessages] = useState<Message[]>([]);
//    const [isBotTyping, setIsBotTyping] = useState(false);
//    const [error, setError] = useState('');

//    const onSubmit = async ({ prompt }: ChatFormData) => {
//       try {
//          setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
//          setIsBotTyping(true);
//          popAudio.play();

//          setError('');
//          const { data } = await axios.post<ChatResponse>('/api/chat', {
//             prompt,
//          });
//          setMessages((prev) => [
//             ...prev,
//             { content: data?.message, role: 'bot' },
//          ]);
//          notificationAudio.play();
//       } catch (error) {
//          console.error(error);
//          setError('Something went wrong try again!');
//       } finally {
//          setIsBotTyping(false);
//       }
//    };

//    return (
//       <div className="flex flex-col h-full">
//          <div className="flex flex-col flex-1 gap-3 mb-6 overflow-y-auto">
//             <ChatMessages messages={messages} />
//             {isBotTyping && <TypingIndicator />}
//             {error && <p className="text-red-500">{error}</p>}
//          </div>
//          <ChatInput onSubmit={onSubmit} />
//       </div>
//    );
// };

// export default ChatBot;

import { useState, createContext, useContext, type ReactNode } from 'react';
import axios from 'axios';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';
import ChatMessages, { type Message } from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';
import TypingIndicator from './TypingIndicator';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;
const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.4;

type ChatResponse = {
  message: string;
};

type ChatBotContextType = {
  messages: Message[];
  isBotTyping: boolean;
  error: string;
  onSubmit: (data: ChatFormData) => Promise<void>;
};

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error('useChatBot must be used within a ChatBot');
  }
  return context;
};

type ChatBotProps = {
  children: ReactNode;
};

const ChatBot = ({ children }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      popAudio.play();

      setError('');
      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
      });
      setMessages((prev) => [...prev, { content: data?.message, role: 'bot' }]);
      notificationAudio.play();
    } catch (err) {
      console.error(err);
      setError('Something went wrong, try again!');
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <ChatBotContext.Provider value={{ messages, isBotTyping, error, onSubmit }}>
      <div className="flex flex-col h-full">{children}</div>
    </ChatBotContext.Provider>
  );
};

// Compound components
ChatBot.Messages = () => {
  const { messages } = useChatBot();
  return (
    <ChatMessages messages={messages}>
      <div className="flex flex-col gap-2">
        {messages.map((msg, i) => (
          <ChatMessages.Item
            key={i}
            message={msg}
            isLast={i === messages.length - 1}
          />
        ))}
      </div>
    </ChatMessages>
  );
};

ChatBot.Input = () => {
  const { onSubmit } = useChatBot();
  return (
    <ChatInput onSubmit={onSubmit}>
      <ChatInput.Form>
        <ChatInput.Textarea />
        <ChatInput.SubmitButton />
      </ChatInput.Form>
    </ChatInput>
  );
};

ChatBot.TypingIndicator = () => {
  const { isBotTyping } = useChatBot();
  if (!isBotTyping) return null;
  return (
    <TypingIndicator>
      <TypingIndicator.Dot />
      <TypingIndicator.Dot style={{ animationDelay: '0.2s' }} />
      <TypingIndicator.Dot />
      <TypingIndicator.Dot style={{ animationDelay: '0.4s' }} />
    </TypingIndicator>
  );
};

ChatBot.Error = () => {
  const { error } = useChatBot();
  if (!error) return null;
  return <p className="text-red-500">{error}</p>;
};

export default ChatBot;
