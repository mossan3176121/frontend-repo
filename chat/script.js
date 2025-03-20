const chatBox = document.getElementById("chat-box");

function addMessage(text, sender, correctable = false, type = "chat") {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  if (type === "correction") msg.classList.add("correction");
  msg.textContent = text;

  if (sender === "user" && correctable) {
    const btn = document.createElement("button");
    btn.textContent = "✍ 添削";
    btn.className = "correct-btn";
    btn.onclick = () => correctSentence(text);
    msg.appendChild(btn);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user", true);
  input.value = "";
  input.style.height = "42px"; // 💡ここで高さを戻す！

  const character = document.getElementById("character-select").value;

  const response = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message, character: character })
  });

  const data = await response.json();
  addMessage(data.reply, "ai");
}

async function correctInput() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user", true);
  input.value = "";

  correctSentence(message);
}

async function correctSentence(sentence) {
  const character = document.getElementById("character-select").value;

  try {
    const response = await fetch("http://localhost:5000/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: sentence, character: character })
    });

    const data = await response.json();
    const reply = data.reply;

    const hasCorrection = reply.correction && reply.correction !== reply.original;
    const altText = reply.alternative.trim();
    const hasAlt = altText && altText !== '-' && altText.toLowerCase() !== 'none';

    // 要約部分（クリック可能）
    const summaryHTML = `
      <div class="correction-summary" onclick="this.nextElementSibling.classList.toggle('hidden')"
          style="cursor: pointer; font-weight: bold;">
        📝 添削結果（クリックで展開）<br>

      </div>
    `;

    // 詳細部分（最初は非表示）
    const detailsHTML = `
      <div class="correction-details hidden">
        <strong>📘 文法チェック</strong><br>
        原文: ${reply.original}<br>
        修正: <span style="color: green; font-weight: bold;">${hasCorrection ? reply.correction : '✅ 文法的にOKです！'}</span><br>
        説明: ${hasCorrection ? reply.grammar : '✅ 文法的にOKです！'}<br><br>

        <strong>🗣️ より自然な表現</strong><br>
        ${reply.naturalness.replace(/\n/g, "<br>")}<br><br>

        <strong>🔁 別の言い回し</strong><br>
        ${hasAlt ? reply.alternative : '-'}
      </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.classList.add("message", "ai", "correction");
    wrapper.innerHTML = summaryHTML + detailsHTML;

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    addMessage("添削に失敗しました。サーバーが応答していません。", "ai", false, "correction");
  }
}


// Enterキー対応
document.getElementById("user-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});


// キャラ変更時に履歴をクリア
document.getElementById("character-select").addEventListener("change", () => {
  chatBox.innerHTML = "";
});

const textarea = document.getElementById("user-input");

function autoResize() {
  textarea.style.height = "auto"; // リセット
  const newHeight = Math.max(textarea.scrollHeight, 42); // 最低42px確保
  textarea.style.height = newHeight + "px";
}

textarea.addEventListener("input", autoResize);

// ページ初期化時にも呼び出す
window.addEventListener("DOMContentLoaded", () => {
  textarea.value = "";
  autoResize();
});

// Enterで送信、Shift+Enterで改行
textarea.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});