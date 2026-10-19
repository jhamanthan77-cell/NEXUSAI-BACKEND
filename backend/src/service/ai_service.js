import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({override: true});
console.log("GROQ key loaded:", Boolean(process.env.GROQ_API_KEY));


const ai = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY
});

const generateAiResponse = async (userMessage) => {
    const response = await ai.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "user",
                content: userMessage
            }
        ]
    });

    return response.choices[0].message.content;
};

export default generateAiResponse;