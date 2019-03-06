from werkzeug.utils import secure_filename
import os

#import path
# TODO: REAL PATH
UPLOAD_FOLDER = '/home/jeswr740/TDDD97-labs/lab4/media-mapp'
ALLOWED_EXTENSIONS = set(['ogg'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file(request):
    # File input not sent
    if 'file' not in request.files:
        return False
    file = request.files['file']
    
    # user pressed cancel => no filename
    if file.filename == '':
        return False

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return True