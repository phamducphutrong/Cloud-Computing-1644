var express = require('express')
var session = require('express-session')
var multer = require('multer')
const upload = multer({ dest: 'public/images/' })
const { MongoClient } = require('mongodb')

var mogoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://phutrong:huykid3800@cluster0.6gdyg.mongodb.net/test'

var app = express()

app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'Toy',
    resave: false
}))

function isAuthenticated(req, res, next) {
    let notLogin = !req.session.userName
    if (notLogin)
        res.redirect('/')
    else
        next()
}

app.get('/logout', (req, res) => {
    req.session.userName = null
    res.redirect('/')
})

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/checkLogin', async (req, res) => {
    let userName = req.body.username
    let password = req.body.password
    req.session.userName = userName
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let checkDatabase = await dbo.collection("users").find({ $and: [{ 'username': userName }, { 'password': password }] }).toArray()
    if (userName != "") {
        if (password != "") {
            if (checkDatabase.length > 0) {
                res.redirect('/home')
            } else {
                let loginFailed = "Username or Password is invalid"
                res.render('login', { 'loginFailed': loginFailed, 'userName': userName, 'password': password })
            }
        } else {
            let emptyPassword = "Password field cannot be blank!"
            res.render('login', { 'emptyPassword': emptyPassword })
        }
    } else {
        let emptyUsername = "Username field cannot be blank!"
        res.render('login', { 'emptyUsername': emptyUsername })
    }

})

app.get('/register', (req, res) => {
    res.render('signup')
})

app.post('/checkSignUp', async (req, res) => {
    let fullName = req.body.fullname
    let email = req.body.email
    let userName = req.body.username
    let password = req.body.password
    let newAccount = {
        'fullname': fullName,
        'email': email,
        'username': userName,
        'password': password
    }
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let check = await dbo.collection("users").find({ 'username': userName }).toArray()
    if (fullName != "") {
        if (email != "") {
            if (userName != "") {
                if (password != "") {
                    if (check.length > 0) {
                        let singupFailed = "Sign Up unsuccessfully, username has been existed"
                        res.render('signup', { 'singupFailed': singupFailed, 'fullName': fullName, 'email': email, 'userName': userName, 'password': password })
                    } else {
                        await dbo.collection("users").insertOne(newAccount)
                        res.redirect('/')
                    }
                } else {
                    let emptyPassword = "Password field cannot be blank!"
                    res.render('signup', { 'emptyPassword': emptyPassword, 'fullName': fullName, 'email': email, 'userName': userName })
                }
            } else {
                let emptyUsername = "Username field cannot be blank!"
                res.render('signup', { 'emptyUsername': emptyUsername, 'fullName': fullName, 'email': email, 'password': password })
            }
        } else {
            let emptyEmail = "Email field cannot be blank!"
            res.render('signup', { 'emptyEmail': emptyEmail, 'fullName': fullName, 'userName': userName, 'password': password })
        }
    } else {
        let emptyFullName = "Fullname field cannot be blank!"
        res.render('signup', { 'emptyFullName': emptyFullName, 'email': email, 'userName': userName, 'password': password })
    }



})

app.get('/home', isAuthenticated, async (req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let user = await dbo.collection("users").find({ 'username': req.session.userName }).toArray()
    res.render('home', { 'user': user[0] })
})

app.get('/viewToys', isAuthenticated, async (req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let toys = await dbo.collection("Toys").find().toArray()
    res.render('toys', { 'toys': toys })
})

app.post('/search', isAuthenticated, async (req, res) => {
    let name = req.body.search
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let toys = await dbo.collection("Toys").find({ 'name': new RegExp(name, 'i') }).toArray()
    res.render('toys', { 'toys': toys, 'name': name })
})

app.get('/insert', isAuthenticated, (req, res) => {
    res.render('newProduct')
})

app.post('/checkInsert', isAuthenticated, upload.single('image'), async (req, res) => {
    let name = req.body.name
    let price = req.body.price
    let provider = req.body.provider
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let Toy = {
        'name': name,
        'price': price,
        'provider': provider,
        'image': req.file.path.slice(14)
    }
    let check = await dbo.collection("Toys").find({ 'name': name }).toArray()
    if (name != "") {
        if (price != "") {
            if (provider != "") {
                if (check.length > 0) {
                    let insertFailed = "Insert failed, Name has been existed"
                    res.render('newProduct', { 'insertFailed': insertFailed, 'name': name, 'price': price, 'provider': provider })
                } else {
                    await dbo.collection("Toys").insertOne(Toy)
                    res.redirect('/viewToys')
                }
            } else {
                let emptyProvider = "Provider field cannot be blank!"
                res.render('newProduct', { 'emptyProvider': emptyProvider, 'name': name, 'price': price })
            }
        } else {
            let emptyPrice = "Price field cannot be blank!"
            res.render('newProduct', { 'emptyPrice': emptyPrice, 'name': name, 'provider': provider })
        }
    } else {
        let emptyName = "Name field cannot be blank!"
        res.render('newProduct', { 'emptyName': emptyName, 'price': price, 'provider': provider })
    }
})



const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')