import helper
from helper import imagedimension
from helper import filterinitialdimension
import configparser
import sys
import os

stepstoperform = 10

config = configparser.ConfigParser()
config.read('../../configuration.ini')
# print(config.sections())

imagedimension = 204
filterinitialdimension = 48
domain = "test-domain"

if(len(sys.argv)>=4):
	domain = sys.argv[1]
	imagedimension = int(float(sys.argv[3]))
	filterinitialdimension = int(float(sys.argv[2]))
else:
	print("USAGE: python3 ./running.py [domain] [filter dimension] [image dimension]")
	sys.exit()

batch_size = 1
z_dim = 100
learning_rate = 0.00025
beta1 = 0.45
sizebu = imagedimension

data_dir = "../../domains/{}/IMAGES_PROCESSED".format( domain )

epochs = 100

from pprint import pprint 

import os
from glob import glob
import numpy as np
from matplotlib import pyplot
show_n_images = 50


from distutils.version import LooseVersion
import warnings
import tensorflow as tf


assert LooseVersion(tf.__version__) >= LooseVersion('1.0'), 'Please use TensorFlow version 1.0 or newer.  You are using {}'.format(tf.__version__)
print('TensorFlow Version: {}'.format(tf.__version__))

# Check for a GPU
if not tf.test.gpu_device_name():
	warnings.warn('No GPU found. Please use a GPU to train your neural network.')
else:
	print('Default GPU Device: {}'.format(tf.test.gpu_device_name()))




def model_inputs(image_width, image_height, image_channels, z_dim):
	"""
	Create the model inputs
	:param image_width: The input image width
	:param image_height: The input image height
	:param image_channels: The number of image channels
	:param z_dim: The dimension of Z
	:return: Tuple of (tensor of real input images, tensor of z data, learning rate)
	"""
	
	real_input_images = tf.placeholder(tf.float32, [None, image_width, image_height, image_channels], 'real_input_images')
	input_z = tf.placeholder(tf.float32, [None, z_dim], 'input_z')
	learning_rate = tf.placeholder(tf.float32, [], 'learning_rate')
	return real_input_images, input_z, learning_rate

def discriminator(images, reuse=False, alpha=0.2, keep_prob=0.5):
	"""
	Create the discriminator network
	:param images: Tensor of input image(s)
	:param reuse: Boolean if the weights should be reused
	:return: Tuple of (tensor output of the discriminator, tensor logits of the discriminator)
	"""
	# TODO: Implement Function
	with tf.variable_scope('discriminator', reuse=reuse):
		# Input layer is 28x28xn
		# Convolutional layer, 14x14x64
		conv1 = tf.layers.conv2d(images, 64, 5, 2, padding='same', kernel_initializer=tf.contrib.layers.xavier_initializer())

		# print("[discriminator:conv1]")
		# pprint(conv1)
		

		lrelu1 = tf.maximum(alpha * conv1, conv1)
		
		# print("[discriminator:lrelu1]")
		# pprint(lrelu1)

		drop1 = tf.layers.dropout(lrelu1, keep_prob)
		
		# print("[discriminator:drop1]")
		# pprint(drop1)

		
		# Strided convolutional layer, 7x7x128
		conv2 = tf.layers.conv2d(drop1, 128, 5, 2, 'same', use_bias=False)
		

		# print("[discriminator:conv2]")
		# pprint(conv2)

		

		bn2 = tf.layers.batch_normalization(conv2)
		

		# print("[discriminator:bn2]")
		# pprint(bn2)

		

		lrelu2 = tf.maximum(alpha * bn2, bn2)
		

		# print("[discriminator:lrelu2]")
		# pprint(lrelu2)

		

		drop2 = tf.layers.dropout(lrelu2, keep_prob)
		
		# print("[discriminator:drop2]")
		# pprint(drop2)

		
		# Strided convolutional layer, 4x4x256
		conv3 = tf.layers.conv2d(drop2, 256, 5, 2, 'same', use_bias=False)
		
		# print("[discriminator:conv3]")
		# pprint(conv3)

		bn3 = tf.layers.batch_normalization(conv3)
		
		# print("[discriminator:bn3]")
		# pprint(bn3)

		lrelu3 = tf.maximum(alpha * bn3, bn3)
		
		# print("[discriminator:lrelu3]")
		# pprint(lrelu3)

		drop3 = tf.layers.dropout(lrelu3, keep_prob)
		
		# print("[discriminator:drop3]")
		# pprint(drop3)

		# fully connected
		flat = tf.reshape(drop3, (-1, ( round(imagedimension/2/2/2) )*( round(imagedimension/2/2/2) )*256))
		
		# print("[discriminator:flat]")
		# pprint(flat)

		logits = tf.layers.dense(flat, 1)
		
		# print("[discriminator:logits]")
		# pprint(logits)

		out = tf.sigmoid(logits)
		
		# print("[discriminator:out]")
		# pprint(out)

		


		return out, logits

