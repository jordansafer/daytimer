import { response } from 'express';
import express = require('express');

const app = express()
const port = 3000

class Clock {
  time:number
  running:boolean
  name:string

  //constructor 
  constructor(time:number, running:boolean, name:string) { 
     this.time = time
     this.running = running 
     this.name = name
  } 

  start():void {
    this.running = true
  }

  stop():void {
    this.running = false
  }

  reset(time:number):void {
    console.log(`${this.name}: resetting to ${time}`)
    this.stop()
    this.time = time
  }

  update():void {
    if (this.running) {
      this.time = this.time - 1
      console.log(`${this.name}: ${this.time}`)
    }
    if (this.time == 0) {
      this.running = false
    }
  }
}

class ClockManager {
  work_clock:Clock
  play_clock:Clock

  constructor() {
    this.work_clock = new Clock(0, false, 'work')
    this.play_clock = new Clock(0, false, 'play')

    const update_time = function(work_clock:Clock, play_clock:Clock):void {
      work_clock.update()
      play_clock.update()
    }

    setInterval(update_time, 1000, this.work_clock, this.play_clock)
  }

  switch(name:string):void {
    if (name == 'work') {
      this.work_clock.start()
      this.play_clock.stop()
    } else {
      this.play_clock.start()
      this.work_clock.stop()
    }
  }

  reset(work_time:number,play_time:number) {
    this.work_clock.reset(work_time)
    this.play_clock.reset(play_time)
  }

  get_status(name:string):Clock {
    return  name == 'work' ? this.work_clock : this.play_clock
  }
}

function convertDateToTime(date:string):number {
  const parts = date.split(':')
  const hours = Number(parts[0])
  const minutes = Number(parts[1]) + 60 * hours
  return 60 * minutes
}

const clocks = new ClockManager()


app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.use('/', express.static('webapp'))

// handle frontend updating countdown times
app.post('/submit', function (req, res) {

    // 1. start a countdown, set values for both clocks
    clocks.reset(convertDateToTime(req.body.work_time), convertDateToTime(req.body.other_time))
    
    // 2. send clocks times to frontend TODO
    res.sendFile(__dirname + '/webapp/index.html')
})

app.post('/clock', function (req, res) {
  clocks.switch(req.body.name)

  const status = clocks.get_status(req.body.name)
  res.json(JSON.stringify(status))
})

app.get('/clock', function (req, res) {
  const status = clocks.get_status(req.body.name)
  res.json(JSON.stringify(status))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
