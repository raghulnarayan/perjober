import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# --- CONFIG ---
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "protracker"
EMAIL = "raghunarayan28@gmail.com"

async def reset_user():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    print(f"Resetting account for {EMAIL}...")
    await db.users.delete_one({"email": EMAIL})
    await db.temp_users.delete_one({"email": EMAIL})
    print("✅ Account deleted. You can now Sign Up fresh.")

if __name__ == "__main__":
    asyncio.run(reset_user())