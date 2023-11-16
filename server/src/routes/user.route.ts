import express, { Request, Response, Router } from 'express'
import User from '../models/user.model'
import UserGroup from '../models/user_group.model'
import validator from 'validator'
import Group from '../models/group.model'
import { failRequest, isUserIdFromTokenMatchingRequest, hashPassword, isObjectEmpty } from '../utils/functions'
import { userUpdatePayload } from '../utils/interfaces'



const routerUser: Router = express.Router()

routerUser.get('/:id', getUserById)
routerUser.get('/:id/groups', getUserGroupsById)
routerUser.put('/:id', updateUserById)

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

async function updateUserById(req: Request, res: Response): Promise<void> {
    try {
        
        const id: number = Number(req.params.id)

        // If the user tries to access another user's profile (token's id doesn't match params id)
        if (!isUserIdFromTokenMatchingRequest(req.headers.authorization, id))
            return failRequest(res, 401, `Unauthorized`)

        const { nickname, email, password }: userUpdatePayload = req.body

        let updatePayload: userUpdatePayload = {}

        if (nickname) 
            updatePayload.nickname = validator.escape(nickname)
        
        // If an email is provided, we check if it is well formed and push it, otherwise we warn
        if (email) {
            if(validator.isEmail(email))
                updatePayload.email = validator.escape(email)
            else
                return failRequest(res, 400, `Your email address doesn't have the right format`)
        }
        
        if (password) 
            updatePayload.password = await hashPassword(password)

        // If the payload we generate haven't been populated (wrong params, empty body, ...), we fail the req
        if (isObjectEmpty(updatePayload))
            return failRequest(res, 400, `Your request doesn't have the adequate parameters`)
        
        const updatedUser = await User.update(
            updatePayload,
            { 
                where: { id }
            }
        )

        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        failRequest(res, 500, `Internal server error`)
    }
}
