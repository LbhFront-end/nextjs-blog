---
title: '前端面试题目汇总摘录（浏览器与性能基础篇）'
date: '2019-04-08  09:30:54'
slug: 'Summary-Excerpt-Of-Front-End-Interview-Questions-BrowserAndPerformanceBasics'
tags: '前端面试题'
categories:
  - '前端面试'
---

温故而知新，保持空杯心态. 续 [前端面试之道](https://yuchengkai.cn/docs/frontend)继续复习浏览器相关内容

## 浏览器基础

### 事件机制

#### 事件触发三阶段

- 'window 往事件 触发处传播，遇到注册的捕获事件会触发'
- '传播到事件触发处时触发注册的事件'
- '从事件触发处往 window 传播，遇到注册的冒泡事件会触发'

事件触发一般来说会按照上面的顺序进行，但是也有特例，如果给一个目标节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行。

```javascript
// 下面会先打印冒泡然后捕获
node.addEventListener(
  'click',
  event => {
    console.log('冒泡');
  },
  false
);

node.addEventListener(
  'click',
  event => {
    console.log('捕获');
  },
  true
);
```

#### 注册事件

addEventListener 注册事件，改函数的第三个参数可以是布尔值，也可以是对象。对于布尔值 useCapture 参数来说，该参数默认值为 false。useCapture 决定了注册的事件是捕获事件还是冒泡事件。对于对象参数来说，可以使用下面几个属性：

- 'capture ，布尔值，和 useCapture 作用一样'
- 'once, 布尔值，值为 true 表示该回调值调用一次，调用后会移除监听'
- 'passive，布尔值，表示永远不会调用 preventDefault'

如果我们希望事件只触发在目标上，可以调用 stopPropagation 来阻止事件的进一步传播。通常我们认为 stopPropagation 是用来阻止事件冒泡的，其实该函数也可以阻止捕获事件。stopImmediatePropagation 同样也可以实现阻止事件，但是还能阻止该事件目标执行别的注册事件。

```javascript
node.addEventListener(
  'click',
  event => {
    event.stopImmediatePropagation();
    console.log('冒泡');
  },
  false
);
// 点击 node 只会执行上面的函数，下面的不会执行
node.addEventListener(
  'click',
  event => {
    console.log('捕获');
  },
  true
);
```

#### 事件代理

如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上面

```html
<ul id="ul">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
<script>
  let ul = document.querySelector('#ul');
  ul.addEventListener('click', event => {
    console.log(event.target);
  });
</script>
```

事件代理的方法相对于直接给目标注册事件来说，有以下优点：

- '节省内存'
- '不需要给子节点注销事件'

### 跨域

#### JSONP

JSONP 原理很简单，就是利用 `<script>` 标签没有跨域限制的漏洞。通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯的时候

```html
<script src="http://domain/api?param1=a&param2=b&callback=jsonp"></script>
<script>
  function jsonp(data) {
    console.log(data);
  }
</script>
```

JSONP 使用简单且兼容性不错，但是只限于 get 请求

在开发中可能会遇到多个 JSONP 请求的回调函数名是相同的，这时候就需要自己封装一个 JSONP ，下面是简单的实现：

```javascript
function jsonp(url, jsonpCallback, success) {
  let script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.type = 'text/javascript';
  window[jsonpCallback] = function (data) {
    success && success(data);
  };
  document.body.appendChild(script);
}
jsonp('http://xxx', 'callback', function (value) {
  console.log(value);
});
```

#### CORS

CORS 需要浏览器和后端同时支持，IE8 和 9 需要通过 XDomainRequest 来实现

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端，只要后端实现了 CORS 就实现了跨域。

服务端设置了 Access-Control-Allow-Origin 就可以开启 CORS , 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都是可以访问资源的。

会在发送请求时出现两种情况，分别为简单请求和复杂请求

**简单请求**

以Ajax 为例，当满足下面的条件的时候会触发简单请求

1.  使用 Get, HEAD, POST

2.  Content-type 的值仅限 text/plain, multipart/form-data, application/x-www-form-urlencoded 之一

请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器，也可以使用 XMLHttpRequest.upload 属性访问

**复杂请求**

对于复杂的请求，首先会发起一个预检请求，该请求是 option 方法，通过该请求来指点服务端是否运行跨域请求。

对于预检请求，使用 Node 来设置 CORS 的话，可能会遇到一个坑，以 express 为例

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization,Access-Control-Allow-Credentials'
  );
  next();
});
```

上面的这个代码会验证 Authorization 子段，如果没有话的就会报错

当前端发起了复杂请求，返回的结果永远是报错的。因为预检请求也会进入到回调中，也会触发 next 方法，因为预检请求并不包含 Authorization 子弹，所以服务端也会报错。想要解决这个问题很简单，只要在 回调中过滤掉 option 就可以了

```javascript
res.statusCode = 204;
res.setHeader('Content-Length', '0');
res.send();
```

#### document.domain

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。

只需要给页面添加 document.domian = 'test.com' 表示二级域名都相同就可以实现跨域

#### postMessage

这种方式通常用于获取嵌入页面中的第三方页面数据，一个页面发送消息，另一个页面判断来源并接受消息

```javascript
// 发送消息端
window.parent.postMessage('message', 'http://test.com');
// 接受消息端
const mc = new MessageChannel();
mc.addEventListener('message', event => {
  const origin = event.origin || event.originalEvent.origin;
  if (origin === 'http://test.com') {
    console.log('验证通过');
  }
});
```

### Event loop

JS 是门非阻塞单线程语言

JS 在执行过程中会产生执行环境，这些执行环境会被顺序的加入到执行栈中。如果遇到异步的代码，会被挂起并加入到 Task(有多种 task) 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。

```javascript
console.log('script start');
setTimeout(function () {
  console.log('setTimeout');
}, 0);
console.log('script end');
// script start
// script end
// setTimeout
```

以上代码虽然 `setTimeout` 延时为 0，其实还是异步。这是因为 HTML5 标准规定这个函数第二个参数不得小于 4 毫秒，不足会自动增加。所以 `setTimeout` 还是会在 `script end` 之后打印。

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask） 和 宏任务（macrotask）。在 ES6 规范中，microtask 称为 `jobs` ，macrotask 称为 `task` 。

```javascript
console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0);

new Promise(resolve => {
  console.log('Promise');
  resolve();
})
  .then(function () {
    console.log('promise1');
  })
  .then(function () {
    console.log('promise2');
  });

console.log('script end');
// script start
// Promise
// script end
// promise1
// promise2
// setTimeout
```

微任务包括 `process.nextTick` ， `promise` ， `Object.observe` ， `MutationObserver`

宏任务包括 `script` ， `setTimeout` ， `setInterval` ， `setImmediate` ， `I/O` ， `UI rendering`

宏任务中包括了 `script` ，浏览器会先执行一个宏任务，接下来有异步代码的话就先执行微任务。

正确的一次 Event Loop 顺序是这样的

1.  执行同步代码，属于宏观任务
2.  执行栈为空，查询是否有微任务需要执行
3.  执行所有微任务
4.  必要的话渲染 UI
5.  然后开始下一轮 Event Loop ，执行宏任务中的异步代码

如果宏任务中的异步代码有大量的计算并且需要操作 DOM 的话，为了更快的界面响应，可以把操作 DOM 放入 微任务中。

#### Node 的 Event loop

Node 中的 Event loop 和浏览器的不相同

Node 中的 Event loop 分成了6个阶段，它们会按照顺序反复执行

```shell
┌──────────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

#### timer

timer 阶段会执行 setTimeout 和 setInterval

一个 timer 指定的时间并不是准确的时间，而是达到这个事件后尽快执行回调，可能会因为系统正在执行别的事务而延迟

下限的时间有一个范围：[1, 2147483647]，如果设置的时间不在范围内，将被设置为 1.

#### I/O

I/O 阶段会执行除了 close 事件，定时器和 setImmediate 的回调

#### idle, prepare

idle，prepare 阶段内部实现

#### poll

poll 阶段很重要，在这一阶段中，系统会做两件事情

1.  执行到点的定时器
2.  执行 poll 队列中的事件

并且当 poll 中没有定时器的情况下，会发现以下两件事情

- '如果poll队列不为空，会遍历回调队列并同步执行，直到队列为空或者系统限制'
- '如果poll队列为空, 会发生两件事情'
  - '如果有 setImmediate 需要执行的时候，poll 阶段会停止并且进入到 check 阶段执行 setImmediate'
  - '如果没有 setImmediate 需要执行，会等待回调被加入到队列中并立即执行回调'

#### check

check 阶段执行 setImmediate

#### close callbacks

close callbacks 阶段执行 close 事件

并且在 Node 中，有些情况下的定时器执行顺序是随机的

```javascript
setTimeout(() => {
  console.log('setTimeout');
}, 0);
setImmediate(() => {
  console.log('setImmediate');
});
// 这里可能会输出 setTimeout，setImmediate
// 可能也会相反的输出，这取决于性能
// 因为可能进入 event loop 用了不到 1 毫秒，这时候会执行 setImmediate
// 否则会执行 setTimeout
```

当然在这种情况下，执行顺序是相同的

```javascript
var fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
// 因为 readFile 的回调在 poll 中执行
// 发现有 setImmediate ，所以会立即跳到 check 阶段执行回调
// 再去 timer 阶段执行 setTimeout
// 所以以上输出一定是 setImmediate，setTimeout
```

上面介绍的都是 macrotask 的执行情况，microtask 会在以上每个阶段完成后立即执行。

```js
setTimeout(() => {
  console.log('timer1');

  Promise.resolve().then(function () {
    console.log('promise1');
  });
}, 0);

setTimeout(() => {
  console.log('timer2');

  Promise.resolve().then(function () {
    console.log('promise2');
  });
}, 0);

// 以上代码在浏览器和 node 中打印情况是不同的
// 浏览器中一定打印 timer1, promise1, timer2, promise2
// node 中可能打印 timer1, timer2, promise1, promise2
// 也可能打印 timer1, promise1, timer2, promise2
```

Node 中的 `process.nextTick` 会先于其他 microtask 执行。

```js
setTimeout(() => {
  console.log('timer1');

  Promise.resolve().then(function () {
    console.log('promise1');
  });
}, 0);

process.nextTick(() => {
  console.log('nextTick');
});
// nextTick, timer1, promise1
```

### 存储

#### cookie, localStorage, sessionStorage, indexDB

| 特性 | cookie | localStorage | sessionStorage | indexDB |
| :----------- '| :----------------------------------------: | :----------------------: | :------------: | :----------------------: |'
| 数据生命周期 | 一般由服务器生成，可以设置过期时间 | 除非被清理，否则一直都在 | 页面关闭就清理 | 除非被处理，否则一直都在 |
| 数据存储大小 | 4K | 5M | 5M | 无限 |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响 | 不参与 | 不参与 | 不参与 |

cookie 不建议用于存储，如果没有大量的数据存储需求的话，可以使用 localStorage 和 sessionStorage。对于不怎么改变的数据使用 localStorage 存储，否则可以用 sessionStorage 存储。

对于 cookie 我们还需要 注意安全性

| 属性 | 作用 |
| --------- '| ------------------------------------------------------------ |'
| value | 如果用于保存用户登录状态，应该将该值加密，不能使用明文的用户标识 |
| http-only | 不能通过 JS 访问 Cookie，减少 XSS 攻击 |
| secure | 只能在协议为 HTTPS 的请求中携带 |
| same-site | 规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击 |

