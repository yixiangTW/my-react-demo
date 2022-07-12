import MyReact from "./react"

const setAttribute = (node, key, value) => {
  if (key.startsWith('on')) {
    node[key.toLocaleLowerCase()] = value
  } else if (key === 'style') {
    Object.assign(node.style, value)
  } else {
    node[key] = value
  }
}

const render = (vnode, container) => {
  return diff(null, vnode, container)
}

const diff = (dom, vnode, container) => {
  const patchedDom = diffNode(dom, vnode)
  if (container && patchedDom.parentNode !== container) {
    container.appendChild(patchedDom)
  }
  return patchedDom
}

// 旧的dom，和新的虚拟dom比较
const diffNode = (dom, vnode) => {
  if(typeof vnode === 'undefined' || vnode === null || typeof vnode === 'boolean') {
    return removeDom(dom)
  }
  if(typeof vnode === 'number') {
    vnode = String(vnode)
  }
  let patchedDom = dom
  // 如果虚拟dom是文本类型，要么替换类型，要么替换元素
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (patchedDom && patchedDom.nodeType === 3) {
      if (patchedDom.textContent !== vnode) {
        patchedDom.textContent = vnode
      }
    } else {
      patchedDom = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(patchedDom, dom);
      }
    }
    return patchedDom
  }

  // 如果虚拟是组件，就diff组件
  if (typeof vnode === 'object' && typeof vnode.tag === 'function') {
    patchedDom = diffComponent(dom, vnode)
    const component = patchedDom._component
    if(component.$init = true) {
      component.$init = false
      if(component.componentDidMount) {
        component.componentDidMount()
      }
    }

    return patchedDom
  }

  // 否则虚拟dom就是普通的html标签类型，并且dom不存在
  if (!dom) {
    patchedDom = document.createElement(vnode.tag)
  }

  // dom存在，但标签变了，旧标签替换新标签
  if (dom && dom.nodeName.toLowerCase() !== vnode.tag.toLowerCase()) {
    patchedDom = document.createElement(vnode.tag)
    dom.childNodes.forEach((child) => patchedDom.appendChild(child))
    replaceDom(patchedDom, dom)
  }

  diffAttributes(patchedDom, vnode)
  diffChildren(patchedDom, vnode.children)
  return patchedDom
}

const diffComponent = (dom, vnode) => {
  let component = dom ? dom._component : null

  if (component && component.constructor === vnode.tag) {
    setComponentProps(component, vnode.attrs)
  } else {
    component = createComponent(vnode.tag, vnode.attrs)
    setComponentProps(component, vnode.attrs)
  }

  return component.$root
}

const createComponent = (constructor, attrs) => {
  let component
  if (constructor.__proto__ === MyReact.Component) {
    component = new constructor(attrs)
  } else {
    component = new MyReact.Component(attrs)
    component.constructor = constructor
    component.render = function () {
      return this.constructor(attrs)
    }
  }
  if(component && component.componentWillMount) {
    component.componentWillMount()
  }
  component.$init = true
  return component
}

const renderComponent = (component) => {
  let vnode = component.render()
  let dom = diffNode(component.$root, vnode)

  if(!component.$init && component.shouldComponentUpdate) {
    const isRender = component.shouldComponentUpdate(component.props, component.state)
    if(!isRender) {
      return isRender
    }
  }
  component.$root = dom // 组件获取真实dom
  component.$root._component = component // 真实dom获取组件

  if(!component.$init && component.componentDidUpdate) {
    component.componentDidUpdate()
  }
}

const replaceDom = (newNode, oldDom) => {
  if (oldDom && oldDom.parentNode) {
    oldDom.parentNode.replaceChild(newNode, oldDom)
  }
}

const diffChildren = (patchedDom, vChildren) => {
  let domChildren = patchedDom.childNodes
  let domsHaskey = {}
  for (let dom of domChildren) {
    if (dom.key) {
      domsHaskey[dom.key] = dom
    }
  }


  let vChild
  let patchChildDom
  let length = Math.max(domChildren.length, vChildren.length)
  for (let i = 0; i < length; i++) {
    vChild = vChildren[i]
    if (vChild.key && domsHaskey[vChild.key]) {
      patchChildDom = diffNode(domsHaskey[vChild.key], vChild)
    } else {
      patchChildDom = diffNode(domChildren[i], vChild)
    }
    if (patchChildDom.parentNode !== patchedDom) {
      patchedDom.appendChild(patchChildDom)
    }
    setOrderInContainer(patchedDom, patchChildDom, i)
  }

}

const setOrderInContainer = (container, dom, order) => {
  if (container.childNodes[order] !== dom) {
    container.childNodes[order].insertAdjacentElement('beforebegin', dom)
  }
}

const diffAttributes = (dom, vnode) => {
  const old = {}
  const attrs = vnode.attrs

  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i]
    old[attr.name] = attr.value
  }

  for (let key in old) {
    if (!(key in attrs)) {
      setAttribute(dom, key, undefined)
    }
  }

  for (let key in attrs) {
    if (old[key] !== attrs[key]) {
      setAttribute(dom, key, attrs[key])
    }
  }

}

const setComponentProps = (component, props) => {
  if(component.$root && component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props)
  }
  component.props = props
  renderComponent(component)
}


const removeDom = (dom) => {
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom)
  }
}

const MyReactDOM = {
  render,
  setAttribute,
  renderComponent
}

export default MyReactDOM