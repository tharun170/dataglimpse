from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import chardet
import os
from werkzeug.utils import secure_filename
from dateutil.parser import parse
import re
import datefinder
import numpy as np
from pymongo import MongoClient
import traceback

app = Flask(__name__)
CORS(app)

try:
    client = MongoClient("your mongodb string")
    db = client["react-auth"]
    collection = db["authentication"]
    mongo_status = "Connected to MongoDB"
except Exception as e:
    mongo_status = f"Failed to connect to MongoDB: {str(e)}"

@app.route("/api/mongo_status", methods=["GET"])
def check_mongo_status():
    return jsonify({"status": mongo_status})

@app.route("/api/register", methods=["POST"])
def register_user():
    try:
        registration_data = request.get_json()
        # Insert registration data into the MongoDB collection
        collection.insert_one(registration_data)
        return jsonify({"message": "ok"})
    except Exception as e:
        traceback_str = traceback.format_exc()  # Get the traceback as a string
        return jsonify({"error": str(e), "traceback": traceback_str}), 500
    
@app.route("/api/get_users", methods=["GET"])
def get_users():
    try:
        # Fetch all documents from the collection
        users_data = list(collection.find({}, {"_id": 0}))

        # Return the data as JSON
        return jsonify({"users": users_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/authenticate", methods=["POST"])
def authenticate_user():
    try:
        login_data = request.get_json()
        print(login_data)
        user = collection.find_one({"email": login_data["email"], "password": login_data["password"]})
        if user:
            return jsonify({"message": "ok"})
        else:
            return jsonify({"error": "not ok"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/forgot_password_step1", methods=["POST"])
def handle1_submit():
    try:
        data = request.get_json()
        email = data.get("email")

        # Check if the email exists in the database
        user = collection.find_one({"email": email})

        if user:
            # Email is valid
            # You might want to send a response or a verification email here
            return jsonify({"message": "Email is valid"}), 200
        else:
            # Email is not found, return an error
            return jsonify({"error": "Invalid email"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for handling the submission of the new password
@app.route("/api/forgot_password_step2", methods=["POST"])
def handle2_submit():
    try:
        data = request.get_json()
        email = data.get("useremail")
        new_password = data.get("newPassword")

        # Update the password in the database
        result = collection.update_one({"email": email}, {"$set": {"password": new_password}})

        if result.modified_count > 0:
            # Password updated successfully
            return jsonify({"message": "Password updated successfully"}), 200
        else:
            # Password update failed, return an error
            return jsonify({"error": "Password update failed"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/google-signup', methods=['POST'])
def google_signup():
    try:
        data = request.get_json()
        email = data.get('email')
        userName = data.get('userName')
        

        # Check if the user already exists in the database
        existing_user = collection.find_one({'email': email})
        print(existing_user)
        if existing_user:
            return jsonify({'message': 'User already exists','status': 400}), 400
        else:
        # Insert the new user into MongoDB
            user_data = {'email': email, 'userName': userName}
            collection.insert_one(user_data)
            return jsonify({'message': 'Google sign-up successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/google-login', methods=['POST'])
def google_login():
    try:
        data = request.get_json()
        email = data.get('email')

        # Check if the user exists in the database
        existing_user = collection.find_one({'email': email})
        if existing_user:
            return jsonify({'message': 'Login successful'})
        else:
            return jsonify({'message': 'User not found', 'status': 404}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500    

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def detect_date_range(df):
    all_dates = []

    for col in df.columns:
        for value in df[col]:
            try:
                value = str(value)  # Ensure the value is a string
                matches = datefinder.find_dates(value)
                if matches:
                    all_dates.extend(matches)
            except Exception:
                continue
    
    if not all_dates:
        return None

    date_range = {
        "start_date": min(all_dates).strftime("%d-%m-%Y"),
        "end_date": max(all_dates).strftime("%d-%m-%Y")
    }

    return date_range

def detect_date_format(df):
    detectors = [
        datefinder.find_dates,
        # Add more detectors for other date formats here
    ]

    for col in df.columns:
        for value in df[col]:
            try:
                value = str(value)  # Ensure the value is a string
                for detector in detectors:
                    matches = detector(value)
                    if matches:
                        detected_date = next(matches)
                        detected_format = detected_date.strftime("%m-%d-%Y")  #Format as "dd-mm-yyyy"

                        # Add the detected date to the DataFrame
                        df[col] = df[col].apply(lambda x: detected_date if x == value else x)

                        return detected_format

            except Exception:
                continue
    
    return "No date column" 

def get_rows_with_null_values(df):
    rows_with_null = df[df.isnull().any(axis=1)]
    return rows_with_null.head(5).to_dict(orient='records')

@app.route('/upload_csv', methods=['POST']) 
def upload_csv():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"})

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"})

        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            with open(file_path, 'rb') as f:
                result = chardet.detect(f.read())
            detected_encoding = result['encoding']
            df = pd.read_csv(file_path, encoding=detected_encoding)
            df = df.replace(np.nan, None)

            date_format = detect_date_format(df)
            date_range=detect_date_range(df)

            shape = df.shape
            column_info = {col: str(dtype) for col, dtype in df.dtypes.items()}
            first_row = df.iloc[0].replace({pd.NA: None}).to_dict()
            last_row = df.iloc[-1].replace({pd.NA: None}).to_dict()
            null_values = df.isnull().sum().to_dict()
            predefinedList = ['decision_month', 'forecast_month', 'city/town']
            columns = df.columns.tolist()
            mismatchedCols = list(set(columns).difference(predefinedList))
            number_of_unmatched_columns = len(mismatchedCols)
            empty_rows = len(df[df.isnull().all(axis=1)])
            null_value_rows = df[df.isnull().any(axis=1)].head(5).replace({pd.NA: None}).to_dict(orient='records')

            # for col, value in null_values.items():
            #     if pd.isna(value):
            #         null_values[col] = None

            if empty_rows>0:
                flag=False
            else:
                flag=True

            rows=shape[1]
            columns=shape[0]

            response_data = {
                "flag":flag,
                "shape": shape,
                "rows":rows,
                "columns":columns,
                "column_info": column_info,
                "first_row": first_row,
                "last_row": last_row,
                "null_values": null_values,
                "number_of_unmatched_columns": number_of_unmatched_columns,
                "mismatched_columns": mismatchedCols,
                "empty_rows": empty_rows,
                "date_format": date_format,
                "date_range": date_range,
                "null_value_rows": null_value_rows, 
                "filename":filename,
                "mandatecolumns":predefinedList
            }
            

            return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)













