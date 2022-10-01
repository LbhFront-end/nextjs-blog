---
title: 'PropTypes'
date:  '2019-02-19 10:00:44'
slug: 'PropTypes'
tags: 'PropTypes'
categories: 
  - 'react'
---

## PropTypes 类型检查

### PropTypes 例子

```javascript
import PropTypes from 'prop-types';
MyComponent.propTypes = {
    // 将属性声明为以下 JS 原生类型
    optionalArray: PropTypes.array,
    optionalBool: PropTypes.bool,
    optionalFunc: PropTypes.func,
    optionalObject: PropTypes.object,
    optionalNumber: PropTypes.number,
    optionalSting: PropTypes.string,
    optionalSymbol: PropTypes.symbol,

    // 可被渲染的元素（包括数字、字符串、子元素或者数组）
    optionalNode: PropTypes.node,

    // 一个 React 元素
    optionalElement: PropTypes.element,

    // 声明属性为某个类的实例，使用 JS 的 instanceof 操作符实现
    optionalMessage: PropTypes.instanceof(Message),

    // 限制属性值是某个特定值之一
    optionalEnum: PropTypes.oneOf(['News', 'Photos']),

    // 限制为列举类型之一的对象
    optionalUnion: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceof(Message)
    ]),

    // 指定元素类型的数组
    optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

    // 指定类型的对象
    optionalObjectOf: PropTypes.objectOf(PropTypes.number),

    // 指定属性及其类型的对象
    optionalObjectWithShape: PropTypes.shape({
        color: PropTypes.string,
        fontSize: PropTypes.number
    }),

    // 可以在任何 PropTypes 属性后面加上 'isRequired' 后缀，这样如果这个属性父组件没有提供时，会打印警告消息
    requiredFunc: PropTypes.func.isRequired,

    // 任何类型的数据
    requiredAny: PropTypes.any.isRequired,

    // 可以执行一个自定义验证器，在验证失败时返回一个 Error 对象而不是 'console.warn' 或抛出异常，在 oneOfType 中不起作用
    customProp: function(props, propName, componentName) {
        if (!/matchme/.test(props[propName])) {
            return new Error(
                'Invalid prop `' + propName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    },

    // 提供一个自定义的 `arrayOf` 或 `objectOf` 验证器，它应该在验证失败时返回一个 Error 对象。 它被用于验证数组或对象的每个值。验证器前两个参数的第一个是数组或对象本身，第二个是它们对应的键。
    customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
        if (!/matchme/.test(propValue[key])) {
            return new Error(
                'Invalid prop `' + propFullName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    })
}
```

### 属性默认值

defaultProps 可以为 props 定义默认值。

```javascript
class Greeting extends React.Component {
    render() {
        return ( <
            h1 > Hello, {
                this.props.name
            } < /h1>
        );
    }
}

// 为属性指定默认值:
Greeting.defaultProps = {
    name: 'Stranger'
};

// 渲染 "Hello, Stranger":
ReactDOM.render( <
    Greeting / > ,
    document.getElementById('example')
);
```
