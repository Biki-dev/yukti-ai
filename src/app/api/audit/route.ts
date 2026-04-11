import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as Blob;
    
    // FIX: Convert directly to base64 without the risky regex
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: 'v1beta' }
    );

    // Instructions optimized for JSON mode
    const auditPrompt = `Analyze this audio for Linguistic Justice (SDG 10). 
    Provide a verbatim transcript and audit for regional accent bias. 
    Return ONLY a JSON object with keys: "transcript", "audit", and "equity_score" (0-1).`;

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: auditPrompt },
          { inlineData: { data: base64Audio, mimeType: file.type || 'audio/webm' } }
        ],
      }],
      generationConfig: { responseMimeType: 'application/json' }
    });

    const response = await result.response;
    const text = response.text();

    // FIX: No cleaning needed. Parse the raw JSON string directly.
    try {
      const jsonResult = JSON.parse(text);
      return NextResponse.json(jsonResult);
    } catch (parseError) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ transcript: "Parse failed", audit: text }, { status: 200 });
    }

  } catch (error) {
    console.error('Gemini SDK Error:', error);
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 });
  }
}