import smtplib
import ssl
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.config import settings
from app.database import get_database
import logging

logger = logging.getLogger(__name__)

def generate_verification_code(length: int = 6) -> str:
    """Generate a random verification code"""
    return ''.join(random.choices(string.digits, k=length))

async def store_verification_code(email: str, code: str, expires_in_minutes: int = 15) -> bool:
    """Store verification code in database with expiration"""
    try:
        db = get_database()
        
        # Calculate expiration time
        expires_at = datetime.utcnow() + timedelta(minutes=expires_in_minutes)
        
        # Store or update verification code
        result = await db.email_verifications.update_one(
            {"email": email},
            {
                "$set": {
                    "code": code,
                    "expires_at": expires_at,
                    "created_at": datetime.utcnow(),
                    "used": False
                }
            },
            upsert=True
        )
        
        return result.acknowledged
    except Exception as e:
        logger.error(f"Error storing verification code: {str(e)}")
        return False

async def verify_code(email: str, code: str) -> bool:
    """Verify the email verification code"""
    try:
        db = get_database()
        
        # Find valid verification code
        verification = await db.email_verifications.find_one({
            "email": email,
            "code": code,
            "used": False,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        if not verification:
            return False
        
        # Mark code as used
        await db.email_verifications.update_one(
            {"_id": verification["_id"]},
            {"$set": {"used": True}}
        )
        
        return True
        
    except Exception as e:
        logger.error(f"Error verifying code: {str(e)}")
        return False

def send_verification_email(email: str, code: str) -> bool:
    """Send verification email with code"""
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Email Verification - BQI Tech"
        message["From"] = settings.from_email
        message["To"] = email
        
        # Create HTML content
        body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                        Email Verification
                    </h1>
                </div>
                
                <div style="padding: 40px 20px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Thank you for signing up with BQI Tech! Please use the verification code below to verify your email address:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 4px;">
                            {code}
                        </div>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                        This code will expire in 15 minutes. If you didn't request this verification, please ignore this email.
                    </p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        This email was sent by BQI Tech. If you have any questions, please contact us at {settings.hr_email}
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        message.attach(MIMEText(body, "html"))
        
        # Create secure connection and send email
        context = ssl.create_default_context()
        
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=context) as server:
            server.login(settings.smtp_user, settings.smtp_pass)
            text = message.as_string()
            server.sendmail(settings.from_email, email, text)
        
        logger.info(f"Verification email sent successfully to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send verification email to {email}: {str(e)}")
        return False

async def send_verification_code(email: str) -> Optional[str]:
    """Generate and send verification code to email"""
    try:
        # Generate verification code
        code = generate_verification_code()
        
        # Store in database
        stored = await store_verification_code(email, code)
        if not stored:
            logger.error("Failed to store verification code")
            return None
        
        # Send email
        sent = send_verification_email(email, code)
        if not sent:
            logger.error("Failed to send verification email")
            return None
        
        return code
        
    except Exception as e:
        logger.error(f"Error in send_verification_code: {str(e)}")
        return None

async def send_contact_email(contact_data: Dict) -> bool:
    """Send contact form notification email to admin"""
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"New Contact Form Submission - {contact_data.get('name', 'Unknown')}"
        message["From"] = settings.from_email
        message["To"] = settings.hr_email
        
        # Create HTML content
        body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                        New Contact Form Submission
                    </h1>
                </div>
                
                <div style="padding: 40px 20px;">
                    <h2 style="color: #374151; margin-bottom: 20px;">Contact Details</h2>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 10px 0;"><strong>Name:</strong> {contact_data.get('name', 'Not provided')}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> {contact_data.get('email', 'Not provided')}</p>
                        <p style="margin: 10px 0;"><strong>Organization:</strong> {contact_data.get('organization', 'Not provided')}</p>
                        <p style="margin: 10px 0;"><strong>Phone:</strong> {contact_data.get('phone', 'Not provided')}</p>
                        <p style="margin: 10px 0;"><strong>Service Interest:</strong> {contact_data.get('service', 'Not specified')}</p>
                    </div>
                    
                    <h3 style="color: #374151; margin-bottom: 15px;">Message</h3>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #14b8a6;">
                        <p style="margin: 0; line-height: 1.6; color: #374151;">
                            {contact_data.get('message', 'No message provided')}
                        </p>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        Submitted on: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        message.attach(MIMEText(body, "html"))
        
        # Create secure connection and send email
        context = ssl.create_default_context()
        
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=context) as server:
            server.login(settings.smtp_user, settings.smtp_pass)
            text = message.as_string()
            server.sendmail(settings.from_email, settings.hr_email, text)
        
        logger.info(f"Contact notification email sent successfully")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send contact notification email: {str(e)}")
        return False

async def send_contact_confirmation(email: str, name: str) -> bool:
    """Send contact form confirmation email to user"""
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Thank you for contacting BQI Tech"
        message["From"] = settings.from_email
        message["To"] = email
        
        # Create HTML content
        body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                        Thank You for Contacting Us!
                    </h1>
                </div>
                
                <div style="padding: 40px 20px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear {name},
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Thank you for reaching out to BQI Tech! We have received your message and appreciate your interest in our services.
                    </p>
                    
                    <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; border-left: 4px solid #14b8a6; margin: 30px 0;">
                        <p style="margin: 0; color: #374151; font-weight: 500;">
                            Our team will review your message and get back to you within 24-48 hours during business days.
                        </p>
                    </div>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        In the meantime, feel free to explore our services and learn more about how we can help your organization with IT consulting and software development.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://www.bqitech.com/services" 
                           style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Explore Our Services
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                        Best regards,<br>
                        The BQI Tech Team
                    </p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        BQI Tech - Strategic IT Consulting for Government Agencies<br>
                        Email: {settings.hr_email} | Website: www.bqitech.com
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        message.attach(MIMEText(body, "html"))
        
        # Create secure connection and send email
        context = ssl.create_default_context()
        
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=context) as server:
            server.login(settings.smtp_user, settings.smtp_pass)
            text = message.as_string()
            server.sendmail(settings.from_email, email, text)
        
        logger.info(f"Contact confirmation email sent successfully to {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send contact confirmation email to {email}: {str(e)}")
        return False 