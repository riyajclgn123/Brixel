import cv2
import time
import io
import os
import requests
from google.cloud import vision

# ===== CONFIG =====
IMAGE_PATH = "latest_capture.jpg"
API_URL = "http://YOUR_SERVER_IP:8000/upload"  # change this

client = vision.ImageAnnotatorClient()

def capture_image():
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    cam.release()

    if ret:
        cv2.imwrite(IMAGE_PATH, frame)
        print("[INFO] Image captured")
    else:
        print("[ERROR] Camera failed")

def extract_text(image_path):
    with io.open(image_path, "rb") as f:
        content = f.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)

    texts = response.text_annotations

    if len(texts) == 0:
        return ""

    return texts[0].description


def send_to_dashboard(image_path, text):
    with open(image_path, "rb") as f:
        files = {"image": f}
        data = {"text": text}

        try:
            res = requests.post(API_URL, files=files, data=data)
            print("[INFO] Sent to dashboard:", res.status_code)
        except Exception as e:
            print("[ERROR] Upload failed:", e)


# ===== MAIN LOOP =====
while True:
    print("\n[PIPELINE] Running cycle...")

    capture_image()

    text = extract_text(IMAGE_PATH)
    print("[OCR TEXT]", text)

    send_to_dashboard(IMAGE_PATH, text)

    print("[WAIT] Sleeping 60 seconds...\n")
    time.sleep(60)
