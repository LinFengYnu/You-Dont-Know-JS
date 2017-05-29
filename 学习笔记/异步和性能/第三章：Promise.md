## Promise
控制反转再反转，信任问题又到自己手上了。

### 什么是Promise
学懂一个东西可以看它对待这个东西的使用态度。是只会API还是真正理解。

#### 未来值
以买汉堡作为类比。取餐号就是Promise。

* Promise可能会成功也有可能会失败。
* 也有可能Promise一直处于未决议状态。

##### 现在值与将来值
作者先以回调做对比，发现了一个特点：把现在值与将来值统一变成未来要执行的。

##### Promise值
例子中使用了两层Promise。

* 第一层：fetchX()和fetchY()调用后返回Promise对象,传给add()函数,不管原始值是现在的还是将来的，Promise都归一化了。
* 第二层：add函数的return Promise.all( [xPromise, yPromise] ),接着通过链式调用then()得到另外一个promise
* 调用add()以及then方法可以把未来值sum拿到
* 调用then(..)实际上可以接受两个函数,一个用于成功一个用于失败
* 所以Promise是和时序无关的,一旦决议后就是外部不可变的值

### 完成事件
从另外一个角度看，Promise就是一种在异步任务中作为两个或更多步骤的流程控制机制。

* 传统js里会对一个未知函数进行事件侦听,称作完成事件。
```
function foo(x) {  
    // 开始做点可能耗时的工作  
    // 构造一个listener事件通知处理对象来返回 
    return listener;  
}  
 
var evt = foo( 42 );  
 
evt.on( "completion", function(){  
    // 可以进行下一步了！  
} );  
 
evt.on( "failure", function(err){  
    // 啊，foo(..)中出错了 
} );
```
* evt对象就是分离的关注点之间一个中立的第三方协商机制。

#### Promise事件
Promise"事件"也是这种机制。
```
function foo(x) {  
    // 可是做一些可能耗时的工作  
 
    // 构造并返回一个promise 
    return new Promise( function(resolve,reject){  
        // 最终调用resolve(..)或者reject(..) 
        // 这是这个promise的决议回调 
    } );  
 
}  
 
var p = foo( 42 );  
 
bar( p );  
 
baz( p ); 
```
* 这时bar和baz的内部实现可能就是在侦听foo的完成状态,并分别调用成功或者失败函数
* 还有一种实现方式是在p.then(...)中传入处理成功和失败的函数

### 具有then方法的鸭子类型
要确定是不是真的Promise类型。

* 不能使用instanceof,因为这个Promise可能不是ES6的Promise
* 鸭子类型检查可以帮忙：p是对象或者函数，并且p.then的类型是函数。但可能会有坑。
* 还有其他方法，比如branding，甚至anti-branding。但是ES标准决定不能让对象有then函数。

### Promise信任问题
Promise提供了信任
#### 调用过早
即使是立即完成的Promise也无法被同步观察到。

* 总是异步的

#### 调用过晚
一个Promise决议后，这个Promise上所有的通过then(..)注册的回调都会在下一个异步时机点上依次被立即调用。

* 要避免细微区别带来的噩梦，你永远都不应该依赖于不同Promise间回调的顺序和调度。

#### 回调未调用
Promise总会给一个结果的。但是还要考虑永远未决议的Promise。

* 给Promise加上一种竞态机制,超时就不管了。

#### 调用次数过少或过多
过少就是0,和未调用一个处理方案。不可能出现过多,因为Promise只会决议一次。
#### 未能传递参数/环境值
如果要传递多个值，就必须要把它们封装在单个值中传递，比如通过一个数组或对象。

#### 吞掉错误或异常
出错可能会引起同步响应，而不出错则会是异步的。

* 如果错误出现在了then方法里,看似被吞了,其实是我们没有侦听它。
* 所以不要忘记加上处理错误

#### 是可信任的Promise吗
如果向Promise.resolve(..)传递一个非Promise、非thenable的立即值，就会得到一个用这个值填充的promise。

* 不可信任是那些假装是Promise的有then方法的值。解决方法是用resolve把它化成promise。

#### 建立信任
Promise的设计目的就是为了使异步编码更清晰。

### 链式流
可以把多个Promise连接到一起以表示一系列异步步骤。

* 每次对Promise调用then(..)，它都会创建并返回一个新的Promise，我们可以将其链接起来；
* 从上一个then返回的值会自动设置成链接的Promise的完成值
* 后一步总会等前一步的。
* 当从完成处理函数返回一个promise时，它会被展开并有可能延迟下一个步骤。所以一个错误可以沿着promise链一直传递下去。
* 只处理错误的API是catch(function(err) { .. })。
* 缺点是有大量的重复样板。

#### 术语：决议、完成以及拒绝
决议的结果可能是完成或者拒绝，所以resolve作为第一个函数名比fulfilled好。

* 在then里的回调函数用fulfilled和rejected命名。ES6规范将这两个回调命名为onFulfilled(..)和onRjected(..)。

### 错误处理

* try..catch结构只能用于同步。
* 理论上可以使用error-first回调来处理异步错误，但是可能会陷入回调地狱。
* Promise是回调分离的。但如果是在解决函数里出了错误就会有坑。
* 如果通过无效的方式使用Promise API，并且出现一个错误阻碍了正常的Promise构造，那么结果会得到一个立即抛出的异常，而不是一个被拒绝的Promise。

#### 绝望的陷阱
为了避免丢失被忽略和抛弃的Promise错误，Promise链的一个最佳实践就是最后总以一个catch(..)结束。但如果错误里面还内嵌错误就是大坑。

