# About this project

This project is a simple to-do application. It allows you to add a to-do, create groups to manage your to-dos with your friends, and manage your account.
It was developed by [Loïc](https://github.com/LoicE5), [Maxime](https://github.com/Mbourdon95) & [Valentin](https://github.com/ValReault) as part of a student project (awarded the highest grade).

## Stack

### Front-End
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Back-End
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

# How to run the project

## Create a .env file for the server (only once)
`cd server && cp .env.example .env`

For this exercise purpose, you don't need to edit the .env config (you may if you desire to). It works from scratch with the example. Indeed, in a business context, we don't do that.
Then set a JWT_SECRET as well as your credentials for your MySQL DB.

Note : Use `127.0.0.1` instead of `localhost` (if applicable), some bugs may occur.

## Run

### Development
`npm run dev`

**For only front-end or server :** `npm run dev:frontend`or `npm run dev:server`

### Production
`npm run build`

**For only front-end or server :** `npm run build:frontend`or `npm run build:server`

Then, open your browser and head to `http://localhost:3000`.
