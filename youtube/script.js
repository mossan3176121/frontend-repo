let player;
// function onYouTubeIframeAPIReady() {

//     player = new YT.Player("player", {
//     height: "315",
//     width: "560",
//     videoId: "",
//     events: {
//         onReady: () => console.log("Player ready"),
//     }
//     });
// }
  window.onYouTubeIframeAPIReady = function() {

    player = new YT.Player("player", {
    height: "315",
    width: "560",
    videoId: "",
    events: {
        onReady: () => console.log("Player ready"),
    }
    });
  }

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

  function extractVideoId(url) {
    const regex = /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function loadVideo() {
    const url = document.getElementById("youtubeUrl").value;
    const videoId = extractVideoId(url);
    if (!videoId) {
      alert("正しいYouTube URLを入力してください。");
      return;
    }

    // player.loadVideoById(videoId);
    // 再生しないで表示だけする
    player.cueVideoById(videoId);

    fetch("http://localhost:5000/get_subtitles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert("字幕取得失敗: " + data.error);
        } else {
          displayDictation(data.transcript);
        }
      });
  }
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }


  function displayDictation(transcript) {
    const container = document.getElementById("dictationArea");
    // container.innerHTML = "<h3>ディクテーション</h3>";

    transcript.forEach((chunk) => {
      const div = document.createElement("div");
      div.className = "chunk";

      const label = document.createElement("label");
      label.textContent = `再生時間 (${formatTime(chunk.start)} - ${formatTime(chunk.end)})`;

      const input = document.createElement("input");
      input.type = "text";
      input.dataset.answer = chunk.text;
      input.placeholder = "聞こえた英文を入力";

      const check = document.createElement("button");
      check.textContent = "チェック";
      check.onclick = () => {
        const userInput = input.value.trim().toLowerCase();
        const correct = input.dataset.answer.trim().toLowerCase();
        if (userInput === correct) {
          input.style.backgroundColor = "#c8f7c5";
        } else {
          input.style.backgroundColor = "#f7c5c5";
          alert(`正解: ${input.dataset.answer}`);
        }
      };

      const play = document.createElement("button");
      play.textContent = "▶ 再生";
      play.onclick = () => {
        if (player && typeof player.seekTo === "function") {
          let hasStarted = false;
          const duration = chunk.end - chunk.start;

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
          player.seekTo(chunk.start, true);
          player.playVideo();
        }
      };

      div.appendChild(label);
      div.appendChild(document.createElement("br"));
      div.appendChild(input);
      div.appendChild(check);
      div.appendChild(play);
      container.appendChild(div);
    });
  }
