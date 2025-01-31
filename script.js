const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const voiceAnimation = document.querySelector("#voice-animation");

function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.volume = 1;
  text_speak.lang = "en-GB";
  window.speechSynthesis.speak(text_speak);
  voiceAnimation.classList.remove("hidden");
  text_speak.onend = () => {
    voiceAnimation.classList.add("hidden");
  };
}
function wishme() {
  const hours = new Date().getHours();
  if (hours < 12) {
    speak("Good morning Sachin");
  } else if (hours < 16) {
    speak("Good afternoon sir");
  } else {
    speak("Good evening sir");
  }
}

window.addEventListener("load", wishme);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.continuous = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase().trim();
  content.innerText = transcript;
  takeCommand(transcript);
};

btn.addEventListener("click", () => {
  recognition.start();
  btn.disabled = true;
  btn.textContent = "Listening...";
  voiceAnimation.classList.remove("hidden");
});

recognition.onend = () => {
  btn.disabled = false;
  btn.textContent = "Click here to talk to me";
  voiceAnimation.classList.add("hidden");
};

function takeCommand(message) {
  if (message.includes("hello")) {
    speak("Hello sir, how can I assist you?");
  } else if (message.includes("who are you")) {
    speak("I am Sifra, your virtual assistant created by Sachin sir.");
  } else if (message.includes("weather in")) {
    getWeather(message);
  } else if (message.includes("open youtube")) {
    speak("Opening YouTube");
    window.open("https://www.youtube.com/");
  } else if (message.includes("open google")) {
    speak("Opening Google");
    window.open("https://www.google.com/");
  } else if (message.includes("what is the date")) {
    const date = new Date().toLocaleDateString();
    speak(`Today's date is ${date}`);
  } else {
    speak(`Here's what I found for ${message}`);
    window.open(`https://www.google.com/search?q=${message}`, "_blank");
  }
}

function getWeather(message) {
  const apiKey = "8563676c5e7010a001f375976e522252"; 
  let city = message.split("weather in")[1]?.trim();
  
  if (!city) {
    speak("Please specify a city.");
    return;
  }

  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Weather API error");
      }
      return response.json();
    })
    .then((data) => {
      const temp = data.current.temp_c;
      speak(`The temperature in ${city} is ${temp} degrees Celsius.`);
    })
    .catch((error) => {
      speak("I couldn't fetch the weather, please try again.");
    });
}
