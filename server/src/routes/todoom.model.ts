import express, { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { Error, Model, Optional } from 'sequelize'
import { secret } from '../utils/jwt_strategy'
import { todoCreatePayload, todoUpdatePayload } from '../utils/interfaces'
import { failRequest, isObjectEmpty } from '../utils/functions'
import validator from 'validator'
import Todoom from '../models/todoom.model'

const routerToDoom: Router = express.Router()

routerToDoom.post('/', createATodo)
routerToDoom.get('/:id', getTodoById)
routerToDoom.put('/:id', updateTodoById)
/*
routerToDoom.patch('/:id', updateTodoStatus)
routerToDoom.delete('/:id', deleteTodoById)
routerToDoom.post('/user/:user_id', addUserToATodo)*/
routerToDoom.get('/test', getAllTodoForAUser)

export default routerToDoom

async function createATodo(req: Request,res: Response):Promise<void>{
    const defaultFail = (): void => failRequest(res,500,`There have been an error processing your signup.`)
    const { 
        group_id,
        title,
        description,
        deadline,
        status,
        assignee_id,
        author_id 
    }: todoCreatePayload = req.body

    let createPayload: todoCreatePayload = {
        group_id,
        title,
        description,
        deadline,
        status,
        assignee_id,
        author_id 
    }

    // If the payload we generate haven't been populated (wrong params, empty body, ...), we fail the req
    if (isObjectEmpty(createPayload))
        return failRequest(res, 400, `Your request doesn't have the adequate parameters`)
    
    try {

            const newTodo: Model = await Todoom.create(createPayload as Optional<any, any>)
            res.status(201).json(newTodo)
    
    } catch (err: Error | any) {
                defaultFail()
    }
}

async function getTodoById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)

        const toDO = await Todoom.findByPk(id)

        if (!toDO) 
            return failRequest(res,404,`ToDO not found`)
        
        res.json(toDO)
    } catch (err) {
        console.error(err)
        failRequest(res,500,`Internal server error`)
    }
}

async function updateTodoById(req: Request,res: Response):Promise<void>{
    try{
        const id = Number(req.params.id)
        const toDO = await Todoom.findByPk(id)
        const { 
            title,
            description,
            deadline,
            status,
            assignee_id,
        }: todoUpdatePayload = req.body

        let updatePayload: todoUpdatePayload = {title,
            description,
            deadline,
            status,
            assignee_id}

        if (title) updatePayload.title = validator.escape(title)
        if(description) updatePayload.description = validator.escape(description)
        if(status) updatePayload.status = validator.escape(status)

        // If the payload we generate haven't been populated (wrong params, empty body, ...), we fail the req
        if (isObjectEmpty(updatePayload))
            return failRequest(res, 400, `Your request doesn't have the adequate parameters`)
        
        const updatedTodo = await Todoom.update(
            
            updatePayload,
            { 
                where: { id }
            }
        ) 
        res.json(updatedTodo)
    }catch(err){
        if (err.name == 'SequelizeUniqueConstraintError')
        failRequest(res, 409, `You can't assign the todo to this user`)
        else
        failRequest(res, 500, `Internal server error`)
    }

    
}  

async function getAllTodoForAUser(req: Request,res: Response):Promise<void>{
    const authorId = Number(req.body.id)

    // Log the authorId to check if it's a valid number
    console.log('Author ID:', authorId)

    if (!authorId) 
        return failRequest(res,400, 'Invalid author ID')

    try {
        const todos = await Todoom.findAll({
            attributes: ['id', 'group_id', 'title', 'description', 'deadline', 'status', 'assignee_id', 'author_id', 'createdAt', 'updatedAt'],
            where: { author_id: authorId },
        })

        res.json(todos)
    } catch (error) {
        console.error('Error fetching todos:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}