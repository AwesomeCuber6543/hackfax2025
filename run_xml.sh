uvicorn xmlstuff:app --reload --host 0.0.0.0 --port 5002
ngrok http 5002

# get ngrok url by grepping the output of ngrok
ngrok_url=$(ngrok http 5002 | grep -oP 'https://\K[^ ]+')
echo "Ngrok URL: $ngrok_url"

# update the xml file with the ngrok url
# sed -i "s|wss://your-ngrok-url/media|$ngrok_url/media|" xmlstuff.py
