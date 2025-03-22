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

const recordBtn = document.getElementById('recordBtn');
const sceneSelect = document.getElementById('scene');
const showTranslationCheckbox = document.getElementById('showTranslation');
const responseArea = document.getElementById('responseArea');
const responseAudio = document.getElementById('responseAudio');

let mediaRecorder;
let audioChunks = [];
let stream = null;

recordBtn.onclick = async () => {
  if (!stream) {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      audioChunks = [];

      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice.webm');
      formData.append('scene', sceneSelect.value);
      formData.append('show_translation', showTranslationCheckbox.checked);
      
      const response = await fetch('http://127.0.0.1:5000/process_audio', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      // 表示更新
      let html = `<p><strong>英語:</strong> ${data.text}</p>`;
      if (showTranslationCheckbox.checked) {
        html += `<p><strong>日本語訳:</strong> ${data.text_ja}</p>`;
      }
      responseArea.innerHTML = html;

      responseAudio.src = data.audio_url;
      responseAudio.play();
    };

    mediaRecorder.start();
    recordBtn.textContent = '🛑 停止';
  } else {
    mediaRecorder.stop();
    recordBtn.textContent = '🎙️ 話す';
  }
};
