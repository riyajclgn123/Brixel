import io
import os
from google.cloud import vision

def extract_text(image_path):
    # Initialize Google Vision client (uses JSON key from env variable)
    client = vision.ImageAnnotatorClient()

    # Check if file exists
    if not os.path.exists(image_path):
        print(f"ERROR: Image not found -> {image_path}")
        return

    # Read image file
    with io.open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # Call Google Vision OCR
    response = client.text_detection(image=image)
    texts = response.text_annotations

    # Handle no text case
    if len(texts) == 0:
        print("No text detected in image.")
        return

    # Full extracted text
    print("\n================ FULL TEXT ================\n")
    print(texts[0].description)

    # Line-by-line output
    print("\n============== LINE BY LINE ==============\n")
    for t in texts[1:]:
        print(t.description)

    # Error handling
    if response.error.message:
        raise Exception(f"Google Vision Error: {response.error.message}")


if __name__ == "__main__":
    # FIXED IMAGE NAME (your correct file)
    image_path = "latest_capture.jpg"

    print("[INFO] Starting OCR on Jetson Nano...")
    print(f"[INFO] Using image: {image_path}")

    extract_text(image_path)
