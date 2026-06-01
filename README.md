# Zara

This folder contains the Flask version of the Zara Personal AI Assistant project.

## Project Structure

- `app.py` - Flask backend
- `templates/index.html` - main frontend page
- `static/css/style.css` - styling
- `static/js/script.js` - frontend logic
- `read_this_file.txt` - demo file for the read-file feature
- `requirements.txt` - Python dependencies

## How To Run

```powershell
cd ".\zara"
python .\app.py
```

Then open [http://127.0.0.1:5002](http://127.0.0.1:5002).

## Features

- Text chat with Zara
- Browser-based voice input
- Browser text-to-speech replies
- Webcam selfie capture from the frontend
- Wikipedia summaries
- Latest news headlines
- Open Google, YouTube, and Camu
- Read a local project file

## Notes

- Voice input works best in browsers that support the Web Speech API.
- Selfie capture needs browser camera permission.
- News and Wikipedia features need internet access.
