import base64
import datetime as dt
import xml.etree.ElementTree as element_tree
from pathlib import Path
from uuid import uuid4

import requests
import wikipedia
from flask import Flask, jsonify, render_template, request


BASE_DIR = Path(__file__).resolve().parent
READ_FILE_PATH = BASE_DIR / "read_this_file.txt"
NEWS_URL = "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"
SAMPLE_COMMANDS = [
    "Introduce yourself",
    "What is your name?",
    "Tell me the time",
    "Tell me today's date",
    "Open YouTube",
    "Open Google",
    "Open my Camu",
    "Wikipedia artificial intelligence",
    "Tell me the news",
    "Read this file",
    "Capture selfie",
]

app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR / "static"),
)


def get_greeting():
    current_hour = dt.datetime.now().hour
    if current_hour < 12:
        return "Good Morning"
    if current_hour < 18:
        return "Good Afternoon"
    return "Good Evening"


def get_news_headlines():
    try:
        response = requests.get(NEWS_URL, timeout=10)
        response.raise_for_status()
        root = element_tree.fromstring(response.content)
    except requests.RequestException:
        return []
    except element_tree.ParseError:
        return []

    headlines = []
    for item in root.findall(".//item"):
        title = item.findtext("title", "").strip()
        if title and title.lower() != "google news":
            headlines.append(title)
        if len(headlines) == 5:
            break
    return headlines


def get_wikipedia_summary(search_query):
    try:
        wikipedia.set_lang("en")
        summary = wikipedia.summary(search_query, sentences=2, auto_suggest=False)
        return f"According to Wikipedia: {summary}"
    except wikipedia.exceptions.DisambiguationError as error:
        options = ", ".join(error.options[:3])
        return f"Your topic is a little broad. Please try one of these: {options}."
    except wikipedia.exceptions.PageError:
        return "I could not find that topic on Wikipedia. Please try a more specific query."
    except requests.RequestException:
        return "Wikipedia is not reachable right now. Please check the internet connection."
    except Exception:
        return "I could not fetch the Wikipedia summary right now."


def read_project_file():
    if not READ_FILE_PATH.exists():
        return "The project note file is missing from the folder."
    return READ_FILE_PATH.read_text(encoding="utf-8").strip()


def save_selfie_from_data_url(image_data):
    if not image_data or "," not in image_data:
        raise ValueError("Invalid image payload.")

    _, encoded_data = image_data.split(",", 1)
    image_bytes = base64.b64decode(encoded_data)
    desktop_path = Path.home() / "Desktop"
    fallback_dir = BASE_DIR / "saved_selfies"
    fallback_dir.mkdir(parents=True, exist_ok=True)

    candidate_dirs = []
    if desktop_path.exists():
        candidate_dirs.append(desktop_path)
    candidate_dirs.append(fallback_dir)

    for save_dir in candidate_dirs:
        try:
            filename = save_dir / f"selfie_{dt.datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid4().hex[:6]}.png"
            filename.write_bytes(image_bytes)
            if save_dir == desktop_path:
                return "Selfie captured and saved on the Desktop."
            return "Selfie captured and saved in the saved_selfies folder."
        except OSError:
            continue

    raise OSError("Could not save selfie to any available directory.")