#### Service Worker

> Service Worker 是运行在浏览器后面的独立线程，一般可以用来实现缓存功能，使用 Service Worker 传输协议必须为 HTTPS，以为 Service Worker 中涉及到拦截，所以必须使用 HTTPS 协议来保障安全。
>
> Service Worker 实现缓存功能一般分成三个步骤：首先你需要先注册 Service Worker ，然后监听到 install 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查找是否存在缓存。，存在缓存的话就可以直接读取缓存文件，否则就去请求数据，下面是这个步骤的实现：

```javascript
// index.js
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js')
        .then(function(registration) {
            console.log('service worker 注册成功');
        }).catch(function(err) {
            console.log('service worker 注册失败');
        });
}

// sw.js
// 监听 install 事件，回调中缓存所需文件
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('my-cache').then(function(cache) {
            return cache.addAll(['./index.html', './index.js'])
        });
    )
});

// 拦截所有请求
// 如果缓存中已经有请求的数据就直接用缓存，否则就去请求数据
self.addEventListener('fetch', e => {
    e.respondWith(
        cache.match(e.request).then(function(response) {
            if (response) return response;
            console.log('fetch source');
        })
    )
});
```

这个内容在 我的一篇 webpack4.x从基础到实战笔记中也有提及

### 缓存机制

性能优化领域相关面试题目

缓存是性能优化中简单高效的一种优化方式，可以显著减少网络传输带来的损耗

对于一个数据来说，可以分成网络请求，后端处理，浏览器响应三个步骤。浏览器缓存可以帮助我们在第一步和第三步中优化性能。如果直接使用缓存而不发起请求，或者发送了请求但是后端存储的数据和前端的一样，那么就没有必要再将数据回传过来，这样就减少了响应数据。

可以分几个部分来讲这个浏览器缓存机制：

#### 缓存位置

1.  Service Worker
2.  Memory Cache
3.  Disk Cache
4.  Push Cache
5.  网络请求

**Service Worker**

Service Worker 的缓存与浏览器中其他内建的缓存机制是不同的，它可以让我们自由控制缓存文件，如何匹配、读取缓存，并且缓存是持续性的。

当 Service Worker 没有命中缓存的时候，我们需要去调用 fetch 函数获取数据。也就是说，如果我们没有在 Service Worker 命中缓存的话，会根据缓存优先级去查找数据。但是不管我们是从 Memory Cache 中还是从网络请求中获取的数据，浏览器都会显示我们是从 Service Worker 中获取的内容。

**Memory Cache**

Memory Cache 也就是内存中的缓存，读取内存中的数据肯定比磁盘的块。但是内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放，一旦我们关闭了 Tag 页面，内存中的缓存也就被释放了。

**Dish Cache**

Disk Cache 也就是存储在硬盘中的缓存，读取速度是慢点，但是什么都能存储在磁盘中，与 Memory Cache 相比胜在容量和 存储时效性上面。

在所有浏览器中，Disk Cache 覆盖面基本是最大的，它会根据 HTTP Header 中的字段来判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。并且及时在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。

**Push Cache**

Push Cache 是 HTTP/2 中的内容。当以上三种缓存都没有命中时才会被使用，并且缓存时间也很短暂，只会在会话 （session）中存在，一旦会话结束便会被释放。

- '所有的资源都能被推送，但是 Edge 和 Safari 浏览器兼容性不怎么好'
- '可以推送 `no-cache` 和 `no-store` 的资源'
- '一旦连接被关闭，Push Cache 就被释放'
- '多个页面可以使用相同的 HTTP/2 连接，也就是说能使用同样的缓存'
- 'Push Cache 中的缓存只能被使用一次'
- '浏览器可以拒绝接受已经存在的资源推送'
- '你可以给其他域名推送资源'

