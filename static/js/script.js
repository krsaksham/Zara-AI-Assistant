const chatBox = document.getElementById("chat-box");
const commandInput = document.getElementById("command-input");
const sendButton = document.getElementById("send-button");
const voiceButton = document.getElementById("voice-button");
const captureButton = document.getElementById("capture-button");
const helpButton = document.getElementById("help-button");
const clearButton = document.getElementById("clear-button");
const statusPill = document.getElementById("status-pill");
const commandChips = document.querySelectorAll(".command-chip");

const cameraModal = document.getElementById("camera-modal");
const closeCameraButton = document.getElementById("close-camera-button");
const cameraVideo = document.getElementById("camera-video");
const cameraCanvas = document.getElementById("camera-canvas");
const snapButton = document.getElementById("snap-button");
const cameraStatus = document.getElementById("camera-status");

let cameraStream = null;
let recognition = null;
let availableVoices = [];


function setStatus(message) {
    statusPill.textContent = message;
}


function loadAvailableVoices() {
    if (!("speechSynthesis" in window)) {
        availableVoices = [];
        return;
    }

    availableVoices = window.speechSynthesis.getVoices();
}


function getPreferredVoice() {
    if (!availableVoices.length) {
        return null;
    }

    const preferredKeywords = [
        "zira",
        "aria",
        "hazel",
        "heera",
        "susan",
        "samantha",
        "victoria",
        "female",
        "woman",
        "google uk english female",
    ];

    const femaleVoice = availableVoices.find((voice) => {
        const voiceName = `${voice.name} ${voice.voiceURI}`.toLowerCase();
        return preferredKeywords.some((keyword) => voiceName.includes(keyword));
    });

    if (femaleVoice) {
        return femaleVoice;
    }

    const englishVoice = availableVoices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("en"));
    return englishVoice || availableVoices[0] || null;
}


function addMessage(role, text) {
    if (!text) {
        return;
    }

    const message = document.createElement("article");
    message.className = `message ${role.toLowerCase()}`;

    const label = document.createElement("span");
    label.className = "message-label";
    label.textContent = role;

    const body = document.createElement("div");
    body.textContent = text;

    message.append(label, body);
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}


function clearConversation(logUser = false) {
    chatBox.innerHTML = "";
    if (logUser) {
        addMessage("You", "Clear chat");
        addMessage("Zara", "Chat cleared. Ready for the next command.");
    }
}


function speakText(text) {
    if (!("speechSynthesis" in window) || !text) {
        return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const preferredVoice = getPreferredVoice();

    if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang || "en-US";
    } else {
        utterance.lang = "en-US";
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}


function processAssistantResult(result) {
    if (!result) {
        return;
    }

    if (result.action === "clear_chat") {
        clearConversation(false);
    }

    if (result.response) {
        addMessage("Zara", result.response);
        speakText(result.response);
    }

    if (result.action === "open_url" && result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
    }

    if (result.action === "open_camera") {
        openCameraModal();
    }

    setStatus("Ready");
}


async function sendCommand(command, options = {}) {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) {
        return;
    }

    const { logUser = true } = options;

    if (logUser) {
        addMessage("You", trimmedCommand);
    }

    setStatus("Thinking...");

    try {
        const response = await fetch("/api/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: trimmedCommand }),
        });

        const result = await response.json();
        processAssistantResult(result);
    } catch (error) {
        addMessage("Zara", "I could not reach the Flask backend right now.");
        setStatus("Connection issue");
    }
}


function submitTypedCommand() {
    const text = commandInput.value.trim();
    if (!text) {
        return;
    }

    commandInput.value = "";
    sendCommand(text);
}


function setupVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceButton.disabled = true;
        voiceButton.textContent = "Voice Unsupported";
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        setStatus("Listening...");
        addMessage("Zara", "Listening... please speak clearly.");
        speakText("Listening");
        voiceButton.disabled = true;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sendCommand(transcript);
    };

    recognition.onerror = () => {
        addMessage("Zara", "Voice input is unavailable right now. Please try typing the command.");
        setStatus("Voice issue");
    };

    recognition.onend = () => {
        voiceButton.disabled = false;
        setStatus("Ready");
    };
}


async function openCameraModal() {
    cameraModal.classList.remove("hidden");
    cameraModal.setAttribute("aria-hidden", "false");
    cameraStatus.textContent = "Starting camera...";

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        cameraVideo.srcObject = cameraStream;
        cameraStatus.textContent = "Camera is ready. Click Capture & Save.";
    } catch (error) {
        cameraStatus.textContent = "Camera access was denied or is unavailable.";
        addMessage("Zara", "I could not access the camera. Please allow camera permission and try again.");
        speakText("I could not access the camera. Please allow camera permission and try again.");
    }
}


function closeCameraModal() {
    if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        cameraStream = null;
    }

    cameraVideo.srcObject = null;
    cameraModal.classList.add("hidden");
    cameraModal.setAttribute("aria-hidden", "true");
    cameraStatus.textContent = "Allow camera access to continue.";
    setStatus("Ready");
}


async function captureAndSaveSelfie() {
    if (!cameraStream) {
        cameraStatus.textContent = "Camera is not ready yet.";
        return;
    }

    const width = cameraVideo.videoWidth || 1280;
    const height = cameraVideo.videoHeight || 720;
    cameraCanvas.width = width;
    cameraCanvas.height = height;

    const context = cameraCanvas.getContext("2d");
    context.drawImage(cameraVideo, 0, 0, width, height);

    cameraStatus.textContent = "Saving selfie...";

    try {
        const image = cameraCanvas.toDataURL("image/png");
        const response = await fetch("/api/save-selfie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image }),
        });

        const result = await response.json();
        addMessage("Zara", result.response || "Selfie saved.");
        speakText(result.response || "Selfie saved.");
        cameraStatus.textContent = result.response || "Selfie saved.";
        closeCameraModal();
    } catch (error) {
        cameraStatus.textContent = "Could not save the selfie.";
        addMessage("Zara", "Something went wrong while saving the selfie. Please try again.");
        speakText("Something went wrong while saving the selfie. Please try again.");
    }
}


sendButton.addEventListener("click", submitTypedCommand);

commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitTypedCommand();
    }
});

voiceButton.addEventListener("click", () => {
    if (recognition) {
        recognition.start();
    }
});

captureButton.addEventListener("click", () => {
    sendCommand("Capture selfie");
});

helpButton.addEventListener("click", () => {
    sendCommand("Help");
});

clearButton.addEventListener("click", () => {
    clearConversation(true);
});

commandChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        sendCommand(chip.dataset.command || chip.textContent);
    });
});

closeCameraButton.addEventListener("click", closeCameraModal);
snapButton.addEventListener("click", captureAndSaveSelfie);

cameraModal.addEventListener("click", (event) => {
    if (event.target === cameraModal) {
        closeCameraModal();
    }
});

window.addEventListener("beforeunload", () => {
    closeCameraModal();
});

setupVoiceRecognition();
loadAvailableVoices();

if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = loadAvailableVoices;
}

addMessage("Zara", document.body.dataset.welcome || "Hello! I am Zara.");
speakText(document.body.dataset.welcome || "Hello! I am Zara.");
