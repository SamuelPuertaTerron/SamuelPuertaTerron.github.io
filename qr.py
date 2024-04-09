import qrcode
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("F:/Research Work/Projects/QRCodeGeneratopr/rt-financial-lit-firebase-adminsdk-cqprx-3b2c35b503.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

doc_ref = db.collection("users").document("Dave")  # Assuming "Dave" is the document ID
doc_ref.set({"Name": "Dave", "Score": "0"})

# URL to your web page (replace with your actual URL)
web_url = "https://samuelpuertaterron.github.io/"

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

# Now let's generate the HTML code with the QR code embedded
html_code = f"""
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <p>Signed in as Dave</p>
    <img src="example_qr_code.png" alt="QR Code">
    <link rel="stylesheet" href="https://pyscript.net/releases/2024.1.1/core.css" />
    <script type="module" src="https://pyscript.net/releases/2024.1.1/core.js"></script>
</body>

</html>
"""

# Write the HTML code to a file
with open("index.html", "w") as file:
    file.write(html_code)
