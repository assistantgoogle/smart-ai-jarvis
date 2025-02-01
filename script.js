// Select DOM Elements
const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const statusEl = document.querySelector("#status");
const voiceAnimation = document.querySelector("#voice-animation");

// Helper function to update status text
const updateStatus = (message) => {
  statusEl.innerText = message;
};

// Speech Synthesis Function
const speak = (text) => {
  if (!("speechSynthesis" in window)) {
    updateStatus("Speech synthesis is not supported in this browser.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.lang = "en-GB";
  window.speechSynthesis.speak(utterance);
  voiceAnimation.classList.remove("hidden");
  utterance.onend = () => {
    voiceAnimation.classList.add("hidden");
  };
};

// Greeting function on load
const wishMe = () => {
  const hours = new Date().getHours();
  if (hours < 12) {
    speak("Good morning, Sachin");
  } else if (hours < 16) {
    speak("Good afternoon, sir");
  } else {
    speak("Good evening, sir");
  }
};

// Call wishMe when the window loads
window.addEventListener("load", wishMe);

// Check for Speech Recognition support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  updateStatus("Speech recognition is not supported in this browser.");
  btn.disabled = true;
}

// Initialize Speech Recognition
const recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.continuous = false;
recognition.lang = "en-GB";

// Process speech recognition results
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase().trim();
  content.innerText = transcript;
  takeCommand(transcript);
};

// Button click to start recognition
btn.addEventListener("click", () => {
  recognition.start();
  btn.disabled = true;
  btn.textContent = "Listening...";
  updateStatus("Speak now...");
  voiceAnimation.classList.remove("hidden");
});

// When recognition ends
recognition.onend = () => {
  btn.disabled = false;
  btn.textContent = "Click here to talk to me";
  updateStatus("Ready");
  voiceAnimation.classList.add("hidden");
};

// Process commands from recognized speech
const takeCommand = (message) => {
  if (message.includes("hello")) {
    speak("Hello sir, how can I assist you?");
  } else if (message.includes("who are you")) {
    speak("I am Sifra, your virtual assistant created by Sachin sir.");
  } else if (message.includes("weather in")) {
    getWeather(message);
  } else if (message.includes("open youtube")) {
    speak("Opening YouTube");
    window.open("https://www.youtube.com/", "_blank");
  } else if (message.includes("open google")) {
    speak("Opening Google");
    window.open("https://www.google.com/", "_blank");
  } else if (message.includes("what is the date")) {
    const date = new Date().toLocaleDateString();
    speak(`Today's date is ${date}`);
  } else if (message.includes("what time is it")) {
    const time = new Date().toLocaleTimeString();
    speak(`The current time is ${time}`);
  } else if (message.includes("tell me a joke")) {
    fetchJoke();
  } else if (message.includes("stop")) {
    window.speechSynthesis.cancel();
    speak("Stopped all speech.");
  } else if (message.includes("clear")) {
    content.innerText = "";
    speak("Cleared the screen.");
  } else {
    speak(`Here's what I found for ${message}`);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
  }
};

// Updated weather function using OpenWeatherMap
const getWeather = (message) => {
  // Replace with your OpenWeatherMap API key
  const apiKey = "8563676c5e7010a001f375976e522252"; 
  let city = message.split("weather in")[1]?.trim();
  if (!city) {
    speak("Please specify a city.");
    return;
  }
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Weather API error");
      }
      return response.json();
    })
    .then((data) => {
      const temp = data.main.temp;
      const description = data.weather[0].description;
      speak(`The temperature in ${city} is ${temp} degrees Celsius with ${description}.`);
    })
    .catch((error) => {
      speak("I couldn't fetch the weather, please try again.");
    });
};

// Fetch a random joke from the Chuck Norris API
const fetchJoke = () => {
  fetch("https://api.chucknorris.io/jokes/random")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Joke API error");
      }
      return response.json();
    })
    .then((data) => {
      speak(data.value);
    })
    .catch((error) => {
      speak("Sorry, I couldn't fetch a joke right now.");
    });
};