def generator(z, out_channel_dim, is_train=True, alpha=0.2, keep_prob=0.5):
	"""
	Create the generator network
	:param z: Input z
	:param out_channel_dim: The number of channels in the output image
	:param is_train: Boolean if generator is being used for training
	:return: The tensor output of the generator
	"""
	# TODO: Implement Function
	with tf.variable_scope('generator', reuse=(not is_train)):
		# First fully connected layer, 4x4x1024
		round(imagedimension/2/2/2)
		fc = tf.layers.dense(z, filterinitialdimension*filterinitialdimension*1024, use_bias=False)
		# print("[generator:fc]")
		# pprint(fc)
		fc = tf.reshape(fc, (-1, filterinitialdimension, filterinitialdimension, 1024))
		# print("[generator:fc2]")
		# pprint(fc)
		bn0 = tf.layers.batch_normalization(fc, training=is_train)
		# print("[generator:bn0]")
		# pprint(bn0)
		lrelu0 = tf.maximum(alpha * bn0, bn0)
		# print("[generator:lrelu0]")
		# pprint(lrelu0)
		drop0 = tf.layers.dropout(lrelu0, keep_prob, training=is_train)
		# print("[generator:drop0]")
		# pprint(drop0)
		
		# Deconvolution, 7x7x512
		conv1 = tf.layers.conv2d_transpose(drop0, 512, 4, 1, 'valid', use_bias=False)
		# print("[generator:conv1]")
		# pprint(conv1)
		bn1 = tf.layers.batch_normalization(conv1, training=is_train)
		# print("[generator:bn1]")
		# pprint(bn1)
		lrelu1 = tf.maximum(alpha * bn1, bn1)
		# print("[generator:lrelu1]")
		# pprint(lrelu1)
		drop1 = tf.layers.dropout(lrelu1, keep_prob, training=is_train)
		# print("[generator:drop1]")
		# pprint(drop1)

		
		# Deconvolution, 14x14x256
		conv2 = tf.layers.conv2d_transpose(drop1, 256, 5, 2, 'same', use_bias=False)
		# print("[generator:conv2]")
		# pprint(conv2)
		bn2 = tf.layers.batch_normalization(conv2, training=is_train)
		# print("[generator:bn2]")
		# pprint(bn2)
		lrelu2 = tf.maximum(alpha * bn2, bn2)
		# print("[generator:lrelu2]")
		# pprint(lrelu2)
		drop2 = tf.layers.dropout(lrelu2, keep_prob, training=is_train)
		# print("[generator:drop2]")
		# pprint(drop2)


		# Output layer, 28x28xn
		logits = tf.layers.conv2d_transpose(drop2, out_channel_dim, 5, 2, 'same')

		# print("[generator:logits]")
		# pprint(logits)

		out = tf.tanh(logits)

		# print("[generator:out]")
		# pprint(out)

		return out


def model_loss(input_real, input_z, out_channel_dim, alpha=0.2, smooth_factor=0.1):
	"""
	Get the loss for the discriminator and generator
	:param input_real: Images from the real dataset
	:param input_z: Z input
	:param out_channel_dim: The number of channels in the output image
	:return: A tuple of (discriminator loss, generator loss)
	"""
	# TODO: Implement Function
	d_model_real, d_logits_real = discriminator(input_real, alpha=alpha)
	
	d_loss_real = tf.reduce_mean(
		tf.nn.sigmoid_cross_entropy_with_logits(logits=d_logits_real,
												labels=tf.ones_like(d_model_real) * (1 - smooth_factor)))
	
	input_fake = generator(input_z, out_channel_dim, alpha=alpha)
	d_model_fake, d_logits_fake = discriminator(input_fake, reuse=True, alpha=alpha)
	
	d_loss_fake = tf.reduce_mean(
		tf.nn.sigmoid_cross_entropy_with_logits(logits=d_logits_fake, labels=tf.zeros_like(d_model_fake)))
	
	g_loss = tf.reduce_mean(
		tf.nn.sigmoid_cross_entropy_with_logits(logits=d_logits_fake, labels=tf.ones_like(d_model_fake)))

	return d_loss_real + d_loss_fake, g_loss


def model_opt(d_loss, g_loss, learning_rate, beta1):
	"""
	Get optimization operations
	:param d_loss: Discriminator loss Tensor
	:param g_loss: Generator loss Tensor
	:param learning_rate: Learning Rate Placeholder
	:param beta1: The exponential decay rate for the 1st moment in the optimizer
	:return: A tuple of (discriminator training operation, generator training operation)
	"""
	# TODO: Implement Function
	# Get weights and bias to update
	t_vars = tf.trainable_variables()
	d_vars = [var for var in t_vars if var.name.startswith('discriminator')]
	g_vars = [var for var in t_vars if var.name.startswith('generator')]

	# Optimize
	with tf.control_dependencies(tf.get_collection(tf.GraphKeys.UPDATE_OPS)):
		d_train_opt = tf.train.AdamOptimizer(learning_rate, beta1=beta1).minimize(d_loss, var_list=d_vars)
		g_train_opt = tf.train.AdamOptimizer(learning_rate, beta1=beta1).minimize(g_loss, var_list=g_vars)

	return d_train_opt, g_train_opt

import numpy as np

