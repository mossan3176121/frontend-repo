
// 問題No
let question_index = 0;
let question_array = [];
let audio_data = []
let max = 0;
let user_input_text="";
let accuracy=0;
let mode = "normal"
// show answerボタンを押したときに呼び出す関数
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("answer_button").addEventListener("click", function() {
        put_answer();
        compare_text();
    })
})
// nextボタンを押したときによびだす関数
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("next_button").addEventListener("click", function() {
        question_index++;
        if (question_index > max-1)
            question_index = max-1;
        set_question_number();
        clear_answer_area();
        clear_input_area();
        set_audio();
    })
})
// back ボタンを押したときによびだす関数
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("back_button").addEventListener("click", function() {
        question_index--;
        if (question_index < 0)
            question_index = 0;

        set_question_number();
        clear_answer_area();
        clear_input_area();
        set_audio();
    })
})
// clear ボタンを押したときに呼び出す関数
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("clear_button").addEventListener("click", function() {
        clear_input_area();
        clear_answer_area();
    })
})
// reset ボタンを押したときに呼び出す関数
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("reset_button").addEventListener("click", function() {
        reset_question();
        clear_input_area();
        clear_answer_area();
        set_question_number();
    })
})
// shuffle ボタンを押したときに呼び出す関数
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("shuffle_button").addEventListener("click", function() {
        shuffle();
    })
})
// シャッフルモードに変更
function shuffle(){
    mode = "shuffle";
    for (let i = question_array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // 0 〜 i の乱数
        [question_array[i], question_array[j]] = [question_array[j], question_array[i]]; // 要素を入れ替え
    }
    console.log(question_array);
}
// 問題を一問目からデフォルト順にする
function reset_question(){
    mode = "normal";
    question_index = 0;
    for (let i=0; i<max; i++) {
        question_array[i] = i+1;
    }
}
// 画面読み込み時にデータ取得
async function fetchAudioData() {
    // AudioデータをDBから取得
    try {
        const response = await fetch("http://localhost:5000/audio_data/all");
        audio_data = await response.json();
    } catch (error) {
        console.error("エラー:", error);
    }
    // const _audio = document.getElementById("audioPlayer");
    // _audio.load();
    
    // 取得確認
    let text = "";
    audio_data.forEach(file=>{
        text += `ID: ${file.id}\n`;
        question_array.push(file.id);
        max = file.id;
    });
    max = question_array.slice(-1);
    console.log(question_array);
    set_audio();
    set_question_number();
}
// 画面読み込み時に実行する関数
document.addEventListener("DOMContentLoaded", () => {
    fetchAudioData();
    clear_input_area();
})
// 解答の出力
function put_answer() {
    // 正解文とその日本語訳を表示
    let index = question_array[question_index]-1
    document.getElementById("answerArea").textContent = `${audio_data[index].sentence}\n ${audio_data[index].sentence_jp}`;
    // 使用されている頻出英熟語を表示
    // document.getElementById("phraseArea").textContent = `${audio_data[index].verb} ${audio_data[index].verb_jp}`;
    let resultHTML = [];
    resultHTML.push(`<span style="color: red;">${audio_data[index].verb}</span>`);
    resultHTML.push(`<span style="color: black;">${audio_data[index].verb_jp}</span>`);
    document.getElementById("phraseArea").innerHTML = `<p style="margin: 0 0;">${resultHTML.join(" ")}</p>`;
}
// 入力欄クリア
function clear_input_area() {
    document.getElementById("input_text").textContent = "";
    let input_text_area = 
    `<textarea id="user_input_text" type="text" placeholder="ここに入力してください"></textarea>`;
    document.getElementById("input_text").innerHTML = input_text_area;
}
// 解答文クリア
function clear_answer_area() {
    document.getElementById("answerArea").textContent = "";
    document.getElementById("inputArea").textContent="";
    document.getElementById("phraseArea").textContent="";
}
// 問題番号セット
function set_question_number() {
    document.getElementById("questionNumArea").textContent = "No." + question_array[question_index] + "/" + max;
}
// audioセット
function set_audio() {
    let index = question_array[question_index]-1;
    let audio = 
    `<audio id="audioPlayer" controls>
        <source src="${audio_data[index].path}" type="audio/mp3">
        お使いのブラウザは audio タグをサポートしていません。
    </audio>`;
    console.log(audio)
    document.getElementById("audio").innerHTML = audio;
}
// **文章を比較して間違いを赤でハイライト**
function compare_text() {
    // 入力された文章の表示
    user_input_text = document.getElementById("user_input_text").value;
    document.getElementById("inputArea").textContent = user_input_text;
    let index = question_array[question_index]-1;
    let correct_text = audio_data[index].sentence
    let userWords = user_input_text.split(" ");
    let correctWords = correct_text.split(" ");

    let resultHTML = [];
    let maxLength = Math.max(correctWords.length, userWords.length);

    for (let i = 0; i < maxLength-1; i++) {
        let correctWord = correctWords[i] || ""; // 正解の単語
        let userWord = userWords[i] || ""; // 入力された単語

        if (userWord === correctWord) {
            resultHTML.push(`<span style="color: green;" class = "circle-mark">${userWord}</span>`); // 正解
        } 
        else {
            resultHTML.push(`<span style="color: green;" class = "cross-mark">${userWord}</span>`); // 不正解
        } 
    }


    // **入力された文章と正解を表示**
    // document.getElementById("correctOutput").textContent = correct_text;

    // **間違いをハイライト**
    document.getElementById("inputArea").innerHTML = `<p style="margin: 0 0;">${resultHTML.join(" ")}</p>`;

}