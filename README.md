![image](https://github.com/user-attachments/assets/11d46f17-8e46-44b6-b52c-6fdcc4bdf04c)

# Cucumber Smart Farm:
## An Internet of Things (IoT) project
### _A Hanoi University & Kosen Highschool IoT 2024 Project_


#### Author: Quang Huy, Trần Nam Sơn, Ayumu???

Check out the summarize video [here](https://drive.google.com/file/d/17wveAPD-P5UhWxB83sp1jmsj6D-eo9nN/view?usp=sharing)

## 1. Abstract
This one-month project aims to integrate advanced technology into agriculture and personal farming. The objective is to provide cost-effective and professional tools to farmers lacking technical knowledge or to individuals with limited agricultural experience. The project focuses on agility and cost-efficiency, utilizing readily available resources to achieve this goal.

## 2. Introduction
The project was initially conceived by Ayumu, a Kosen High School student in his second year. Early attempts were quite basic, employing ESP32 gadgets to **control items and manually retrieve data**. Before coming to Vietnam, Ayumu could only manage these tasks through his code. In mid-September 2024, as part of an exchange program, Ayumu's school sent him to Hanoi University for one month to further develop his project.

Under the mentorship of T. Quang Huy, and with the addition of Sơn to the team, significant advancements were made. By the end of the exchange program, the team successfully developed a **front-end web application capable of controlling the system, retrieving real-time data and images, and displaying graphs from past to present**. Furthermore, the **back-end structure and code were improved and streamlined, allowing for comprehensive control of all components while leaving room for future project scaling.** <br/><br/>⚠️ ***WARNING***: The current codes are for software, no hardware codes have been committed.

## 3. Methods - Project Requirements:

This section outlines the comprehensive structure and the overall setup steps required for the project. Detailed methodologies and intricate procedures will be thoroughly discussed in the following section.
### Requirements:
* C Language ( control ESP32 )
* Python 3.0 ( control app )
* HTML-CSS-JS
* Firebase
* MongoDB Atlas
* Flask
* ESP32 Sensors (temperature, humidity, light levels and soil moisture)
* LED ??
* Pump ??
* A Cucumber plant

<br/>
<details>
<summary><strong style="font-size: 17px;">Setup the project's hardware ( UNFINISHED )</strong></summary>
<br>

    1. Set up Arduino IDE
    2. (Still unfinished)

</details>

<br/>
<details>
<summary><strong style="font-size: 17px;">Setup the project's software</strong></summary>
<br>

    1. Install Visual Studio Code
    2. Set up a MongoDB Atlas Account
    3. Set up a Firebase Account
    4. Download the code
    4.1. Set up codes which will be listed in the following section.
    5. Install required packages & libraries
    6. Run Arduino IDE ( for back-end )
    7. Run the flask app in Visual Studio Code ( for front-end )

</details>
<br/>

## 4. Implementation details
This section provide clear understand about what you must do for the project to work. A lot of codes' templates which haved been ignored due to privacy reasons will be listed here with proper guidance.

<details>
<summary><strong style="font-size: 15px;">Firebase data structure</strong></summary>
<br>

This is how your json file you exported from real-time database from firebase, should look like:

``` bash
{
  "Data": {
    "BH1750": {
      "lux": -2
    },
    "DHT11": {
      "humidity": 26,
      "temperature": 25.4
    },
    "Moisture_sensor": {
      "sensor_1": 562,
      "sensor_2": 406,
      "sensor_3": 0,
      "sensor_4": 0,
      "sensor_Average": -24
    },
    "ledAuto": true,
    "manualLed": false,
    "manualWater": false,
    "waterAuto": false
  }
}
```
</details>
<br/>
<details>
<summary><strong style="font-size: 15px;">flaskapp/__init__.py</strong></summary>
<br>

```bash
from flask import Flask
import os
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json'))
firebase_admin.initialize_app(cred, {
    'databaseURL': 'YOUR_REAL_TIME_URL_firebasedatabase.app',
    'storageBucket': 'YOUR_PROJECT_NAME.appspot.com'
})

app = Flask(__name__)
app.secret_key = os.urandom(12)

from flaskapp import routes
```
</details>

<br/>
<details>
<summary><strong style="font-size: 15px;">flaskapp/serviceAccountKey.json</strong></summary>
<br>
This can be downloaded from your Firebase Settings, it looks like this:
<br>

```bash
{
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": "",
  "universe_domain": ""
}
```
</details>

<br/>
<details>
<summary><strong style="font-size: 15px;">flaskapp/routes.py</strong></summary>
<br>
- Copy this code and fill in 
- Put in YOUR OWN 'MONGO_URI', 'database', 'collection' around line 116:
<br>

```bash
from flask import render_template, request, jsonify, flash
import sys
import os
import json
import firebase_admin
from firebase_admin import db, storage
from flaskapp import app
from pymongo import MongoClient
from datetime import timedelta

# Load the Firebase service account JSON file
def load_service_account():
    with open('flaskapp/serviceAccountKey.json') as f:  # Update this path
        return json.load(f)

# pages
@app.route("/")
@app.route('/dashboard')
def dashboard():
    # Reference to the sensor data in Firebase
    ref = db.reference('sensor_data')
    sensor_data = ref.get()

    # Pass the data to your template
    return render_template('dashboard.html', data=sensor_data, title='Dashboard')

@app.route("/graph")
def graph():
    return render_template('graph.html', title='Graph', active='graph')

# api routes for new data source or removed if unneeded
@app.route("/api/getData", methods=['POST', 'GET'])
def api_getData():
    if request.method == 'POST':
        try:
            # Replace with logic to get data from the new data source
            data = {"example_key": "example_value"}
            return jsonify(data)
        except:
            print(sys.exc_info()[0])
            print(sys.exc_info()[1])
            return None

@app.route("/api/getChartData", methods=['POST', 'GET'])
def api_getChartData():
    if request.method == 'POST':
        try:
            # Replace with new chart data logic
            data = {"chart_data": [1, 2, 3, 4, 5]}
            return jsonify(data)
        except:
            print(sys.exc_info()[0])
            print(sys.exc_info()[1])
            return None

@app.route("/api/status", methods=['GET', 'POST'])
def status():
    try:
        # Replace with new status logic if needed
        data = {"status": "active"}
        return jsonify(data)
    except:
        print(sys.exc_info()[0])
        print(sys.exc_info()[1])
        return None

@app.route("/fetch_sensor_data_page")
def fetch_sensor_data_page():
    return render_template('fetch_sensor_data.html', title='Fetch Sensor Data')

# API route to fetch sensor data from Firebase
@app.route("/api/fetch_sensor_data", methods=['GET'])
def fetch_sensor_data():
    try:
        # Reference to the sensor data in Firebase
        ref = db.reference('Data')
        sensor_data = ref.get()

        if sensor_data is None:
            return jsonify({"error": "No sensor data found"}), 404
        
        # Check what data is being fetched
        print("Fetched sensor data:", sensor_data)  # Debug line

         # Extract temperature
        # temperature = sensor_data.get('temperature')

        # Debugging: print the temperature
        # print("Temperature:", temperature)

        # Return the temperature along with the full sensor data
        # return jsonify(temperature)
        return jsonify(sensor_data)
    except Exception as e:
        print(f"Error fetching sensor data: {e}")
        return jsonify({"error": "Failed to fetch sensor data"}), 500

# Render live_img page
@app.route("/live_image")
def live_image():
    return render_template('live_image.html', title='Live Image', active='live-image')

# API route to get the image URL from Firebase storage
@app.route('/api/get_live_image', methods=['GET'])
def get_live_image():
    try:
        bucket = storage.bucket()
        # your_mongo_atlas_folder/photo
        blob = bucket.blob('image/photo.jpg')  # Update to the correct path of your image
        image_url = blob.generate_signed_url(timedelta(seconds=300))  # Generate a signed URL with a 5-minute expiry
        return jsonify({"image_url": image_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# MongoDB connection setup
client = MongoClient('YOUR_MONGO_URL', tls=True, tlsAllowInvalidCertificates=True )
mongodb = client['cucumberDB']  # Reference the correct database
collection = mongodb['storeData']  # Reference the correct collection

@app.route("/api/fetch_past_data", methods=['GET'])
def fetch_past_data():
    try:
        # Query MongoDB for all records
        past_data = list(collection.find())

        # Check if any data was found
        if not past_data:
            return jsonify({"error": "No past data found"}), 404

        # Convert ObjectId to string and format the data
        formatted_data = []
        for data in past_data:
            record = {
                "id": str(data["_id"]),  # Convert ObjectId to string
                "timestamp": data["timestamp"],
                "data": data["data"]
            }
            formatted_data.append(record)

        # Print the fetched data to the terminal
        print("Fetched past data:")
        for data in formatted_data:
            print(data)

        # Return the formatted data as a JSON response
        return jsonify(formatted_data)

    except Exception as e:
        print(f"Error fetching past data: {e}")
        return jsonify({"error": f"Failed to fetch past data due to {e}"}), 500

@app.route("/api/store_sensor_data", methods=['POST'])
def store_sensor_data():
    sensor_data = request.json.get('data')
    
    # Store sensor data in Firebase
    ref = db.reference(f'sensor_data/')
    ref.push(sensor_data)

    return jsonify({"status": "Success"}), 200

@app.route("/api/update_water_auto", methods=['POST'])
def update_water_auto():
    try:
        # Get the new waterAuto status from the request
        water_auto_status = request.json.get('waterAuto')

        if water_auto_status is None:
            return jsonify({"error": "Invalid waterAuto status"}), 400

        # Update the waterAuto status in Firebase
        ref = db.reference('Data/waterAuto')
        ref.set(water_auto_status)

        return jsonify({"status": "Success", "waterAuto": water_auto_status}), 200
    except Exception as e:
        print(f"Error updating waterAuto: {e}")
        return jsonify({"error": "Failed to update waterAuto"}), 500

@app.route("/api/update_water_manual", methods=['POST'])
def update_water_manual():
    try:
        # Get the new waterManual status from the request
        water_manual_status = request.json.get('manualWater')

        if water_manual_status is None:
            return jsonify({"error": "Invalid manualWater status"}), 400

        # Update the manualWater status in Firebase
        ref = db.reference('Data/manualWater')
        ref.set(water_manual_status)

        return jsonify({"status": "Success", "manualWater": water_manual_status}), 200
    except Exception as e:
        print(f"Error updating manualWater: {e}")
        return jsonify({"error": "Failed to update manualWater"}), 500

@app.route("/api/update_led_auto", methods=['POST'])
def update_led_auto():
    try:
        # Get the new ledAuto status from the request
        light_auto_status = request.json.get('ledAuto')

        if light_auto_status is None:
            return jsonify({"error": "Invalid ledAuto status"}), 400

        # Update the ledAuto status in Firebase
        ref = db.reference('Data/ledAuto')
        ref.set(light_auto_status)

        return jsonify({"status": "Success", "ledAuto": light_auto_status}), 200
    except Exception as e:
        print(f"Error updating ledAuto: {e}")
        return jsonify({"error": "Failed to update ledAuto"}), 500

@app.route("/api/update_led_manual", methods=['POST'])
def update_led_manual():
    try:
        # Get the new manualLed status from the request
        led_manual_status = request.json.get('manualLed')

        if led_manual_status is None:
            return jsonify({"error": "Invalid manualLed status"}), 400

        # Update the manualLed status in Firebase
        ref = db.reference('Data/manualLed')
        ref.set(led_manual_status)

        return jsonify({"status": "Success", "manualLed": led_manual_status}), 200
    except Exception as e:
        print(f"Error updating manualLed: {e}")
        return jsonify({"error": "Failed to update manualLed"}), 500


@app.route("/api/firebase-config", methods=['GET'])
def firebase_config():
    try:
        service_account_data = load_service_account()
        return jsonify(service_account_data)
    except Exception as e:
        print(f"Error loading Firebase config: {e}")
        return jsonify({"error": "Failed to load Firebase config"}), 500
```
</details>

<br/>
<details>
<summary><strong style="font-size: 15px;">DELETE 'firebase-functions' Folder ( OPTIONAL )</strong></summary>
<br>

```
⚠️ The existing code has been deprecated and serves no functional purpose in the current setup. Initially, it was designed to capture real-time data every 24 hours and store it in a static database within Firebase for past record-keeping, independent of server activity and is still able to run even if hosts aren't available. However, deploying this feature requires an upgrade from the free Firebase plan to the Pay-as-You-Go plan, which was deemed unsuitable for the project. 
```
</details>

<br/>
<details>
<summary><strong style="font-size: 15px;">DELETE 'mongo-firebase-sync' Folder ( OPTIONAL )</strong></summary>
<br>
This folder contains scripts for data injection purposes by retrieving information from Firebase and sending to Mongo, primarily used to verify the connection to MongoDB Atlas. Occasionally, we use this folder to send test data to the database to ensure the MongoDB Atlas connection is functioning correctly.

Re-run this to verify if you can upload to the database. However, in this project we won't be POSTING any data, as this will be done on the back-end side, where ESP32 will send directly to the database

```bash
node uploadToMongo.js
```

CREATE & double-click on ***mongo-firebase-sync/runUploadToMongo.bat***:

```bash
@echo off
cd /d "path-to-your-mongo-firebase-sync-folder"
node uploadToMongo.js
```
</details>


## Images 📷
Final set up:



#### Web page
Dashboard:
![image](https://github.com/user-attachments/assets/2e19062a-0523-4384-a4c2-9f5ef16fa941)

Real-time Graph:
![image](https://github.com/user-attachments/assets/7b64e170-a98b-436b-82ae-a4994251623b)

Past records Graph:
![image](https://github.com/user-attachments/assets/d0955931-461b-47e1-8d97-d64357d69603)

Live View:
![image](https://github.com/user-attachments/assets/46a18a04-6164-46d9-97e5-7d7b4aceb453)





