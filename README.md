# Enterprise Coffee Pooling

Let your people decide when they're going to meet up to get some coffee.

## Features:
- [x] Real-time updates using WebSockets
- [ ] Browser notifications
- [x] Allow users to set-up availability windows (I'll go grab a coffee in the next 2 hours)
- [ ] Allow users to broadcast an emergency event (I'm going to get a coffee right now)
- [ ] Show suggestions

## Technologies:
This started as a weekend project. My goal is to keep it as lightweight as possible.

This means, only necessary node packages on the server, and no external JS dependencies
on the client.

Currently using:
- Node.js server (with `websocket`, `serve-static` and `finalhandler`)
- Pure Object Oriented JS client
- Nothing else!

## Installation / Usage
Clone repo:
```bash
git clone https://github.com/karate/coffee-pool.git
cd coffee-pool/
```
Install dependencies:
```bash
$ npm install
```
Run Node.js server:
```bash
$ npm start
```
Visit `localhost:8080` in your browser

## Contribute
Thank you for your interest!
Since the project is still very youg, please create an issue and let's discuss any changes / fixes before creating a Pull Request.
