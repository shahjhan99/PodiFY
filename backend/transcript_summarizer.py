import requests
import os
import sys
from pathlib import Path

def generate_summary(transcript_content, api_key):
    """
    Generate a summary using Groq API
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Determine summary length based on transcript length
    word_count = len(transcript_content.split())
    if word_count < 100:
        summary_instruction = "Return a concise summary in 1-2 sentences."
    elif word_count < 500:
        summary_instruction = "Return a summary in 2-3 sentences."
    else:
        summary_instruction = "Return a detailed summary in 3-5 sentences covering the main points."
    
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system", 
                "content": f"You are a helpful assistant that summarizes transcripts. Do not speculate or infer anything. {summary_instruction}"
            },
            {
                "role": "user", 
                "content": f"Summarize the following transcript:\n\n{transcript_content}"
            }
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
        return data.get("choices", [{}])[0].get("message", {}).get("content", "No summary generated.")
    
    except requests.exceptions.RequestException as e:
        print(f"Groq API request failed: {e}")
        return f"Summary generation failed: {e}"
    except (KeyError, IndexError, TypeError) as e:
        print(f"Error parsing Groq API response: {e}")
        return "Summary generation failed due to parsing error."

def process_transcript_file(file_path):
    """
    Process a single transcript file and generate its summary
    """
    api_key = "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"
    
    try:
        # Read transcript content
        with open(file_path, 'r', encoding='utf-8') as f:
            transcript_content = f.read().strip()
        
        if not transcript_content:
            print(f"Transcript file {file_path} is empty")
            return
        
        print(f"Processing transcript: {file_path}")
        print(f"Transcript length: {len(transcript_content.split())} words")
        
        # Generate summary
        summary = generate_summary(transcript_content, api_key)
        
        # Create summary filename
        file_path_obj = Path(file_path)
        summary_filename = file_path_obj.stem + "_summary.txt"
        summary_path = file_path_obj.parent / summary_filename
        
        # Save summary
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write(summary)
        
        print(f"Summary saved to: {summary_path}")
        print(f"Summary: {summary}")
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcript_summarizer.py <transcript_file_path>")
        sys.exit(1)
    
    transcript_file = sys.argv[1]
    if not os.path.exists(transcript_file):
        print(f"File not found: {transcript_file}")
        sys.exit(1)
    
    process_transcript_file(transcript_file)