#### 处理未捕获的情况
有个方法是注册一个类似于“全局未处理拒绝”处理函数的东西，这样就不会抛出全局错误，而是调用这个函数。用定时器来判断是否要抛出错误。(太随意了)

* 可以设想一个done方法

#### 成功的坑
考虑Promise的未来发展,可能会有个defer()方法查看历史错误,并且Promsie在下一个任务或时间循环tick上（向开发者终端）会报告所有拒绝。

* 默认情况下，所有的错误要么被处理要么被报告。

### Promise模式
自带的很多模式简化了开发和维护。
#### Promise.all([ .. ])
类似门。必须所有的Promise都成功完成后才继续执行。一错皆错。

* 要记住为每个promise关联一个拒绝/错误处理函数，特别是从Promise.all([ .. ])返回的那一个。

#### Promise.race([ .. ])
门闩或者竞态的模式。

* 一旦有任何一个Promise决议为完成，Promise.race([ .. ])就会完成；一旦有任何一个Promise决议为拒绝，它就会拒绝。
* 不要传递空数组
* 超时竞赛可以帮助解决异步调用太晚的问题：只要超时就判定另外一个赢了。
* 未来Promise需要一个finally(..)回调注册,不然被忽略掉的Promise会造成性能和内存上的问题。
* 有一种方法可以查看Promise的完成而不对其产生影响。

#### all([ .. ])和race([ .. ])的变体

* none([ .. ]) 全部拒绝
* any([ .. ]) 忽略拒绝
* first([ .. ]) 第一个完成的
* last([ .. ]) 最后一个完成的
* 有相应的polyfill代码

#### 并发迭代
使用异步迭代函数。

* 以一个异步的map函数为例，迭代函数里每次返回一个Promise
```
Promise.map = function(vals,cb) {  
    // 一个等待所有map的promise的新promise  
    return Promise.all(  
        // 注：一般数组map(..)把值数组转换为 promise数组  
        vals.map( function(val){  
            // 用val异步map之后决议的新promise替换val  
            return new Promise( function(resolve){  
                cb( val, resolve );  
            } );  
        } )  
    );  
};

Promise.map( [p1,p2,p3], function(pr,done){  
    // 保证这一条本身是一个Promise  
    Promise.resolve( pr )  
    .then(  
        // 提取值作为v  
        function(v){  
            // map完成的v到新值  
            done( v * 2 );  
        },  
        // 或者map到promise拒绝消息  
        done  
    );
} )  
.then( function(vals){  
    console.log( vals );         // [42,84,"Oops"]  
} ); 
```

### Promise API概述
ES6中的Promise规范，作者写了Native Promise 库

#### new Promise(..)构造器
必须提供一个函数回调。resolve接受(可能完成可能拒绝),reject拒绝

#### Promise.resolve(..)和Promise.reject(..)
reject适用于创建拒绝,resolve适用于创建Promise
```
var p1 = Promise.resolve( fulfilledTh );  
var p2 = Promise.resolve( rejectedTh );
var p3 = Promise.reject( rejectedTh );
```

#### then(..)和catch(..)
Promise的then方法需要传两个参数：成功或拒绝的回调函数。catch相当于then(null,..)

#### Promise.all([ .. ])和Promise.race([ .. ])
它们都会返回一个Promise。一个是门模式一个是门闩模式。

* 传空数组的话all会立即完成，race会挂住

### Promise局限性
#### 顺序错误处理
Promise链中的错误容易被忽略掉。

* 同于try..catch存在的局限.catch(..)也无法检测到

#### 单一值
不管是成功还是拒绝都是返回单值。面对封装值的复杂情况另外看待。

* 返回一个promise数组。若干个值。
* 采用某种函数技巧
```
function spread(fn) {  
    return Function.apply.bind( fn, null );  
}
```
* 解构赋值，Promise提供了参数解构赋值：传[x,y]打印x,y
```
var [x,y] = msgs;  
console.log( x, y );
```

#### 单决议
无法适用于数据或事件流的多值决议处理。

* 需要在事件处理函数中定义整个Promise链，破坏了关注点与功能分离（SoC）的思想。
```
click( "#mybtn", function(evt){  
    var btnID = evt.currentTarget.id;  
 
    request( "http://some.url.1/?id=" + btnID )  
    .then( function(text){  
        console.log( text );  
    } );  
} ); 
```

#### 惯性
把回调风格的代码改成Promise风格的。使用promisory。

* wrap函数：需要一个error-first风格的回调作为第一个参数，并返回一个新的函数。返回的函数自动创建一个Promise并返回，并替换回调，连接到Promise完成或拒绝。
```
// polyfill安全的guard检查 
if (!Promise.wrap) {  
    Promise.wrap = function(fn) {  
        return function() {  
            var args = [].slice.call( arguments );  
            return new Promise( function(resolve,reject){  
                fn.apply(  
                    null,  
                    args.concat( function(err,v){  
                        if (err) {  
                            reject( err );  
                        }  
                        else {  
                            resolve( v );  
                        }  
                    } )  
                );  
            } );  
        };  
    };  
}
```

#### 无法取消的Promise
不能外部人为取消，不然就违背了未来值的可信任性。

* 用超时取消的方法Promise值本身还是会运行。
* 侵入式地定义决议回调:在超时Promise定义一个catch函数,侵入一个变量用于控制后面的then执不执行
* 取消应该是一个更高层的抽象机制
* 单独的Promise不应该可取消，但是取消一个可序列是合理的

#### Promise性能
理论上比回调稍慢一些，但是是值得使用的。因为它带来的异步好处和可信任性完全使得降低性能成为一个伪命题。
