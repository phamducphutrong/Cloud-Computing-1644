var http = require("http")

var myserver = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (req.url == '/') {
        res.write('<html><body><p style="color:red">This is home Page.</p></body></html>');
    } else if (req.url == '/student') {
        res.write('<html><body><p style="color:blue">This is student Page.</p></body></html>');
    } else {
        res.write('<html><body><p style="color:yellow">Not found.</p></body></html>');
    }
    res.end
})

myserver.listen(5000)
console.log("Server is running!")