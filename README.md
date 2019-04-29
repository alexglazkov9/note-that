# note-that
Note-that is a note taking app

## Local installation
### Prerequisites
* Node.js
* NPM
* Python
* pip

___

#### Clone repository:

```
git clone https://github.com/alexglazkov9/note-that.git
cd note-that
```

#### Install NPM dependencies:

From ```client``` folder run:
```
npm install
```

#### Setup Python environment and install dependencies:

From ```server``` folder run:
```
virtualenv venv
source venv/bin/activate     # or ./venv/Scripts/activate.ps1
pip install -r requirements.txt
```

#### Start local server

From ```client``` folder run:
```
npm start
```

From ```server``` folder run:
```
flask run
```
