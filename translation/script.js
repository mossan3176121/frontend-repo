let correctAnswer = ""; // 正解を保存する変数
  
async function getQuestion() {
  const res = await fetch("https://flask.adicteng.com/get_question");
  const data = await res.json();

  document.getElementById("question").textContent = data.japanese;
  correctAnswer = data.correct;

  // リセット
  document.getElementById("result").style.display = "none";
  document.getElementById("englishInput").value = "";
}

async function submitTranslation() {
  const input = document.getElementById("englishInput").value.trim();
  const japanese = document.getElementById("question").textContent.trim();

  if (!input || !japanese || japanese === "読み込み中...") {
    alert("日本語文の読み込みまたは英訳の入力が未完了です！");
    return;
  }

  const response = await fetch("https://flask.adicteng.com/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      japanese: japanese,
      correct: correctAnswer,
      english: input
    })
  });

  if (!response.ok) {
    alert("エラーが発生しました（ステータス: " + response.status + "）");
    return;
  }

  const data = await response.json();

  document.getElementById("original").textContent = input;
  document.getElementById("corrected").textContent = data.corrected;
  document.getElementById("feedback").textContent = data.feedback;

  document.getElementById("is-correct").textContent = data.is_correct ? "⭕ 正解" : "❌ 不正解";
  document.getElementById("result").style.display = "block";
}
