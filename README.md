# dev-funny

**Pre-Installation Requirements**

- Install node and npm with nvm: https://github.com/creationix/nvm

**Server(nodejs)**

Install dependencies:
```
npm install
```
Set environment variables:
```
cp .env.example .env
```
Start server:
```
# Start server
npm start

or

# Selectively set DEBUG env var to get logs
DEBUG=dev-funny-api:* npm start
```

**API doc**
```
npm run apidoc
```
Open `doc/index.html` to view api doc.