def show_generator_output(sess, n_images, input_z, out_channel_dim, image_mode):
	"""
	Show example output for the generator
	:param sess: TensorFlow session
	:param n_images: Number of Images to display
	:param input_z: Input Z Tensor
	:param out_channel_dim: The number of channels in the output image
	:param image_mode: The mode to use for images ("RGB" or "L")
	"""
	cmap = None if image_mode == 'RGB' else 'gray'
	z_dim = input_z.get_shape().as_list()[-1]
	example_z = np.random.uniform(-1, 1, size=[n_images, z_dim])

	samples = sess.run(
		generator(input_z, out_channel_dim, False),
		feed_dict={input_z: example_z})

	images_grid = helper.images_square_grid(samples, image_mode)
	#pyplot.imshow(images_grid, cmap=cmap)
	#pyplot.show()
	return images_grid







def train(epoch_count, batch_size, z_dim, learning_rate, beta1, get_batches, data_shape, data_image_mode, print_every=10, show_every=10):

	input_real, input_z, _ = model_inputs(data_shape[1], data_shape[2], data_shape[3], z_dim)
	d_loss, g_loss = model_loss(input_real, input_z, data_shape[3], alpha=0.2)
	d_train_opt, g_train_opt = model_opt(d_loss, g_loss, learning_rate, beta1)

	saver = tf.train.Saver()

	sample_z = np.random.uniform(-1, 1, size=(72, z_dim))

	samples, losses = [], []


	steps = 0
	count = 0

	with tf.Session() as sess:

		saver = tf.train.Saver()

		sess.run(tf.global_variables_initializer())

		folderpath = "../../domains/{}/MODELS".format( domain )

		if os.path.isfile("{}/mostrecentmodel.meta".format(folderpath)): 
			saver = tf.train.import_meta_graph("{}/mostrecentmodel.meta".format(folderpath))
		elif os.path.isfile("{}/0.meta".format(folderpath)): 
			saver = tf.train.import_meta_graph("{}/0.meta".format(folderpath))
		
		if tf.train.latest_checkpoint("{}/".format(folderpath)) != None:
			saver.restore(sess, tf.train.latest_checkpoint("{}/".format(folderpath)))
		
		coord = tf.train.Coordinator()

		threads = tf.train.start_queue_runners(sess=sess, coord=coord)

		folderpathoutput = "../../domains/{}/OUTPUTS".format( domain )

		if not os.path.exists( folderpathoutput ):
			os.mkdir( folderpathoutput )

		for epoch_i in range(epoch_count):

			# os.mkdir("{}/{}".format(folderpathoutput , str(epoch_i)) )
			for batch_images in get_batches(batch_size):

				steps += 1
				batch_images *= 2.0
				batch_z = np.random.uniform(-1, 1, size=(batch_size, z_dim))

				sess.run(d_train_opt, feed_dict={input_real: batch_images, input_z: batch_z})

				sess.run(g_train_opt, feed_dict={input_z: batch_z})

				if steps % print_every == 0:
					# At the end of each epoch, get the losses and print them out
					train_loss_d = d_loss.eval({input_real: batch_images, input_z: batch_z})
					train_loss_g = g_loss.eval({input_z: batch_z})
					print("Epoch {}/{} Step {}...".format(epoch_i+1, epoch_count, steps),
						"Discriminator Loss: {:.4f}...".format(train_loss_d),
						"Generator Loss: {:.4f}".format(train_loss_g))
					# Save losses for viewing after training
					#losses.append((train_loss_d, train_loss_g))

				if steps % show_every == 0:
					count = count +1
					iterr = count*show_every
					images_grid = show_generator_output(sess, 25, input_z, data_shape[3], data_image_mode)
					# dst = os.path.join(folderpathoutput, str(epoch_i), str(iterr)+".png")
					
					def into(c):
						return  int(float(os.path.splitext(c)[0]))
					

					filenamesinfolder = [os.path.basename(x) for x in   glob( "{}/*.png".format( folderpathoutput ))  ]

					if len(filenamesinfolder)==0:
						filenamesinfolder.append("0.png")


					mxfilename = max( filenamesinfolder   ,key=into)
					mxfilename = int(float(os.path.splitext(mxfilename)[0]))
					mxfilename = mxfilename + 1

					dst = os.path.join(folderpathoutput, str(mxfilename)+".png")
					print(images_grid)
					pyplot.imsave(dst, images_grid)
					

				if epoch_i == stepstoperform:
					
					if not os.path.exists("{}/".format(folderpath)):
						os.makedirs("{}/".format(folderpath))
					saver.save(sess, "{}/mostrecentmodel".format(folderpath) )
					# saver.save(sess, './model/' + str(epoch_i) , global_step=1000 , max_to_keep=4, keep_checkpoint_every_n_hours=2 )
					sys.exit(0)





# ------ main



celeba_dataset = helper.Dataset('celeba', glob(os.path.join(data_dir, '*.*')))
pprint(celeba_dataset.shape)

with tf.Graph().as_default():
	# print("[b]")
	train(epochs, batch_size, z_dim, learning_rate, beta1, celeba_dataset.get_batches,
		  celeba_dataset.shape, celeba_dataset.image_mode)
