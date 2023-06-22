import indexRouter from './index.routes'
import usersRouter from './users.routes'
import postsRouter from './posts.routes'
import commentsRouter from './comments.routes'
import { Express, Request, Response } from 'express'

export const routesInit = (app:Express) => {
    app.use('/posts',postsRouter)
    app.use('/posts/comments',commentsRouter)
    app.use('/',indexRouter)
    app.use('/users',usersRouter)
    app.use((_:Request, res:Response) => {
        res.status(404).json({ msg_err: 'Not Found 404' })
    })
}