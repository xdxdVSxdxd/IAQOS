import configparser
import sys
import os
from PIL import Image
from glob import glob
import filecmp
from filecmp import dircmp

config = configparser.ConfigParser()
config.read('../../configuration.ini')

styleimageurl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/800px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg"
imagemaxdimension = 500
domain = "test-domain"

if(len(sys.argv)>=4):
	domain = sys.argv[1]
	styleimageurl = sys.argv[2]
	imagemaxdimension = int(float(sys.argv[3]))
else:
	print("USAGE: python3 ./running.py [domain] [URL of image to be used as style] [max image size]")
	sys.exit()

size = imagemaxdimension , imagemaxdimension

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
	im.thumbnail(size)
	im.save(outfile, "JPEG")
	n = n + 1
