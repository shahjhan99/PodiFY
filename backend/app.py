from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import uvicorn
import os
import tempfile
import requests
from dotenv import load_dotenv


app = FastAPI()

# -------------------------
# CORS Middleware
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# -------------------------
# Whisper Model (CPU)
# -------------------------
model = WhisperModel("small", device="cpu")


# Load .env file
load_dotenv()
# -------------------------
# Groq API Key
# -------------------------
GROQ_API_KEY = os.getenv("your_real_key_here")


# Global variable to store latest summary
summary = ""

# -------------------------
# /process Endpoint
# -------------------------
@app.post("/process")
async def process_file(file: UploadFile, start_time: int = Form(0), end_time: int = Form(-1)):
    global summary

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Transcribe audio
    segments, info = model.transcribe(tmp_path)
    transcript_text = []
    for segment in segments:
        if (start_time == 0 or segment.start >= start_time) and (end_time == -1 or segment.end <= end_time):
            transcript_text.append(f"[{segment.start:.2f}s - {segment.end:.2f}s] {segment.text}")
    os.remove(tmp_path)
    transcript_str = "\n".join(transcript_text)

    print("\n===== TRANSCRIPT GENERATED =====")
    print(transcript_str)
    print("================================")

    # -------------------------
    # Call Groq API for summary
    # -------------------------
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
     "model": "llama-3.1-8b-instant",
     "messages": [
        {"role": "system", "content": (
            "You are a helpful assistant that summarizes transcripts. "
            "Do not speculate or infer anything. "
            "Always return a concise summary of the text provided, regardless of length. "
            "Return the summary in 1-3 sentences if the transcript is short, or longer if transcript is long."
        )},
        {"role": "user", "content": f"Summarize the following transcript:\n\n{transcript_str}"}
        ]
    }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        # Safely extract summary
        summary = data.get("choices", [{}])[0].get("message", {}).get("content", "No summary returned.")

    except requests.exceptions.RequestException as e:
        print("Groq API request failed:", e)
        summary = "No summary returned due to API error."
    except (KeyError, IndexError, TypeError) as e:
        print("Error parsing Groq API response:", e)
        print("Response content:", response.text if 'response' in locals() else None)
        summary = "No summary returned due to parsing error."

    # Fallback: if summary still empty, use first 300 chars of transcript
    if not summary or summary.strip() == "":
        summary = transcript_str[:300]

    print("\n===== SUMMARY GENERATED =====")
    print(summary)
    print("================================")

    return {
        "transcript": transcript_str,
        "summary": summary
    }

# -------------------------
# /get_summary Endpoint
# -------------------------
@app.get("/get_summary")
def get_current_summary():
    global summary
    return {"summary": summary}

# -------------------------
# Run server
# -------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
 