import express = require('express');

const app = express()
const port = 3000

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.use('/', express.static('webapp'))

// handle frontend updating countdown times
app.post('/submit', function (req, res) {
    console.log(req.body)

    // 1. start a countdown, set values for both clocks
    // 2. send clocks times to frontend

    res.send('Got a POST request')
})

app.post('/clock', function (req, res) {
  console.log(req.body)

  res.send("hi")
})

// handle frontend changing 


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const work_clock = 0
const play_clock = 0