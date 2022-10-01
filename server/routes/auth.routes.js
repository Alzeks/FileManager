const Router = require("express");
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')
const fs = require('fs')

router.post('/registration',
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:3, max:12})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
    return res.status(400).json({message: "Uncorrect request", errors})
        }
        const {email, password} = req.body

        const candidate = await User.findOne({email})
        if(candidate) {
    return res.status(400).json({message: `User with email ${email} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({email, password: hashPassword})

        await user.save()
  await fileService.createDir(new File({user: user.id, name: ''}))
      return  res.json({message: "User was created"})
    } catch (e) {
        console.log(e)
        res.send({message: "Server error"})
    }
})

router.post('/login',
    async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({email})
            if (!user) {
    return res.status(404).json({message: "User not found"})
            }
    const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
    return res.status(400).json({message: "Invalid password"})
            }
    const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })

router.get('/auth', authMiddleware,
    async (req, res) => {
      try {
            const user = await User.findOne({_id: req.user.id})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })
//my
router.delete('/registration', authMiddleware,
    async (req, res) => {
    try {
        const candidate = await User.findOne({_id: req.user.id})
        if(!candidate) {
    return res.status(400).json({message: `User with id ${req.user.id} no exist`})
        }
   const filePath = `${config.get('filePath')}\\${req.user.id}`
   if(!fs.existsSync(filePath)){
   return  res.status(500).json({message: "No main folder"})}

   const filesRemove = await File.remove({ user: req.user.id})

   const fileDelete = await fileService.deleteDir(req.user.id)

      const user = await User.remove({_id: req.user.id})
      console.log(user);
        res.json({message: "User was deleted"})

    } catch (e) {
        console.log(e)
        res.send({message: "Server error"})
    }
})

module.exports = router
