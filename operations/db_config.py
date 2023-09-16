import mysql.connector

"""
Instantiates a global database connection
TODO: Implement error handling
TODO: Paths needs to be updated for production
"""
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    database="statemint"
)

mycursor = mydb.cursor()
