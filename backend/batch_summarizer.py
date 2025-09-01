import os
import glob
from pathlib import Path
from transcript_summarizer import process_transcript_file

def process_all_transcripts(outputs_dir="PodiFY/outputs"):
    """
    Process all transcript files in the outputs directory that don't already have summaries
    """
    # Find all .txt files that are not summary files
    transcript_pattern = os.path.join(outputs_dir, "*.txt")
    all_txt_files = glob.glob(transcript_pattern)
    
    transcript_files = [f for f in all_txt_files if not f.endswith("_summary.txt")]
    
    if not transcript_files:
        print("No transcript files found in the outputs directory.")
        return
    
    print(f"Found {len(transcript_files)} transcript file(s) to process:")
    
    for transcript_file in transcript_files:
        # Check if summary already exists
        file_path_obj = Path(transcript_file)
        summary_filename = file_path_obj.stem + "_summary.txt"
        summary_path = file_path_obj.parent / summary_filename
        
        if summary_path.exists():
            print(f"Summary already exists for {transcript_file}, skipping...")
            continue
        
        print(f"\nProcessing: {transcript_file}")
        process_transcript_file(transcript_file)

if __name__ == "__main__":
    process_all_transcripts()