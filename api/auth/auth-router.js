const express = require('express')
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')
const router = express.Router()

const checkReqBody = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        res.status(401).json('username andor password missing')
    } else {
        next()
    }
}

const checkNewUsername = async (req, res, next) => {
    try {
        const rows = await Users.findBy({ username: req.body.username })
        if (!rows.length) {
            next()
        } else {
            res.status(401).json('Username already in db')
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const checkExistingUsername = async (req, res, next) => {
    try {
        const rows = await Users.findBy({ username: req.body.username })
        if (rows.length) {
            req.userData = rows[0]
            next()
        } else {
            res.status(401).json('Username not in db')
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

router.get('/', (req, res) => {
    res.json('Inside API')
})

router.post('/register', checkReqBody, checkNewUsername, async (req, res) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 10)
        const newUser = await Users.add({ username: req.body.username, password: hash })
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/login', checkReqBody, checkExistingUsername, async (req, res) => {
    try {
        const verifies = bcrypt.compareSync(req.body.password, req.userData.password)
        if (verifies) {
            req.session.user = req.userData
            res.status(200).json(`Welcome, ${req.userData.username}`)
        } else {
            res.status(401).json('You shall not pass!')
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.json('Error logging out')
            } else {
                res.json('Goodbye')
            }
        })
    } else {
        res.json('No user session found')
    }
})


module.exports = router