import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: `You are a friendly financial literacy wizard helping users learn about personal finance, credit, budgeting, and money management. You provide clear, simple explanations suitable for beginners. Keep your responses concise and encouraging. If users ask about specific financial situations, remind them to consult with a licensed financial advisor for personalized advice.`,
      messages: messages,
    });

    const textContent = response.content.find((block) => block.type === 'text');
    const text = textContent && 'text' in textContent ? textContent.text : '';

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from chatbot' },
      { status: 500 }
    );
  }
}
