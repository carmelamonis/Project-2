import psycopg2
from sqlalchemy import create_engine
from flask import Flask, render_template
from config import db_user, db_password, db_host, db_port, db_name

# Database setup
engine = create_engine(f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}')

# Create an instance of Flask
app = Flask(__name__)

# Route to index.html template
@app.route("/")
def index():
    # Return index template
    return render_template("index.html")

@app.route("/api/shooting_data")
def shooting_data():
    # connect to our database
    conn = engine.connect()
    # query our database
    results_df = pd.read_sql('SELECT * FROM TABLE_NAME', conn)
    # convert results to json # orient = 'records' get an dictonary/object for each row of dataframe
    results_json = results_df.to_json(orient='records') 
    # close our database connection
    conn.close()
    # result resuls to the endpoint
    return results_json

# Route that will trigger the heatmap
@app.route("/map")
def map():
    # Direct to map.html
    return render_template("map.html")

# Route that will trigger the axes chart
@app.route("/axes")
def axes():
    # Direct to bubble.html
    return render_template("axes.html")

# Route that will trigger the data table
@app.route("/data")
def data():
    # Direct to data.html
    return render_template("data.html")

if __name__ == "__main__":
    app.run(debug=True)