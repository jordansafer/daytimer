import express = require('express');

const app = express()
const port = 3000

app.use(express.urlencoded({
    extended: true
}))
app.use('/', express.static('webapp'))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.post('/submit', function (req, res) {
    console.log(req.body)
    res.send('Got a POST request')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})