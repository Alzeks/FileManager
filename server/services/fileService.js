const fs = require('fs')
const File = require('../models/File')
const config = require('config')

class FileService {
    createDir(file) {
  const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'File was created'})
                } else {
                    return reject({message: "File already exist or no file's name"})
                }
            } catch (e) {
                return reject({message: 'File error or no main dir'})
            }
        }))
    }

    deleteFile(file) {
        const path = this.getPath(file)
        if (file.type === 'dir') {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }
    getPath(file) {
        return config.get('filePath') + '\\' + file.user + '\\' + file.path
    }

//my
deleteDir(id) {
  return new Promise(((resolve, reject) => {
        try {
   const path = config.get('filePath') + '\\' + id

          fs.rm(path, { recursive: true, force: true }, err => {
            if (err) { throw err  }
           })
              return resolve({message: 'Main file was deleted'})
        } catch (e) {
            return reject({message: 'File error'})
        }
    }))
   }
}
module.exports = new FileService()
