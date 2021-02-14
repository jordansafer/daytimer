class TimeButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: false, time: 0 }
  }

  render() {
    const color = this.state.active ? 'lightgreen' : 'pink'

    const seconds = time % 60
    const minutesRemaining = time / 60
    const minutes = minutesRemaining % 60
    const hours = minutesRemaining / 24

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
            console.log(this.props.name)

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
            .then((response) => {
              console.log(response) // TODO update with backend value
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

  backendSync() {
    fetch('/clock')
    .then((response) => {
      console.log(response) // TODO update state here
    })
  }

  componentDidMount() {
    this.timerUpdate = setInterval(
      () => this.tick(),
      1000
    )
    this.backendSync = setInterval(
      () => this.syncBackend(),
      60 * 1000
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