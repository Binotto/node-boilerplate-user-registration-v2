const express = require ('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

//Finding profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//Find all Users
//GET /users?deleted=false or true
//GET /users?limit=10&skip=20
router.get('/users', auth, async (req, res) => { 
    let users;
    try{
        users = await User.find({})
        if (req.query.deleted === 'false'){
            users = await User.aggregate([
                { $match : { deleted : false } }
            ])
            //users = await User.find({ deleted: false })
        }
        if (req.query.deleted === 'true'){
            users = await User.aggregate([
                { $match : { deleted : true } }
            ])
            //users = await User.find({ deleted: true })
        }
        if(req.query.limit >= 0 && req.query.skip >= 0 && req.query.limit !== "" && req.query.skip !== ""){
            users = await User.aggregate([
                { $skip : parseInt(req.query.skip)},
                { $limit : parseInt(req.query.limit)}
                
            ])
            //users = await User.find({}).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip))
        }
        res.status(201).send(users)
    }catch (error) {
        res.status().send(error)
    }    
})

//Last Updates I
router.get('/users/lastUpdates', auth, async (req, res) => { 
    try{
        const users = await User.aggregate([
            { $sort : { updatedAt : -1}},
            { $limit : 2},
            { $project : { _id: 0, name: "$name"} }
        ])
        res.status(201).send(users)
    }catch (error) {
        res.status().send(error)
    }   
})
//Last Updated II
// GET /users/last?tokens=<number>
router.get('/users/last', auth, async (req, res) => {
    let users; 
    try{
        users = await User.aggregate([ 
            { $sort : { updatedAt : -1}},
            { $unwind : "$tokens" },
            { $limit : 1},
            { $project : 
                { 
                    _id : "$name",
                    updatedAt: "$updatedAt",
                    token: "$tokens"
                } 
            }
        ])
        if (parseInt(req.query.tokens) >= 0 && parseInt(req.query.tokens) !== ""){
            users = await User.aggregate([ 
                { $sort : { updatedAt : -1}},
                { $unwind : "$tokens" },
                { $limit : parseInt(req.query.tokens)},
                { $project : 
                    { 
                        _id : "$name",
                        updatedAt: "$updatedAt",
                        token: "$tokens"
                    } 
                }
            ])
        }
        res.status(201).send(users)
    }catch (error) {
        res.status().send(error)
    }   
})

//All Registered Users By Name
router.get('/users/allRegisteredUsersByName', auth, async (req, res) => { 
    try{
        const users = await User.aggregate([
            { $project : { _id: 0, name : 1 } }
        ])
        res.status(201).send(users)
    }catch (error) {
        res.status().send(error)
    }   
})

//Find a User by id
router.get('/users/:id',auth , async (req, res) => {   
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)      
    }catch (error) {
        res.status(500).send(`Not Found.`)
    }    
})
//Filter
router.get('/users/filter/:name',auth , async (req, res) => {   
    const _name = req.params.name 
    try{
        const user = await User.aggregate([
            { $match : { name : _name } }
        ])
        if(user.toString() !== ""){
            res.status(201).send(user)
        }else{
            res.status(400).send('Not Found')
        }
        
    }catch (error) {
        res.status(500).send(error)
    }    
})

//Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user , token })
    } catch (error){
        res.status(400).send(error)
    }
})

//Logout
router.post('/users/logout', auth,  async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        
        await req.user.save()

        res.send()
    }catch (error){
        res.status(500).send()
    }
})

//Logout of all
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch (error){
        res.status(500).send()
    }
})

//Creating a new user
router.post('/user', async (req, res) => { 
    const user = new User(req.body)

    try {   
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })
    }catch (e) {
        res.status(400).send(e)
    }
    
})

//Updating user
router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'e-mail', 'password', 'age']
    const isValidateOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidateOperation){
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try{
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    }catch(error){
        res.status(400).send(error)
    }
})

//Updating other user
router.patch('/users/:id', auth, async(req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'e-mail', 'password', 'age']
    const isValidateOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidateOperation){
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try{
        const user = await User.findById(_id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.send(user)
    }catch(error){
        res.status(400).send(error)
    }
})

//Deleting user
router.delete('/users/me', auth, async (req, res) => {
    try{
        req.user.deleted = true
        req.user.tokens = []
        req.user.generateRandomPassword()
        await req.user.save()
        res.send(req.user)
    }catch (error){
        res.status(403).send()
    }
})
//Deleting a user by id
router.delete('/users/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        user.deleted = true
        req.user.tokens = []
        user.generateRandomPassword()
        await user.save()
        res.send(user)
    }catch (error){
        res.status(403).send()
    }
})

module.exports = router

