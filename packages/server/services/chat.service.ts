let chatHistory = [];
const GROQ_API_KEY = process.env.GROQ_API_KEY;

type ChatResponse = {
   id: string;
   message: string;
};

// Public Interface
export const chatService = {
   async sendMessage(prompt: string) {
      try {
         chatHistory.push({ role: 'user', content: prompt });

         const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${GROQ_API_KEY}`,
               },
               body: JSON.stringify({
                  model: 'llama-3.1-8b-instant',
                  messages: chatHistory,
               }),
            }
         );

         const data = (await response.json()) as any;
         const reply = data.choices[0].message.content;
         chatHistory.push({ role: 'assistant', content: reply });

         return reply;
      } catch (error) {
         throw new Error('Failed to fetch response from GROQ API');
      }
   },
};
