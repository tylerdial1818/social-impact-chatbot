import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { retrieveRelevantChunks, buildAugmentedPrompt, extractCitations } from '@/lib/rag';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || messages.length === 0) {
      return new Response('No messages provided', { status: 400 });
    }
    
    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    const userQuery = latestMessage.content;
    
    // Get conversation history (excluding the latest message)
    const conversationHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));
    
    // Retrieve relevant document chunks
    const retrievedChunks = await retrieveRelevantChunks(userQuery, {
      topK: 5,
      minScore: 0.65,
    });
    
    // Build augmented prompt
    const augmentedPrompt = buildAugmentedPrompt(
      userQuery,
      retrievedChunks,
      conversationHistory
    );
    
    // Generate response with streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: augmentedPrompt },
        { role: 'user', content: userQuery },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    // Convert to stream
    const stream = OpenAIStream(response, {
      onStart: async () => {
        // Log retrieval metrics
        console.log(`Retrieved ${retrievedChunks.length} chunks`);
        const citations = extractCitations(retrievedChunks);
        console.log(`Unique sources: ${citations.join(', ')}`);
      },
      onCompletion: async (completion) => {
        // Log completion metrics
        console.log(`Response length: ${completion.length} chars`);
      },
    });
    
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