def process_command(command):
    cleaned_command = command.strip().lower()
    words = cleaned_command.split()

    if not cleaned_command:
        return {"response": "Please type or say a command first."}

    if any(greeting in words for greeting in ["hi", "hello", "hey"]):
        return {"response": "Hello! Please tell me how I can help you."}

    if "help" in cleaned_command or "what can you do" in cleaned_command:
        help_text = "Here are some commands you can try:\n" + "\n".join(f"- {item}" for item in SAMPLE_COMMANDS)
        return {"response": help_text}

    if "your name" in cleaned_command:
        return {"response": "My name is Zara."}

    if "introduce yourself" in cleaned_command or "about yourself" in cleaned_command:
        return {
            "response": (
                "Hello! I am Zara, your personal AI assistant. "
                "I was built by Team Py_Crew, a group of first-year B.Tech CSE students. "
                "I can help with simple commands like date, time, news, Wikipedia search, opening websites and capturing selfies."
            )
        }

    if "who invented you" in cleaned_command or "who made you" in cleaned_command:
        return {"response": "I was built by Team Py_Crew as a first-year CSE group project."}

    if "team" in cleaned_command or "developers" in cleaned_command:
        return {
            "response": (
                "We are Team Py_Crew. In this project, different teammates worked on the GUI, "
                "voice input, camera feature, internet-based commands and testing."
            )
        }

    if "how old are you" in cleaned_command:
        return {"response": "I do not have an age, but I am a fresh project version."}

    if "date" in cleaned_command:
        today = dt.datetime.now().strftime("%d %B %Y")
        return {"response": f"Today's date is {today}."}

    if "time" in cleaned_command:
        time_now = dt.datetime.now().strftime("%I:%M %p")
        return {"response": f"The current time is {time_now}."}

    if "day" in cleaned_command:
        day_name = dt.datetime.now().strftime("%A")
        return {"response": f"Today is {day_name}."}

    if "open youtube" in cleaned_command:
        return {
            "response": "Opening YouTube.",
            "action": "open_url",
            "url": "https://www.youtube.com",
        }

    if "open google" in cleaned_command:
        return {
            "response": "Opening Google.",
            "action": "open_url",
            "url": "https://www.google.com",
        }

    if "open my camu" in cleaned_command or "open camu" in cleaned_command:
        return {
            "response": "Opening Camu.",
            "action": "open_url",
            "url": "https://student.bennetterp.camu.in/",
        }

    if "capture" in cleaned_command or "selfie" in cleaned_command:
        return {
            "response": "Opening the camera. Click capture to save a selfie and close when you are done.",
            "action": "open_camera",
        }

    if "news" in cleaned_command:
        headlines = get_news_headlines()
        if not headlines:
            return {"response": "I could not fetch the latest news right now. Please check the internet connection and try again."}
        text = "Here are the latest headlines:\n" + "\n".join(
            f"{index}. {headline}" for index, headline in enumerate(headlines, start=1)
        )
        return {"response": text}

    if "wikipedia" in cleaned_command:
        search_query = cleaned_command.replace("wikipedia", "", 1).strip()
        if not search_query:
            return {"response": "Please type something like 'Wikipedia Python programming'."}
        return {"response": get_wikipedia_summary(search_query)}

    if "read this file" in cleaned_command or "read file" in cleaned_command:
        return {"response": read_project_file()}

    if "clear chat" in cleaned_command:
        return {"response": "Chat cleared. Ready for the next command.", "action": "clear_chat"}

    if cleaned_command in {"zara stop", "exit", "quit", "close"}:
        return {"response": "This browser version stays open, but you can close the tab anytime."}

    return {"response": "I did not understand that command. Please try another one or click Help."}


@app.get("/")
def index():
    welcome_message = (
        f"{get_greeting()}! I am Zara, your personal AI assistant. "
        "This Flask version was made by Team Py_Crew. Type a command, use the microphone, or try the sample buttons."
    )
    return render_template(
        "index.html",
        sample_commands=SAMPLE_COMMANDS,
        welcome_message=welcome_message,
    )


@app.post("/api/command")
def command_api():
    payload = request.get_json(silent=True) or {}
    command = payload.get("command", "")
    return jsonify(process_command(command))


@app.post("/api/save-selfie")
def save_selfie_api():
    payload = request.get_json(silent=True) or {}
    image_data = payload.get("image", "")

    try:
        message = save_selfie_from_data_url(image_data)
        return jsonify({"response": message})
    except ValueError:
        return jsonify({"response": "I could not read the selfie image. Please try again."}), 400
    except Exception:
        return jsonify({"response": "Something went wrong while saving the selfie. Please try again."}), 500


@app.get("/api/health")
def health_api():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5002)
