import { NextRequest, NextResponse } from "next/server";
import { ChatMessage } from "../../types/chatMessage";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openAIConfig = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(openAIConfig);

export async function POST(request: NextRequest) {
  const { movieName, movieCharacter, question, chatHistory = [] }: { 
    movieName: string; 
    movieCharacter: string; 
    question: string; 
    chatHistory: ChatMessage[] 
  } = await request.json();

  console.log(movieName, movieCharacter, question, chatHistory);

  if (!movieName || !movieCharacter || !question) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const systemMessage = `You are helpful and provide good information but you are ${movieCharacter} from ${movieName}. You will stay in character as ${movieCharacter} no matter what. Make sure you find some way to relate your responses to ${movieCharacter}'s personality or the movie ${movieName} at least once every response.`;

  const message_history_maker = chatHistory.map((chatMessage) => {
    const sender = chatMessage.sender === "You" ? "user" : "assistant";
    return { 
      role: sender, 
      content: chatMessage.text };
  });

  const messages = [
    { role: "system", content: systemMessage },
    ...message_history_maker,
    { role: "user", content: question },
  ] as ChatCompletionMessageParam[];

  console.log(messages);

  const answer = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return NextResponse.json({ answer: answer.choices[0].message.content });

}

