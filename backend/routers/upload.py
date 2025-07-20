import cloudinary
import cloudinary
import cloudinary.uploader
import cloudinary.api
import time
from fastapi import APIRouter
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(
    prefix='/upload',
    tags=['Upload']
)

cloudinary.config(
    cloud_name = os.getenv("CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_SECRET")
)

@router.get('/')
async def get_credential_cloudinary():
    timestamp = int(time.time())
    signature = cloudinary.utils.api_sign_request(
        {
            'timestamp': timestamp,
            'folder': "images"
        },
        cloudinary.config().api_secret
    )

    return {
        "timestamp": timestamp,
        "signature": signature,
        "api_key": cloudinary.config().api_key,
        "cloud_name": cloudinary.config().cloud_name
    }