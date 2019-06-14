import configparser
import sys
import os
import json
import filecmp
from filecmp import dircmp

from keras.applications.resnet50 import ResNet50
from keras.preprocessing import image
from keras.applications.resnet50 import preprocess_input, decode_predictions
import numpy as np

from pprint import pprint 

import os
from glob import glob
import numpy as np
from matplotlib import pyplot

config = configparser.ConfigParser()
config.read('../../configuration.ini')
# print(config.sections())

imagedimension = 204
filterinitialdimension = 48
domain = "test-domain"

if(len(sys.argv)>=4):
	domain = sys.argv[1]
	imagedimension = int(float(sys.argv[3]))
	# filterinitialdimension = int(float(sys.argv[2]))
else:
	print("USAGE: python3 ./running.py [domain] [filter dimension] [image dimension]")
	sys.exit()

data_dir = "../../domains/{}/IMAGES_PROCESSED".format( domain )
output_dir = "../../domains/{}/OUTPUTS".format( domain )

if not os.path.exists( data_dir ):
	os.mkdir( data_dir )

if not os.path.exists( output_dir ):
	os.mkdir( output_dir )

# dc = dircmp(data_dir,output_dir)
# inputfiles = dc.left_only

outputdirfiles = glob( "{}/*.*".format( output_dir ) )
datadirfiles = glob( "{}/*.*".format( data_dir ) )

for i in range(0,len(datadirfiles)):
	datadirfiles[i] = datadirfiles[i] + ".json"
	datadirfiles[i] = datadirfiles[i].replace("IMAGES_PROCESSED","OUTPUTS")

main_list = np.setdiff1d(datadirfiles,outputdirfiles)

# ------ main

model = ResNet50(weights='imagenet')

# dataset = glob( "{}/*.*".format( data_dir ) )
for im in main_list:
	pprint( im )
	# img = image.load_img(  "{}/{}".format( data_dir ,im ) , target_size=(224, 224))
	im = im.replace(".json","")
	im = im.replace("OUTPUTS","IMAGES_PROCESSED")
	img = image.load_img(  im  , target_size=(224, 224))
	x = image.img_to_array(img)
	x = np.expand_dims(x, axis=0)
	x = preprocess_input(x)

	preds = model.predict(x)
	# decode the results into a list of tuples (class, description, probability)
	# (one such list for each sample in the batch)
	# print(preds)
	decoded = decode_predictions(preds, top=3)[0]
	results = []
	for dec in decoded:
		if dec[2]>0.1:
			r = [  dec[1] , str(dec[2]) ]
			results.append( r )
	json_results = json.dumps( results )
	pprint(json_results)

	file_path =  "{}/{}.json".format(output_dir, os.path.basename(im))

	file_object = open(file_path, 'w')
	file_object.write( json_results )
	file_object.close()



