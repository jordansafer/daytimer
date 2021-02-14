const e = React.createElement

class TimeButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: false, hours: 0, minutes: 0, seconds: 0 }
  }

  render() {
    const color = this.state.active ? 'lightgreen' : 'pink'

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

            let response = fetch('/clock', {
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
              //console.log(response)
            })
              
            // 2. Update on frontend
            this.setState((state) => ({ 
              active: !state.active, 
              hours: state.hours, 
              minutes: state.minutes, 
              seconds: state.seconds 
            }));
          }}>
         {this.state.hours}:{this.state.minutes}:{this.state.seconds}
      </div>
    )
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