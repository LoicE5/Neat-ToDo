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
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)


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

Then, open your browser and head to `http://localhost:3000`.
