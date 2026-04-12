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

    const auditPrompt = `You are an AI Linguistic Justice auditor (SDG 10). Analyze this audio for regional accent bias.

  Return ONLY a valid JSON object with exactly these keys:
  - "transcript": the verbatim transcript as a string
  - "word_risks": an array of objects, one per word in the transcript, each with:
    - "word": the word as a string
    - "risk": a number from 0.0 (no bias risk) to 1.0 (high bias risk), representing how likely a standard AI would misinterpret or penalize this word due to accent
  - "audit": an object with keys:
    - "accent_identified": string (e.g. "Northeast Indian / Assamese-influenced English")
    - "features": string (phonetic patterns detected, e.g. "retroflex consonants, vowel substitution")
    - "potential_bias_analysis": string (how a standard AI would wrongly penalize this speaker)
  - "equity_score": a number from 0 to 1 (1 = fully equitable, 0 = heavily biased)
  - "xai_explanation": a string of exactly 1-2 sentences explaining WHY this equity_score was given, 
    referencing specific phonetic features found
  - "scorecard": an object with these keys, each being a number from 0 to 1:
    - "phonetic_accuracy": how accurately the phonemes were captured
    - "lexical_fairness": whether word choices were penalized due to accent
    - "contextual_equity": whether the meaning/intent was preserved despite accent
    - "overall_bias_risk": overall risk that a downstream AI would discriminate (0 = low risk, 1 = high risk)

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