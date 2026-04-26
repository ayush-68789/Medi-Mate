const Groq = require('groq-sdk');
const pdf = require('pdf-parse');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are an expert medical report analyzer and health consultant. Your goal is to translate complex medical lab reports (CBC, Lipid Profile, Liver/Kidney Function, Vitamin Panels, etc.) into clear, actionable, and empathetic insights for a patient.

Analyze the provided data and return ONLY a valid JSON object with the following structure:
{
  "summary": {
    "verdict": "A concise, 1-line professional verdict (e.g., 'Excellent Overall Profile', 'Minor Nutritional Deficiencies', 'Requires Clinical Attention')",
    "description": "A comprehensive 3-4 sentence overview. Explain the main takeaways, what is working well, and what specifically needs attention in simple language. Avoid jargon.",
    "chips": ["List 3-4 key highlights using emojis like '✓ Normal Hemoglobin', '⚠️ Critically Low Vitamin D', '⚡ Fasting Glucose Elevated'"],
    "health_score": 0-100 (A weighted score where 100 is optimal health based on the parameters provided)
  },
  "metrics": [
    {
      "icon": "A very specific, relevant emoji (e.g., 🧪 for chemicals, 🩸 for blood, 🦴 for bone/calcium, ⚡ for energy/glucose)",
      "name": "Parameter full name (e.g., 'Total Cholesterol')",
      "value": "Numeric value",
      "unit": "Measurement unit",
      "status": "normal" | "low" | "high",
      "fill": 0-100 (A visual guide for a bar: 50 is dead center/ideal, 20 is very low, 80 is very high)
    }
  ],
  "findings": [
    {
      "icon": "Specific emoji representing the issue",
      "color": "fi-amber" (warning) | "fi-blue" (info) | "fi-green" (ok) | "fi-red" (critical),
      "title": "Clear title of the observation (e.g., 'Vitamin D Deficiency')",
      "desc": "Explain what this means for their health and why it might be occurring in simple terms.",
      "tag": "Action category (e.g., 'Immediate Action' | 'Dietary' | 'Monitoring')",
      "tagStyle": "A custom CSS style for the tag pill (e.g., 'background:#fee2e2;color:#991b1b;' for red, 'background:#fef3c7;color:#92400e;' for amber)"
    }
  ],
  "recommendations": [
    {
      "icon": "Relevant emoji (🥗 for diet, 🏃 for lifestyle, 👨‍⚕️ for medical, 💊 for supplements)",
      "color": "rc-amber" (important) | "rc-green" (routine) | "rc-blue" (lifestyle) | "rc-rose" (urgent),
      "title": "Actionable, punchy title (e.g., 'Increase Iron-Rich Foods')",
      "desc": "A specific, detailed recommendation. Instead of 'Eat better', say 'Incorporate spinach, red meat, or lentils into your diet at least 3 times a week.'"
    }
  ],
  "next_steps": [
    {
      "num": 1,
      "title": "Clear action step",
      "desc": "Concrete next step (e.g., 'Book a follow-up with a General Physician', 'Repeat this specific test in 3 months')"
    }
  ]
}

CRITICAL GUIDELINES:
1. ACCURACY: Values must be extracted exactly as they appear.
2. RECOMMENDATIONS: Must be holistic. Provide at least one for Diet, one for Lifestyle/Environment, and one for Medical/Diagnostic follow-up.
3. TONE: Professional yet accessible. Avoid scaring the patient; focus on empowerment through action.
4. JSON ONLY: Do not include any text before or after the JSON object.
`;

exports.analyzeReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = req.file.mimetype;
    let content;
    let isImage = fileType.startsWith('image/');

    if (fileType === 'application/pdf') {
      const pdfData = await pdf(req.file.buffer);
      content = pdfData.text;
      
      if (!content || content.trim().length < 10) {
        return res.status(400).json({ error: 'Could not extract text from PDF. Please upload a clear image or a text-based PDF.' });
      }
    } else if (isImage) {
      // For images, we will use Groq Vision model
      content = req.file.buffer.toString('base64');
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or an Image.' });
    }

    let chatCompletion;

    if (isImage) {
      chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this medical report image and provide the summary in JSON format.' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${fileType};base64,${content}`,
                },
              },
            ],
          },
        ],
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', // Official replacement for llama-3.2-11b-vision-preview
        temperature: 0.2,
        max_tokens: 2048,
        // Note: response_format not supported for vision models
      });
    } else {
      chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Here is the text extracted from a medical report. Analyze it and provide the summary in JSON format:\n\n${content}` },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.2,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      });
    }

    const responseContent = chatCompletion.choices[0].message.content;
    
    let analysis;
    try {
      const cleanedJSON = responseContent.replace(/```json\n?|```/g, '').trim();
      analysis = JSON.parse(cleanedJSON);
    } catch (parseError) {
      console.error('AI Response Parsing Error:', parseError);
      return res.status(500).json({ 
        error: 'AI returned an unreadable report format.',
        details: parseError.message
      });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Report Analysis Error Details:', error.message || error);
    res.status(500).json({ 
      error: 'Failed to analyze the report.',
      details: error.message 
    });
  }
};