[HTTP/2 push is tougher than I thought](https://link.juejin.im/?target=https%3A%2F%2Fjakearchibald.com%2F2017%2Fh2-push-tougher-than-i-thought%2F)

**网络请求**

如果所有缓存都没有命中的话，那么只能发起网络请求来获取资源了。

在性能上面考虑，大部分接口都应该选择好缓存策略

#### 缓存策略

通常浏览器的缓存策略分成两种，强缓存和协商缓存，并且缓存策略都是通过设置 HTTP Header 来实现的。

**强缓存**

强缓存可以设置两种 HTTP Header 来实现：Expires 和 Cache-Control。强缓存表示在缓存期间不需要请求，state code 为 200

**Expires**

```http
Expires:  Sat,20,Apr 2019 10:06:00 GMT
```

Expires 是 HTTP/1 的产物，表示资源会在 Sat, 20, Apr 2019 10:06:00 GMT 后过期，需要再次请求。并且 Expires 受限于本地时间，如果修改了本地时间，可能会造成缓存失效。

**Cache-Control**

```http
Cache-Control:max-age=30
```

Cache-Control 出现于 HTTP/1.1，优先级高于 Expires，该属性值表示资源会在 30秒后过去，需要再次请求。

Cache-Control 可以在请求头或者响应头中设置，并且可以组合使用多种指令。比如希望资源能被缓存下来，并且是客户端是代理服务器都能缓存，还能设置缓存失效时间等。

| 指令 | 作用 |
| ------------ '| -------------------------------------------------------- |'
| public | 表示响应可以被客户端和代理服务器缓存 |
| private | 表示响应只可以被客户端缓存 |
| max-age=30 | 缓存30秒后失效，需要重新请求 |
| s-maxage=30 | 覆盖 max-age 作用是一样的，只在代理服务器中生效 |
| no-store | 不缓存任何响应 |
| no-cache | 资源被缓存，但是立即失效，下次会发起请求验证资源是否过期 |
| max-stale=30 | 30秒内，即使缓存失效了，也使用该缓存 |
| min-fresh=30 | 希望30秒内获取最新的响应 |

**协商缓存**

如果缓存过期了，就需要发起请求验证资源是否需要更新。协商缓存可以通过设置两种 Http header 来实现：Last-Modifier 和 ETag

当浏览器发起请求验证资源的时候，如果资源没有做改变，那么服务器就会返回 304 状态码，并且更新浏览器缓存的有效期。

**Last-Modified 和 If-Modified-Since**

Last-Modified 表示本地文件最后修改日期。If-Modifier-Since 会将 Last-Modifier 的值发送给服务器，询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来，否则返回 304 状态码

但是 Last-Modifier 存在一些弊端：

- '如果本地打开缓存文件，即使没有对文件进行修改，但还是会造成 `Last-Modified` 被修改，服务端不能命中缓存导致发送相同的资源'
- '因为 `Last-Modified` 只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源'

因为这些弊端所有出现了 ETag

**ETag 和 If-None-Match**

ETag 类似于文件指纹，If-None-Match 会将当前的 Etag 发送给服务器，询问该资源 ETag 是否发生了变化，如果有变动的话就将新的资源发送回来。并且 ETag 的优先级比 Last-Modifier 搞。

那么如果什么缓存策略都没有设置，浏览器会怎么处理？

对于这种情况，浏览器会采用一个启发式算法，通常会取响应头的 Date 减去 Last-Modifier 值的 10% 作为缓存时间。

#### 实际场景引用缓存策略

**频繁变动的资源**

首先使用 Cache-Control：no-cache 使得浏览器每次都请求服务器，然后配合 ETag 和 Last-Modifier 来验证资源是否有效。这样的做法虽然不能节省请求数量，但是能显著减少响应数据大小

**代码文件**

指除了 HTML 之外的代码的文件。因为HTML 文件一般不缓存或者缓存时间很短。

一般来说，都会使用打包工具，webpack 等等来对文件名进行哈希处理，只有当代码修改过后才会生成新的文件名。这样我们就可以给文件设置一个缓存有效期一年 Cache-Control:max-age=31536000 这样就只有当 HTML 文件引入的文件名发生了改变的时候才会去下载最新的代码文件，否则就会一直使用缓存。

#### 其他优化

其实除了缓存的优化可以让性能显著提高，另外一个很重要点的是在开发阶段，尽量使用按需加载的原则来开发，增加代码的使用率从源头来优化性能，可能效果会更加显著。

### 在浏览器地址栏键入 URL，按下回车之后会经历一下流程

1.  解析 url 到 dns 服务器
2.  dns 服务器返回 ip 地址到浏览器
3.  跟随协议将 ip 发送到网络中
4.  经过局域网达到服务器
5.  进入服务器的 MVC 架构 controller
6.  经过逻辑处理，请求分发，调用 Model
7.  Model 与数据 进行交互，然后读取数据库，将结果通过 view 层返回到网络回到浏览器
8.  浏览器根据请求回来的 html 和关联的css js 文件进行渲染
9.  在渲染的过程中，浏览器根据 html 生成 dom 树，根据 css 生成 css 树
10. 将 dom 树和 css 树进行整合，最终知道 dom 节点的样式，在页面上进行样式渲染
11. 浏览器去执行 js 脚本
12. 最终展示页面

### 渲染机制

#### HTML=>DOM 树

打开一个网页时，浏览器会去请求对应的 HTML 文件，拿到 JS/CSS/HTML 文件的字符串，但是计算机是不理解这些字符串的，在网络中传输的内容都是01 字节数据。当浏览器接收到这些字节数据后，它会将这些字节数据转换为字符串，也就是我们写的代码。

当数据被转换成字符以后，浏览器会将这些字符串通过词法分析转换为标记（Token），这一过程叫做标价化（tokenization）

打标记会将代码分成一块块，然后打上标记，便于理解这些最小单位的代码的含义。结束标记化后开始转换为 Node，最后这些 Node 会根据不同 Node 之间的联系构建为一颗 DOM 树

```shell
字节数据 => 字符串 => Token => Node => DOM
```

#### CSS => CSSDOM 树

与上面的过程是类似的。在这一过程中浏览器会确定下每一个节点的样式是什么，并且在这一过程中是很消耗资源的。浏览器得递归 CSSDOM 树，然后确定具体的元素到底是什么样式

```shell
字节数据 => 字符串 => Token => Node => CSSDOM
```

#### 生成渲染树

将 DOM 与 CSSOM 合并为一个渲染树

这一过程不是简单将两者结合，渲染树只会包括㤇显示的节点和这些节点样式信息，如果某个节点是 display:none 的，那么就不会在渲染树中显示

当浏览器生成渲染树以后，就会根据渲染树来进行布局（也可以叫做回流），然后调用 GPU 绘制，合成图层，显示在屏幕上。

#### 浏览器的渲染机制一般分成下面几个步骤

1.  处理 HTML 并构建 DOM 树
2.  处理 CSS 构建 CSSOM 树
3.  将 DOM 与 CSSOM 合并为一个渲染树
4.  根据渲染树来布局，计算每个节点位置
5.  调用 GPU 绘制，合成图层，显示在屏幕上

#### 经典面试题目：插入几万个 DOM，如何实现页面不卡顿？

因为 DOM 是属于渲染引擎中的东西，而 JS 又是 JS 引擎中的东西。当我们通过 JS 操作 DOM 的时候，其实这个操作涉及到了两个线程之间的通信，那么势必会带来一些性能上的损耗。操作 DOM 次数一多，也就等同于一直在进行线程之间的通信，并且操作 DOM 可能还会带来重绘回流的情况，所以也就导致了性能上的问题。

对于这道题目来说，首先我们肯定不能一次性把几万个 DOM 全部插入，这样肯定会造成卡顿，所以解决问题的重点应该是如何分批次部分渲染 DOM。大部分人应该可以想到通过 `requestAnimationFrame` 的方式去循环的插入 DOM，其实还有种方式去解决这个问题：**虚拟滚动**（virtualized scroller）。

**这种技术的原理就是只渲染可视区域内的内容，非可见区域的那就完全不渲染了，当用户在滚动的时候就实时去替换渲染的内容。**

当我们滚动页面的时候就会实时去更新 DOM，这个技术就能顺利解决这道经典面试题。了解更多点击 [react-virtualized](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Fbvaughn%2Freact-virtualized)。

[掘金上的方案](https://juejin.im/post/5ca1ac256fb9a05e6938d2d1#heading-23)

方案一：分页，懒加载，把数据分页，然后每次接受一定的数据，避免一次性接收太多

方案二：setInterval，setTimeout，requestAnimationFrame 分批渲染，让数据在不同帧内去做渲染

方案三：使用 virtual-scroll，虚拟滚动。

virtual-scroll 虚拟滚动，这种方式是指根据容器元素的高度以及列表项元素的高度来显示长列表数据中的某一个部分，而不是去完整地渲染长列表，以提高无限滚动的性能。

virtual-scroll 原理，在用户滚动时，改变列表可视区域的渲染部分

- '计算当前可见区域起始数据的 startIndex'
- '计算当前可见区域结束数据的 endIndex'
- '计算当前可见区域的数据，并渲染到页面中'
- '计算 startIndex 对应的数据在整个列表中的偏移位置 startOffset 并设置到列表上'
- '计算 endIndex 对应的数据相对于可滚动区域最底部的偏移位置 endOffset，并设置到 列表上'

startOffset 和 endOffset 会撑开容器元素的内容高度，让其可持续的滚动；此外，还能保持滚动条处于一个正确的位置。

#### 阻塞渲染的情况

首先渲染是生成渲染树，所以 HTML 和 CSS 肯定会阻塞渲染，如果想要渲染更快，就应该降低一开始需要渲染的文件大小，并且扁平层级，优化选择器。

然后当浏览器在解析到 script 标签的时候，会暂停构建 DOM ，完成之后才会从暂停的地方重新开始。也就是说，，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS 文件，这也是都建议将 `script` 标签放在 `body` 标签底部的原因。

也可以给 `script` 标签添加 `defer` 或者 `async` 属性。当 `script` 标签加上 `defer` 属性以后，表示该 JS 文件会并行下载，但是会放到 HTML 解析完成后顺序执行，所以对于这种情况你可以把 `script` 标签放在任意位置。对于没有任何依赖的 JS 文件可以加上 `async` 属性，表示 JS 文件下载和解析不会阻塞渲染。

#### Load 和 DOMContentLoaded 区别

Load 事件触发代表页面中的 DOM ，CSS ，JS , 图片已经全部加载完毕

DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS 和图片加载.

#### 图层

一般来说，可以把普通文档流看做是一个图层。特定的属性可以生成一个新的图层。不同的图层渲染互不影响，所以对于某些频繁需要渲染的建议单独生成一个新图层，提高性能。但也不能生成过多的图层，会引起反作用。

通常下面几个常用属性可以生成新图层

- '3D 变换：translate3d，translateZ'
- 'will-change'
- 'video, iframe 标签'
- '通过动画实现的 opacity 动画转换'
- 'position：fixed'

#### 重绘（Repaint） 和 回流（Reflow）

重绘和回流是渲染步骤中的一小节，但是这两个步骤对于性能影响很大。

- '重绘是当节点需要更改外观而不影响布局的时候，比如改变 color ，就叫做重绘'
- '回流是布局或者几何属性需要改变就成为回流'

回流必定会引起重绘，重绘不一定会引起回流。回流所需要的成本比重绘高德多，改变深层次的节点很可能会导致父节点的一系列回流。

所以一下几个动作可能会导致性能问题：

- '改变 window 大小'
- '改变字体'
- '添加或者删除样式'
- '文字改变'
- '定位或者浮动'
- '盒模型'

重绘和回流其实和 Event Loop 有关

1.  当 Event Loop 执行完 Microtasks 后，会判断 document 是否需要更新。因为 浏览器是 60HZ 的刷新率，也就是 16.6ms 才会更新一次
2.  判断是否有 resize 或者 scroll ，有点话就回去触发事件，所以 resize 和 scroll 事件也是至少 16ms 才会触发一次，并且自带节流功能。
3.  判断是否触发了 media query
4.  更新动画并且发送时间
5.  判断是否有全屏操作事件
6.  执行 requestAnimationFrame 回调
7.  执行 IntersectionObserver 回调，该方法用于判断元素是否可见，可以用于懒加载上面，但是兼容性不是很好
8.  更新界面
9.  以上就是一帧中可能会做的事情，如果在一帧中有空闲时间，就会去执行 requestIdleCallback 回调

#### 减少重绘和回流

使用 translate 替代 top

```html
<div class="test"></div>
<style>
  .test {
    position: absolute;
    top: 10px;
    width: 100px;
    height: 100px;
    background: red;
  }
</style>
<script>
  setTimeout(() => {
    // 引起回流
    document.querySelector('.test').style.top = '100px';
  }, 1000);
</script>
```

使用 visibility 替代 display:none，因为前者只会引起重绘，后者会引起回流（改变了布局）

把 DOM 离线后修改。比如：先 把 DOM 给 display:none(有一次回流)，然后你修改100次，然后再把它显示出来。

不要把 DOM 结点的属性值放在一个循环里当做循环里的变量

```javascript
for (let i = 0; i < 1000; i++) {
  // 获取 offsetTop 会导致回流，因为需要去获取正确的值
  console.log(document.querySelector('.test').style.offsetTop);
}
```

不要使用 table 布局，可能一个很小的改动都会造成整个 table 的重新布局

动画实现的速度的选择，动画速度越快，回流次数越多，也可以使用 requestAnimationFrame

CSS 选择符从右往左匹配查找，避免 DOM 深度过深

将频繁运行的动画变成图层，图层能够阻止该节点回流影响别的元素。比如对于 video 标签，浏览器会自动将该节点变成图层

## 性能

### 网络相关

#### DNS 预解析

DNS 解析也是需要时间的，可以通过预解析的方式来预先获得域名所对应的 IP

```html
<Link rel="dns-prefetch" href="//xxx.cn">
</link>
```

#### 缓存

缓存对于前端性能优化来说是一个重要的点，良好的缓存策略可以降低资源的重复加载提高网页的整体加载速度。

通常浏览器缓存策略分成两种：强缓存和协商缓存。

#### 强缓存

实现强缓存可以通过两种响应头实现：Expires 和 Cache-Control 。强缓存表示在缓存期间不需要请求，state code 为 200

```http
Expires:Tue,09 Apr 2019 08:39:00 GMT
```

Expires 是 HTTP/1.0 的产物，表示资源会在上述时间后过期，需要再次请求，并且 Expires 受限于本地时间，如果修改了本地时间，可能会造成缓存失效。

```http
Cache-control:max-age=30
```

Cache-control 出现于 HTTP/1.1 优先级高于 Expires。该属性表示自愿会在 30秒后过期，需要再次请求。

#### 协商缓存

如果缓存过期了，我们就可以使用协商缓存来解决问题。协商缓存需要请求，如果缓存有效会返回 304, 、

协商缓存需要客户和服务端共同实现，和强缓存一样，也有两种实现方式。

**Last-Modified 和 If-Modified-Since**

Last-Modified 表示本地文件最后修改日期，If-Modified-Since 会将 Last-Modified 的值发送给服务器，询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来。

但是如果在本地打开缓存文件，就会造成 Last-Modified 被修改，所以在 HTTP/1.1 出现了 ETag

**ETag 和 If-None-Match**

ETag 类似于文件指纹，If-None-Match 会将 当前的 Etag 发送给服务器，询问该资源 Etag 是否变动，如果有变动的话就将新的资源发送回来，并且 ETag 优先级比 Last-Modified 高。

#### 选择合适的缓存策略

对于大部分的场景都可以使用强缓存配合协商缓存来解决，但是有一些特殊的地方可能需要选择特殊的缓存策略：

- '对于某些不需要缓存的资源，可以使用 Cache-control:no-store 来表示该资源不需要缓存'
- '对于频繁变动的资源，可以使用 Cache-control:no-cache 并配合 ETag 使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新。'
- '对于代码文件来说，通常使用 Cache-control:max-age=31536000 并配合策略缓存使用，然后对文件进行指纹处理，一旦文件名变动就会立刻下载新的文件。'

#### 使用 HTTP/2.0

因为浏览器会有并发请求的限制，在 HTTP/1.1 时代，每个请求都需要建立和断开，消耗了好几个 RTT 时间，并且由于 TCP 慢启动的原因，加载体积大的文件会需要更多的时间

在 HTTP/2.0 中引入了多路复用，能够让多个请求使用同个 TCP 链接，极大的加快了网页的加载速度。还支持 Header 压缩，进一步叫上了请求的数据大小

预加载

预加载是声明式的 fetch，强制浏览器请求资源，并且不会阻塞 onload 事件，可以使用下面的代码：

```html
<Link rel="preload" href="xxx.com">
</link>
```

预加载可以一定程度上降低首屏的时间，因为可以将一些不响应首屏但是重要的文件延后，唯一的缺点就是兼容性不好。

#### 预渲染

可以通过预渲染将下载的文件预先在后台渲染，可以使用下面的代码开启：

```html
<Link ref="prerender" href="xxx.com">
</link>
```

预渲染可以提高页面的架子啊速度，但是要确保该页面百分之百会被用户之后打开，否则就白白浪费资源了。

### 优先渲染过程

#### 懒执行

懒执行就是将某些逻辑延后到使用时再计算。该即使可以用于首屏优化，对于某些耗时逻辑并不需要在首屏就使用的，就可以使用懒执行。懒执行需要唤醒，一般可以通过定时器或者事件的回调来唤醒

#### 懒加载

懒加载就是将不关键的资源延后加载

懒加载的原理就是只加载自定义区域（通常是可视区域，但也可以是即将进入可视区域）内需要加载的东西，对于图片来说，先设置图片的 src 属性为一张占位图，将真实的图片资源放入一个自定义属性中，当进入自定义区域的时候，就将自定义属性替换成 src 属性，这样图片就会下载资源，实现了图片的懒加载。

懒加载不仅可以用于图片，也可以使用在别的资源上，比如进入可视区域才开始播放视频等等。

### 文件优化

#### 图片优化

#### 计算图片大小

对于一张100\*100 的像素的图片来说，有 10000 个像素点，如果每个像素点都是用 RGBA 存储的话，每个像素有四个通道，每个通道有 1 个字节（8位=1个字节），所以图片的大小大概为39KB（10000x1x4/1024）

但是在实际项目中，一张图片可能并不需要使用那么多颜色去显示，我们可以通过减少每个像素的调色板来对应缩小图片的大小。

大致有两个思路：

1.  减少像素点
2.  减少每个像素点能够显示的颜色

#### 图片加载优化

1.  不用图片，能用 CSS 显示的尽量不要使用图片
2.  移动端来说，一般图片都用 CDN 加载，可以计算出适配屏幕宽度，然后去请求对应裁剪好的图片
3.  小图使用 base64 格式
4.  将多个图片整合在一张雪碧图
5.  选择正确的图片格式
6.  对于能够显示 WebP 格式的浏览器尽量使用 WebP 格式。因为这个格式具有更好的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差别的图片质量，缺点就是兼容性不好。
7.  小图使用 Png，其实对于大部分图标这种图片，可以使用 SVG 代替
8.  照片使用 JPEG

#### 其他文件优化

- 'CSS 文件放在 head 中'
- '服务端开启文件压缩功能'
- '将 script 标签放在 body 的底部，因为 JS 文件执行会阻塞渲染，当然也可以将 script 放在任何地方，然后加上 defer , 表示该文件并行下载，但是会放在 HTML 解析完成后顺序执行。对于没有任何依赖的 JS 文件加上 async 表示加载和渲染文档元素的过程和 JS 文件的加载与执行并行无序进行'
- '执行 JS 代码过长会卡住渲染，对于需要时间计算的代码可以考虑使用 Webworker 。它可以让我们另开一个线程执行脚本而不影响渲染。'

#### CDN

静态资源尽量使用 CDN 加载，由于浏览器对于单个域名有并发请求上限，可以考虑使用多个 CDN 域名。对于 CDN 加载静态资源需要注意的是 CDN 域名要与主站不同，否在每次请求都会带上主站的 cookie

### 其他

#### 使用 Webpack 优化项目

- '对于 Webpack4，打包项目使用 production 模式，这样会自动开启代码压缩'
- '使用 ES6 模块来开启 tree shaking，这个技术可以移除没有使用的代码'
- '优化图片，对于小图可以使用 base64 的方式写入文件中'
- '按照路由拆分代码，实现按需加载'
- '给打包出来的文件名添加哈希，实现浏览器缓存文件'

#### 监控

对于代码运行错误，通常的办法是使用 `window.onerror` 拦截报错。该方法能拦截到大部分的详细报错信息，但是也有例外

- '对于跨域的代码运行错误会显示 `Script error.` 对于这种情况我们需要给 `script` 标签添加 `crossorigin` 属性'
- '对于某些浏览器可能不会显示调用栈信息，这种情况可以通过 `arguments.callee.caller` 来做栈递归'

对于异步代码来说，可以使用 `catch` 的方式捕获错误。比如 `Promise` 可以直接使用 `catch` 函数， `async await` 可以使用 `try catch`

但是要注意线上运行的代码都是压缩过的，需要在打包时生成 sourceMap 文件便于 debug。

对于捕获的错误需要上传给服务器，通常可以通过 `img` 标签的 `src` 发起一个请求。

#### 面试题

**如何渲染几万条数据并不卡住页面**

```javascript
setTimeout(() => {
  const total = 100000;
  const once = 20;
  const loopCount = total / once;
  let countOfRender = 0;
  let ul = document.querySelector('ul');

  function add() {
    // 优化性能，插入不会造成回流
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < once; i++) {
      const li = document.createElement('li');
      li.innerHTML = Math.floor(Math.random() * total);
      fragment.appendChild(li);
    }
    ul.appendChild(fragment);
    countOfRender += 1;
    loop();
  }

  function loop() {
    if (countOfRender < loopCount) {
      window.requestAnimationFrame(add);
    }
  }
  loop();
}, 0);
```

## 安全

### XSS

**跨网站指令码**（英语：Cross-site scripting，通常简称为：XSS）是一种网站应用程式的安全漏洞攻击，是[代码注入](https://www.wikiwand.com/zh-hans/%E4%BB%A3%E7%A2%BC%E6%B3%A8%E5%85%A5)的一种。它允许恶意使用者将程式码注入到网页上，其他使用者在观看网页时就会受到影响。这类攻击通常包含了 HTML 以及使用者端脚本语言。

XSS 分为三种：反射型，存储型和 DOM-based

#### 如何攻击

XSS 通过修改 HTML 节点或者执行 JS 代码来攻击网站

例如通过 URL 获取某些参数

```html
<!-- 'http://www.domain.com?name=<script>alert(1)</script> -->'
<div>{{name}}</div>
```

上述 URL 输入可能会将 HTML 改为 `<div><script>alert(1)</script></div>` ，这样页面中就凭空多了一段可执行脚本。这种攻击类型是反射型攻击，也可以说是 DOM-based 攻击。

也有另一种场景，比如写了一篇包含攻击代码 `<script>alert(1)</script>` 的文章，那么可能浏览文章的用户都会被攻击到。这种攻击类型是存储型攻击，也可以说是 DOM-based 攻击，并且这种攻击打击面更广。

#### 如何防御

最普遍的做法是转义输入输出的内容，对于引号，尖括号，斜杠进行转义

```javascript
function escape(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quto;');
  str = str.replace(/'/g, '&#39;');
  str = str.replace(/`/g, '&#96;');
  str = str.replace(/\//g, '&#x2F;');
  return str;
}
```

通过转义可以将攻击代码 `<script>alert(1)</script>` 变成

```js
// -> &lt;script&gt;alert(1)&lt;&#x2F;script&gt;
escape('<script>alert(1)</script>');
```

对于显示富文本来说，不能通过上面的办法来转义所有字符，因为这样会把需要的格式也过滤掉。这种情况通常采用白名单过滤的办法，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式。

```javascript
var xss = require('xss');
var html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>');
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html);
```

以上示例使用了 `js-xss` 来实现。可以看到在输出中保留了 `h1` 标签且过滤了 `script` 标签

#### CSP

内容安全策略 ([CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP)) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

我们可以通过 CSP 来尽量减少 XSS 攻击。CSP 本质上也是建立白名单，规定了浏览器只能够执行特定来源的代码。

通常可以通过 HTTP Header 中的 `Content-Security-Policy` 来开启 CSP

只允许加载本站资源

```http
Content-Security-Policy:default-src 'self'
```

只允许加载 HTTPS 协议图片

```http
Content-Security-Policy:img-src https://*
```

允许加载任何来源框架

```http
Content-Security-Policy:child-src 'none'
```

更多属性可以查看 [这里](https://content-security-policy.com/)

### CSRF

**跨站请求伪造**（英语：Cross-site request forgery），也被称为 **one-click attack**或者 **session riding**，通常缩写为 **CSRF** 或者 **XSRF**， 是一种挟制用户在当前已登录的 Web 应用程序上执行非本意的操作的攻击方法。[[1\]](https://www.wikiwand.com/zh/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0#citenoteRistic1) 跟[跨網站指令碼](https://www.wikiwand.com/zh/%E8%B7%A8%E7%B6%B2%E7%AB%99%E6%8C%87%E4%BB%A4%E7%A2%BC)（XSS）相比，**XSS** 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

简单点说，CSRF 就是利用用户的登录态发起恶意请求。

#### 如何攻击

假设网站中有一个通过 Get 请求提交用户评论的接口，那么攻击者就可以在钓鱼网站中加入一个图片，图片的地址就是评论接口

```html
<img src="http://www.domain.com/xxx?comment='attack'" />
```

如果接口是 Post 提交的，就相对麻烦点，需要用表单来提交接口

```html
<form action="http://www.domain.com/xxx" id="CSRF" method="post">
  <input name="comment" value="attack" type="hidden" />
</form>
```

#### 如何防御

防范 CSRF 可以遵循以下几种规则：

1.  Get 请求不对数据进行修改
2.  不让第三方网站访问到用户的 Cookie
3.  阻止第三方网站请求接口
4.  请求时附带验证信息，比如验证码或者是 token

**SameSite**

可以对 Cookie 设置 SameSite 属性，该属性设置 Cookie 不随着跨域请求发送，该属性可以很大程度减少 CSRF 的攻击，但是该属性目前并不是所有浏览器都兼容的

**验证 Referer**

对于需要防范 CSRF 的请求，我们可以通过验证 Referer 来判断该请求是否为第三方网站发起的

**Token**

服务器下发一个随机 Token （算法不能复杂），每次发起请求时都将 Token 携带上，服务器验证 Token 是否有效

### 点击劫持

是一种视觉欺骗的攻击手段

#### 如何攻击

攻击者将需要攻击的网站通过 `iframe` 嵌套的方式嵌入自己的网页中，并将 `iframe` 设置为透明，在页面中透出一个按钮诱导用户点击。

#### 如何防御

**X-FRAME-OPTIONS**

是一个 HTTP 响应头，为了防御用 iframe 嵌套的点击劫持攻击。

可以设置三个值，分别是

- 'DENY, 表示页面不允许通过 iframe 的方式来展示'
- 'SAMEORIGHT, 表示页面在相同的域名下来通过 iframe 的方式展示'
- 'ALLOW-FROM, 表示页面可以在指定来源的 iframe 中展示'

### 中间人攻击

中间人攻击是攻击方同时与服务端和客户端建立起了连接，并让对方认为连接是安全的，但是实际上整个通信过程都被攻击者控制了。攻击者不仅能获得双方的通信信息，还能修改通信信息。

通常来说不建议使用公共的 Wi-Fi，因为很可能就会发生中间人攻击的情况。如果你在通信的过程中涉及到了某些敏感信息，就完全暴露给攻击方了。

当然防御中间人攻击其实并不难，只需要增加一个安全通道来传输信息。HTTPS 就可以用来防御中间人攻击，但是并不是说使用了 HTTPS 就可以高枕无忧了，因为如果你没有完全关闭 HTTP 访问的话，攻击方可以通过某些方式将 HTTPS 降级为 HTTP 从而实现中间人攻击。

### 密码安全

#### 加盐

也就是给原来的密码添加字符串，增加原密码的长度

```javascript
sha256(sha1(md5(salt + password + salt)));
```

但是加盐并不能阻止别人盗窃账号，只能确保即使数据库泄露，也不会暴露用户的真实密码。一旦攻击者得到了用户的账号，可以通过暴力破解的方式破解密码。对于这种情况，通常使用验证码增加延时或者限制尝试次数的方式。并且一旦用户输入了错误的密码，也不能直接提示用户输错密码，而是账号或者密码错误

### 从 V8 中看性能优化

测试性能工具：Chrome Audits 以及 Perfomance

V8引擎引入了 TurboFan 编译器，会在特定的情况下进行优化，将代码编译成执行效率更高的 Machine Code，当然这个编译器并不是 JS 必须需要的，只是为了提高代码执行性能，所以总的 来说 JS 更偏向于 解释型语言。

```shell
JavaScript Source Code => [Parser] => Abstract Syntax Tree => [interpreter Ignition ] => [Complier TurboFan]
																																														      ||				       ||
																																													         ByteCode     <=   Optimized Machine Code
```

JS 会首先被解析为 AST ，解析过程比较慢，代码越多，解析的过程也就耗费越长，这也是我们为什么要压缩代码的原因。另外一个减少解析时间的方式是预解析，作用于未执行的函数。另外尽可能避免嵌套函数声明，可以避免重复解析。

Ignition 负责将 AST 转换为 Bytecode , 然后 TurboFan 负责编译优化后的 Machine Code，并 Machine Code 在执行效率上优于 Bytecode.

JS 是一门动态类型的语言，而且有一堆的规则，简单的加法运算代码，内容就要考虑好几种规则，比如数字相加、字符串相加、对象和字符串等等。这种情况就会导致内部要增加很多判断逻辑，降低运行效率。

如果固定了类型，就不需要执行很多判断逻辑，代码可以编译为 Machine Code。ts 的好处？

如果我们一旦传入的参数类型改变，那么 Machine Code 就会被 DeOptimized 为 ByteCode，这样就有性能上的一个损耗。所以我们如果希望diam能多的编译为 Machine Code 并且 DeOptimized 的次数减少，就应该尽可能保证传入的类型一致。

## 框架通识

### MVVM(View+Model+ViewModel)

传统的 MVC 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染，当有用户输入的时候，会通过控制器去更新模型，并且通知视图进行更新，但是 MVC 架构的一个巨大的缺项就是控制承担的责任太大了，随着项目的愈加复杂，控制器中的代码会越来越臃肿，导致出现不利于维护的情况。

MVVM 由三个内容组成：

- 'View：界面'
- 'Model：数据模型'
- 'ViewModel：作为桥梁负责沟通 View 和 Model'

在 JQuery 时期，如果需要刷新 UI 时，需要先取到对应的 DOM 再更新 UI，这样数据和业务的逻辑就和页面有强耦合。

ViewModel 只关心数据和业务的处理，不关心 View 是怎么处理数据的，这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。以 Vue 框架为例子，ViewModel 就是组件的实例，View 就是模板，Model 在引入了 Vuex 的情况下是完全可以和组件分离的。在 MVVM 中还引入了一个隐式的 Binder 层，实现了 View 和 ViewModel 的绑定，在Vue 中，这个隐式的 Binder 层就是Vue 通过解析模板中的插值和指令从而实现 View 和 ViewModel 的绑定。

在 MVVM 中，最核心的也就是数据双向绑定，例如 Angluar 的脏数据检测，Vue 中的数据劫持。

#### 脏数据监测

当触发了指定事件后会进入脏数据检测，这时会调用 `$digest` 循环遍历所有的数据观察者，判断当前值是否和先前的值有区别，如果检测到变化的话，会调用 `$watch` 函数，然后再次调用 `$digest` 循环直到发现没有变化。循环至少为二次 ，至多为十次。

脏数据检测虽然存在低效的问题，但是不关心数据是通过什么方式改变的，都可以完成任务，但是这在 Vue 中的双向绑定是存在问题的。并且脏数据检测可以实现批量检测出更新的值，再去统一更新 UI，大大减少了操作 DOM 的次数。所以低效也是相对的，这就仁者见仁智者见智了。

#### 数据劫持

Vue 内部使用了 `Object.defineProperty()` 来实现双向绑定，通过这个函数可以监听到 `set` 和 `get` 的事件。

```javascript
var data = {
  name: 'yck'
};
observe(data);
let name = data.name;
data.name = 'yyy';

function observe(obj) {
  if (!obj || typeof obj !== 'object') {
    return;
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}

function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function rectiveGetter() {
      console.log('get value');
      return val;
    },
    set: function rectiveSetter(newVal) {
      console.log('change value');
      val = newVal;
    }
  });
}
```

以上代码简单的实现了如何监听数据的 `set` 和 `get` 的事件，但是仅仅如此是不够的，还需要在适当的时候给属性添加发布订阅

```html
<div>{{name}}</div>
```

在解析如上模板代码时，遇到 `{{name}}` 就会给属性 `name` 添加发布订阅。

```javascript
// 通过Dep 解耦
class Dep() {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        // sub 是 Watcher 实例
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }

}
// 全局属性，通过该属性配置 Watcher
Dep.target = null;

