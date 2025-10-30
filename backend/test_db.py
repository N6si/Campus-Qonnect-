from pymongo import MongoClient

# Your Atlas connection string
uri = "mongodb+srv://raj123:dGO25AZ8s8Hp@cluster0.ohn3vgk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Connect to MongoDB Atlas
client = MongoClient(uri)
db = client["campusconnect"]

try:
    print("✅ Connected successfully to MongoDB Atlas!")

    # Insert a sample document into a collection called "students"
    students_collection = db["students"]
    sample_student = {
        "name": "John Doe",
        "year": 2025,
        "major": "Computer Science"
    }
    result = students_collection.insert_one(sample_student)
    print(f"📌 Inserted document with ID: {result.inserted_id}")

    # Show all collections now
    print("📂 Collections in MongoDB:", db.list_collection_names())

except Exception as e:
    print("❌ Error:", e)
