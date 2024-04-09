import qrcode
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("rt-financial-lit-firebase-adminsdk-cqprx-3b2c35b503.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

doc_ref = db.collection("users").document("Dave")  # Assuming "Dave" is the document ID
doc_ref.set({"Name": "Dave", "Score": "0"})

# URL to your web page (replace with your actual URL)
web_url = "http://127.0.0.1:5500/index.html"

# Data to encode in the QR code (concatenate Firebase document ID to the URL)
data = f"{web_url}?collection=users&document=Dave"

# Create QR code instance
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

# Add data to the QR code
qr.add_data(data)
qr.make(fit=True)

# Create an image from the QR code
img = qr.make_image(fill_color="black", back_color="white")

# Save the image
img.save("example_qr_code.png")
