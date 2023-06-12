import indexRouter from './index.routes'
import usersRouter from './users.routes'
import postsRouter from './posts.routes'
import { Express, Request, Response } from 'express'

export const routesInit = (app:Express) => {
    app.use('/posts',postsRouter)
    app.use('/',indexRouter)
    app.use('/users',usersRouter)
    app.use((req:Request, res:Response) => {
        res.status(404).json({ msg_err: 'Not Found 404' })
    })
}