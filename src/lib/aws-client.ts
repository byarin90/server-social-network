import AWS from 'aws-sdk'
import { config } from 'dotenv'
import { SECRET } from '../constant/constant'

config()

AWS.config.update({
  accessKeyId: SECRET.AWS_ACCESS_KEY_ID,
  secretAccessKey: SECRET.AWS_SECRET_ACCESS_KEY,
  region: SECRET.AWS_REGION
})

export const s3Client = new AWS.S3()
