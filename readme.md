实现react框架

npm run start 运行

需要了解babel的作用
babel 插件
```
{
  "presets": [
  "@babel/preset-env",
  ["@babel/preset-react"]
  ],
  "plugins": [    [
    "@babel/plugin-transform-react-jsx",
    {
      "pragma": "MyReact.createElement"
    }
  ]]
}
```