const express = require('express')
const router = express.Router()

const Users = require('./users-model')


const restricted = (req, res, next) => {
    if (req.session && req.session.user) {
        next()
    } else {
        res.status(403).json('You shall not pass!')
    }
}

router.get('/', async (req, res) => {
    try {
        const users = await Users.find()
        if (users) {
            res.status(200).json(users)
        } else {
            res.status(500).json('Something went terribly wrong')
        }
    } catch (error) {
        res.status(500).json('Something went terribly wrong')
    }
})

module.exports = router