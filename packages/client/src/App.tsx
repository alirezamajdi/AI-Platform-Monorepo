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
      <div className="p-4 h-screen w-3xl mx-auto">
         <ChatBot />
      </div>
   );
}

export default App;
