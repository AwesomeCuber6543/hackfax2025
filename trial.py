# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client

# Set environment variables for your credentials
# Read more at http://twil.io/secure

account_sid = "AC5cdae1a55f417a301367519fcf8bbd5a"
auth_token = "47ee8629ede380e57febcfd9a416c2ba"
client = Client(account_sid, auth_token)

call = client.calls.create(
  url="http://demo.twilio.com/docs/voice.xml",
  to="+14436761199",
  from_="+18335735835"
)

print(call.sid)