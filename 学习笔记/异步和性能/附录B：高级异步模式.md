## 高级异步模式
利用asynquence探索更高级的异步模式

### 可迭代序列
可迭代序列是一个符合标准的迭代器。

* 和for..of结合使用
```
var steps = ASQ.iterable();  
 
steps  
.then( function STEP1(){ return 2; } )  
.then( function STEP2(){ return 4; } )  
.then( function STEP3(){ return 6; } )  
.then( function STEP4(){ return 8; } )  
.then( function STEP5(){ return 10; } );  
 
for (var v of steps) {  
    console.log( v );  
}  
// 2 4 6 8 10 
```
* 可迭代序列表达了一系列顺序的（同步或异步的）步骤
#### 可迭代序列扩展
一般异步手段是及早求值，而可迭代序列是惰性求值。

* 序列步骤排序有一个竞态条件。
* 所需的流程控制的动态性越强，可迭代序列的优势就越明显。

### 事件响应
promise和序列的弱点都是只能决议一次。处理事件流不是很好。

* 作者假想了一个Observable，可以查看所有状态的事件

#### ES7 Observable
“订阅”到一个流的事件的方式是传入一个生成器，事件每次发生就调用next()方法

#### 响应序列
看不懂

### 生成器协程
并发执行生成器

#### 状态机
根据状态不同委托给处理不同状态的函数

### 通信顺序进程
通信顺序进程（Communicating Sequential Processes，CSP）

* A要接收一个来自B的消息。A yield它对来自于B的这个消息的请求（因此暂停A）,反过来一样
* 通过通道的管道实现通信语义
```
var ch = channel();  
 
function *foo() {  
    var msg = yield take( ch );  
 
    console.log( msg );  
}  
 
function *bar() {  
    yield put( ch, "Hello World" );  
 
    console.log( "message sent" );  
}  
 
run( foo );  
run( bar );  
// Hello World  
// "message sent"
```

#### 消息传递

#### asynquence CSP模拟
ASQ也实现了CSP的模拟

* 在CSP中，我们把所有的异步都用通道消息上的阻塞来建模，而不是阻塞等待Promise/序列/thunk完成。
看不懂......