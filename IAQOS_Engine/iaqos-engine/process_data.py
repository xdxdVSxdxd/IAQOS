import mysql.connector
import configparser
import sys
import os
from pprint import pprint 
import re
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize, PunktSentenceTokenizer
from nltk.tag import pos_tag
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
# import pattern.en as lemEng
# import pattern.it as lemIt
# import pattern.fr as lemFr
from nltk import FreqDist

config = configparser.ConfigParser()
config.read('configuration.ini')


def process_text(name,domain,t,mime,ext,idasset,typeasset,owner_name):
	if ext == "DATA":
		cursor = mydb.cursor(buffered=True)
		sql = "SELECT id, content,label FROM data_text WHERE id_asset = %s"
		val = [ idasset ]
		cursor.execute(sql,val)
		while True:
			row = cursor.fetchone()
			if row == None:
				break
			iddata = row[0]
			content = row[1]
			label = row[1]

			# ripulire dai caratteri non alfanumerici
			content = re.sub('[^0-9a-zA-Z]+', ' ', content)
			label = re.sub('[^0-9a-zA-Z]+', ' ', label)


			d = "{} {}".format(content,label)
			d = d.replace("."," ")

			print(d)

			# ripulire dalle stopwords

			sbEng = SnowballStemmer('english')
			sbIt = SnowballStemmer('italian')
			sbFr = SnowballStemmer('french')

			d = ' '.join([sbIt.stem(item) for item in (d).split(' ')])

			# dd = lemEng.parse(d, lemmata=True).split(' ')

			# pprint(dd)

			stopwordsen = set(stopwords.words('english'))
			stopwordsit = set(stopwords.words('italian'))
			stopwordsfr = set(stopwords.words('french'))


			words = word_tokenize(d)

			wordsFiltered = []

			for w in words:
				if w not in stopwordsit:
					wordsFiltered.append(w)

			# fare bag of words + recurrencies
			ItFreq = FreqDist(word for word in wordsFiltered)


			mostfrequent = ItFreq.most_common(20)
			# for word, frequency in ItFreq.most_common(10):
			#	print(u'{}: {}'.format(word, frequency))

			# pprint(wordsFiltered)


			for w1,f1 in mostfrequent:
				cc1 = mydb.cursor(buffered=True)
				sql1 = "SELECT id,weigth FROM TEXTS_graphs_nodes WHERE name = %s AND domain = %s LIMIT 0,1"
				val1 = [ w1 , domain ]
				idn1 = -1
				weight1 = f1
				cc1.execute(sql1,val1)
				rc1 = cc1.fetchall()
				for x in rc1:
					idn1 = int( x[0] )
					weight1 = weight1 + int(x[1])
				if idn1==-1:
					cc2 = mydb.cursor(buffered=True)
					sql2 = "INSERT INTO TEXTS_graphs_nodes(name,domain,weigth) VALUES( %s , %s , %s )"
					val2 = [ w1 , domain , f1 ]
					cc2.execute(sql2,val2)
					mydb.commit()
					idn1 = cc2.lastrowid
					weight1 = f1
					cc2.close()
				else:
					cc2 = mydb.cursor(buffered=True)
					sql2 = "UPDATE TEXTS_graphs_nodes SET weigth =  %s  WHERE id = %s"
					val2 = [ weight1 , idn1 ]
					cc2.execute(sql2,val2)
					mydb.commit()
					cc2.close()

			for i1 in range(0,len(mostfrequent)):
				w1,f1 = mostfrequent[i1]
				cc1 = mydb.cursor(buffered=True)
				sql1 = "SELECT id,weigth FROM TEXTS_graphs_nodes WHERE name = %s AND domain = %s LIMIT 0,1"
				val1 = [ w1 , domain ]
				idn1 = -1
				weight1 = f1
				cc1.execute(sql1,val1)
				rc1 = cc1.fetchall()
				for x in rc1:
					idn1 = int( x[0] )
					weight1 = weight1 + int(x[1])
				
				for i2 in range(i1+1,len(mostfrequent)):
					w2,f2 = mostfrequent[i2]
					if w1 != w2:
						cc3 = mydb.cursor(buffered=True)
						sql3 = "SELECT id,weigth FROM TEXTS_graphs_nodes WHERE name = %s AND domain = %s"
						val3 = [ w2 , domain ]
						idn2 = -1
						weight2 = f2
						cc3.execute(sql3,val3)
						rc3 = cc3.fetchall()
						for x in rc3:
							idn2= int( x[0] )
							weight2 = weight2 + int(x[1])
						# print("{} <--> {}".format(w1,w2))
						weighttot = f1 + f2
						cc4 = mydb.cursor(buffered=True)
						sql4 = "SELECT weight FROM TEXTS_graphs_links WHERE (id1 = %s AND id2 = %s ) OR (id1 = %s AND id2 = %s ) LIMIT 0,1"
						val4 = [ idn1 , idn2 , idn2, idn1 ]
						cc4.execute(sql4,val4)
						rc4 = cc4.fetchall()
						if len(rc4)>0:
							for rel in rc4:
								weighttot = weighttot + int(rel[0])
							# fare update
							cc5 = mydb.cursor(buffered=True)
							sql5 = "UPDATE TEXTS_graphs_links SET weight = %s WHERE (id1 = %s AND id2 = %s ) OR (id1 = %s AND id2 = %s )"
							val5 = [ weighttot, idn1 , idn2 , idn2, idn1 ]
							cc5.execute(sql5,val5)
							mydb.commit()
							cc5.close()
						else:
							# fare insert
							cc5 = mydb.cursor(buffered=True)
							sql5 = "INSERT INTO TEXTS_graphs_links(id1,id2,weight) VALUES( %s , %s , %s )"
							val5 = [ idn1 , idn2 , weighttot ]
							cc5.execute(sql5,val5)
							mydb.commit()
							cc5.close()
						cc4.close()
						


						cc3.close()

				cc1.close()
		cursor.close()


def process(name,domain,t,mime,ext,idasset,typeasset,owner_name):
	processed = False
	if typeasset == "TEXTS":
		process_text(name,domain,t,mime,ext,idasset,typeasset,owner_name)
		processed = True

	if processed:
		cc5 = mydb.cursor(buffered=True)
		sql5 = "UPDATE assets SET processed = 1 WHERE id = %s"
		val5 = [ idasset ]
		cc5.execute(sql5,val5)
		mydb.commit()
		cc5.close()



mydb = mysql.connector.connect(
	host=config['default']['DB_HOST'].replace("\"",""),
	user=config['default']['DB_USER'].replace("\"",""),
	passwd=config['default']['DB_PWD'].replace("\"",""),
	database=config['default']['DB_NAME'].replace("\"",""),
	port=8889
)

cursor = mydb.cursor(buffered=True)
cursor.execute("SELECT name, domain, t, mime, ext, id, type, owner_name FROM assets WHERE processed=0 ORDER BY t ASC")
while True:
	row = cursor.fetchone()
	if row == None:
		break
	# print(row)
	name = row[0]
	domain = row[1]
	t = row[2]
	mime = row[3]
	ext = row[4]
	idasset = row[5]
	typeasset = row[6]
	owner_name = row[7]
	process(name,domain,t,mime,ext,idasset,typeasset,owner_name)

mydb.close()
