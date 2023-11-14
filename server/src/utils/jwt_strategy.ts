import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import User from '../models/user.model.js'
import { Model } from 'sequelize'

// TODO use env variable and a more robust auto generated secret
const secret:string = 't3$t'

interface jwtPayload {
    id:number
}

const jwtStrategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
},
    (payload:jwtPayload, done:VerifiedCallback):void => {
        User.findByPk(payload.id)
            .then((user:Model) => {
                if (user)
                    return done(null, user)
                return done(null, false)
            })
            .catch((err:string) => {
                console.error('Error in finding user by ID in JWT')
            })
    }
)

export default jwtStrategy
export {
    secret
}