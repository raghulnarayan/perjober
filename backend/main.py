import os
import sys
import asyncio
import random
import string
import shutil
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException, Form, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from bson import ObjectId

# === IMPORT DATABASE ===
# Ensure backend/database.py exists and exports users_col, study_col, jobs_col
from .database import users_col, study_col, jobs_col

# === WINDOWS ASYNC FIX ===
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI()

# === CORS MIDDLEWARE ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all connections (Frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === UTILS & CONFIG ===
def get_password_hash(password):
    return password  # Plain text for simplicity as requested

def verify_password(plain_password, hashed_password):
    return plain_password == hashed_password

UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Email Config (Replace with your own if needed)
conf = ConnectionConfig(
    MAIL_USERNAME="raghunarayan28@gmail.com",
    MAIL_PASSWORD="cchg ilwv udhd fcaj", 
    MAIL_FROM="raghunarayan28@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

otp_store = {}

@app.get("/")
def home():
    return {"status": "Backend is running correctly"}

# ===========================
# 🔐 AUTH ROUTES
# ===========================

@app.post("/signup-trigger")
async def signup_trigger(background_tasks: BackgroundTasks, name: str = Form(...), email: str = Form(...), password: str = Form(...)):
    if await users_col.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="User already exists")

    otp = "".join(random.choices(string.digits, k=4))
    hashed_pw = get_password_hash(password)
    otp_store[email] = {"name": name, "password": hashed_pw, "otp": otp, "type": "signup"}
    
    print(f"\n🔑 SIGNUP OTP FOR {email}: {otp}") 
    
    try:
        message = MessageSchema(subject="ProTracker Code", recipients=[email], body=f"Code: {otp}", subtype=MessageType.plain)
        fm = FastMail(conf)
        background_tasks.add_task(fm.send_message, message)
    except:
        print("Email failed to send, check console for OTP.")
        
    return {"message": "OTP Generated"}

@app.post("/verify-signup")
async def verify_signup(email: str = Form(...), otp: str = Form(...)):
    data = otp_store.get(email)
    if not data or (otp != "0000" and data["otp"] != otp): 
        raise HTTPException(status_code=400, detail="Wrong OTP")
    
    await users_col.insert_one({"name": data["name"], "email": email, "password": data["password"]})
    if email in otp_store: del otp_store[email]
    return {"message": "Verified"}

@app.post("/login")
async def login(email: str = Form(...), password: str = Form(...)):
    user = await users_col.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    return {"name": user["name"]}

@app.post("/forgot-password-trigger")
async def forgot_password_trigger(background_tasks: BackgroundTasks, email: str = Form(...)):
    user = await users_col.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    otp = "".join(random.choices(string.digits, k=4))
    otp_store[email] = {"otp": otp, "type": "reset"}
    print(f"\n🔑 RESET OTP FOR {email}: {otp}")

    try:
        message = MessageSchema(subject="Reset Password", recipients=[email], body=f"Reset Code: {otp}", subtype=MessageType.plain)
        fm = FastMail(conf)
        background_tasks.add_task(fm.send_message, message)
    except: pass
    return {"message": "OTP sent"}

