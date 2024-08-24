import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openAIConfig = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(openAIConfig);

export async function POST(request: NextRequest) {
  const { movieName, movieCharacter }: { 
    movieName: string; 
    movieCharacter: string; 
  } = await request.json();

  console.log(`Generating image for ${movieCharacter} from ${movieName}`);

  if (!movieName || !movieCharacter ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // const prompt = `A character from the movie ${movieName} named ${movieCharacter}`;
  const prompt = `A character in the style of ${movieCharacter} from the movie ${movieName}`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });
  const image_url = response.data[0].url;
  console.log(image_url);

  return NextResponse.json({ image_url });
}