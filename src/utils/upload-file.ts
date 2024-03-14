import multer, { MulterError } from 'multer'
import { Request, Response, NextFunction } from 'express'
import { StandardError } from './error-handling'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']

    if (!allowedTypes.includes(file.mimetype)) {
      cb(new StandardError('Unsupported file type. Only PDF, PNG, and JPEG are allowed', 'UNSUPPORTED_FILE_TYPE', 400))
    } else {
      cb(null, true)
    }
  }
})

const handleMulterError = (err: MulterError, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      res.status(400).json({ error: 'Must upload exactly 1 file' })
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'One of the files exceeds the maximum limit of 3 MB.' })
    } else {
      res.status(400).json({ error: err.message })
    }
  } else {
    next()
  }
}

const checkContentType = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type']

  if (!contentType || !contentType.includes('multipart/form-data')) {
    res.status(400).json({
      message: 'Content-Type must be multipart/form-data',
      type: 'INVALID_CONTENT_TYPE',
      statusCode: 400
    })
    return
  }

  next()
}

export const uploadFile = [checkContentType, upload.array('file', 1), handleMulterError]
