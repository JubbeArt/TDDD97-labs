source ../.venv/bin/activate
# this will make sure both commands die when user pressed 'ctrl+c'
trap 'kill %1' SIGINT
# build javascript in background
npm start &
# start server
python server/server.py 
