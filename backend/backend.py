from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import shutil
import os

app = FastAPI()

# ===== CORS (frontend access) =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== SUPABASE CONFIG =====
SUPABASE_URL = "https://vhdskuetklxeonjchagz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZHNrdWV0a2x4ZW9uamNoYWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjk5MzcsImV4cCI6MjA5MjcwNTkzN30.c8Yvw3RfI_re1P6_ZjMJJOSLgjYxd_sE3mKh8IB-DVI"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ===== SEND DATA TO SUPABASE =====
@app.post("/upload")
async def upload(image: UploadFile, text: str = Form(...)):

    file_path = f"{UPLOAD_DIR}/{image.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    print("[INFO] Image saved:", file_path)
    print("[INFO] Text:", text)

    # OPTIONAL: if you upload images to Supabase storage later
    image_url = file_path

    # ===== INSERT INTO SUPABASE =====
    data = supabase.table("ocr_data").insert({
        "text": text,
        "image_url": image_url
    }).execute()

    return {"status": "success"}