function update(value) {
    document.querySelector('div').innerText = value;
}

class Watcher {
    constructor(obj, key, cb) {
        // Dep.target 指向自己，然后触发属性的 getter 添加监听，最后将 Dep.target 置空
        Dep.target = this;
        this.cb = cb;
        this.key = key;
        this.obj = obj;
        this.value = obj[key]
        Dep.target = null
    }
    update() {
        // 获得新值
        this.value = this.obj[this.key];
        // 调用 update 方法更新 dom
        this.cb(this.value);
    }
}
var data = {
    name: 'yck'
}
observe(data)
// 模拟解析到 {{name}} 触发的操作
new Watcher(data, 'name', update)
// update dom innerHtml
data.name = 'yyy'
```

接下来, 对 `defineReactive` 函数进行改造

```javascript
function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val);
  let db = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value');
      // 将 Watcher 添加到 订阅
      if (Dep.traget) {
        dp.addSub(Dep.target);
      }
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log('change value');
      val = newVal;
      // 执行 watcher 的 update 方法
      dp.notify();
    }
  });
}
```

以上实现了一个简易的双向绑定，核心思路就是手动触发一次属性的 getter 来实现发布订阅的添加。

#### Proxy 与 Object.defineProperty 对比

`Object.defineProperty` 虽然已经能够实现双向绑定了，但是他还是有缺陷的。

1.  只能对属性进行数据劫持，所以需要深度遍历整个对象
2.  对于数组不能监听到数据的变化

虽然 Vue 中确实能检测到数组数据的变化，但是其实是使用了 hack 的办法，并且也是有缺陷的。

```js
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
// hack 以下几个函数
const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
methodsToPatch.forEach(function (method) {
  // 获得原生函数
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    // 调用原生函数
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // 触发更新
    ob.dep.notify();
    return result;
  });
});
```

反观 Proxy 就没以上的问题，原生支持监听数组变化，并且可以直接对整个对象进行拦截，所以 Vue 也将在下个大版本中使用 Proxy 替换 Object.defineProperty

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property);
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      setBind(value);
      return Reflect.set(target, property, value);
    }
  };
  return new Proxy(obj, handler);
};

let obj = {
  a: 1
};
let value;
let p = onWatch(
  obj,
  v => {
    value = v;
  },
  (target, property) => {
    console.log(`Get '${property}' = ${target[property]}`);
  }
);
p.a = 2; // bind `value` to `2`
p.a; // -> Get 'a' = 2
```

