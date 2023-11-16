import express, { Request, Response, Router } from 'express'
import validator from 'validator'
import { decodeJwtToken, failRequest } from '../utils/functions'
import Group from '../models/group.model'
import { groupCreationPayload, groupRenamePayload } from '../utils/interfaces'
import { Optional } from 'sequelize'
import { secret } from '../utils/jwt_strategy'
import User from '../models/user.model'

const routerGroup: Router = express.Router()

routerGroup.post('/', createGroup)
routerGroup.get('/:id', getGroupById)
routerGroup.patch('/:id', renameGroupById)
routerGroup.delete('/:id', deleteGroupById)
routerGroup.get('/:id/users', getUsersOfGroupById)

export default routerGroup

async function createGroup(req: Request, res: Response): Promise<void> {
    try {
        const { name }:groupCreationPayload = req.body

        if (!name)
            return failRequest(res, 400, `You must provide a name for your group`)
    
        const payload:groupCreationPayload = {
            name: validator.escape(name)
        }

        const createdGroup = await Group.create(payload as Optional<any, any>)

        res.status(201).json(createdGroup)

    } catch (error) {
        console.error(error)
        failRequest(res, 500, `Internal server error`)
    }
}

async function getGroupById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)

        const group = await Group.findByPk(id)

        if (!group)
            return failRequest(res,404,`Group not found`)

        res.json(group)
    } catch (error) {
        console.error(error)
        failRequest(res,500,`Internal server error`)
    }
}

async function renameGroupById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)

        const userId = decodeJwtToken(req.headers.authorization, secret).id
        const currentUser = await User.findByPk(userId) as any

        // If the user isn't inside the group, he can't rename it
        if (!await currentUser.hasGroup(id))
            return failRequest(res, 401, 'Unauthorized')

        const { name }: groupRenamePayload = req.body
        
        if (!name)
            return failRequest(res, 400, `You must provide a new name for your group`)
    
        const updatePayload:groupRenamePayload = {
            name: validator.escape(name)
        }
    
        const renamedGroup = await Group.update(updatePayload, {
            where: { id }
        })
    
        res.json(renamedGroup)
    } catch (error) {
        console.error(error)
        failRequest(res, 500, `Internal server error`)
    }
}

async function deleteGroupById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)

        const userId = decodeJwtToken(req.headers.authorization, secret).id
        const currentUser = await User.findByPk(userId) as any

        // If the user isn't inside the group, he can't rename it
        if (!await currentUser.hasGroup(id))
            return failRequest(res, 401, 'Unauthorized')

        const group = await Group.findByPk(id);

        if (!group) 
            return failRequest(res, 404, `Group not found`)

        await group.destroy()

        res.json({ message: 'Group deleted successfully' })
    } catch (error) {
        console.error(error)
        failRequest(res, 500, `Internal server error`)
    }
}

async function getUsersOfGroupById(req: Request, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)

        const userId = decodeJwtToken(req.headers.authorization, secret).id
        const currentUser = await User.findByPk(userId) as any

        // If the user isn't inside the group, he can't rename it
        if (!await currentUser.hasGroup(id))
            return failRequest(res, 401, 'Unauthorized')

        const group = await Group.findByPk(id) as any
        const usersOfGroup = await group.getUsers()

        res.json([...usersOfGroup].map(user=>user.id))
    } catch (error) {
        console.error(error)
        failRequest(res, 500, `Internal server error`)
    }
}