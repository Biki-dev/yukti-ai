import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const startTime = Date.now();

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    // Send minimal test prompt to measure actual latency
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: 'ping' }]
      }],
      generationConfig: {
        maxOutputTokens: 10,
      }
    });

    const response = await result.response;
    const text = response.text().toLowerCase().trim();

    const latencyMs = Date.now() - startTime;

    // Check if we got a reasonable response (pong or similar)
    const isHealthy = text.includes('pong') || text.length > 0;

    return NextResponse.json({
      status: isHealthy ? 'ok' : 'degraded',
      model: 'gemini-2.5-flash',
      latencyMs,
      provider: 'vertex-ai',
      timestamp: new Date().toISOString(),
    }, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    console.error('Health check failed:', error);

    return NextResponse.json({
      status: 'error',
      model: 'gemini-2.5-flash',
      latencyMs,
      provider: 'vertex-ai',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}
