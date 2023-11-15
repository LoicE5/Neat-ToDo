import express, { Request, Response, Router } from 'express'
import User from '../models/user.model'
import UserGroup from '../models/user_group.model'
import validator from 'validator'
import Group from '../models/group.model'

const routerUser: Router = express.Router()

routerUser.get('/:id', getUserById)
routerUser.get('/:id/groups', getUserGroupsById)

export default routerUser

async function getUserById(req: Request, res: Response): Promise<void> {

    const id: number = Number(validator.escape(req.params.id))
    res.json(await User.findByPk(id))
}

async function getUserGroupsById(req: Request, res: Response): Promise<void> {
    const id: number = Number(validator.escape(req.params.id))

    res.json(await User.findAll({
        include: [{
            model: Group,
            through: UserGroup
        } as any],
        where: {id: id}
    }))
}