#### 路由原理

前端路由实现起来其实很简单，本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无须刷新。目前单页面使用的路由就只有两种实现方式

- 'hash 模式'
- 'history 模式'

www.text.com/##/ 就是 Hash URL ，当 ## 后面的 哈希值发生变化的时候，不会向服务器请求数据，可以通过 hashchaneg 事件来监听到 URL 的变化，从而进行跳转页面。

![hash 模式](http://user-gold-cdn.xitu.io/2018/7/11/164888109d57995f?w=942&h=493&f=png&s=39581)

History 模式是 HTML5 新推出的功能，比之 Hash URL 更加美观

![History 模式](http://user-gold-cdn.xitu.io/2018/7/11/164888478584a217?w=1244&h=585&f=png&s=59637)

### Virtual Dom

#### 为什么需要 Virtual Dom

操作 DOM 是一件很耗费性能的事情，可以通过 JS 对象来模拟 DOM 对象。

```javascript
const ul = {
  tag: 'ul',
  props: {
    class: 'list'
  },
  children: {
    tag: 'li',
    children: '1'
  }
};
// 相当于
/** <ul class='list'>
  <li>1</li>
</ul>
*/
```

例子：

```java
// 假设这里模拟一个 ul，其中包含了 5 个 li
;[1, 2, 3, 4, 5][
  // 这里替换上面的 li
  (1, 2, 5, 4)
]
```

从上述例子中，我们一眼就可以看出先前的 ul 中的第三个 li 被移除了，四五替换了位置。

如果以上操作对应到 DOM 中，那么就是以下代码

```js
// 删除第三个 li
ul.childNodes[2].remove();
// 将第四个 li 和第五个交换位置
let fromNode = ul.childNodes[4];
let toNode = node.childNodes[3];
let cloneFromNode = fromNode.cloneNode(true);
let cloenToNode = toNode.cloneNode(true);
ul.replaceChild(cloneFromNode, toNode);
ul.replaceChild(cloenToNode, fromNode);
```

当然在实际操作中，我们还需要给每个节点一个标识，作为判断是同一个节点的依据。所以这也是 Vue 和 React 中官方推荐列表里的节点使用唯一的 `key` 来保证性能。

那么既然 DOM 对象可以通过 JS 对象来模拟，反之也可以通过 JS 对象来渲染出对应的 DOM

以下是一个 JS 对象模拟 DOM 对象的简单实现

```javascript
export default class Element {
  /**
   * @param {String} tag 'div'
   * @param {Object} props {class:'item'}
   * @param {Array} child [Element1,'text]
   * @param {String} key option
   */
  constructor(tag, props, children, key) {
    this.tag = tag;
    this.props = props;
    if (Array.isArray(children)) {
      this.children = children;
    } else if (isString(children)) {
      this.key = children;
      this.children = null;
    }
    if (key) this.key = key;
  }
  // 渲染
  render() {
    let root = this._createElement(this.tag, this.props, this.children, this.key);
    document.body.appendChild(root);
    return root;
  }
  create() {
    return this._createElement(this.tag, this.props, this.children, this.key);
  }
  // 创建节点
  _createElement(tag, props, child, key) {
    // 通过 tag 创建节点
    let el = document.createElement(tag);
    // 设置节点属性
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        const value = props[key];
        el.setAttribute(key, value);
      }
    }
    if (key) {
      el.setAttribute('key', key);
    }
    // 递归添加子节点
    if (child) {
      child.forEach(elememt => {
        let child;
        if (element instanceof Element) {
          child = this._createElement(elememt.tag, elememt.props, elememt.children, elememt.key);
        } else {
          child = document.createTextNode(elememt);
        }
        el.appendChild(child);
      });
    }
    return el;
  }
}
```

#### Virtual Dom 算法简述

DOM 是多叉树结构，如果需要完整的对比两棵树的差异，那么需要的时间复杂度是 O(n ^ 3)。React 团队优化了算法，实现了 O(n) 的复杂度来对比差异。

关键在于只是对比同层的节点，而不是跨层对比，这也是考虑到在实际业务中很少回去跨层移动 DOM 元素。

判断差异算法分成了两步

- '首先从上到下，从左到右遍历对象，要就是树的深度遍历，这一步会给每个节点添加索引，便于后面渲染差异'
- '一旦节点有子元素，就去判断子元素是否有不同'

#### Virtual Dom 算法实现

**树的递归**

首先实现树的递归遍历，在实现该算法前，考虑两个节点对比出现的几种情况：

1.  新的节点 tagName 或者 key 和旧的不同，这种情况代表需要替换旧的节点，并也不再需要遍历新旧子元素了，因为整个旧节点都被删除掉了。
2.  新的节点的 tagName 和 key （可能都没有）和旧的相同，开始遍历子树
3.  没有新的节点，那么什么都不用做

```javascript
import { StateEnums, isString, move } from './util';
import Element from './element';
export default function diff(oldDomTree, newDomTree) {
  // 用于记录差异
  let pathchs = {};
  // 一开始的索引为0
  dfs(oldDomTree, newDomTree, 0, pathchs);
  return pathchs;
}

function dfs(oldNode, newNode, index, patches) {
  // 用于保存子树的更改
  let curPatches = [];
  // 需要判断三种情况：
  // 1.没有新的节点，那么什么都不做
  // 2.新的节点的 tagName 和 key（可能都没有）和旧的相同，开始遍历子树
  // 3.没有新的节点，那么什么都不用做
  if (!newNode) {
  } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
    // 判断属性是否变更
    let props = diffProps(oldNode.props, newNode.props);
    if (props.length)
      curPatches.push({
        type: StateEnums.ChangeProps,
        props
      });
    // 遍历子树
    diffChildren(oldNode.children, newNode.children, index, patches);
  } else {
    // 节点不同，需要替换
    curPatches.push({
      type: StateEnums.Replace,
      node: newNode
    });
  }
  if (curPatches.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(curPatches);
    } else {
      patches[index] = curPatches;
    }
  }
}
```

**判断属性的更改**

判断属性的更改也分成三个步骤

1.  遍历旧的属性列表，查看每个属性是否还存在于新的属性列表中
2.  遍历新的属性列表，判断两个列表中都存在的属性的值是否存在变化
3.  在第二步中同时查看是否有属性不存在与旧的属性列列表中

```javascript
function diffProps(oldProps, newProps) {
  let change = [];
  for (const key in oldProps) {
    if (oldProps.hasOwnProperty(key) && !newProps[key]) {
      change.push({
        prop: key
      });
    }
  }
  for (const key in newProps) {
    if (newProps.hasOwnProperty(key)) {
      const prop = newProps[key];
      if (oldProps[key] && oldProps[key] !== newProps[key]) {
        change.push({
          prop: key,
          value: newProps[key]
        });
      } else if (!oldProps[key]) {
        change.push({
          prop: key,
          value: newProps[key]
        });
      }
    }
  }
  return change;
}
```

**判断列表差异算法实现**

整个 Virtual Dom 中最核心的算法，这里的主要步骤其实和判断属性差异是类似的，也是分成三个步骤：

1.  遍历旧的节点列表，查看每个节点是否还存在新的节点列表中
2.  遍历新的节点列表，判断是否有新的节点
3.  在第二步中同时判断节点是否有移动

该算法只对有 key 的节点做处理

```javascript
  function listDiff(oldList, newList, index, patches) {
      // 为了遍历方便，先取出两个 list 中所有的 keys
      let oldKeys = getKeys(oldList);
      let newKeys = getKeys(newList);
      let changes = [];
      // 用于保存变更后的节点数据，使用该数组保存有以下好处，
      // 1.可以正确获取被删除节点索引
      // 2.交换位置只需要操作一遍 dom
      // 3.用于 diffChildren 函数中的判断，只需要遍历
      // 两个树中都存在的节点，对于新增或者删除的节点来说，完全没有必要再去判断一次

      let list = [];
      oldList && oldList.forEach(item => {
          let key = item.key;
          if (isString(item)) {
              key = item
          }
          // 寻找新的 children 中是否含有当前节点，没有的话需要删除
          let index = newKeys.indexOf(key);
          if (index === -1) {
              list.push(null);
          } else {
              list.push(key)
          }
      })
      // 遍历变更后的数组
      let length = list.length;
      // 因为删除数组元素是会更改索引的，所以从后往前删可以保证索引不变
      for (let i = length - '1; i >= 0; i--) {'
          // 判断当前元素是否为空，为空则表示要删除
          if (!list[i]) {
              list.splice(i, 1)
              changes.push({
                  type: StateEnums.Remove,
                  index: i
              });
          }
      }
      // 遍历新的list 判断是否节点新增或者是移动，同时也对 list 做节点的新增或者是移动
      newList && newList.forEach(item => {
          let key = item.key;
          if (isString(item)) {
              key = item
          }
          // 寻找旧的 children 中是否含有当前节点，没有的话需要插入
          let index = list.indexOf(key);
          if (index === -1 || index == null) {
              changes.push({
                  type: StateEnums.Insert,
                  node: item,
                  index: i
              });
              list.splice(i, 0, key)
          } else {
              // 找到了，需要判断是否需要移动
              if (index !== i) {
                  changes.push({
                      type: StateEnums.Move,
                      from: index,
                      to: i
                  });
                  move(list, index, i)
              }
          }
      })
      return {
          changes,
          list
      }
  }

  function getKeys(list) {
      let keys = [];
      let text;
      list && list.forEach(item => {
          let key;
          if (isString(item)) {
              key = [item]
          } else if (item instanceof Element) {
              key = item.key;
          }
          keys.push(key)
      })
      return keys
  }
```

**遍历子元素打标识**

对于整个函数来说，主要的功能就两个

1.  判断两个列表差异
2.  给节点打上标记

总体来说，该函数的实现很简单

```javascript
function diffChildren(oldChild, newChild, index, patches) {
  let { changes, list } = listDiff(oldChild, newChild, index, patches);
  if (changes.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(changes);
    } else {
      patches[index] = changes;
    }
  }
  // 记录上一次遍历过的节点
  let last = null;
  oldChild &&
    oldChild.forEach((item, i) => {
      let child = item && item.children;
      if (child) {
        index = last && last.children ? index + last.children.length + 1 : index + 1;
        let keyIndex = list.indexOf(item.key);
        let node = newChild[keyIndex];
        // 只遍历新旧节点都存在的节点，其他新增或者删除的没有必要遍历
        if (node) {
          dfs(item, node, index, patches);
        }
      } else {
        index += 1;
      }
      last = item;
    });
}
```

**渲染差异**

通过之前的算法，我们已经可以得出两个树的差异了。既然知道了差异，就需要局部去更新 DOM 了，下面就让我们来看看 Virtual Dom 算法的最后一步骤

这个函数主要两个功能

1.  深度遍历树，将需要做变更操作的取出来
2.  局部更新 DOM

```javascript
let index = 0;
export default function patch(node, patchs) {
  let changes = patchs[index];
  let childNodes = node && node.childNodes;
  // 这里的深度遍历和 diff 中是一样的
  if (!childNodes) index += 1;
  if (changes && changes.length && patchs[index]) {
    changeDom(node, changes);
  }
  let last = null;
  if (childNodes && childNodes.length) {
    childNodes.forEach((item, i) => {
      index = last && last.children ? index + last.children.length + 1 : index + 1;
      patch(item, patchs);
      last = item;
    });
  }
}

function changeDom(node, changes, noChild) {
  changes &&
    changes.forEach(change => {
      let { type } = change;
      switch (type) {
        case StateEnums.ChangeProps:
          let { props } = change;
          props.forEach(item => {
            if (item.value) {
              node.setAttribute(item.prop, item.value);
            } else {
              node.removeAttribute(item.prop);
            }
          });
          break;
        case StateEnums.Remove:
          node.childNodes[change.index].remove();
          break;
        case StateEnums.Insert:
          let dom;
          if (isString(change.node)) {
            dom = document.createTextNode(change.node);
          } else if (change.node instanceof Element) {
            dom = change.node.create();
          }
          node.insertBefore(dom, node.childNodes[change.index]);
          break;
        case StateEnums.Replace:
          node.parentNode.replaceChild(change.node.create(), node);
          break;
        case StateEnums.Move:
          let fromNode = node.childNodes[change.from];
          let toNode = node.childNodes[change.to];
          let cloneFromNode = fromNode.cloneNode(true);
          let cloenToNode = toNode.cloneNode(true);
          node.replaceChild(cloneFromNode, toNode);
          node.replaceChild(cloenToNode, fromNode);
          break;
        default:
          break;
      }
    });
}
```

#### 最后

Virtul Dom 算法的实现也是下面三个步骤：

1.  通过JS 来模拟创建 DOM 对象
2.  判断两个对象的差异
3.  渲染差异

```javascript
let test4 = new Element(
  'div',
  {
    class: 'my-div'
  },
  ['test4']
);
let test5 = new Element(
  'ul',
  {
    class: 'my-div'
  },
  ['test5']
);

let test1 = new Element(
  'div',
  {
    class: 'my-div'
  },
  [test4]
);

let test2 = new Element(
  'div',
  {
    id: '11'
  },
  [test5, test4]
);

let root = test1.render();

let pathchs = diff(test1, test2);
console.log(pathchs);

setTimeout(() => {
  console.log('开始更新');
  patch(root, pathchs);
  console.log('结束更新');
}, 1000);
```

### 路由模式

涉及的面试题目：前端路由原理，两种实现方式有什么区别？

前端路由实现起来不难，本质就是监听 URL 的变化，然后匹配路由规则，显示对应的页面，并且无须刷新页面，目前前端使用的路由大概有两种方式：

- 'hash 模式'
- 'History 模式'

#### Hash

`www.test.com/#/` 就是 Hash URL，当 `#` 后面的哈希值发生变化时，可以通过 `hashchange` 事件来监听到 URL 的变化，从而进行跳转页面，并且无论哈希值如何变化，服务端接收到的 URL 请求永远是 `www.test.com` 。

```javascript
window.addEventListener('haschange', () => {
  // 具体逻辑...
});
```

Hash 模式相对简单，并且兼容性更好

#### History

History 模式 是 HTML5 推出的新功能，主要使用 history.pushState 和 history.replaceState 改变 URL。

通过 History 模式改变 URL 同样不会引起浏览器的刷新，只会更新浏览器的历史记录

```javascript
// 新增历史记录
history.pushState(stateObj, title, URL);
// 替换当前的历史记录
history.replaceState(stateObj, title, URL);
```

当用户做出浏览器动作的时候，比如点击后退按钮会触发 popState 事件

```javascript
window.addEventListener('popstate', e => {
  // e.state 就是 push(stateObject) 中的 stateObject
  console.log(e.state);
});
```

#### 两种模式对比

- 'Hash 模式只可以更改 # 号后面的内容。History 模式可以通过 API 设置任意的同源的 URL'
- 'History 模式可以通过 API 添加任意的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串'
- 'Hash 模式无需后置配置，并且兼容性好。History 模式在用户输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 用于匹配不到静态资源的时候'

### Vue 常考的基本知识点

#### 声明周期钩子函数

在 beforeCreate 钩子函数使用的时候，是获取不到 props 或者 data中的数据的，因为这些数据都在 initState 中

然后会执行 created 钩子函数，这一步可以访问到之前不能访问到的数据，但是这时候，组件还没有被挂载。

beforeMount 钩子函数，开始构建 VDOM，最后执行 mounted 钩子函数，并将 VDOM 渲染为真实的 DOM 并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有组件全部挂载完毕，才会执行根组件的挂载钩子。

数据更新时会调用钩子函数 beforeUpdate 和 updated ，分别是在数据更新前后会调用

keep-alive 独有的生命周期，activated 和 deactivated。用 keep-alive 包裹的组件切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数, 命中缓存渲染后会执行 atived 钩子函数

最后就是销毁组件的钩子函数 beforeDestory 和 destroyed . 前者适合移除事件、定时器等等，否则可能会引起内存泄露的问题，然后进行一系列的销操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕之后才会执行根组件的 destroyed 钩子函数

#### 组件通信

一般有一下几种情况

- '父子组件'
- '兄弟组件'
- '跨多层次组件'
- '任意组件'

#### 父子组件通信

父组件通过 props 传递给子组件，子组件通过 emit 发送事件传递数据给父组件，这两种方式是常用的父子通信实现方法

这种父子组件就是典型的单向数据流，父组件通过 props 传递数据，子组件不能直接修改 props, 而是必须通过发送事件的方式告知父组件修改数据。

另外这两种方式还可以使用语法糖 v-model 来直接实现，因为 v-model 会解析成名为 value 的 prop 和 input 的事件。这种语法糖的方式是典型的双向绑定，常用于 UI控件上面，但是根本上还是通过事件的方法来让父组件修改数据。

还可以通过 \$parent 或者是 \$children 对象来访问组件实例中方法和数据。

另外使用 Vue2.3 以上的版本还可以使用 \$ listeners 和 .sycn 两个属性

\$ listeners 属性会将父组件中（不含 .native 修饰器的）v-on 事件监听器传递给子组件，子组件可以通过访问 \$listeners 来自定义监听器

.sync 属性是语法糖，可以很简单实现子组件和父组件的通信

```vue
<!--父组件中--->
<input :value.sync="value">
<!--上面写法等同于-->
<input :value="value" @update:value="v=>value=v"></comp>
<!--子组件中-->
<script>
    this.$emit('update:value',1)
</script>
```

#### 兄弟组件通信

可以通过查找父组件中的子组件的实现，就是 `this.$parent.$children` 在 `$children` 中可以通过 name 查询到需要的组件实例，然后进行通信

#### 跨多层组件通信

可以使用 Vue2.2 新增的 API provide/inject ，虽然在文档中不支持使用在业务中，但是如果用得好的话还是有用的

假设有父组件 A 然后有一个跨多层级的子组件B

```javascript
// 父组件A
export default {
    provide: {
        data: 1
    }
}
// 子组件 B
export default {
    inject: ['data'],
    mounted() {
        // 无论跨几层都能获取到父组件的 data 属性
        console.log(this.data); //=>1
    }
}
```

#### 任意组件

这种方式可以通过 Vuex 或者 Event Bus 解决，另外如果不怕麻烦的话，可以使用这种方式来解决上述的所有通信情况

#### extend 能做什么

作用是扩展㢟生成一个构造器，通常会与 `$mount` 一起使用

```javascript
// 创建组件构造器
let Component = Vue.extend({
    template: '<div>test</div>'
})
// 挂载到 #app 上
new.Component().$mount('#app');
// 除了上面方式还可以来扩展原来的组件
let SuperComponent = Vue.extend(Component)
new SuperComponent({
    created() {
        console.log(1);
    }
})
new SuperComponent().$mount('#app')
```

#### mixin 和 mixins 的区别

mixin 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的

```javascript
Vue.mixin({
  beforeCreate() {
    // 逻辑，这种方式会影响到所有组件的 beforeCreate 钩子函数
  }
});
```

文档不建议直接在应用中使用 mixin ，但是不滥用的话，可以全局混入装好的 ajax 或者一些工具函数等等

mixins 应该是我们最常使用的扩展组件的方式了，如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 mixins 混入代码，比如上拉下拉加载数据这种等等。

另外要注意的是 mixins 混入的钩子函数会先于组件的钩子函数执行，并且在晕倒同名选项的时候也会有选择性的进行合并。

#### computed 和 watch 的区别

computed 是计算属性，依赖其他属性来计算，并且 computed 的值有缓存，只有当值变化才会返回内容。

watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

所以一般来说需要依赖别的属性来动态获得值的时候就可以使用 computed ，对于监听到值的变化需要做的一些复杂业务逻辑的时候可以使用 watch

另外这两者都支持对象的写法：

```javascript
vm.$watch('obj', {
  // 深度遍历
  deep: true,
  // 立即触发
  immediate: true,
  // 执行函数
  handler: function (val, oldVal) {}
});

var vm = new Vue({
  data: {
    a: 1
  },
  computed: {
    aPlus: {
      // this.aPlus 的时候触发
      get: function () {
        return this.a + 1;
      },
      // this.aPlus = 1时触发
      set: function (v) {
        this.a = v - '1';
      }
    }
  }
});
```

#### keep-alive组件的作用

需要需要在组件切换时，保存一些组件的状态防止多次渲染，可以使用 keep-alive 组件包裹需要保存的组件

对于 keep-alive 组件来说，它拥有两个独有的声明周期函数，分别是 activated 和 deactivated ，用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数

#### v-show 和 v-if 的区别

v-show 只是在 display：none 和 display：block 之间切换。无论初始条件是什么都会被渲染出来，后面只需要切换 CSS，DOM 还是一直保留的，所以总的来说，v-show 在初始渲染有更高的开销，但是切换开销小，更适合于频繁切换的场景

v-if 的话就涉及 Vue 底层的编译，当属性初始为 false，组件就不会被渲染，直到条件为 true，并且切换条件时会触发销毁/挂载组件，所以总的来说在切换开销更高，更适合不经常切换的场景，并且基于 v-if 的这种惰性渲染机制，可以在必要的时候才去渲染组件，减少整个页面的初始渲染开销。

#### 组件中 data 什么时候可以使用对象

组件复用时所有的实例都会共享 data ，如果data 是对象的话，就会造成一个组件修改 data 之后会影响到其他所有的组件，所以我们需要将 data 写成函数，每次用到就调用一次函数来获得新的数据

当我们使用 new Vue() 的方式的时候，无论我们将 data 设置为对象还是函数都是可以的，因为 new Vue（） 的方式是生成一个根组件，也就不存在共享 data 的情况了。

#### 进阶知识点

#### 响应式原理

Vue 内部使用了 Object.defineProperty() 来实现数据响应式，通过函数可以监听到 set 和 get 事件

```javascript
const data = {
  name: 'lbh'
};
observe(data);
let { name } = data;
data.name = 'haha';

function observe(obj) {
  // 判断类型
  if (!obj || typeof obj !== 'object') {
    return;
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}

function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val);
  Object.defineProperty(obj, key, {
    // 可枚举
    enumerable: true,
    // 可配置
    configurable: true,
    // 自定义函数
    get: function reactiveGetter() {
      console.log('get val');
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log('change val');
      val = newVal;
    }
  });
}
```

上面代码简单实现了如何监听数据的 set 和 get 事件，因为自定义函数一开始是不会执行的，只有先执行了依赖收集，才能在属性更新的时候派发更新，所以我们接下来需要先触发依赖收集

```html
<div>{{name}}</div>
```

在解析上面的模板代码时候，会遇到 `{{name}}` 就会进行依赖收集

实现一个 Dep 类，用于解耦属性的依赖收集和派发更新操作

```javascript
class Dep {
  constructor() {
    this.subs = [];
  }
  // 添加依赖
  addSub(sub) {
    this.subs.push(sub);
  }
  // 更新
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}
// 全局属性，通过该属性配置 watcher
Dep.target = null;
```

当需要收集依赖的时候调用 addSub, 当需要派发更新的时候调用 notify()

下面简单了解 Vue 组件挂载时添加响应式的过程。在组件挂载时，会先对所有需要的属性调用 Object.defineProperty(), 然后实例化 Watcher，传入组件更新的回调，在实例化中，会对模板中的属性进行求值，触发依赖收集。

```javascript
class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己，然后出发属性的 getter 添加监听，最后将 Dep.target 置空
    Dep.target = this;
    this.cb = cb;
    this.obj = obj;
    this.key = key;
    this.value = obj[value];
    Dep.target = null;
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key];
    // 调用 update 方法更新 Dom
    this.cb(this.value);
  }
}
```

上面是 Wathcer 的简单实现，在执行构造函数的时候将 Dep.target 指向自身，从而使得收集到了对应的 Watcher, 在派发更新的时候取出对应的 Watcher 然后执行 update 函数

接下来，需要对 defineReactive 函数进行改造，在自定义函数中添加依赖收集和派发更新相关的代码：

```javascript
function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val);
  let dp = new Dep();
  Object.defineProperty(obj, key, {
    // 可枚举
    enumerable: true,
    // 可配置
    configurable: true,
    // 自定义函数
    get: function reactiveGetter() {
      console.log('get val');
      // 将Watcher 添加到订阅中
      if (Dep.target) {
        dp.addSub(Dep.target);
      }
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log('change val');
      val = newVal;
      // 执行 watcher 的 update 方法
      dp.notify();
    }
  });
}
```

上面的代码实现了一个简易的数据响应式，核心思路就是手动触发一次属性的 getter 来实现依赖收集。

测试：

```javascript
var data = {
  name: 'lbh'
};
observe(data);

function update(value) {
  document.querySelector('div').innerText = value;
}
// 模拟解析到 `{{name}}` 触发的操作
new Watcher(data, 'name', update);
// update Dom innerText
data.name = 'haha';
// get val
// change val
// get val
```

#### Object.defineProperty 的缺陷

如果通过下标的方式修改数据或者给对象新增属性并不会触发组件的重新渲染，因为 Object.defineProperty 不能拦截到这些操作，更精确的来说，对于数组来说，大部分操作都是拦截不到的，只是 vue 内部通过重写函数的方式改写了这个问题。

Vue 提供了一个 API 解决

```javascript
export function set(target: Array < any > | Object, key: any, val: any): any {
    // 判断是否为数组且下标是否有效
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        // 调用 splice 函数触发派发更新
        // 该函数已被重写
        target.length = Math.max(target.length, key)
        target.splice(key, 1, val)
        return val
    }
    // 判断 key 是否已经存在
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = (target: any).__ob__
    // 如果对象不是响应式对象，就赋值返回
    if (!ob) {
        target[key] = val
        return val
    }
    // 进行双向绑定
    defineReactive(ob.value, key, val)
    // 手动派发更新
    ob.dep.notify()
    return val
}
```

对于数组而言，Vue 内部重写了以下函数实现派发更新

```javascript
// 获得数组原型
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
// 重写以下函数
const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
methodsToPatch.forEach(function (method) {
  // 缓存原生函数
  const original = arrayProto[method];
  // 重写函数
  def(arrayMethods, method, function mutator(...args) {
    // 先调用原生函数获得结果
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    // 调用以下几个函数时，监听新数据
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // 手动派发更新
    ob.dep.notify();
    return result;
  });
});
```

#### 编译过程

Vue 会通过编译器将模板通过几个阶段最终编成为 render 函数，然后通过执行 render 函数生成 Virtual DOM 最终映射为真实 DOM

这个阶段分成三部分：

1.  将模板解析为 AST
2.  优化 AST
3.  将 AST 转换为 render 函数

第一个阶段，通过正则表达式去匹配模板中的内容，然后将内容提取出来做各种逻辑操作，接着会生成一个基本的 AST 对象

```javascript
{
    // 类型
    type： 1，
    // 标签
    tag,
    // 属性列表
    attrsList: attrs,
        // 属性映射
        attrsMap: makeAttrsMap（ attrs）,
        // 父节点
        parent,
        // 子节点
        children: []
}
```

然后会根据这个最基本的 AST对象的属性，进一步扩展 AST

当然在这一阶段中，还会进行其他的一些判断逻辑。比如说对比前后开闭标签是否一致，判断根组件是否只存在一个，判断是否符合 HTML5 [Content Model](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FGuide%2FHTML%2FContent_categories) 规范等等问题。

优化 AST 阶段，对节点进行了静态内容提取，将永远不会变动的节点拿出来，实现复用 Virtual DOM, 跳过对比算法的功能。

最后一个阶段，通过 AST 生成 render 函数，主要的目的是遍历整个 AST, 根据不同的条件生成不同的代码

#### NextTick 原理浅析

nextTick 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM

默认使用 microtasks，但是特殊情况下会使用 macrotasks，比如 v-on

对于实现 macrotasks，会先判断是否能使用 setImmediate，不能的话就降级为 MessageChannel，以上都不行的话就使用 setTimeout

```javascript
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else if (
  typeof MessageChannel !== 'undefined' &&
  (isNative(MessageChannel) || MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = () => {
    port.postMessage(1);
  };
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
```

### React 常考的基本知识点

#### 声明周期

v16 版本中引入了 Fiber 机制，这个机制一定程度上影响了部分生命周期函数的调用，也引入了新的两个 API 来解决问题。[关于 Fiber](http://www.ayqy.net/blog/dive-into-react-fiber/)

之前版本的 react如果嵌套太多层，会导致调用栈过长，再加上复杂的操作，就可能导致长时间阻塞主线程，带来不好的用户体验。就类似潜水员，只有潜到底才会回到水面。而如果水面这时候发生了其他优先级更高的事情，也要等潜水员潜到底后再重新上来。

Fiber 就是为了解决这个问题而生的，它本质上是一个虚拟的堆栈帧，新的调度器hi根据优先级自由调用这些帧，从而将之前的同步渲染变成了异步渲染，在不影响体验的情况下去分段计算更新。

优先级的区别，对于动画这种优先性别很高的东西，16ms 必须渲染一次保证不卡顿的情况下，react 会每 16ms 以内暂停一次更新，返回来继续渲染动画。潜水员不再一直潜到底，而是潜到一定深度后在该点设置一个传送点后浮出水面，然后传回去传送点继续下潜。

对于异步渲染，有三个阶段：reconcliiation 和 commit ，前者过程是可以打断的，后者不能暂停，会一直更新界面直到完成。

Reconciliation 阶段

- 'componentWillMount'
- 'componentWillReceiveProps'
- 'shouldComponentUpdate'
- 'componentWillUpdate'

Commit 阶段

- 'componentDidMount'
- 'componentDidUpdate'
- 'componentWillUnmount'

因为前者是可以被打断的，所以 Reconciliation 阶段会执行的声明周期函数就可能会出现调用多次的情况，从而引起 bug。因此对于 Reconciliation 阶段调用的几个函数，除了 shouldComponentUpdate 之外，其他都应该避免去使用，并且 V16 中也引入了新的 API 来解决这个问题

getDerivedStateFromProps 用于替换 componentWillReciveProps，这个函数会在初始化和 update 时候被调用。

```javascript
class ExampleComponent extends React.Component {
  // Initialize state in constructor,
  // Or with a property initializer.
  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.someMirroredValue !== nextProps.someValue) {
      return {
        derivedData: computeDerivedState(nextProps),
        someMirroredValue: nextProps.someValue
      };
    }

    // Return null to indicate no change to state.
    return null;
  }
}
```

`getSnapshotBeforeUpdate` 用于替换 `componentWillUpdate` ，该函数会在 `update` 后 DOM 更新前被调用，用于读取最新的 DOM 数据。

#### setState

setState 是异步的，调用这个函数不会马上引起 state 的变化

```javascript
handle() {
    console.log(this.state.count); // 0
    this.setState({
        count: this.state.count + 1
    });
    this.setState({
        count: this.state.count + 1
    });
    this.setState({
        count: this.state.count + 1
    });
    console.log(this.state.count) // 0
}
```

上面的代码等同于下面

```javascript
Object.assign(
  {},
  {
    count: this.state.count + 1
  },
  {
    count: this.state.count + 1
  },
  {
    count: this.state.count + 1
  }
);
```

可以通过下面的方式来实现我们原来的目的

```javascript
handle() {
    this.setState((prevState) => ({
        count: prevState.state.count + 1
    }));
    this.setState((prevState) => ({
        count: prevState.state.count + 1
    }));
    this.setState((prevState) => ({
        count: prevState.state.count + 1
    }));
}
```

在每次 setState 后取得正确的 state，可以这样实现：

```java
handle(){
    this.setState((prevState)=>({count:prevState.count+1}),()=>{
        console.log(this.state);
    })
}
```

#### 性能优化

在 `shouldComponentUpdate` 函数中我们可以通过返回布尔值来决定当前组件是否需要更新。

通过 immutable 或者 immer 这些库来生成不可变对象。这类库对于操作大规模的数据来说会提升不错的性能，并且一旦改变数据就会生成一个新的对象，对比前后 `state` 是否一致也就方便多了。

单纯的浅比较一下，可以直接使用 `PureComponent` ，底层就是实现了浅比较 `state` 。

```jsx
class Test extends React.PureComponent {
  render() {
    return <div>PureComponent</div>;
  }
}
```

V16 之后可以使用 React.memo 来实现相同的功能

```jsx
const Test = React.memo(() => {
  <div>PureComponent</div>;
});
```

通过这种方式我们就可以既实现了 `shouldComponentUpdate` 的浅比较，又能够使用函数组件。

#### 组件通信

同样的情况：

- '父子组件'
- '兄弟组件'
- '跨多层次组件'
- '任意组件'

#### 父子组件

父组件通过 props 传递数据给子组件，子组件通过调用父组件传来函数传递给父组件，这两种方式是最常用的父子通信的方法。

这种父子通信方式也就是典型的单向数据流，父组件通过 props 传递数据，子组件不能直接修改 props, 而是必须通过调用父组件函数的方式来告知父组件修改数据

#### 兄弟组件

与这种情况可以通过共同的父组件来管理状态和事件函数。比如其中给一个兄弟组件调用父组件传递过来的事件函数修改父组件中的状态，然后父组件将状态传递给另一个兄弟组件

#### 跨多层次组件

使用 Context API

```jsx
// 创建 Context，可以在开始就传入值
const StateContext = React.createContext();
class Parent extends React.Component{
    render(){
        // value 就是传入 Context 中的值
        <StateContext.Provider value='haha'>
            <Child/>
        </StateContext.Provider>
    }
}

class Child extends React.Component{
    render(){
        return(
            <ThemeContext.Consumer>
                // 取出值
                {context=>{
                    name is {context}
                }}
            </ThemeContext.Consumer>
        )
    }

}
```

#### 任意组件

这种方式可以通过 Redux、Mobx 等工具 或者 Event Bus 解决。

#### HOC 是什么？相比 mixins 有什么优点

例子

```javascript
function add(a, b) {
  return a + b;
}
```

给这个 add 函数添加一个输出结果的功能，实现优雅并且可以复用和扩展：

```javascript
function withLog(fn) {
  function wrapper(a, b) {
    const result = fn(a, b);
    console.log(result);
    return result;
  }
  return wrapper;
}
const withLogAdd = withLog(add);
withLogAdd();
```

这种做法在函数式编程里面被称为高阶函数。高阶组件和高阶函数就是同一个东西，实现一个函数，传入一个组件，然后在函数内部再实现一个函数切扩展传入的组件，最后返回一个新的组件，这就是高阶组件的概念，作用是为了更好的复用代码。

HOC 和 Vue 中的 mixins 作用是一致的，并且在早期的 React 也是使用 mixins 的方式。但是在使用 class 的方式创建组件以后，mixins 的方式就不能使用了，并且其实 mixins 也是存在一些问题的，比如：

- '隐含了一些依赖，多人开发，我写了某个state 并且在 mixins 中使用了，这就存在一个依赖关系。其他人要移除就要去 mixins 里面查找依赖'
- '多个 mixin 中可能存在同名的函数，会造成函数重写'
- '雪球效应，一个mixin 被多个组件使用，会由于需求使得 mixin 变得臃肿。'

HOC 解决了这些问题，并且它们达成的效果也是一致的，同时也更加函数式了。

#### 事件机制

```jsx
const Test = ({ list, handleClick }) => {
  list.map((item, index) => (
    <span onClick={handleClick} key={index}>
      {index}
    </span>
  ));
};
```

JSX 上写的事件并没有绑定在对应真实的 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在 document上，这样的方式不仅可以减少内存的损耗，还能在组件挂载时统一订阅和移除事件。

另外冒泡到 document 上的事件也不是原生的浏览器事件，而是 React自己实现的合成事件（SyntheticEvnet）。因此我们不想要事件冒泡的话，可以使用 event.preventDefault

合成事件的目的：

- '抹平了浏览器之间的兼容问题，另外一个是跨浏览器原生事件包装器，赋予了跨浏览器开发的能力'
- '对于原生浏览器来说，浏览器会给监听器创建一个事件对象，如果有很多事件监听就要分配很多事件对象会造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用的时候，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下一次复用事件对象。'

## Webpack性能优化

### 减少webpack 打包时间

### 优化 loader

影响打包效率第一个必定是 babel，因为 babel hi将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，转换代码越多，效率越低。

可以优化 loader 的文件搜索范围

```javascript
module.exports = {
  module: {
    rules: {
      // 只对 js 文件使用 babel
      test: /\.js$/,
      loader: 'babel-loader',
      // 只在 src 文件夹下查找
      include: [resolve('src')],
      exclude: /node_module/
    }
  }
};
```

还可以将 babel 编译过的文件缓存起来，下次只需要编译更改过的代码文件就可以了, 这样可以大幅度加快打包速度

```javascript
loader: 'babel-loader?cacheDirectory=true';
```

### HappyPack

受限于 Node 是单线程的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况。

HappyPack 可以将 loader 的同步执行转换为并行的，这样就可以充分利用系统的资源来加快打包效率了

```javascript
module: {
    loaders: [{
        test: /\.js$/,
        include: [resolve('src')],
        exclude: /node_module/,
        // id 后面的内容对应下面的
        loader: 'happypack/loader?id=happybabel'
    }]
}

plugins: [
    new HappyPack({
        id: 'happybabel'
    }),
    loaders: ['babel-loader?cacheDirectory'],
    // 开启四个线程
    threads: 4
]
```

### DllPlugin

DllPlugin 可以将特定的类库提前打包然后引入。这种方式可以极大的减少打包类库的次数，只有当类库更新版本才有需要打包，并且也实现了将公告代码抽离出成单独文件的优化方案。

```javascript
// 单独配置在一个文件中
// webpack.dll.conf.js
const path = require('path');
const webpack = require('webpack');

module.export = {
  enrty: {
    vendor: ['react']
  },
  plugins: [
    new webpack.DllPlugin({
      // 与 output.library 一致
      name: '[name]-[hash]',
      // 与 DllReferencePlugin 中一致
      context: __dirname,
      path: path.join(__dirname, 'dist', '[name]-mainfest.json')
    })
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '[name]-[hash]'
  }
};
```

然后运行这个配置文件生成依赖文件，使用 DllReferencePlugin 将依赖文件引入项目中

```javascript
// webpack.conf.js
module.export = {
  // 省略其他配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // 之前打包出来的 json文件
      mainfest: require('./dist/vendor-mainfest.json')
    })
  ]
};
```

### 减少webpack 打包后的体积

**按需加载**

SPA 项目中都会存在十几甚至更多的路由页面。如果我们将这些页面全部打包进一个 JS 文件的话，虽然将多个请求合并了，但是同样也加载了很多并不需要的代码，耗费了更长的时间。那么为了首页能更快地呈现给用户，我们肯定是希望首页能加载的文件体积越小越好，**这时候我们就可以使用按需加载，将每个路由页面单独打包为一个文件**。当然不仅仅路由可以按需加载，对于 `loadash` 这种大型类库同样可以使用这个功能。

底层的机制都是当使用的时候再去加载对应的文件，返回一个 Promis ，当 Promise 成功以后去执行回调

**Scope Hoisting**

Scope Hoisting 会分析出来模块之间的依赖关系，尽可能的把打包的模块合并到一个函数中去

比如打包两个文件

```javascript
// test.js
export const a = 1;
// index.js
import { a } from './test.js';
```

打包出来的代码是这样的

```javascript
[
  /* 0 */
  function (module, exports, require) {
    //...
  },
  /* 1 */
  function (module, exports, require) {
    //...
  }
];
```

但是如果我们使用 Scope Hoisting 的话，代码就会尽可能的合并到一个函数中去，也就变成了这样的类似代码

```javascript
[
  /* 0 */
  function (module, exports, require) {
    //...
  }
];
```

在webpack4 中只要启用 optimization.concatenateModules 就可以了

```javascript
module.exports = {
  optimization: {
    concatenateModules: true
  }
};
```

**Tree Shaking**

Tree Shaking 可以实现删除项目中未被引用的代码，例如：

```javascript
// test.js
export const a = 1;
export const b = 2;
// index.js
import { a } from './test.js';
```

对于以上情况， `test` 文件中的变量 `b` 如果没有在项目中使用到的话，就不会被打包到文件中。

如果你使用 Webpack 4 的话，开启生产环境就会自动启动这个优化功能。
