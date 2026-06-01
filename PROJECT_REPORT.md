# PROJECT REPORT

## ZARA - Web-Based AI Assistant

### Team Members

- Nirmallya Bhowmick
- Saksham Kumar
- Rudransh Jiyala
- Agam Bhatia
- Rudraksh Singh
- Keshav Kumar

## Abstract

Zara is a web-based AI assistant developed as a first-year B.Tech CSE mini project using Flask, HTML, CSS, and JavaScript. The system provides a browser-based assistant interface through which a user can type commands, use voice input, listen to spoken responses, capture selfies using the camera, read a local file, retrieve Wikipedia summaries, open useful websites, and view news headlines. The project demonstrates the integration of backend logic, frontend interaction, browser APIs, and web-based automation into a single interactive assistant.

## Introduction

Virtual assistants are widely used to simplify day-to-day digital tasks. The goal of this project was to design a beginner-friendly assistant that combines multiple useful features in one web application. Zara was built to show how a Flask backend can work together with a modern frontend to create an assistant capable of handling both user commands and browser-based features such as speech and camera access.

Unlike a simple static website, this project combines frontend design, command interpretation, feature routing, voice support, and media handling. It therefore serves as a practical demonstration of full-stack integration at an introductory engineering level.

## Objectives

- Build an interactive AI assistant using Flask.
- Create a proper frontend-backend project structure.
- Support both typed commands and voice-based interaction.
- Implement webcam-based selfie capture and saving.
- Fetch useful information such as time, date, news, and Wikipedia summaries.
- Demonstrate practical integration of Python backend logic with browser APIs.

## Problem Statement

Users often need to perform small repetitive tasks such as opening websites, checking the current time, searching for quick information, or using device features like the microphone and camera. Performing all these actions separately is less convenient. The aim of Zara is to provide a single assistant interface that can respond to natural commands and perform such tasks in an organized and user-friendly way.

## Technologies Used

### Programming Languages

- Python
- HTML
- CSS
- JavaScript

### Frameworks and Libraries

- Flask
- requests
- wikipedia

### Browser APIs

- Web Speech API for voice input and speech output
- MediaDevices API for camera access
- Fetch API for frontend-backend communication

## Project Structure

- `app.py` - Flask backend containing routes, command handling, and feature logic
- `templates/index.html` - main user interface
- `static/css/style.css` - application styling
- `static/js/script.js` - frontend interaction logic
- `read_this_file.txt` - demo file used by Zara's file-reading feature
- `requirements.txt` - backend dependencies

## System Overview

The project follows a client-server architecture:

1. The user enters or speaks a command in the browser.
2. The frontend sends the command to the Flask backend through `/api/command`.
3. The backend processes the command and decides the required action.
4. A JSON response is sent back to the frontend.
5. The frontend updates the chat interface and performs browser-side actions such as speaking the response, opening websites, or starting the camera.

## Main Features

- Text-based chat interface
- Voice input from the browser microphone
- Spoken responses using browser speech synthesis
- Webcam-based selfie capture and save feature
- Wikipedia summary retrieval
- News headline retrieval
- Open Google, YouTube, and Camu through commands
- Read a local project file
- Clear chat and sample command support

## Module Description

### 1. Backend Command Processing

The backend receives user commands through Flask routes and matches them with supported actions such as greeting, date/time retrieval, news, Wikipedia search, and website opening. This forms the core logic of the assistant.

### 2. Frontend Interaction Module

The frontend provides the Zara interface, input area, chat window, buttons, and visual sections. It also handles user-side actions and renders both user messages and assistant responses.

### 3. Voice Interaction Module

This module uses browser speech recognition for capturing user speech and browser speech synthesis for playing Zara's spoken response.

### 4. Camera and Selfie Module

The camera module accesses the webcam from the browser, captures an image, converts it into a data payload, and sends it to the Flask backend to save it properly.

### 5. Information Retrieval Module

This module handles external information-based features such as Wikipedia summaries and news headline retrieval.

## Workflow

1. User opens the Zara web application.
2. User types a command or clicks the voice input button.
3. The command is sent to the backend.
4. Backend identifies the requested feature.
5. Backend returns a structured response.
6. Frontend displays Zara's reply in the chat window.
7. If needed, the frontend also performs browser-side actions such as opening a URL or activating the camera.

## Work Distribution

- **Saksham Kumar**: Camera/selfie feature, final app wiring, overall integration, debugging, complete app working
- **Nirmallya Bhowmick**: Frontend-backend coordination, main application flow, UI interaction logic, core development support
- **Rudransh Jiyala**: Voice assistant features, speech-related work, command interaction testing
- **Agam Bhatia**: Frontend layout, styling, buttons, interface polish
- **Rudraksh Singh**: News feature, Wikipedia feature, file-reading related support
- **Keshav Kumar**: Testing, bug reporting, documentation support, report and presentation preparation

## Testing and Verification

The project was checked through route-level and interface-level verification. Important backend endpoints such as `/`, `/api/health`, `/api/command`, and `/api/save-selfie` were tested. The frontend was also checked for command flow, response rendering, voice support, and camera access behavior.

## Challenges Faced

- Managing proper Flask project structure with templates and static files
- Handling voice support across browsers
- Managing camera permission and selfie saving flow
- Coordinating frontend and backend actions correctly
- Making the application stable when multiple local ports and old processes were active
- Providing fallback behavior when internet-dependent features are unavailable

## Future Enhancements

- Add user authentication and session-based personalization
- Improve conversational intelligence using advanced language models
- Add weather, reminders, and email functionality
- Save chat history for later use
- Add multilingual support
- Deploy the application on a cloud platform for wider access

## Conclusion

Zara successfully demonstrates the design of a web-based assistant built with Flask and browser technologies. The project combines backend command processing, frontend interaction, speech support, camera capture, and information retrieval into one complete application. It also reflects practical teamwork, modular development, and integration of multiple components into a working full-stack project.

## How to Run

From the project folder:

```powershell
python .\app.py
```

Then open:

`http://127.0.0.1:5002`
