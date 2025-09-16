import { OpenAI } from 'openai';

const HF_TOKEN = import.meta.env.HF_TOKEN;

export const POST = async ({ request }) => {
  const { prompt } = await request.json();

  const client = new OpenAI({
    baseURL: import.meta.env.HF_URL,
    apiKey: HF_TOKEN,
  });

  const chatCompletion = await client.chat.completions.create({
    model: "meta-llama/Llama-3.1-8B-Instruct:novita", 
    messages: [
      {
        role: "system",
        content: "You are an SVG code generator. Generate SVG code for the following prompt."
      },
      {
        role: "user",
        content: prompt
      }
    ],
  });

  const message = chatCompletion.choices[0].message.content || "";
  const svgMatch = message.match(/<svg[\s\S]*?<\/svg>/i);

  return new Response(JSON.stringify({ svg: svgMatch ? svgMatch[0] : "" }), {
    headers: { "Content-Type": "application/json" },
  });
};
