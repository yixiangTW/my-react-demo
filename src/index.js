const MyReact = {}
MyReact.createElement = function(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

const clickBtn = () => {}
const name = 'ilv'

const element = <div className="wrapper">
  <h1>hello {name}</h1>
  <button onClick={clickBtn}>clickButton</button>
</div>

console.log(element)
