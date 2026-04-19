const Groq = require('groq-sdk');
const pdf = require('pdf-parse');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are an expert medical report analyzer. Your task is to analyze medical lab reports (CBC, Liver Function, Vitamin Panel, etc.) and provide a clear, patient-friendly summary.
Return ONLY a valid JSON object with the following structure:
{
  "summary": {
    "verdict": "A short 1-line summary (e.g., 'Mostly Normal — Minor Attention Needed')",
    "description": "A 2-3 sentence overview of the health status based on the report.",
    "chips": ["List of 3-4 key summary points like '✓ Normal CBC' or '⚠️ Low Iron'"],
    "health_score": 0-100 (Estimate an overall health score based on the values)
  },
  "metrics": [
    {
      "icon": "A relevant emoji (e.g., 🩸, 🦠, 💊)",
      "name": "Parameter name (e.g., Haemoglobin)",
      "value": "Numeric value found in report",
      "unit": "Measurement unit (e.g., g/dL)",
      "status": "normal" | "low" | "high",
      "fill": 0-100 (Percentage for a progress bar representation)
    }
  ],
  "findings": [
    {
      "icon": "Relevant emoji",
      "color": "fi-amber" | "fi-blue" | "fi-green" | "fi-red",
      "title": "Short title of finding",
      "desc": "Detailed explanation in simple terms.",
      "tag": "Actionable tag like 'Monitor' | 'Dietary' | 'Normal'",
      "tagStyle": "CSS style for the tag background and color (e.g., 'background:#fef3c7;color:#92400e;')"
    }
  ],
  "recommendations": [
    {
      "icon": "Relevant emoji",
      "color": "rc-amber" | "rc-green" | "rc-blue" | "rc-rose",
      "title": "Short recommendation title",
      "desc": "Brief advice on what to do."
    }
  ],
  "next_steps": [
    {
      "num": 1,
      "title": "Action item title",
      "desc": "What the user should do next."
    }
  ]
}

IMPORTANT:
- Ensure all values are extracted accurately.
- Use patient-friendly language for descriptions.
- Status 'low' or 'high' should be based on the reference ranges in the report.
- Respond ONLY with the JSON object.
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
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.2,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      });
    } else {
      chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Here is the text extracted from a medical report. Analyze it and provide the summary in JSON format:\n\n${content}` },
        ],
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.2,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      });
    }

    const responseContent = chatCompletion.choices[0].message.content;
    const analysis = JSON.parse(responseContent);

    res.json(analysis);
  } catch (error) {
    console.error('Report Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze the report. Please ensure the file is clear and try again.' });
  }
};