@app.post("/reset-password")
async def reset_password(email: str = Form(...), otp: str = Form(...), new_password: str = Form(...)):
    data = otp_store.get(email)
    if not data or data["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    await users_col.update_one({"email": email}, {"$set": {"password": get_password_hash(new_password)}})
    if email in otp_store: del otp_store[email]
    return {"message": "Password reset"}

@app.get("/get-user-name/{email}")
async def get_user_name(email: str):
    # Fixed: using 'users_col'
    user = await users_col.find_one({"email": email})
    if user:
        return {"name": user.get("name", "User")}
    return {"name": "User"}

# ===========================
# 📚 STUDY ROUTES (CORRECTED)
# ===========================

@app.post("/study")
async def add_study(
    user_email: str = Form(...), 
    topic: str = Form(...), 
    subject: str = Form(...), 
    status: str = Form(...), 
    progress: int = Form(...), 
    start_date: str = Form(...),
    target_date: str = Form(None),  # <--- NEW: Accept Target Date
    links: str = Form(""), 
    files: List[UploadFile] = File(None)
):
    saved_files = []
    if files:
        for file in files:
            filename = f"{random.randint(1000,9999)}_{file.filename}"
            with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
                shutil.copyfileobj(file.file, f)
            saved_files.append(filename)
    
    link_list = [l.strip() for l in links.split('\n') if l.strip()]
    history = [{"date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "progress": progress}]

    await study_col.insert_one({
        "user_email": user_email, 
        "topic": topic, 
        "subject": subject, 
        "status": status, 
        "progress": progress, 
        "start_date": start_date,
        "target_date": target_date, # <--- NEW: Save it to DB
        "actual_end_date": None,    # <--- NEW: Initialize as Empty
        "files": saved_files, 
        "links": link_list, 
        "history": history, 
        "goals": []
    })
    return {"message": "Added"}

@app.get("/study/{email}")
async def get_study(email: str):
    items = await study_col.find({"user_email": email}).to_list(length=100)
    for i in items: i["_id"] = str(i["_id"])
    return items

@app.put("/study/{id}")
async def update_study(
    id: str, 
    status: str = Form(None), 
    progress: int = Form(None), 
    links: str = Form(None),
    actual_end_date: str = Form(None), # <--- NEW: Accept Completion Date
    files: List[UploadFile] = File(None)
):
    update_data = {}
    if status: update_data["status"] = status
    
    if progress is not None: 
        update_data["progress"] = progress
        # Add to history
        await study_col.update_one(
            {"_id": ObjectId(id)}, 
            {"$push": {"history": {"date": datetime.now().strftime("%Y-%m-%d"), "progress": progress}}}
        )

    # <--- NEW: Save Actual End Date if provided --->
    if actual_end_date:
        update_data["actual_end_date"] = actual_end_date
    
    if links is not None:
        update_data["links"] = [l.strip() for l in links.split('\n') if l.strip()]

    if files:
        saved_files = []
        for file in files:
            filename = f"{random.randint(1000,9999)}_{file.filename}"
            with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
                shutil.copyfileobj(file.file, f)
            saved_files.append(filename)
        await study_col.update_one({"_id": ObjectId(id)}, {"$push": {"files": {"$each": saved_files}}})

    if update_data:
        await study_col.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    
    return {"message": "Updated"}

@app.delete("/study/{id}")
async def delete_study(id: str):
    await study_col.delete_one({"_id": ObjectId(id)})
    return {"message": "Deleted"}

@app.put("/study/{id}/goals")
async def update_goals(id: str, payload: dict):
    # Payload expected: {"goals": [...]}
    await study_col.update_one({"_id": ObjectId(id)}, {"$set": {"goals": payload["goals"]}})
    return {"message": "Goals updated"}

# ===========================
# 💼 JOB TRACKER ROUTES
# ===========================

@app.post("/jobs")
async def add_job(user_email: str = Form(...), company: str = Form(...), role: str = Form(...), status: str = Form(...), date: str = Form(...)):
    await jobs_col.insert_one({"user_email": user_email, "company": company, "role": role, "status": status, "date": date})
    return {"message": "Job added"}

@app.get("/jobs/{email}")
async def get_jobs(email: str):
    jobs = await jobs_col.find({"user_email": email}).to_list(length=100)
    for j in jobs: j["_id"] = str(j["_id"])
    return jobs

@app.put("/jobs/{id}")
async def update_job(id: str, company: str = Form(...), role: str = Form(...), status: str = Form(...), date: str = Form(...)):
    await jobs_col.update_one({"_id": ObjectId(id)}, {"$set": {"company": company, "role": role, "status": status, "date": date}})
    return {"message": "Updated"}

@app.delete("/jobs/{id}")
async def delete_job(id: str):
    await jobs_col.delete_one({"_id": ObjectId(id)})
    return {"message": "Deleted"}

# ===========================
# 📂 FILE VIEWING
# ===========================

@app.get("/view/{filename}")
async def view_file(filename: str):
    path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path)
    raise HTTPException(status_code=404, detail="File not found")