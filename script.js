const ChatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input .send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "AIzaSyCTucn5YuHFa3lvdb3Ct5VJwHjn3J1RFLI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p></p>` 
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;

    return chatLi;
};

const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.candidates && data.candidates.length > 0) {
            let generatedText = data.candidates[0].content.parts[0].text;
            // Replace newlines with <br> tags
            generatedText = generatedText.replace(/\n/g, '<br>');
            // Clean up unwanted characters at the start of sentences
            generatedText = generatedText.replace(/^[##\**]+/, '');
            messageElement.innerHTML = generatedText;
        } else {
            messageElement.textContent = "Sorry, I couldn't process your message.";
        }

    } catch (error) {
        console.error("Error:", error.message || error);
        messageElement.textContent = "Oops, something went wrong...";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

const handleChat = () => {
    userMessage = ChatInput.value.trim();
    if (!userMessage) return;
    ChatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

sendChatbtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

function toggleSection(sectionId) {
    document.querySelectorAll('.hidden-section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}
const micBtn = document.querySelector(".mic-btn");
let recognition;
let isListening = false;

// Check if the browser supports the Web Speech API
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    // Start speech recognition
    const startRecognition = () => {
        recognition.start();
        isListening = true;
        micBtn.classList.add("active");
    };

    // Stop speech recognition
    const stopRecognition = () => {
        recognition.stop();
        isListening = false;
        micBtn.classList.remove("active");
    };

    // Handle results from speech recognition
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        ChatInput.value = transcript; // Set the recognized text into the input field
        handleChat(); // Automatically send the message
    };

    // Handle speech recognition errors
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopRecognition();
    };

    // Toggle voice search on click of the microphone button
    micBtn.addEventListener("click", () => {
        if (isListening) {
            stopRecognition();
        } else {
            startRecognition();
        }
    });
} else {
    console.warn("Speech recognition not supported in this browser.");
    micBtn.style.display = 'none'; // Hide mic button if speech recognition is not supported
}
