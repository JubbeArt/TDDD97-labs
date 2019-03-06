source ../.venv/bin/activate
# this will make sure both commands die when user pressed 'ctrl+c'
trap 'kill %1' SIGINT
# build javascript in background
#npm start &
/home/jeswr740/Downloads/node-v11.10.1-linux-x64/bin/npm start &
# start server
python server/server.py 
