import os
import cloudinary
import cloudinary.uploader

from dotenv import load_dotenv


cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_resume_to_cloudinary(file_path: str):
    result = cloudinary.uploader.upload(
        file=file_path,
        resource_type="raw",
        folder="ai-recruitment/resumes",
    )

    print("Cloudinary Upload Result:")
    print(result)

    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }


def delete_resume(public_id: str):

    if public_id:
        cloudinary.uploader.destroy(
            public_id,
            resource_type="raw",
        )


def generate_resume_url(public_id: str):
    return cloudinary.utils.cloudinary_url(
        public_id, resource_type="raw", sign_url=True
    )[0]



def generate_signed_resume_url(public_id: str):
    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        resource_type="raw",
        sign_url=True,
    )
    return url
