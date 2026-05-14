const analyzeBtn = document.getElementById("analyzeBtn");
const transcriptBox = document.getElementById("transcript");
const resultDiv = document.getElementById("result");

analyzeBtn.addEventListener("click", async () => {
  const transcript = transcriptBox.value.trim();

  if (transcript === "") {
    alert("Please paste transcript first");
    return;
  }

  resultDiv.innerHTML = "<p>Analyzing...</p>";

  const response = await fetch("http://localhost:5000/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ transcript })
  });

  const data = await response.json();

  displayResult(data);
});

function displayResult(data) {
  if (data.rawResponse) {
    resultDiv.innerHTML = `<pre>${data.rawResponse}</pre>`;
    return;
  }

  resultDiv.innerHTML = `
    <h2>Extracted Evidence</h2>
    ${data.extractedEvidence.map(item => `
      <div class="card">
        <h3>${item.type}</h3>
        <p><strong>Quote:</strong> ${item.quote}</p>
        <p><strong>Reason:</strong> ${item.reason}</p>
      </div>
    `).join("")}

    <h2>Rubric Score</h2>
    <div class="card">
      <h3>${data.rubricScore.score}/10</h3>
      <p>${data.rubricScore.justification}</p>
    </div>

    <h2>KPI Mapping</h2>
    ${data.kpiMapping.map(item => `
      <div class="card">
        <h3>${item.kpi}</h3>
        <p>${item.connection}</p>
      </div>
    `).join("")}

    <h2>Gap Analysis</h2>
    <div class="card">
      <ul>
        ${data.gapAnalysis.map(gap => `<li>${gap}</li>`).join("")}
      </ul>
    </div>

    <h2>Follow-up Questions</h2>
    <div class="card">
      <ol>
        ${data.followUpQuestions.map(q => `<li>${q}</li>`).join("")}
      </ol>
    </div>
  `;
}