const db = require('../../database/db-config')

module.exports = {
    add, 
    find, 
    findBy,
    findById
}

async function add(user) {
    const [id] = await db('users').insert(user, 'id')
    return findById(id)
}

function find() {
    return db('users').select('id', 'username').orderBy('id')
}

function findBy(filter) {
    return db('users').where(filter).orderBy('id')
}

function findById(id) {
    return db('users').where({ id }).first()
}