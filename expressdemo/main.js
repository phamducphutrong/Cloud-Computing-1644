var express = require('express')
var app = express()
var fs = require('fs')
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true })) //cho phép lấy dữ liệu người dùng từ form

app.get('/', function (req, res) {
    let n = new Date()
    let name = "Captain Jack"
    let studentFood = []
    fs.readFile('food.txt', 'utf-8', function (err, data) {
        let data2 = data.trim().split('\n')
        for (i = 0; i < data2.length; i++) {
            let s = data2[i].split(';')
            let studentElement = {
                name: s[0],
                food: s[1] 
            }
            studentFood.push(studentElement)
        }
        res.render('home', {'studentFood' : studentFood})
    })
})

app.get('/student', function (req, res) {
    let foods = ['com', 'ga', 'bo']

    for (i = 0; i < foods.length; i++) {
        foods[i] = foods[i].toUpperCase()
    }
    res.render('student', { 'foods': foods })
})

app.post('/registerLunch', function (req, res) {
    let name = req.body.txtName
    let food = req.body.food
    let userInfo = {
        'name': name,
        'food': food
    }
    res.render('thank', { 'user': userInfo })
    fs.appendFile('food.txt', name + ';' + food + '\n', 'utf-8', function (err, data) {

    })
})


app.listen(5000)

console.log('server is running')