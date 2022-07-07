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
    this.setState({
      name: 'ilv aaa'
    })
  };

  render() {
    console.log('app render')
    return (
      <div className="wrapper">
        <h1 style={styleObj}>hello {this.state.name}</h1>
        <Job job={this.state.job}/>
        <Hobby hobby={this.state.hobby} />
        <button onClick={this.clickBtn}>clickButton 修改名字</button>
        <TestState />
      </div>
    );
  }
}

class Job extends MyReact.Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log('job render')
    return <div>我的工作是 {this.props.job}</div>
  }
}


function Hobby(props) {
  console.log('hobby render')
  return <div>我的兴趣是 {props.hobby}</div>
}

class TestState extends MyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      state1: ''
    }
  }
  
  update = () => {
    this.setState({state1: 'aaa'})
  }

  render() {
    console.log('testState render')
    return (
      <div onClick={this.update}>{this.state.state1} testState</div>
    )
  }

}

MyReactDOM.render(<App />, document.querySelector("#root"));
