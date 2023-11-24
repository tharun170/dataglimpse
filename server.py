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

app = Flask(__name__)
CORS(app)

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












