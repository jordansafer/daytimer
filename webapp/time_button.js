class TimeButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: false, time: 0 }
  }

  render() {
    const color = this.state.active ? 'lightgreen' : 'pink'

    const seconds = String(this.state.time % 60).padStart(2, "0")
    const minutesRemaining = Math.floor(this.state.time / 60)
    const minutes = String(minutesRemaining % 60).padStart(2, "0")
    const hours = String(Math.floor(minutesRemaining / 60)).padStart(2, "0")

    return (
      <div style={{ 
        backgroundColor: color,
        margin: '10px',
        fontSize: '7em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
       }} 
           onClick={() => {
            // 1. Post update to backend
            fetch('/clock', {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: this.props.name
              })
            })
            .then((response) => response.json())
            .then((backendStateString) => {
              const backendState = JSON.parse(backendStateString)
              this.setState((state) => ({
                active: Boolean(backendState.running),
                time: Number(backendState.time)
              }))
            })
              
            // 2. Update on frontend
            this.setState((state) => ({ 
              active: !state.active, 
              time: state.time
            }));
          }}>
         {hours}:{minutes}:{seconds}
      </div>
    )
  }

  tick() {
    this.setState((state) => {
      const active = state.active && state.time > 0
      const time = active ? state.time - 1 : state.time
      return {
        active: active,
        time: time
      }
    })
  }

  syncBackend() {
    fetch('/clock?name=' + this.props.name)
    .then((response) => response.json())
    .then((backendStateString) => {
      const backendState = JSON.parse(backendStateString)
      this.setState((state) => ({
        active: Boolean(backendState.running),
        time: Number(backendState.time)
      }))
    })
  }

  componentDidMount() {
    this.timerUpdate = setInterval(
      () => this.tick(),
      1000
    )
    this.backendSync = setInterval(
      () => this.syncBackend(),
      Math.floor(5 * 1000)
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerUpdate)
    clearInterval(this.backendSync)
  }
}

const timing_container = document.querySelector('#timing_container');
const work_button = <TimeButton name="work"/>
const play_button = <TimeButton name="play"/>
const buttons = <div className="flex-row">
  {work_button}
  {play_button}
</div>
ReactDOM.render(buttons, timing_container)
