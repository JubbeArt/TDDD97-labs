# TDDD97-labs

# Install
```bash
pip3 install virtualenv
virtualenv -p python3.6 .venv
source .venv/bin/activate
pip install -r requirements.txt 
```

# Run
```bash
./start.sh
```

or

```bash
source .venv/bin/activate
python lab3/server.py
```

# Generate requirements.txt
```bash
source .venv/bin/activate
pip freeze > requirements.txt
```

# Exit venv enviorment with
```bash
deactivate .venv/bin/activate
```