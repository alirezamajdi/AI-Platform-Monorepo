// import React, { useEffect, useRef } from 'react';
// import ReactMarkdown from 'react-markdown';

// export type Message = {
//    content: string;
//    role: 'user' | 'bot';
// };

// type Props = {
//    messages: Message[];
// };
// const ChatMessages = ({ messages }: Props) => {
//    const lastMessageRef = useRef<HTMLDivElement | null>(null);

//    useEffect(() => {
//       lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
//    }, [messages]);

//    const onCopyMessage = (e: React.ClipboardEvent) => {
//       const selection = window.getSelection()?.toString()?.trim();
//       if (selection) {
//          e.preventDefault();
//          e.clipboardData.setData('text/plain', selection);
//       }
//    };

//    return (
//       <>
//          {messages?.map((message, index) => (
//             <div
//                onCopy={onCopyMessage}
//                className={`px-3 py-1 rounded-xl ${
//                   message.role == 'user'
//                      ? 'bg-blue-600 text-white self-end'
//                      : ' bg-gray-100 text-black self-start'
//                }`}
//                ref={index === messages.length - 1 ? lastMessageRef : null}
//                key={index}
//             >
//                <ReactMarkdown>{message.content}</ReactMarkdown>
//             </div>
//          ))}
//       </>
//    );
// };

// export default ChatMessages;

import React, {
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

type ChatMessagesContextType = {
  messages: Message[];
};

const ChatMessagesContext = createContext<ChatMessagesContextType | undefined>(
  undefined
);

export const useChatMessages = () => {
  const context = useContext(ChatMessagesContext);
  if (!context) {
    throw new Error(
      'useChatMessages must be used within a ChatMessages provider'
    );
  }
  return context;
};

type ChatMessagesProps = {
  messages: Message[];
  children: ReactNode;
};

const ChatMessages = ({ messages, children }: ChatMessagesProps) => {
  return (
    <ChatMessagesContext.Provider value={{ messages }}>
      {children}
    </ChatMessagesContext.Provider>
  );
};

// Compound subcomponents
ChatMessages.List = ({ className }: { className?: string }) => {
  const { messages } = useChatMessages();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString()?.trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {messages.map((message, index) => (
        <div
          key={index}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          onCopy={onCopyMessage}
          className={`px-3 py-1 rounded-xl max-w-[80%] break-words ${
            message.role === 'user'
              ? 'bg-blue-600 text-white self-end'
              : 'bg-gray-100 text-black self-start'
          }`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

// Optional: separate ChatMessage.Item if needed
ChatMessages.Item = ({
  message,
  isLast,
}: {
  message: Message;
  isLast?: boolean;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLast) ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isLast]);

  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString()?.trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <div
      ref={ref}
      onCopy={onCopyMessage}
      className={`px-3 py-1 rounded-xl max-w-[80%] break-words ${
        message.role === 'user'
          ? 'bg-blue-600 text-white self-end'
          : 'bg-gray-100 text-black self-start'
      }`}
    >
      <ReactMarkdown>{message.content}</ReactMarkdown>
    </div>
  );
};

export default ChatMessages;
