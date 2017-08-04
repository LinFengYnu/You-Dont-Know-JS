## asynquence库

这个库是很多异步模式的载体。

### 序列与抽象设计
这种异步模式是“序列”模式。一个序列代表了一个任务的容器，由完成这个任务的独立（可能是异步）的步骤组成。

* 序列是可控的，比Promise好，asynquence序列可以在任何时间被abort()
* 错误是整体的而不是全局的，控制反转到序列
* 可以把每个单独步骤涉及的异步类型等细节抽象出去
* 序列很容易被改造，以适应不同的思考模式，比如基于事件、基于流、基于响应的
编码。

### asynquence API
创建一个ASQ实例、即序列，传的每个参数表示序列中的一个初始步骤。

#### 步骤
所有后续的参数都是从前一个步骤传递过来的消息。直到这个continuation回调被
调用后，这个步骤才完成。

* 异步then(),同步done()或val()

#### 错误
一个序列中任何一个步骤出错都会把整个序列抛入出错模式中，剩余的普通步骤会被忽略。

* or(..)序列方法或onerror(..)方法控制错误。
* 错误不会被吞掉
* 还可以显式避免错误报告

#### 并行步骤
门的实现gate(..)和Promise.all([..])直接对应。

* 如果gate(..)中所有的步骤都成功完成，那么所有的成功消息都会传给下一个序列步骤。如果它们中有任何一个出错的话，整个序列就会立即进入出错状态。

##### 步骤的变体
如any、first、race、last、none

* 还有map映射
* waterfall(..)瀑布，一个成功才下一个，最后才成功，一出错就全错

##### 容错
强行容错

* try...catch，失败了用成功消息填充
* 也可以使用until(..)建立一个重试循环，强行从循环中退出break就会让主序列进入出错状态。
* 兼容promise风格，用pThen和pCatch

#### 序列分叉
和promise的分支不一样，asynquence里可使用fork()实现同样的分叉。
```
var sq2 = sq.fork();
```

#### 合并序列
seq(..)，通过把一个序列归入另一个序列来合并这两个序列。还有pipe方法。

### 值与错误序列
想自动创建一个延时值或者延时出错的序列。可以使用contrib插件after和
failAfter。
### Promise与回调
可以把promise归并到序列里。也可以通过toPromise把promise剔出来。

* 可以使用errfcb生成一个error-first风格回调以连入到面向回调的工具
* 为某个工具创建一个序列封装的版本ASQ.wrap(..)

### 可迭代序列
有时候要实现Promise或步骤的外部控制，这会导致棘手的capability extraction问题。

* asynquence把控制能力外部化了
```
/ 注： 这里的domready是一个控制这个序列的迭代器 
var domready = ASQ.iterable();  
// ..  
domready.val( function(){  
    // DOM就绪 
} );  
// ..  
document.addEventListener( "DOMContentLoaded", domready.next ); 
```

### 运行生成器
asynquence也内建了生成器，叫作runner(..)。通过ASQ.wrap(..)包装也可以实现一个指定生成器的普通函数。
```
ASQ( 10, 11 )  
.runner( function*(token){  
var x = token.messages[0] + token.messages[1];  

// yield一个真正的promise  
x = yield doublePr( x );  

// yield一个序列  
x = yield doubleSeq( x );  	
return x;  
} )  
.val( function(msg){  
    console.log( msg );         // 84  
} );
```