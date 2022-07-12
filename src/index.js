import MyReact from "../lib/react";
import MyReactDOM from "../lib/react-dom";


const styleObj = {
  color: "red",
  fontSize: "20px",
};

class App extends MyReact.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: 'ilv',
      job: '前端工程师',
      hobby: '看电影'
    }
  }

  clickBtn = () => {
    let newName = window.prompt('输入标题')
    this.setState({
      name: newName
    })
  };

  render() {
    return (
      <div className="wrapper">
        <h1 style={styleObj}>hello {this.state.name}</h1>
        <Job job={this.state.job}/>
        <Hobby hobby={this.state.hobby} />
        <button onClick={this.clickBtn}>clickButton 修改名字</button>
        <TestState init={1} name={this.state.name}/>
      </div>
    );
  }
}

class Job extends MyReact.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>我的工作是 {this.props.job}</div>
  }
}


function Hobby(props) {
  return <div>我的兴趣是 {props.hobby}</div>
}

class TestState extends MyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      state1: 0
    }
  }

  componentWillMount() {
    console.log('componentWillMount')
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.setState({state1: this.props.init})
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps)
  }

  shouldComponentUpdate(props, state) {
    console.log('shouldComponentUpdate')
    console.log(props, state)
    return true
  }
  
  update = () => {
    this.setState({state1: this.state.state1 + this.props.init})
  }

  render() {
    return (
      <div onClick={this.update}>{this.state.state1} 点击+1 {this.props.name}</div>
    )
  }

}

MyReactDOM.render(<App />, document.querySelector("#root"));
