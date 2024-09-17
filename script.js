/*const ChatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input .send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "AIzaSyCTucn5YuHFa3lvdb3Ct5VJwHjn3J1RFLI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Twelve Data API for mutual funds
const TWELVE_DATA_URL = 'https://twelve-data1.p.rapidapi.com/mutual_funds/world/ratings?symbol=VFIAX';
const TWELVE_DATA_OPTIONS = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '1f6c2357c1msh5284c807abcea8dp1c355djsn930dc4366699',
        'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
    }
};

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

const fetchMutualFundRatings = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    try {
        const response = await fetch(TWELVE_DATA_URL, TWELVE_DATA_OPTIONS);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Twelve Data API Response:", data);

        if (data && data.ratings && data.ratings.length > 0) {
            const ratingDetails = data.ratings.map(rating => `Rating: ${rating.rating}, Date: ${rating.date}`).join(', ');
            messageElement.innerHTML = `VFIAX Ratings: ${ratingDetails}`;
        } else {
            messageElement.textContent = "No ratings found for VFIAX.";
        }

    } catch (error) {
        console.error("Error fetching mutual fund data:", error.message || error);
        messageElement.textContent = "Error fetching mutual fund data. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    // Check if the user message contains a specific keyword to trigger the Twelve Data API
    if (userMessage.toLowerCase().includes("vfiax")) {
        // Fetch VFIAX ratings from the Twelve Data API
        await fetchMutualFundRatings(incomingChatLi);
        return;
    }

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
            generatedText = generatedText.replace(/\n/g, '<br>');
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

// Microphone and Speech Recognition code remains the same as before...
/*const ChatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input .send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "AIzaSyCTucn5YuHFa3lvdb3Ct5VJwHjn3J1RFLI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const YAHOO_API_URL = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-similarities?symbol=INTC';
const YAHOO_API_OPTIONS = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '1f6c2357c1msh5284c807abcea8dp1c355djsn930dc4366699',
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
};

// Function to create chat bubbles
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

// Function to generate response from Gemini API
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
            generatedText = generatedText.replace(/\n/g, '<br>');
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

// Function to handle stock data fetch from Yahoo Finance API
const fetchStockData = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    try {
        const response = await fetch(YAHOO_API_URL, YAHOO_API_OPTIONS);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Yahoo API Response:", data);

        if (data.finance && data.finance.similarities.length > 0) {
            const stockList = data.finance.similarities.map(stock => `${stock.symbol}: ${stock.name}`).join(', ');
            messageElement.innerHTML = `Similar stocks: ${stockList}`;
        } else {
            messageElement.textContent = "No similar stocks found.";
        }
    } catch (error) {
        console.error("Error fetching stock data:", error);
        messageElement.textContent = "Error fetching stock data. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

// Main function to handle the chat input
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

        if (userMessage.toLowerCase().includes("stock")) {
            fetchStockData(incomingChatLi);  // Fetch stock data if the user mentions "stock"
        } else {
            generateResponse(incomingChatLi); // Otherwise, use the Gemini API
        }
    }, 600);
};

// Event listeners
sendChatbtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addE*/
const ChatInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input .send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "AIzaSyCTucn5YuHFa3lvdb3Ct5VJwHjn3J1RFLI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Twelve Data API for mutual funds
const TWELVE_DATA_URL = 'https://twelve-data1.p.rapidapi.com/mutual_funds/world/ratings?symbol=VFIAX';
const TWELVE_DATA_OPTIONS = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '1f6c2357c1msh5284c807abcea8dp1c355djsn930dc4366699',
        'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
    }
};

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

const fetchMutualFundRatings = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    try {
        const response = await fetch(TWELVE_DATA_URL, TWELVE_DATA_OPTIONS);
        console.log('Response Status:', response.status);
        const data = await response.json();
        console.log("Twelve Data API Response:", data);

        if (data && data.ratings && data.ratings.length > 0) {
            const ratingDetails = data.ratings.map(rating => `Rating: ${rating.rating}, Date: ${rating.date}`).join(', ');
            messageElement.innerHTML = `VFIAX Ratings: ${ratingDetails}`;
        } else {
            messageElement.textContent = "No ratings found for VFIAX.";
        }

    } catch (error) {
        console.error("Error fetching mutual fund data:", error.message || error);
        messageElement.textContent = "Error fetching mutual fund data. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

const generateResponse = async (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    if (userMessage.toLowerCase().includes("vfiax")) {
        await fetchMutualFundRatings(incomingChatLi);
        return;
    }

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
            generatedText = generatedText.replace(/\n/g, '<br>');
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

// Microphone and Speech Recognition code remains the same as before...

const micBtn = document.querySelector(".mic-btn");
let recognition;
let isListening = false;

if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    const startRecognition = () => {
        recognition.start();
        isListening = true;
        micBtn.classList.add("active");
    };

    const stopRecognition = () => {
        recognition.stop();
        isListening = false;
        micBtn.classList.remove("active");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        ChatInput.value = transcript; // Set the recognized text into the input field
        handleChat(); // Automatically send the message
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopRecognition();
    };

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
