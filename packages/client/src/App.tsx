import { useEffect, useState } from 'react';
import ChatBot from './components/chat/ChatBot';

function App() {
   const [message, setMessage] = useState('');

   useEffect(() => {
      fetch('/api/hello')
         .then((res) => res.json())
         .then((data) => setMessage(data.message));
   }, []);

   return (
      <div className="p-4 h-screen w-3xl mx-auto flex flex-col">
         <ChatBot>
            <div className="flex flex-col flex-1 gap-3 mb-6 overflow-y-auto">
               <ChatBot.Messages />
               <ChatBot.TypingIndicator />
               <ChatBot.Error />
            </div>
            <ChatBot.Input />
         </ChatBot>
      </div>
   );
}

export default App;
