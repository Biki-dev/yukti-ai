import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';


const fetchWithRetry = async (model: any, requestConfig: any, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(requestConfig);
    } catch (error: any) {
      if (error.status === 503 && i < retries - 1) {
        console.warn(`503 Error. Retrying in ${delay}ms... (Attempt ${i + 1} of ${retries})`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; 
      } else {
        throw error; 
      }
    }
  }
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as Blob;
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash"
    });

    const auditPrompt = `You are an AI Linguistic Justice auditor (SDG 10). Analyze this audio for accent and language bias across English, Hindi, and Assamese (including code-switching).

Return ONLY a valid JSON object with exactly these keys:
- "transcript": the verbatim transcript as a string
- "word_risks": an array of objects, one per word in the transcript, each with:
    - "word": the word as a string
    - "risk": a number from 0.0 (no bias risk) to 1.0 (high bias risk), representing how likely a standard AI would misinterpret or penalize this word due to accent or language mismatch
    - "language": one of "en", "hi", "as", or "other" based on the word's most likely language
- "audit": an object with keys "accent_identified", "features", "potential_bias_analysis"
- "equity_score": a number from 0 to 1 (1 = fully equitable, 0 = heavily biased)

Scoring guidance:
- Do not assume non-English words are inherently high risk.
- Treat Hindi and Assamese as valid target languages, not outliers.
- Evaluate risk based on realistic model support gaps, accent variation, and code-switching robustness.

Return nothing else. No markdown, no explanation.`;

    const requestConfig = {
      contents: [{
        role: 'user',
        parts: [
          { text: auditPrompt },
          { inlineData: { data: base64Audio, mimeType: file.type || 'audio/webm' } }
        ],
      }],
      generationConfig: { responseMimeType: 'application/json' }
    };

    // Use the retry wrapper here
    const result = await fetchWithRetry(model, requestConfig);

    const response = await result.response;
    const text = response.text();

    try {
      const jsonResult = JSON.parse(text);
      return NextResponse.json(jsonResult);
    } catch (parseError) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ transcript: "Parse failed", audit: text }, { status: 200 });
    }

  } catch (error) {
    console.error('Gemini SDK Error:', error);
    return NextResponse.json({ error: 'Audit failed due to high demand' }, { status: 500 });
  }
}