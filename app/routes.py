from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

### APIs
@app.route('/hourly_data')
def hourly_data():

    filename = 'https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Accident.csv'
    fatal = pd.read_csv(filename, sep=',')
    
    fatal_hour = fatal[['Hour_of_Accident','Fatal_Casualties', 'Total_Number_of_Casualties']]
    fatal_hour = fatal_hour.groupby('Hour_of_Accident').agg('sum')
    fatal_hour = fatal_hour.reset_index()

    fatal_hour_json = fatal_hour.to_json(orient='records')

    return fatal_hour_json

@app.route('/monthly_data')
def monthly_data():

    filename = 'https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Accident.csv'
    fatal = pd.read_csv(filename, sep=',')

    fatal_month = fatal[['Month_of_Accident','Fatal_Casualties', 'Total_Number_of_Casualties']]
    fatal_month = fatal_month.groupby('Month_of_Accident').agg('sum')
    fatal_month = fatal_month.reset_index()
    
    fatal_month_json = fatal_month.to_dict(orient='records')

    return jsonify(fatal_month_json)

### Templates
@app.route('/')
@app.route('/introduction')
def introduction():
    return render_template("introduction.html", title = "Great Britian Fatal Accidents")

@app.route('/trends')
def trends():
    return render_template("trends.html", title = "Monthly and Hourly Trends")

@app.route('/type')
def age_fatality_type():
	return render_template("type.html", title = "Age and Fatality Casualty Types")

if __name__ == '__main__':
    app.run(debug=True)
