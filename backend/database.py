import motor.motor_asyncio

# backend/database.py
MONGO_DETAILS = "mongodb+srv://raghu:raghu123@cluster0.dx4h2.mongodb.net/protracker?retryWrites=true&w=majority&appName=Cluster0"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

# This matches the database name in your screenshot image_4e9fa5.png
database = client["protracker"] 

users_col = database.get_collection("users")
study_col = database.get_collection("study")
jobs_col = database.get_collection("jobs")
temp_users = database.get_collection("temp_users")