var express = require('express')
var session = require('express-session')
var app = express()
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://127.0.0.1:27017'
app.use(session({
    secret: 'my secret !@#$%^&*',
    resave: false
}))

app.get('/', async (req, res) => {
    // let server = await MongoClient.connect(url)
    // let dbo = server.db("ATNToys")
    // let accessCount = req.session.accessCount || 0
    // accessCount++
    // req.session.accessCount = accessCount
    // chuaDangNhap = !req.session.userName
    res.render('home'
        // 'accessCount': accessCount, 'check' : chuaDangNhap

     )
})

app.post('/register', async (req, res) => {
    let name = req.body.username
    let pass = req.body.password
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let users = await dbo.collection('users').find({'name' : name})
    // req.session.userName = name
    for(i=0;i<users.length;i++){
        if(name == username[i] && pass == password[i]){
            res.render('profile', {'username': username[i]})
        }
        else {
            res.write('Account inputs are not correct!')
            res.end()
        }
    }
    // res.render('profile', { 'name': name, 'pass' : pass, 'users' : users})
})

app.get('/profile', (req, res) => {
    chuaDangNhap = !req.session.userName
    res.render('profile', { 'name': req.session.userName, 'check' : chuaDangNhap })
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("server is running")