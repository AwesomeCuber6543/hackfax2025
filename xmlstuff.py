from fastapi import FastAPI
from fastapi.responses import Response

app = FastAPI()

@app.post("/voice")
async def voice():
    twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Start>
        <Stream url="wss://your-ngrok-url/media" />
    </Start>
    <Dial>+1YOURPHONENUMBER</Dial>
</Response>"""
    return Response(content=twiml, media_type="application/xml")
