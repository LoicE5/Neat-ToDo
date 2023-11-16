import express, { Request, Response, Router } from 'express'
import validator from 'validator'
import { failRequest } from '../utils/functions'
import Group from '../models/group.model'
import { groupCreationPayload } from '../utils/interfaces'
import { Optional } from 'sequelize'

const routerGroup: Router = express.Router()

routerGroup.post('/', createGroup)

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