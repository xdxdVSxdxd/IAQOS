import mysql.connector
import configparser
import sys
import os
from pprint import pprint 

stepstoperform = 10

config = configparser.ConfigParser()
config.read('configuration.ini')



mydb = mysql.connector.connect(
  host=config['default']['DB_HOST'].replace("\"",""),
  user=config['default']['DB_USER'].replace("\"",""),
  passwd=config['default']['DB_PWD'].replace("\"",""),
  database=config['default']['DB_NAME'].replace("\"",""),
  port=8889
)

def shellquote(s):
    return "'" + s.replace("'", "'\\''") + "'"

cursor = mydb.cursor()
cursor.execute("SELECT domain,action,param1,param2,lastupdated FROM domain_actions ORDER BY lastupdated ASC LIMIT 0,1")
result = cursor.fetchall()
for x in result:
	domain = shellquote(x[0])
	action = shellquote(x[1])
	param1 = shellquote(x[2])
	param2 = shellquote(x[3])

	command = "./process_actions.sh {} {} {} {}".format(  action , domain, param1, param2  );

	print( command )

	# e alla fine
	sql = "UPDATE domain_actions SET lastupdated=NOW() WHERE domain = %s"
	val = [ x[0] ]
	cursor2 = mydb.cursor()
	cursor2.execute(sql,val)
	mydb.commit()

mydb.close();

