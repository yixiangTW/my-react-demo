import MyReactDOM from "./react-dom"

const createElement = function(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children,
    key: attrs ? (attrs.key ? attrs.key : null) : null
  }
}

class Component {
  constructor(props) {
    this.props = props
    this.state = {}
  }
  
  setState(state) {
    this.state = Object.assign(this.state, state)
    MyReactDOM.renderComponent(this)
  }
}

const MyReact = {
  createElement,
  Component
}


export default MyReact