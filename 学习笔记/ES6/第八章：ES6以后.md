## ES6以后
以后ES将以年编年，具体看张怡秋的知乎回答。

### async function
generator+promise的语法糖
```
async function main() { 
    var ret = await step1(); 
    try { 
        ret = await step2( ret ); 
    } 
    catch (err) { 
        ret = await step2Failed( err ); 
    } 
    ret = await Promise.all( [ 
        step3a( ret ), 
        step3b( ret ), 
        step3c( ret ) 
    ] ); 
    await step4( ret ); 
} 
main() 
.then( 
    function fulfilled(){ 
        // `main()` 成功地完成了 
    }, 
    function rejected(reason){ 
        // 噢，什么东西搞错了 
    } 
); 
```
* async function代替function *,await代替yield
* 运行 main() 函数的调用实际上返回一个我们可以直接监听的promise
* 还有一个 async function* 的提案，它应当被称为“异步generator”

#### 警告
争论：它仅返回一个promise，所以没有办法从外部 撤销 一个当前正在运行的 async function 实例。

### Object.observe(..) 
Object.observe(..)直接提供数据绑定的机制,它的思想是建立监听器来监听一个对象的变化，并在一个变化发生的任何时候调用一个回调。

* 六种变化：增删改 重新配置/设置原型链/阻止拓展
* 代理是可以在动作发生之前拦截它们的。对象监听让你在变化（或一组变化）发生之后进行应答。

#### 自定义变化事件
自定义事件->监听事件->事件轮询->检测变化->执行逻辑

* Object.deliverChangeRecords(observer)投递事件
* 关注点分离使得你的使用模式匹配的更干净

#### 中止监听
Object.unobserve(..)

### 指数操作符
**操作符
```
a ** 4;         // Math.pow( a, 4 ) == 16 
a **= 3;        // a = Math.pow( a, 3 
```
### 对象属性与  ... 
对象的收集与扩散
```
var o1 = { a: 1, b: 2 }, 
    o2 = { c: 3 }, 
    o3 = { ...o1, ...o2, d: 4 }; 
console.log( o3.a, o3.b, o3.c, o3.d ); 
```
```
var o1 = { b: 2, c: 3, d: 4 }; 
var { b, ...o2 } = o1; 
console.log( b, o2.c, o2.d );       // 2 3 4
```
### Array#includes(..)
代替indexOf，比如indexOf在数组中查找 NaN 值会失败。
### SIMD
SIMD API 暴露了各种底层（CPU）指令，它们可以同时操作一个以上的数字值。并行数学操作。类似汇编的语法
### WebAssembly (WASM)
为转译/交叉编译而努力

* 一种方案是基于ASM.js的，另一种是直接执行二进制代码