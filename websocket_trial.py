import base64
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
import re
import smtplib
from pydantic import BaseModel
from enum import Enum
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
logger = logging.getLogger("uvicorn.error")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/media")
async def media_stream(websocket: WebSocket):
    await websocket.accept()
    logger.info("WebSocket connection accepted")

    has_seen_media = False
    message_count = 0
    # print("HELLO")
    try:
        while True:
            message = await websocket.receive_text()
            # print("MESSAGE RECEIVED", message)
            data = json.loads(message)

            event_type = data.get("event")
            if event_type == "connected":
                logger.info("Connected message: %s", message)
            elif event_type == "start":
                logger.info("Start message: %s", message)
            elif event_type == "media":
                if not has_seen_media:
                    payload = data['media']['payload']
                    chunk = base64.b64decode(payload)
                    logger.info("First media chunk received: %d bytes", len(chunk))
                    # print("CHUNK RECEIVED", chunk)
                    logger.info("Suppressing additional media logs...")
                    has_seen_media = True
            elif event_type in {"stop", "closed"}:
                logger.info("Stream closed: %s", message)
                break

            message_count += 1

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected by client.")
    except Exception as e:
        logger.exception("Error during WebSocket communication: %s", str(e))
    finally:
        logger.info("Connection closed. Total messages: %d", message_count)

class EmailSummaryRequest(BaseModel):
    #user_email: str
    subject: str
    body: str

@app.post("/send_email")
def send_email(request: EmailSummaryRequest):

    gmail_user = "yahia.salman.04@gmail.com"
    gmail_pwd = "krxktexpgqvogjcw"
    
    # Connect to the Gmail SMTP server using SSL
    server_ssl = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server_ssl.ehlo()
    server_ssl.login(gmail_user, gmail_pwd)

    FROM = "AGILLAIRE SUPPORT <support@agillaire.com>"
    #TO = request.user_email
    TO = "salmanyahia04@gmail.com"

    #check if To email is valid
    #if not re.match(r"[^@]+@[^@]+\.[^@]+", request.user_email):
        #raise Exception("Invalid email")
    
    # Email message needs proper headers
    message = f"From: {FROM}\nTo: {TO}\nSubject: Call Received from {request.subject}\n\n{request.body}"

    # Send email properly formatted
    server_ssl.sendmail(FROM, [TO], message)
    server_ssl.quit()  # Always close the connection when done


db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="emergency_app",
    port=8889
)


class EmergencyPriority(Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    

class EmergencyRequest(BaseModel):
    priority: str
    message: str
    address: str
    name: str

@app.post("/add_emergency")
def add_emergency(request: EmergencyRequest):
    print(request)
    cursor = db.cursor()
    query = "INSERT INTO emergencies (priority, message, address, name) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (request.priority, request.message, request.address, request.name))
    db.commit()
    cursor.close()
    return {"message": "Emergency added successfully"}

@app.get("/get_emergencies")
def get_emergencies():
    cursor = db.cursor()
    query = "SELECT * FROM emergencies"
    cursor.execute(query)
    emergencies = cursor.fetchall()
    return {"emergencies": emergencies}
