var express = require('express')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://ahihi:huykid3800@cluster0.3xfku.mongodb.net/test'

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/insert', (req, res) => {
    res.render("newProduct")
})

app.post('/newProduct', async (req, res) => {
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    if (name.length <= 5) {
        res.render('newProduct', {"nameError": "Ten khong duoc nho hon 5 ki tu"})
        return 
    }
    let product = {
        'name': name,
        'price': price,
        'picture': picture
    }
    // ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    // truy cap vao Database Toys
    let dbo = server.db("ATNToys")
    // insert product
    await dbo.collection("product").insertOne(product)
    // quay lai trang home
    res.redirect('/')
})

app.get('/viewAll', async (req, res) => {
    // ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    // truy cap vao Database Toys
    let dbo = server.db("ATNToys")
    //get data
    let products = await dbo.collection('product').find().toArray()
    res.render('allProduct', { 'products': products})
})

app.post('/search', async (req, res) => {
    let name = req.body.txtName
    // ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    // truy cap vao Database Toys
    let dbo = server.db("ATNToys")
    //get data
    let products = await dbo.collection('product').find({ 'name': new RegExp(name, 'i') }).toArray()
    res.render('allProduct', { 'products': products })
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')