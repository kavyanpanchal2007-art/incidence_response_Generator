from datetime import datetime, timezone
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError
from pydantic import BaseModel

from auth import hash_password, verify_password
from database import get_db
from gemini import generate_playbook
from models import User, Post, PlaybookRequest
from pdf import generate_pdf


# FIX 1: Use 'dict' instead of strict models to prevent 422 errors
class SavePlaybookRequest(BaseModel):
    username: str
    playbook: dict

class DownloadPdfRequest(BaseModel):
    playbook: dict

class PostRequest(Post):
    username: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API Running"}

@app.post("/register")
def register_user(user: User):
    db = get_db()
    try:
        if db.users.find_one({"username": user.username}):
            raise HTTPException(status_code=409, detail="Username already exists")
        db.users.insert_one({
            "username": user.username,
            "password": hash_password(user.password),
        })
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except PyMongoError as error:
        raise HTTPException(status_code=500, detail="Database error") from error

    return {"message": "User registered successfully"}

@app.post("/login")
def login_user(user: User):
    db = get_db()
    try:
        existing_user = db.users.find_one({"username": user.username})
    except PyMongoError as error:
        raise HTTPException(status_code=500, detail="Database error") from error

    # FIX 2: Return 404 if user not found, so frontend can automatically register them
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {"message": "Login successful", "username": user.username}

@app.post("/generate-playbook")
def generate(request: PlaybookRequest):
    return generate_playbook(request)

@app.post("/save-playbook")
def save_playbook(request: SavePlaybookRequest):
    db = get_db()
    try:
        db.playbooks.insert_one({
            "username": request.username,
            "playbook": request.playbook,
            "created_at": datetime.now(timezone.utc),
        })
    except PyMongoError as error:
        raise HTTPException(status_code=500, detail="Database error") from error

    return {"message": "Playbook saved successfully"}

@app.post("/download-pdf")
def download_pdf(request: DownloadPdfRequest):
    if not request.playbook:
        raise HTTPException(
            status_code=400,
            detail="Playbook data missing"
        )

    pdf_bytes = generate_pdf(request.playbook)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=playbook.pdf"
        },
    )

@app.get("/playbooks/{username}")
def get_user_playbooks(username: str):
    db = get_db()
    try:
        playbooks = list(db.playbooks.find({"username": username}).sort("created_at", -1))
    except PyMongoError as error:
        raise HTTPException(status_code=500, detail="Database error") from error

    for playbook in playbooks:
        playbook["_id"] = str(playbook["_id"])
        if "created_at" in playbook and isinstance(playbook["created_at"], datetime):
            playbook["created_at"] = playbook["created_at"].isoformat()

    return {"playbooks": playbooks}

@app.post("/posts")
def create_post(post: PostRequest):
    db = get_db()
    post_data = post.model_dump()
    post_data["rating"] = post_data.get("rating", 0)
    post_data["created_at"] = datetime.now(timezone.utc)

    try:
        result = db.posts.insert_one(post_data)
    except PyMongoError as error:
        raise HTTPException(status_code=500, detail="Database error") from error

    post_data["_id"] = str(result.inserted_id)
    if isinstance(post_data["created_at"], datetime):
        post_data["created_at"] = post_data["created_at"].isoformat()

    return {"message": "Post created successfully", "post": post_data}

@app.get("/posts")
def get_posts():
    db = get_db()
    try:
        posts = list(db.posts.find().sort("created_at", -1))
    except PyMongoError as error:
        raise HTTPException(status_code=500, detail="Database error") from error

    for post in posts:
        post["_id"] = str(post["_id"])
        if "created_at" in post and isinstance(post["created_at"], datetime):
            post["created_at"] = post["created_at"].isoformat()

    return {"posts": posts}

@app.post("/posts/{id}/upvote")
def upvote_post(id: str):
    db = get_db()
    try:
        post_id = ObjectId(id)
    except InvalidId as error:
        raise HTTPException(status_code=400, detail="Invalid post id") from error

    try:
        result = db.posts.update_one({"_id": post_id}, {"$inc": {"rating": 1}})
    except PyMongoError as error:
        raise HTTPException(status_code=500, detail="Database error") from error

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")

    return {"message": "Post upvoted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)