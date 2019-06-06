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
    fatal_month.insert(2, "Month", [4,8,12,2,1,7,6,3,5,11,10,9], True) 
    fatal_month = fatal_month.reset_index()
    fatal_month = fatal_month.drop(["Month_of_Accident"], axis = 1)
    fatal_month = fatal_month.sort_values(by=['Month'], ascending=True)
    
    fatal_month_json = fatal_month.to_json(orient='records')

    return fatal_month_json

@app.route('/fatality_type')
def fatality_type():
    filename = "https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Casualty.csv"
    fatal_type = pd.read_csv(filename, sep=',')
    fatal_type = fatal_type[['Fatal_Casualty_Type', 'Fatal_Accident_Index']]
    fatal_type = fatal_type.groupby('Fatal_Casualty_Type').agg('count')
    fatal_type = fatal_type.rename(index=str, columns={"Fatal_Accident_Index": "Count"})
    fatal_type = fatal_type.sort_values(by=['Count'], ascending=False)
    fatal_type = fatal_type.reset_index()
    fatal_type['Fatal_Casualty_Type'] = fatal_type.Fatal_Casualty_Type.astype(str)
    fatal_type_json = fatal_type.to_json(orient='records')

    return fatal_type_json

@app.route('/age_fatal_count')
def age_fatal_count():
    filename = "https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Casualty.csv"
    age = pd.read_csv(filename, sep=',')
    age = age[['Fatal_Accident_Index', 'Fatal_Casualty_Age']]
    age = age.groupby('Fatal_Casualty_Age').agg('count')
    age = age.reset_index()
    age = age.rename(index=str, columns={"Fatal_Accident_Index": "Count"})
    age = age.sort_values(by=['Fatal_Casualty_Age'], ascending=True)
    age.drop(age.tail(1).index,inplace=True)
    age['Fatal_Casualty_Age'] = age.Fatal_Casualty_Age.astype(int)
    age = age.sort_values(by=['Fatal_Casualty_Age'], ascending=True)
    age_json = age.to_json(orient='records')

    return age_json

@app.route('/fatality_type_by_age')
def fatality_type_by_age():

    filename = "https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Casualty.csv"
    fatal_age = pd.read_csv(filename, sep=',')
    fatal_age = fatal_age[['Fatal_Casualty_Type', 'Fatal_Casualty_Age']]
    fatal_age = fatal_age.groupby('Fatal_Casualty_Age').agg('max')
    fatal_age = fatal_age.reset_index()
    fatal_age = fatal_age.sort_values(by=['Fatal_Casualty_Age'], ascending=True)
    fatal_age.drop(fatal_age.tail(1).index,inplace=True)
    fatal_age['Fatal_Casualty_Age'] = fatal_age.Fatal_Casualty_Age.astype(int)
    fatal_age = fatal_age.sort_values(by=['Fatal_Casualty_Age'], ascending=True)
    fatal_age_json = fatal_age.to_json(orient='records')

    return fatal_age_json


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
