if [ $# -ne 4 ];
then
	echo "Usage: process_actions.sh [action] [domain] [param1] [param2]"
else
	cd "./actions/$1"

	python3 process_inputs.py $2 $3 $4
	python3 running.py $2 $3 $4
fi