var express = require('express')
var app = express()
var fs = require('fs')

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.get('/', function (req, res) {
    // let name = 'Captain Jack'
    // let now = new Date()
    // console.log("my app:" + now)
    let nameAndImage = []
    fs.readFile('data.txt', 'utf-8', function(err,data){
        let data2 = data.trim().split('\n')
        for (i = 0; i < data2.length; i++) {
            let s = data2[i].split(';')
            if(s[1].trim().endsWith('.jpg')|| s[1].trim().endsWith('.png')){
                let nameAndImageElement = {
                    name: s[0],
                    image: s[1]
                }
                nameAndImage.push(nameAndImageElement)
            }
        }
    })
    res.render('index', { 'nameAndImage' : nameAndImage })
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running')