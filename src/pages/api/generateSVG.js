import OpenAI from "openai";

const BASE_URL = "https://openrouter.ai/api/v1";
const ACCESS_TOKEN = import.meta.env.HF_TOKEN; 

export const POST = async ({ request }) => {
    const messages  = await request.json();

    if (!ACCESS_TOKEN) {
        console.error("❌ Missing OpenRouter API Key");
        return new Response(
            JSON.stringify({ error: "Server missing API key" }),
            { status: 500 }
        );
    }

    const client = new OpenAI({
        baseURL: BASE_URL,
        apiKey: ACCESS_TOKEN,
    });

    const SystemMessage = {
        role: "system",
        content: "You are an SVG code generator. Generate SVG code for the following messages. Make sure to include ids for each part of the generated SVG.",
    };

    const chatCompletion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        messages: [SystemMessage, ...messages],
    });

    const message = chatCompletion.choices[0].message || "";
    const svgMatch = message.content.match(/<svg[\s\S]*?<\/svg>/i);
    message.content = svgMatch ? svgMatch[0] : "";

    return new Response(JSON.stringify({ svg: message }), {
        headers: { "Content-Type": "application/json" },
    });
};
