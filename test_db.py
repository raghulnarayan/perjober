import asyncio  # This was missing!
from motor.motor_asyncio import AsyncIOMotorClient

async def test_connection():
    # Use your actual password (raghu123) and your actual cluster ID (dx4h2)
    uri = "mongodb+srv://raghu:raghu123@cluster0.dx4h2.mongodb.net/?appName=Cluster0"
    
    print("Connecting to MongoDB Atlas...")
    client = AsyncIOMotorClient(uri)
    try:
        # The ping command verifies that the connection is alive
        await client.admin.command('ping')
        print("✅ MongoDB Atlas Connection Successful!")
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_connection())