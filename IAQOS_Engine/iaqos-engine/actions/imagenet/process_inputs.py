import configparser
import sys
import os
from PIL import Image
from glob import glob
import filecmp
from filecmp import dircmp

config = configparser.ConfigParser()
config.read('../../configuration.ini')

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

size = imagedimension , imagedimension

input_dir = "../../domains/{}/IMAGES".format( domain )
data_dir = "../../domains/{}/IMAGES_PROCESSED".format( domain )

if not os.path.exists( data_dir ):
	os.mkdir( data_dir )	

inputdirfiles = glob( "{}/*.*".format( input_dir ) )
datadirfiles = glob( "{}/*.*".format( data_dir ) )

dc = dircmp(input_dir,data_dir)
inputfiles = dc.left_only

n = 0

for file in inputfiles:
	outfile = "{}/{}".format( data_dir , os.path.basename(file) )
	infile = "{}/{}".format( input_dir , os.path.basename(file) )
	im = Image.open(infile)
	im.save(outfile, "JPEG")
	n = n + 1
