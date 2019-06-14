from flask import Flask, render_template, jsonify
from flask_bootstrap import Bootstrap
import pandas as pd

app = Flask(__name__)
bootstrap = Bootstrap(app)

### APIs
@app.route('/hourlyTrendData')
def hourlyTrendData():

    filename = 'https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Accident.csv'
    fatal = pd.read_csv(filename, sep=',')   
    fatal_hour = fatal[['Hour_of_Accident','Fatal_Casualties', 'Total_Number_of_Casualties']]
    fatal_hour = fatal_hour.groupby('Hour_of_Accident').agg('sum')
    fatal_hour = fatal_hour.reset_index()
    fatal_hour = fatal_hour.rename(index=str, columns={"Hour_of_Accident": "hour"})
    fatal_hour = fatal_hour.rename(index=str, columns={"Fatal_Casualties": "fatalCasualties"})
    fatal_hour = fatal_hour.rename(index=str, columns={"Total_Number_of_Casualties": "totalCasualties"})
    fatal_hour_json = fatal_hour.to_json(orient='records')
    return fatal_hour_json

@app.route('/monthlyTrendData')
def monthlyTrendData():

    filename = 'https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Accident.csv'
    fatal = pd.read_csv(filename, sep=',')
    fatal_month = fatal[['Month_of_Accident','Fatal_Casualties', 'Total_Number_of_Casualties']]
    fatal_month = fatal_month.groupby('Month_of_Accident').agg('sum')
    fatal_month.insert(2, "month", [4,8,12,2,1,7,6,3,5,11,10,9], True) 
    fatal_month = fatal_month.reset_index()
    fatal_month = fatal_month.drop(["Month_of_Accident"], axis = 1)
    fatal_month = fatal_month.rename(index=str, columns={"Fatal_Casualties": "fatalCasualties"})
    fatal_month = fatal_month.rename(index=str, columns={"Total_Number_of_Casualties": "totalCasualties"})
    fatal_month = fatal_month.sort_values(by=['month'], ascending=True)
    fatal_month_json = fatal_month.to_json(orient='records')
    return fatal_month_json


@app.route('/fatalityTypeCount/<selection>')
def fatalityTypeCount(selection):
    filename = "https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Casualty.csv"
    fatal_type = pd.read_csv(filename, sep=',')
    fatal_type = fatal_type[['Fatal_Casualty_Type', 'Fatal_Accident_Index', 'Fatal_Casualty_Sex']]
    if (selection != "All"):
        fatal_type = fatal_type.loc[fatal_type['Fatal_Casualty_Sex'] == F'{selection}']
    fatal_type = fatal_type.groupby('Fatal_Casualty_Type').agg('count')
    fatal_type = fatal_type.rename(index=str, columns={"Fatal_Accident_Index": "count"})
    fatal_type = fatal_type.sort_values(by=['count'], ascending=False)
    fatal_type = fatal_type.reset_index()
    fatal_type = fatal_type[['Fatal_Casualty_Type', 'count']]
    fatal_type['Fatal_Casualty_Type'] = fatal_type.Fatal_Casualty_Type.astype(str)
    fatal_type = fatal_type.replace('_', ' ', regex=True)
    fatal_type = fatal_type.rename(index=str, columns={"Fatal_Casualty_Type": "fatalCasualtyType"})
    fatal_type = fatal_type.replace('Other Vehicle Occupant', 'Other Occupant')
    fatal_type = fatal_type.replace('Motor Cycle Passenger', 'Motorcycle Passenger')
    fatal_type = fatal_type.replace('Motor Cycle Rider', 'Motorcycle Rider')
    fatal_type_json = fatal_type.to_json(orient='records')

    return fatal_type_json

@app.route('/fatalCountAge/<selection>')
def fatalCountAge(selection):
    filename = "https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Casualty.csv"
    age = pd.read_csv(filename, sep=',')
    age = age[['Fatal_Accident_Index', 'Fatal_Casualty_Age', 'Fatal_Casualty_Sex']]
    if (selection != "All"):
        age = age.loc[age['Fatal_Casualty_Sex'] == F'{selection}']
    age = age.groupby('Fatal_Casualty_Age').agg('count')
    age = age.reset_index()
    age = age.rename(index=str, columns={"Fatal_Accident_Index": "count"})
    age = age.sort_values(by=['Fatal_Casualty_Age'], ascending=True)
    age.drop(age.tail(1).index,inplace=True)
    age = age[['Fatal_Casualty_Age', 'count']]
    age['Fatal_Casualty_Age'] = age.Fatal_Casualty_Age.astype(int)
    age = age.sort_values(by=['Fatal_Casualty_Age'], ascending=True)
    age = age.rename(index=str, columns={"Fatal_Casualty_Age": "age"})
    age_json = age.to_json(orient='records')

    return age_json

@app.route('/fatalTypeAge/<selection>')
def fatalTypeAge(selection):

    filename = "https://raw.githubusercontent.com/kdhartmann/Project1/master/Fatal%20Casualty.csv"
    fatal_age = pd.read_csv(filename, sep=',')
    fatal_age = fatal_age[['Fatal_Casualty_Type', 'Fatal_Casualty_Age', 'Fatal_Casualty_Sex']]
    if (selection != "All"):
        fatal_age = fatal_age.loc[fatal_age['Fatal_Casualty_Sex'] == F'{selection}']
    fatal_age1 = fatal_age.groupby(['Fatal_Casualty_Age', 'Fatal_Casualty_Type']).size().reset_index()
    fatal_age2 = fatal_age1.groupby('Fatal_Casualty_Age')[[0]].agg('max')
    fatal_age2 = fatal_age2.rename(columns={ fatal_age2.columns[-1]: "count" })
    fatal_age1 = fatal_age1.rename(columns={ fatal_age1.columns[-1]: "count" })
    fatal_merged = pd.merge(fatal_age2, fatal_age1,  how='left', left_on=['Fatal_Casualty_Age','count'], right_on = ['Fatal_Casualty_Age','count'])
    fatal_age = fatal_merged[['Fatal_Casualty_Age', 'Fatal_Casualty_Type']]
    fatal_age = fatal_age.sort_values(by=['Fatal_Casualty_Age'], ascending=True)
    fatal_age.drop(fatal_age.tail(1).index,inplace=True)
    fatal_age.drop(fatal_age.tail(1).index,inplace=True)
    fatal_age['Fatal_Casualty_Age'] = fatal_age.Fatal_Casualty_Age.astype(int)
    fatal_age = fatal_age.sort_values(by=['Fatal_Casualty_Age'], ascending=True)
    fatal_age = fatal_age.drop_duplicates(subset='Fatal_Casualty_Age', keep="last")
    fatal_age = fatal_age.replace('_', ' ', regex=True)
    fatal_age = fatal_age.rename(index=str, columns={"Fatal_Casualty_Age": "age"})
    fatal_age = fatal_age.rename(index=str, columns={"Fatal_Casualty_Type": "fatalCasualtyType"})
    fatal_age = fatal_age.replace('Other Vehicle Occupant', 'Other Occupant')
    fatal_age = fatal_age.replace('Motor Cycle', 'Motorcycle')
    fatal_age = fatal_age.replace('Motor Cycle Rider', 'Motorcycle Rider')
    fatal_age_json = fatal_age.to_json(orient='records')

    return fatal_age_json

### Templates
@app.route('/')
@app.route('/about')
def introduction():
    return render_template("about.html")

@app.route('/trends')
def trends():
    return render_template("trends.html")

@app.route('/type')
def type():
    return render_template("type.html")

if __name__ == '__main__':
    app.run(debug=True)
