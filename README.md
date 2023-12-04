# How to run the project

## Create a .env file for the server (only once)
`cd server && cp .env.example .env`

For this exercise purpose, you don't need to edit the .env config (you may if you desire to). It works from scratch with the example. Indeed, in a business context, we don't do that.

## Run

Open two terminals, then type :

### Development
`cd frontend && npm run dev`

`cd server && npm run dev`

### Production
`cd frontend && npm run start`
`cd server && npm run start`

Then, open your browser and head to `http://localhost:3000` or the port you have set on .env instead.
