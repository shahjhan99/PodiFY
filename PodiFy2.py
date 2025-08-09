import os
import tempfile
import streamlit as st
from moviepy import VideoFileClip
from faster_whisper import WhisperModel
import requests
import librosa
import librosa.display
import matplotlib.pyplot as plt

# Initialize Whisper model
model = WhisperModel("base", device="cpu", compute_type="int8")

def extract_audio(video_path, start_time=None, end_time=None):
    try:
        video = VideoFileClip(video_path)
        if start_time is not None and end_time is not None and end_time > start_time:
            video = video.subclipped(start_time, end_time)
        audio_path = tempfile.mktemp(suffix=".wav")
        video.audio.write_audiofile(audio_path, codec='pcm_s16le', logger=None)
        video.close()
        return audio_path
    except Exception as e:
        st.error(f"Error extracting audio: {str(e)}")
        return None

def get_video_duration(file_path):
    try:
        clip = VideoFileClip(file_path)
        duration = clip.duration
        clip.close()
        return round(duration, 2)
    except Exception as e:
        st.error(f"Error getting video duration: {e}")
        return None

def transcribe_audio(audio_path):
    segments, info = model.transcribe(audio_path, beam_size=5)
    transcript = ""
    timestamps = []
    for seg in segments:
        start = round(seg.start, 2)
        end = round(seg.end, 2)
        text = seg.text.strip()
        timestamps.append((start, end, text))
        transcript += f"[{start} - {end}] {text}\n"
    return transcript.strip(), timestamps

def summarize_with_groq(transcript):
    try:
        headers = {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "user", "content": f"Summarize the following:\n{transcript}"}
            ]
        }

        response = requests.post("https://api.groq.com/openai/v1/chat/completions",
                                 headers=headers,
                                 json=payload,
                                 timeout=30)
        response.raise_for_status()

        data = response.json()
        if 'choices' in data and len(data['choices']) > 0:
            return data['choices'][0]['message']['content']
        return "Error: Could not generate summary"
    except Exception as e:
        return f"Error in summarization: {str(e)}"

def plot_waveform(audio_path):
    try:
        y, sr = librosa.load(audio_path)
        plt.figure(figsize=(10, 2))
        librosa.display.waveshow(y, sr=sr)
        plt.axis('off')
        img_path = tempfile.mktemp(suffix=".png")
        plt.savefig(img_path, bbox_inches='tight', pad_inches=0)
        plt.close()
        return img_path
    except Exception as e:
        st.error(f"Error generating waveform: {str(e)}")
        return None

def main():
    st.title("🎙️ PodiFy Transcription")

    uploaded_file = st.file_uploader("📂 Upload Audio or Video", type=["mp4", "mov", "avi", "mkv", "wav", "mp3", "ogg"])

    if uploaded_file is not None:
        if "last_file" not in st.session_state or st.session_state.last_file != uploaded_file.name:
            st.session_state.last_file = uploaded_file.name
            st.session_state.start_time = 0.0
            st.session_state.end_time = 0.0

            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(uploaded_file.name)[-1]) as tmp:
                tmp.write(uploaded_file.read())
                st.session_state.file_path = tmp.name

            if st.session_state.file_path.lower().endswith((".mp4", ".mov", ".avi", ".mkv")):
                duration = get_video_duration(st.session_state.file_path)
                if duration:
                    st.session_state.end_time = duration

        file_path = st.session_state.get("file_path", None)

        if file_path:
            is_video = file_path.lower().endswith((".mp4", ".mov", ".avi", ".mkv"))
            is_audio = file_path.lower().endswith((".wav", ".mp3", ".ogg"))

            if is_video:
                st.video(uploaded_file)

                with st.form("trim_form"):
                    start_time = st.number_input("Start Time (seconds)", min_value=0.0, step=0.1,
                                                 value=st.session_state.get("start_time", 0.0), key="start_time_input")
                    end_time = st.number_input("End Time (seconds)", min_value=0.0, step=0.1,
                                               value=st.session_state.get("end_time", 0.0), key="end_time_input")
                    submit = st.form_submit_button("Process")

                if submit:
                    if end_time <= start_time:
                        st.error("End time must be greater than start time")
                        return
                    audio_path = extract_audio(file_path, start_time, end_time)
                    if not audio_path:
                        st.error("Failed to extract audio.")
                        return
                    st.info(f"⏱️ Trimmed segment: {start_time:.2f}s → {end_time:.2f}s")

                    waveform_img = plot_waveform(audio_path)
                    if waveform_img:
                        st.image(waveform_img, caption="🎵 Audio Waveform")

                    transcript, _ = transcribe_audio(audio_path)
                    st.text_area("📝 Transcript", transcript, height=200)

                    summary = summarize_with_groq(transcript)
                    st.text_area("🧠 Summary", summary, height=150)

                    if os.path.exists(audio_path):
                        os.remove(audio_path)

            elif is_audio:
                st.audio(uploaded_file)
                st.session_state.start_time = 0.0
                st.session_state.end_time = 0.0

                if st.button("Process Audio"):
                    audio_path = file_path
                    st.info("⏱️ Processing full audio file")

                    waveform_img = plot_waveform(audio_path)
                    if waveform_img:
                        st.image(waveform_img, caption="🎵 Audio Waveform")

                    transcript, _ = transcribe_audio(audio_path)
                    st.text_area("📝 Transcript", transcript, height=200)

                    summary = summarize_with_groq(transcript)
                    st.text_area("🧠 Summary", summary, height=150)

            else:
                st.warning("Unsupported file type.")

if __name__ == "__main__":
    main()
