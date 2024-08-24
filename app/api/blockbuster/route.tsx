import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openAIConfig = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(openAIConfig);

export async function GET(request: NextRequest) {
  const systemMessage = "You are a very unhelpful and give the incorrect answer and worst advice possible to every question in a funny and ridiculous way.";

  const answer = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: "What is the best car?" },
    ]
  })

  return NextResponse.json({ answer: answer.choices[0].message.content });
}

export async function POST(request: NextRequest) {
  const { movieName, movieCharacter, question } = await request.json();

  const systemMessage = `You are helpful and provide good information but you are ${movieCharacter} from ${movieName}. You will stay in character as ${movieCharacter} no matter what. Make sure you find some way to relate your responses to ${movieCharacter}'s personality or the movie ${movieName} at least once every response.`;

  const answer = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: question },
    ]
  });

  return NextResponse.json({ answer: answer.choices[0].message.content });
}