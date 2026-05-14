# Supervisor Feedback Analyzer

An AI-assisted web application that analyzes supervisor feedback transcripts for DeepThought Fellows and generates structured insights to support psychology interns in their evaluation process.

This project was built as part of the DeepThought Software Developer Internship assignment.

---

## Problem Statement

DeepThought psychology interns currently spend 45–60 minutes manually reviewing each supervisor feedback transcript. This tool reduces the analysis time to approximately 10 minutes by using a local LLM via Ollama to generate a structured draft analysis.

The AI does not replace human judgment. It provides a draft that the intern reviews and finalizes.

---

## Features

* Paste supervisor transcript into a web interface
* Analyze transcript using a local Ollama model
* Extract evidence quotes with sentiment tags
* Suggest rubric score (1–10) with justification
* Map work to relevant business KPIs
* Identify assessment gaps
* Generate follow-up questions
* Parse and validate JSON responses from the model

---

## Tech Stack

### Frontend

* HTML
* CSS
* Vanilla JavaScript

### Backend

* Node.js
* Express.js
* CORS

### LLM

* Ollama
* Llama 3.2

---

## Project Structure

```text
supervisor-feedback-analyzer/
│
├── backend/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── context.md
├── rubric.json
├── sample-transcripts.json
└── README.md
```

---

## Architecture Overview

```text
User Pastes Transcript
        ↓
Frontend (HTML/CSS/JS)
        ↓
POST /api/analyze
        ↓
Express Backend
        ↓
Prompt Construction
        ↓
Ollama Local API (llama3.2)
        ↓
JSON Cleanup & Validation
        ↓
Structured Analysis Response
        ↓
Frontend Displays Results
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/supervisor-feedback-analyzer.git
cd supervisor-feedback-analyzer
```

### 2. Install Ollama

Download and install from:

[https://ollama.com](https://ollama.com)

### 3. Pull the Model

```bash
ollama pull llama3.2
```

### 4. Start Ollama

```bash
ollama serve
```

### 5. Install Backend Dependencies

```bash
cd backend
npm install
```

### 6. Start Backend Server

```bash
node server.js
```

### 7. Open Frontend

Open:

```text
frontend/index.html
```

in your browser.

---

## How to Use

1. Open the application in the browser.
2. Paste a supervisor feedback transcript.
3. Click **Run Analysis**.
4. Review the generated output.

---

## Expected Output

### Extracted Evidence

Specific quotes tagged as positive, negative, or neutral.

### Rubric Score

Suggested score from 1 to 10 with evidence-based justification.

### KPI Mapping

Connection between the Fellow’s work and business KPIs.

### Gap Analysis

Important dimensions not covered in the transcript.

### Follow-up Questions

Questions for the next supervisor call.

---

## Prompt Engineering Approach

The backend constructs a structured prompt that:

* Defines the role of the AI assistant
* Provides the transcript
* Specifies the exact JSON schema
* Uses negative instructions to prevent extra text

### Negative Prompting

```text
Return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside JSON.
Do not invent information not present in the transcript.
```

---

## Hallucination Guardrails

To improve reliability, the following safeguards were implemented:

1. Explicit JSON schema in the prompt.
2. Negative prompting.
3. Removal of markdown code fences.
4. Extraction of content between first `{` and last `}`.
5. JSON parsing with `try/catch`.
6. Fallback display of raw model response.
7. Human review before final assessment.

---

## Design Challenges Tackled

### 1. Structured Output Reliability

LLMs sometimes return markdown or commentary around JSON. I implemented response cleaning and safe parsing to extract only the JSON object.

### 2. Showing Uncertainty

The interface presents the output as a suggested draft, emphasizing that a psychology intern must review and edit the analysis.

---

## Tradeoffs Made

* Used a single prompt rather than multiple model calls for simplicity and speed.
* Chose vanilla HTML/CSS/JS instead of React to focus on functionality.
* Used no database because persistence was not required.

---

## Sample Test Transcript

Use the transcripts provided in `sample-transcripts.json`.

Recommended transcript for testing:

* `transcript-001` (Karthik Narayanan)

---

## Known Limitation

The model may suggest a score that differs from the expected range, which is why human review remains essential.

---

## Future Improvements

* Editable output fields
* Side-by-side transcript and evidence highlighting
* Retry mechanism when JSON parsing fails
* Loading spinner and error messages
* Export analysis to PDF
* Integration of `rubric.json` and `context.md` directly into the prompt

---

## Model Selection

I used **Llama 3.2** because:

* It runs efficiently on most laptops.
* Provides strong structured output performance.
* Requires no API key or cloud access.
* Works completely offline.

---

## Example Commit History

* Initial project setup
* Add Express backend with Ollama integration
* Add frontend UI
* Implement JSON cleanup and parsing
* Add README and documentation

---

## Submission Components

* Public GitHub repository
* App demo video
* Code walkthrough video
* Hand-drawn sketch
* Mind map

---

## Author

**Ritu Sharma**
GitHub: [GitHub Profile (@riu333)](https://github.com/riu333?utm_source=chatgpt.com)
