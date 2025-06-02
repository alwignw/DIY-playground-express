import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import { Request } from 'express'

interface RequestExtend extends Request {
  destination?: string
  user?:string
}

const pathUpload = 'public/uploads'

const storage = multer.diskStorage({
  destination: (
    req: RequestExtend,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const destinationDir = pathUpload

    // Check if the destination directory exists, create it if not
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true })
    }

    cb(null, destinationDir) // Folder save file upload
  },
  filename: (
    req: RequestExtend,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const extension = path.extname(file.originalname)
    const filename = path.basename(file.originalname, extension)
    const fileName = `${filename}-${new Date().getTime()}${extension}`
    cb(null, fileName)
  }
})

const uploadOptions = {
  storage
  // limits: {
  //   fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB
  // },
  // fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  //   // Custom file filter logic if needed
  //   const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  //   const isValidExtension = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());

  //   if (!isValidExtension) {
  //     return cb(new Error('Invalid file type'));
  //   }

  //   cb(null, true);
  // },
}

const upload = multer(uploadOptions)

export default upload
