import cv2
import time
import io
import os
from google.cloud import vision
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ================= CONFIG =================
IMAGE_PATH = "latest_capture.jpg"
INTERVAL = 60  # 1 minute

client = vision.ImageAnnotatorClient()


# ================= CAPTURE IMAGE =================
def capture_image():
    cam = cv2.VideoCapture(0)

    if not cam.isOpened():
        print("Camera not found")
        return False

    ret, frame = cam.read()
    cam.release()

    if ret:
        cv2.imwrite(IMAGE_PATH, frame)
        print("[INFO] Image captured")
        return True

    print("[ERROR] Capture failed")
    return False


# ================= OCR =================
def extract_text(image_path):
    with io.open(image_path, "rb") as f:
        content = f.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        return ""

    return texts[0].description


# ================= UPLOAD IMAGE TO SUPABASE STORAGE =================
def upload_image(image_path):
    bucket = supabase.storage.from_("captures")
    file_name = f"{int(time.time())}.jpg"
    with open(image_path, "rb") as f:
        bucket.upload(
            file_name,
            f,
            {"content-type": "image/jpeg", "upsert": "true"}
        )
    public_url = bucket.get_public_url(file_name)
    return public_url


# ================= SAVE TO DATABASE =================
def save_to_supabase(image_url, text):

    supabase.table("captures").insert({
        "image_url": image_url,
        "raw_text": text,
        "confidence": 1.0,
        "is_assignment": False
    }).execute()

    print("[INFO] Saved to Supabase")


# ================= MAIN LOOP =================
while True:
    print("\n[PIPELINE] Running cycle...")

    if capture_image():

        # OCR
        text = extract_text(IMAGE_PATH)
        print("[OCR]", text)

        # Upload image
        image_url = upload_image(IMAGE_PATH)
        print("[IMAGE URL]", image_url)

        # Save everything
        save_to_supabase(image_url, text)

    print(f"[WAIT] Sleeping {INTERVAL} sec...\n")
    time.sleep(INTERVAL)
