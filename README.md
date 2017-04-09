# dev-funny
**Pre-Installation Requirements**
- Install npm: https://docs.npmjs.com/getting-started/installing-node


**Frontend(client)**

Clone project:
```
git clone git@github.com:hienbx94/dev-funny.git
```
Check out develop branch
```
git checkout develop
```
Cd to frontend(client) folder and install package for angular 2
```
cd client && npm install
```
Run frontend(client) on http://localhost:8080
```
npm start
```

**Server(nodejs)**

Install yarn

```
npm install -g yarn
```
Install dependencies:
```
yarn
```
Set environment (vars):
```
cp .env.example .env
```
Start server:
```
# Start server
yarn start

or

# Selectively set DEBUG env var to get logs
DEBUG=dev-funny-api:* yarn start
```
