import express, { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { Error, Model, Optional } from 'sequelize'
import { secret } from '../utils/jwt_strategy'
import { todoCreationPayload, todoUpdatePayload } from '../utils/interfaces'
import { failRequest, isObjectEmpty, decodeJwtToken } from '../utils/functions'
import validator from 'validator'
import Todoom from '../models/todoom.model'

const routerToDoom: Router = express.Router()

routerToDoom.post('/', createATodo)
routerToDoom.get('/:id', getTodoById)
routerToDoom.put('/:id', updateTodoById)
routerToDoom.get('/user/:user_id', getAllTodoForAUser)

export default routerToDoom

async function createATodo(req: Request,res: Response):Promise<void>{
    try {
        const { 
            group_id,
            title,
            description,
            deadline,
            status,
            assignee_id,
            author_id 
        }: todoCreationPayload = req.body

        if (!title || !assignee_id || !author_id)
            return failRequest(res, 400, `Required parameters haven't been set`)

        const currentUserId = decodeJwtToken(req.headers.authorization, secret).id

        if (currentUserId !== author_id)
            failRequest(res, 400, `You cannot assign a todo on behalf of others`)

        let createPayload: todoCreationPayload = {
            title: validator.escape(title),
            assignee_id: Number(assignee_id),
            author_id : Number(author_id)
        }

        if (group_id)
            createPayload.group_id = Number(group_id)

        if (description)
            createPayload.description = validator.escape(description)

        if (deadline) {
            if(validator.isDate(deadline as string))
                createPayload.deadline = new Date(deadline)
            else
                return failRequest(res, 400, `Your date format is not valid`)
        }

        // TODO add a enum check for allowed status
        if (status)
            createPayload.status = validator.escape(status)
    
        const newTodo: Model = await Todoom.create(createPayload as Optional<any, any>)
        res.status(201).json(newTodo)
    
    } catch (error) {
        failRequest(res,500, `Internal server error`)
    }
}

async function getTodoById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)

        const toDo = await Todoom.findByPk(id) as any

        if (!toDo) 
            return failRequest(res, 404, `ToDo not found`)
        
        const currentUserId = decodeJwtToken(req.headers.authorization, secret).id
        const currentUser = await User.findByPk(currentUserId) as any

        if (
            currentUserId !== toDo.assignee_id &&
            currentUserId !== toDo.author_id &&
            !await currentUser.hasGroup(toDo.group_id)
        )
            return failRequest(res, 401, `Unauthorized`)
        
        res.json(toDo)
    } catch (err) {
        console.error(err)
        failRequest(res,500,`Internal server error`)
    }
}

async function updateTodoById(req: Request,res: Response):Promise<void> {
    try {
        const id = Number(req.params.id)

        const currentUserId = decodeJwtToken(req.headers.authorization, secret).id
        const currentUser = await User.findByPk(currentUserId) as any

        const toBeUpdatedTodo = await Todoom.findByPk(id) as any
        
        if (!toBeUpdatedTodo)
            return failRequest(res,404, `Todo not found`)

        // A user can't update a todo he's not related to
        if (
            currentUserId !== toBeUpdatedTodo.assignee_id &&
            currentUserId !== toBeUpdatedTodo.author_id &&
            !await currentUser.hasGroup(toBeUpdatedTodo.group_id)
        )
            return failRequest(res, 401, `Unauthorized`)

        const {
            title,
            description,
            deadline,
            status,
            assignee_id
        }: todoUpdatePayload = req.body

        let updatePayload: todoUpdatePayload = {}

        if (title)
            updatePayload.title = validator.escape(title)

        if (description)
            updatePayload.description = validator.escape(description)

        // TODO Filter the status with enum
        if (status)
            updatePayload.status = validator.escape(status)

        if (deadline) {
            if(validator.isDate(deadline as string))
                updatePayload.deadline = new Date(deadline)
            else
                return failRequest(res, 400, `Your date format is not valid`)
        }

        if (assignee_id)
            updatePayload.assignee_id = Number(assignee_id)

        // If the payload we generate haven't been populated (wrong params, empty body, ...), we fail the req
        if (isObjectEmpty(updatePayload))
            return failRequest(res, 400, `Your request doesn't have the adequate parameters`)

        await toBeUpdatedTodo.update(updatePayload)

        res.json(toBeUpdatedTodo)

    } catch(err) {
        if (err.name == 'SequelizeUniqueConstraintError')
            failRequest(res, 409, `You can't assign the todo to this user`)
        else
            failRequest(res, 500, `Internal server error`)
    }

    
}  

//TODO refactor this thing
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