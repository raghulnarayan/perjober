from pymongo import MongoClient
try:
    client = MongoClient("mongodb+srv://raghu:raghu123@cluster0.dx4h2.mongodb.net/protracker")
    print("Connection Success! Collections:", client.protracker.list_collection_names())
except Exception as e:
    print("Connection Failed:", e)