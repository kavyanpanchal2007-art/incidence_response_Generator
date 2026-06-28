import os

from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["incident_playbook"]


def get_db():
    return db
