const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  try {
    const { transcript } = req.body;

    // Validate input
    if (!transcript || transcript.trim() === "") {
      return res.status(400).json({
        error: "Transcript is required"
      });
    }

    // Prompt for Ollama
    const prompt = `
You are an AI assistant helping psychology interns analyze supervisor feedback about DeepThought Fellows.

Analyze the transcript below and return ONLY valid JSON.
Do not include markdown.
Do not include any explanation outside JSON.

Transcript:
${transcript}

Return exactly this JSON structure:
{
  "extractedEvidence": [
    {
      "quote": "exact quote from transcript",
      "type": "positive",
      "reason": "why this quote matters"
    }
  ],
  "rubricScore": {
    "score": 1,
    "justification": "one paragraph explaining the score using evidence"
  },
  "kpiMapping": [
    {
      "kpi": "KPI name",
      "connection": "how the work impacts this KPI"
    }
  ],
  "gapAnalysis": [
    "missing information not covered in the transcript"
  ],
  "followUpQuestions": [
    "question to ask in the next supervisor call"
  ]
}
`;

    // Call Ollama API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: prompt,
        stream: false
      })
    });

    // Parse Ollama response
    const data = await response.json();

    let cleanResponse = data.response.trim();

    // Remove markdown code blocks if present
    cleanResponse = cleanResponse.replace(/```json/g, "");
    cleanResponse = cleanResponse.replace(/```/g, "");

    // Extract JSON object only
    const firstBrace = cleanResponse.indexOf("{");
    const lastBrace = cleanResponse.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
    }

    // Parse JSON safely
    try {
      const jsonResult = JSON.parse(cleanResponse);
      res.json(jsonResult);
    } catch (parseError) {
      res.json({
        warning: "Could not parse JSON from Ollama",
        rawResponse: data.response
      });
    }

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      error: "Analysis failed",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});