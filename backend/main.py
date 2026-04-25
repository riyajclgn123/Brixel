import time
import json
import os

from capture import capture_frame
from text_extractor import extract_text
from braille_converter import text_to_braille_unicode, text_to_brf
from tts_player import speak, save_audio

CAPTURE_DIR = "/tmp/visionboard"
INTERVAL = 60  # seconds between captures

os.makedirs(CAPTURE_DIR, exist_ok=True)

def run_pipeline():
    print("=" * 50)
    print("  VisionBoard - Whiteboard to Braille")
    print(f"  Auto-capturing every {INTERVAL} seconds")
    print("  Press Ctrl+C to stop")
    print("=" * 50)

    capture_num = 0

    while True:
        capture_num += 1
        img_path = f"{CAPTURE_DIR}/capture_{capture_num}.jpg"

        print(f"\n--- Capture #{capture_num} ---")

        print("[1/4] Capturing webcam image...")
        result = capture_frame(img_path)
        if not result:
            print("Camera error, retrying in 60s...")
            time.sleep(INTERVAL)
            continue

        print("[2/4] Extracting text with EasyOCR...")
        try:
            data = extract_text(img_path)
        except Exception as e:
            print(f"OCR error: {e}")
            time.sleep(INTERVAL)
            continue

        if not data["raw_text"].strip():
            print("No text detected on whiteboard. Waiting...")
            time.sleep(INTERVAL)
            continue

        print(f"  Found {data['num_text_regions']} text regions")
        print(f"  Content type: {data['content_type']}")
        print(f"  Confidence: {data['confidence']}")
        print(f"  Text: {data['raw_text'][:150]}")

        print("[3/4] Converting to Braille...")
        braille = text_to_braille_unicode(data["raw_text"])
        brf_path = f"{CAPTURE_DIR}/capture_{capture_num}.brf"
        text_to_brf(data["raw_text"], brf_path)
        print(f"  Braille: {braille[:80]}")
        print(f"  BRF saved: {brf_path}")

        print("[4/4] Generating audio...")
        audio_path = f"{CAPTURE_DIR}/capture_{capture_num}.mp3"
        save_audio(data["read_aloud"], audio_path)
        print(f"  Audio saved: {audio_path}")

        try:
            speak(data["read_aloud"])
        except Exception as e:
            print(f"  Playback skipped: {e}")

        print(f"\nCapture #{capture_num} COMPLETE")
        print(f"Waiting {INTERVAL}s for next capture...")
        time.sleep(INTERVAL)

if __name__ == "__main__":
    run_pipeline()
