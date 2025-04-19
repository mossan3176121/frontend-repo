window.addEventListener('load', function () {
  var gtmScript = document.createElement('script');
  gtmScript.src = "https://www.googletagmanager.com/gtag/js?id=G-8YBTB93Y69";
  gtmScript.async = true;
  document.head.appendChild(gtmScript);

  gtmScript.onload = function () {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-8YBTB93Y69');
  };
});

const sceneData = [
  {
    name: "travel_tourism_1",
    videoUrl: "https://youtu.be/cDuXpB5p2Zk",
  },
  {
    name: "daily_life_1",
    videoUrl: "https://www.youtube.com/watch?v=8QicIkDjuyQ",
  },
  {
    name: "travel_tourism_2",
    videoUrl: "https://youtu.be/xBC1_8F1xiI",
  },
  {
    name: "travel_tourism_3",
    videoUrl: "https://youtu.be/fe13AxE6gP0",
  },
];


let player;

document.addEventListener("DOMContentLoaded", () => {
    // YouTubeプレイヤー用の関数を定義
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("player", {
        // height: "315",
        // width: "560",
        videoId: "",
        events: {
          onReady: () =>  {
          console.log("Player ready");
          // ✅ デフォルト動画をロード（最初の選択肢に合わせる）
          const defaultScene = "travel_tourism_1";
          handleSelectChange(defaultScene);
      
          // 選択状態も合わせておく（見た目上も）
          const select = document.getElementById("talk_place");
          select.value = defaultScene;
        }
        }
      });
    };
  
    // YouTube APIスクリプトを DOM構築後に追加
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  });

  function extractVideoId(url) {
    const regex = /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function loadVideo(selectedValue) {
    const videoId = extractVideoId(selectedValue);
    // 再生しないで表示だけする
    player.cueVideoById(videoId);

  }
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }


  function displayDictation(transcript) {
    const container = document.getElementById("textareaContainer");
    container.innerHTML = ""; // ← ここが重要！
    
    transcript.forEach((chunk) => {
      const div = document.createElement("div");
      div.className = "chunk";

      const label = document.createElement("label");
      label.innerHTML = `
      <strong>🕒再生時間：</strong> ${formatTime(chunk.start_time)} ～ ${formatTime(chunk.end_time)}　
      <strong>👤スピーカー：</strong> ${chunk.speaker}
      `;

      const input = document.createElement("textarea");
      input.type = "text";
      input.dataset.answer = chunk.sentence;
      input.placeholder = "聞こえた英文を入力";

      const clear_button = document.createElement("button");
      clear_button.textContent = "✖"
      clear_button.className = "clear-button";
      clear_button.onclick = () => {
        input.value = "";
        input.focus();
        input.placeholder = "聞こえた英文を入力";
      }

      const answerBox = document.createElement("div");
      answerBox.className = "answer-box"; // 任意でスタイル用class
      answerBox.style.marginTop = "6px";
      answerBox.style.display = "none";  // 初期は非表示

      const check = document.createElement("button");
      check.textContent = "👁 答えを見る";
      
      let isAnswerVisible = false;  // トグル状態のフラグ
      
      check.onclick = () => {
        if (!isAnswerVisible) {
          const userInput = input.value.split(" ");
          const correct = input.dataset.answer.split(" ");
          let resultHTML = [];
          let maxLength = Math.max(correct.length, userInput.length);
      
          for (let i = 0; i < maxLength; i++) {
            let correctWord = correct[i] || "";
            let userWord = userInput[i] || "";
      
            if (userWord === correctWord) {
              resultHTML.push(`<span style="color: green;" class="circle-mark">${userWord}</span>`);
            } else {
              resultHTML.push(`<span style="color: red;" class="cross-mark">${userWord}</span>`);
            }
          }
      
          answerBox.innerHTML = `
            <strong>あなたの入力：</strong> ${resultHTML.join(" ")}<br>
            <strong>正解：</strong> ${input.dataset.answer}
          `;
          answerBox.style.display = "block";
          check.textContent = "🙈 答えを隠す";
          isAnswerVisible = true;
        } else {
          answerBox.style.display = "none";
          check.textContent = "👁 答えを見る";
          isAnswerVisible = false;
        }
      };


      const play = document.createElement("button");
      play.textContent = "▶ 再生";
      play.onclick = () => {
      const playerContainer = document.getElementById("playerContainer");
      if (playerContainer) {
        playerContainer.style.display = "none";
        // ボタンのテキストも更新したい場合はこちら（任意）
        const toggleBtn = document.getElementById("togglePlayerBtn");
        if (toggleBtn) {
          toggleBtn.textContent = "🎥 動画を表示 ";
        }
      }
      if (player && typeof player.seekTo === "function") {
        let hasStarted = false;
        const duration = chunk.end_time - chunk.start_time;

        const onPlayerStateChange = (event) => {
          if (event.data === YT.PlayerState.PLAYING && !hasStarted) {
            hasStarted = true;
            setTimeout(() => {
              player.pauseVideo();
              player.removeEventListener("onStateChange", onPlayerStateChange);
            }, duration * 1000);
          }

        };

          player.addEventListener("onStateChange", onPlayerStateChange);
          player.seekTo(chunk.start_time, true);
          player.playVideo();
        }

      };
      
      const stop = document.createElement("button");
      stop.textContent = "⏸ 停止";
      stop.onclick = () => {
        if (player && typeof player.pauseVideo === "function") {
          player.pauseVideo();
        }
      };

      div.appendChild(label);
      div.appendChild(document.createElement("br"));
      div.appendChild(input);
      div.appendChild(clear_button);
      div.appendChild(play);
      div.appendChild(stop); 
      div.appendChild(check);
      div.appendChild(answerBox);
      container.appendChild(div);
    });
  }

async function handleSelectChange(selectedValue) {
  const scene = sceneData.find(s => s.name === selectedValue);
  if (!scene) {
    console.log("シーンデータに登録されていません");
    return;
  }

  loadVideo(scene.videoUrl);

  try {
    const database_value = await sendInputData(scene.name);
    validTranscript = database_value.filter(item => item && item.start_time !== undefined);
    displayDictation(validTranscript);
  } catch (err) {
    console.error("データ取得エラー:", err);
  }

  const playerContainer = document.getElementById("playerContainer");
  if (playerContainer) {
    playerContainer.style.display = "block";
    // ボタンのテキストも更新したい場合はこちら（任意）
    const toggleBtn = document.getElementById("togglePlayerBtn");
    if (toggleBtn) {
      toggleBtn.textContent = "🎥 動画を非表示 ";
    }
  }
}

// データ送信用関数（option選択時にバックエンドに送信）
async function sendInputData(scene_name) {

  const response = await fetch("https://flask.adicteng.com/api/submit", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: scene_name })
  });

  const result = await response.json();

  // 最初の要素が undefined または null のときはスキップ
  if (!result[0] || result[0].start_time === undefined) {
    console.warn("1行目は空行（仕様どおり）です。");
  } else {
    console.log("バックエンドからの受信データ:", result);
  }
  
  return result
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("togglePlayerBtn");
  const playerContainer = document.getElementById("playerContainer");

  toggleBtn.addEventListener("click", () => {
    const isHidden = playerContainer.style.display === "none";
    playerContainer.style.display = isHidden ? "block" : "none";
    toggleBtn.textContent = isHidden ? "🎥 動画を非表示" : "🎥 動画を表示";
  });
});
