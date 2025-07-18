from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging
from datetime import datetime

from ..lib.email import send_contact_email, send_contact_confirmation
from ..database import get_database

logger = logging.getLogger(__name__)

router = APIRouter(tags=["contact"])

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str
    organization: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None

@router.post("/")
async def submit_contact(contact_data: ContactRequest):
    """Submit a contact form message"""
    try:
        logger.info(f"Received contact form submission from {contact_data.email}")
        
        # Save to database (optional - for record keeping)
        try:
            db = get_database()
            contact_record = {
                "name": contact_data.name,
                "email": contact_data.email,
                "message": contact_data.message,
                "organization": contact_data.organization,
                "phone": contact_data.phone,
                "service": contact_data.service,
                "submitted_at": datetime.utcnow(),
                "status": "new"
            }
            await db.contact_messages.insert_one(contact_record)
            logger.info(f"Contact message saved to database for {contact_data.email}")
        except Exception as db_error:
            logger.warning(f"Failed to save contact message to database: {str(db_error)}")
            # Continue even if database save fails
        
        # Send email notification to admin
        try:
            await send_contact_email(contact_data.dict())
            logger.info(f"Contact notification email sent for {contact_data.email}")
        except Exception as email_error:
            logger.error(f"Failed to send contact notification email: {str(email_error)}")
            # Don't fail the request if email sending fails
        
        # Send confirmation email to user
        try:
            await send_contact_confirmation(contact_data.email, contact_data.name)
            logger.info(f"Contact confirmation email sent to {contact_data.email}")
        except Exception as email_error:
            logger.error(f"Failed to send contact confirmation email: {str(email_error)}")
            # Don't fail the request if email sending fails
        
        return {
            "message": "Contact form submitted successfully",
            "status": "success"
        }
        
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process contact form") 