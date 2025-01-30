let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-GB";
    window.speechSynthesis.speak(text_speak);
}

function wishme() {
    let hours = new Date().getHours();
    if (hours < 12) {
        speak("Good morning Sachin");
    } else if (hours < 16) {
        speak("Good afternoon sir");
    } else {
        speak("Good evening sir");
    }
}

window.addEventListener('load', wishme);

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript);
};

btn.addEventListener("click", () => {
    recognition.start();
    btn.style.display = "none";
    voice.style.display = "block";
});

function takeCommand(message) {
    btn.style.display = "flex";
    voice.style.display = "none";
    
    if (message.includes("hello")) {
        speak("Hello sir, how can I assist you?");
    } else if (message.includes("who are you")) {
        speak("I am Sifra, your virtual assistant.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube");
        window.open("https://www.youtube.com/");
    } else if (message.includes("open google")) {
        speak("Opening Google");
        window.open("https://www.google.com/");
    } else if (message.includes("what is the date")) {
        let date = new Date().toLocaleDateString();
        speak(`Today's date is ${date}`);
    } else {
        speak(`Here’s what I found for ${message}`);
        window.open(`https://www.google.com/search?q=${message}`, "_blank");
    }
}
