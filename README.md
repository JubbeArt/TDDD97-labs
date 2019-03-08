# TDDD97-labs

# We aim for the grade 5:
## 1. Providing Live Data Presentation [3 points] (ChartJS and sockets)
## 3. Performing Client-side Routing + Overriding Back/Forward buttons using the History API [2 point] (React-Router)
## 5. Applying Further Security Measures [3 points] (bcrypt and openssl)  
## 7. Client-side Templating Using a Third-Party API [1 point] (React)


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