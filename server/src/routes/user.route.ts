import express, { Request, Response, Router } from 'express'
import User from '../models/user.model'
import UserGroup from '../models/user_group.model'
import validator from 'validator'
import Group from '../models/group.model'
import { failRequest, isUserIdFromTokenMatchingRequest } from '../utils/functions'

const routerUser: Router = express.Router()

routerUser.get('/:id', getUserById)
routerUser.get('/:id/groups', getUserGroupsById)

export default routerUser

async function getUserById(req: Request, res: Response): Promise<void> {

    try {
        const id = Number(req.params.id)
        
        if(!isUserIdFromTokenMatchingRequest(req.headers.authorization, id))
            return failRequest(res, 401, `Unauthorized`)

        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } })
        
        if (!user) 
            return failRequest(res,404,`User not found`)
        
        res.json(user)
    } catch (error) {
        console.error(error)
        failRequest(res,500,`Internal server error`)
    }

}

async function getUserGroupsById(req: Request, res: Response): Promise<void> {
    try {
        const id: number = Number(validator.escape(req.params.id))

        if(!isUserIdFromTokenMatchingRequest(req.headers.authorization, id))
            return failRequest(res, 401, `Unauthorized`)
        
        const user = await User.findByPk(id, {
            include: [{
                model: Group,
                through: UserGroup,
            } as any],
        })
        if (!user) 
            return failRequest(res,404,`User not found`)
        
        res.json(user)
    } catch (error) {
        console.error(error)
        failRequest(res,500,`Internal server error`)
    }
}