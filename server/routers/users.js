const express = require('express')
const users = require('../models/users')
const router = new express.Router()
const badWordsCheck = require('bad-words')
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

// the backend part of checking if user is logged in (happens in auth) 
// and updates the user data in frontend whenever its needed
router.get("/logincheck", auth,  (req, res) => {
  if(req.user.avatar){
    var avatar = req.user.avatar.toString('base64')
  }
  res.send({
    username: req.user.username,
    avatar: avatar
  })
})

// backend part of making a new user, with encrypting the password for sure
router.post('/createuser', async (req, res) => {
  const newUser = new users(req.body)
  newUser.password = await bcryptjs.hash(newUser.password, 8)

  try {
    await newUser.save()
    res.status(201).send(newUser)
  } catch (e) {
    res.status(400).send(e)
  }
})


// to check if the username is taken or including bad words when trying to make a new account
router.get("/checkuser/:username", async (req, res) => {
  const filter = new badWordsCheck()
  try {
    const user = await users.findOne({username: req.params.username})
    if (!user && !filter.isProfane(req.params.username)) {
      return res.status(404).send()
    }
    res.status(200).send()
  } catch (e) {
    res.status(404).send(e)
  }
})


// backend part of signing user in, it will make a new token and attach it to the user in the DB
// it does make the HttpOnly cookie too
router.post("/usersignin", async (req, res) => {
  try {
    const user = await users.findAndVerifyUser(req.body.username, req.body.password)
    const token = await user.generateAuthToken()

    res.cookie("secureToken", token, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      sameSite: 'strict'
    });

    res.send({user, token})
  }
  catch (e) {
    res.status(400).send(e)
  }
})

// multer filters, limits the upload size to 1mb and the file types
const avatar = multer ({
  limits: {
    fileSize: 1048576
  },
  fileFilter(req, file, cd){
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
      return cd(new Error())
    }
    return cd(undefined, true)
  }
})

// multer will save the image in the database as binery data
router.post("/avatar", auth, avatar.single('file'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 175, height: 175 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    
    res.send()
}, 
(error, req, res, next) => {
  res.send({error: error})
})

// the backend part of removing the avatar, it will simply change avatar's value to null
router.get("/removeavatar", auth, async (req, res) => {
  try {
    req.user.avatar = null
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(400).send()
  }

})


// to handle changing password, it will check and compare the old password with bcrypt
router.patch("/changepassword", auth, async (req, res) => {
  try {
    const match = await bcryptjs.compare(req.body.oldPassword, req.user.password)
    if(match) {
      const newHashedPassword = await bcryptjs.hash(req.body.newPassword, 8)
      await users.findOneAndUpdate({ 
        username: req.user.username, "tokens.token":req.cookies.secureToken }, 
        {password: newHashedPassword}
      )
      res.send()
    } else {
      res.status(400).send()
    }
  } catch (e) {
    res.status(400).send()
  }
})

// to logout the user, it does remove the HttpOnly token cookie from the DB as well
router.get("/logout", auth, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.secureToken, process.env.JWT_SECRET_TOKEN)
    const user = await users.findOne({ _id: decoded._id, 'tokens.token': req.cookies.secureToken })
    const temp = user.tokens.filter((item) => item.token !== req.cookies.secureToken)
    user.tokens = temp
    await user.save()
    res.send()
  } catch(e) {
    res.status(404).send()
  }
})

module.exports = router
