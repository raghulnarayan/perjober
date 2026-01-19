import subprocess
import time
import os
import sys

# --- CONFIGURATION ---
# We use the NEW folder to guarantee a fresh start
DB_PATH = r"C:\protracker_db"
MONGO_EXE = r"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"

def run_system():
    # 1. Create DB Folder if missing (Self-Repairing)
    if not os.path.exists(DB_PATH):
        print(f"📂 Creating fresh database folder: {DB_PATH}")
        os.makedirs(DB_PATH)

    # 2. Start MongoDB (The Engine)
    print("\n🚀 [1/3] Starting Database...")
    # We allow mongod to output to this terminal so you can see if it's alive
    mongo_process = subprocess.Popen([MONGO_EXE, "--dbpath", DB_PATH])
    time.sleep(4)  # Give it time to initialize

    # 3. Start Backend (The Brain)
    print("🔥 [2/3] Starting Backend (Port 8001)...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--port", "8001"],
        creationflags=subprocess.CREATE_NEW_CONSOLE # Opens in its own window
    )
    time.sleep(3)

    # 4. Start Frontend (The Face)
    print("🎨 [3/3] Starting Frontend...")
    frontend_process = subprocess.Popen(
        [sys.executable, "-m", "streamlit", "run", "frontend/app.py"],
        creationflags=subprocess.CREATE_NEW_CONSOLE # Opens in its own window
    )

    print("\n✅ SYSTEM IS LIVE!")
    print("=================================================")
    print("  👉 To Stop: Press Ctrl + C in THIS terminal.")
    print("  ⚠️ DO NOT close the other windows manually.")
    print("=================================================")

    try:
        # Keep the script running to monitor everything
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 SHUTDOWN INITIATED...")
        
        # A. Stop Apps First
        frontend_process.terminate()
        backend_process.terminate()
        print("   - Frontend & Backend stopped.")

        # B. SAFELY Stop Database (Crucial Step)
        print("   - Saving Database state (Please wait)...")
        mongo_process.terminate()
        mongo_process.wait() # Wait for MongoDB to delete the lock file
        print("✅ DATABASE SAVED & CLOSED SAFELY.")
        print("👋 Bye Raghu!")

if __name__ == "__main__":
    run_system()