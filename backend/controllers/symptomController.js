const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a professional medical assistant AI. Analyze the provided symptoms along with their severity and duration.
Return ONLY a valid JSON object with the following keys:
- "risk_level": "Low", "Moderate", or "High". Assess this based on symptom combination, severity (1-10), and duration.
- "advisory": A list of 3-4 specific pieces of health advice tailored to the severity and duration.
- "precautions": A list of 3-4 immediate precautions to take.
- "next_steps": A clear recommendation (e.g., "Schedule a GP appointment", "Self-care", "Emergency Room").
- "suggested_tests": A list of 2-3 medical tests or diagnostic procedures to consider.
- "disclaimer": A professional medical disclaimer stating this is not health advice.

IMPORTANT: Respond ONLY with the JSON object. Do not include any conversational text.
`;

exports.analyzeSymptoms = async (req, res) => {
  const { symptoms, severity, duration } = req.body;

  if (!symptoms) 
  {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  try {
    const userContext = `Symptoms: ${symptoms}, Severity (1-10): ${severity || 'Not specified'}, Duration: ${duration || 'Not specified'}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `My health situation is: ${userContext}. Please analyze this and provide guidance.` },
      ],
      model: 'llama3-8b-8192', // More stable model for free tier
      temperature: 0.5,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const responseContent = chatCompletion.choices[0].message.content;
    const analysis = JSON.parse(responseContent);

    res.json(analysis);
  } catch (error) {
    console.error('Groq API Error Details:', error.message || error);
    res.status(500).json({ 
      error: 'Failed to analyze symptoms.', 
      details: error.message 
    });
  }
};
