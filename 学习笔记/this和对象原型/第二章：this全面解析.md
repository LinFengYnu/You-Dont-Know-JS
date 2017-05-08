## this全面解析

### 调用位置
弄清调用栈和调用位置。调用位置决定了this的绑定。

```
function baz() { 
    // 当前调用栈是：baz 栈底
    // 因此，当前调用位置是全局作用域 
 
    console.log( "baz" ); 
    bar(); // <-- bar的调用位置 
} 
 
function bar() { 
    // 当前调用栈是baz -> bar 栈底
    // 因此，当前调用位置在baz中 
 
    console.log( "bar" ); 
    foo(); // <-- foo的调用位置 
} 
 
function foo() { 
    // 当前调用栈是baz -> bar -> foo 栈底
    // 因此，当前调用位置在bar中 
 
    console.log( "foo" ); 
} 
 
baz(); // <-- baz的调用位置
```

### 绑定规则
四条规则。

#### 默认绑定
独立函数调用。如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定。
```
function foo() {  
    console.log( this.a ); 
} 
var a = 2; 
 
foo(); // 2
```
#### 隐式绑定
查看调用位置是否有上下文对象。

* 比如obj.foo()，this被绑定到obj上去了。
* 对象属性引用链中只有最顶层或者说最后一层会影响调用位置。比如说obj1.obj2.foo()和obj2.foo()效果一样。

##### 隐式丢失
当一个变量引用了函数的时候。或者传入回调函数时。
```
function foo() {  
    console.log( this.a ); 
} 
 
var obj = {  
    a: 2, 
    foo: foo  
}; 
 
var bar = obj.foo; // 函数别名！ 
  
var a = "oops, global"; // a是全局对象的属性 
 
bar(); // "oops, global"
```
这个例子中this还是全局对象。

在那个传入回调函数的例子里，函数的调用位置决定了this是全局对象。传入类似setTimeout()内置函数也是一样的。

#### 显式绑定

显式绑定使用函数的call(..)和apply(..)方法。它们的第一个参数是一个对象。例如foo.call( obj ); 

##### 硬绑定

* 强制绑定，不可修改。
```
function foo() {  
    console.log( this.a ); 
} 
 
var obj = {  
    a:2 
}; 
//硬绑定到了obj上
var bar = function() { 
    foo.call( obj ); 
}; 
 
bar(); // 2 
setTimeout( bar, 100 ); // 2 
 
// 硬绑定的bar不可能再修改它的this 
bar.call( window ); // 2
```
* 可以自己创建一个复用bind函数。ES5也自带Function.prototype.bind方法。
```
// 简单的辅助绑定函数 
function bind(fn, obj) {  
    return function() { 
        return fn.apply( obj, arguments );  
    }; 
} 
```

* API调用上下文
很多函数自带绑定上下文的功能，比如[1, 2, 3].forEach( foo, obj ); 

#### new绑定
JS的构造函数和其他语言的不一样。构造函数只是一些使用new操作符时被调用的函数。不用new它们照样可以用。new只是一个语法糖。实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。

new其实做了这些事：
1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行[[原型]]连接。
3. 这个新对象会绑定到函数调用的this。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

### 优先级
四条规则按优先级来执行。
new 绑定>显式绑定>隐式绑定>默认绑定

### 绑定例外
显式绑定时传入的是null或者undefined会应用默认绑定，一般在函数柯里化会用到。至于展开数组可以用ES6的...。这样做的副作用是可能会覆盖全局的变量，导致bug。

#### 更安全的this
委托给空对象。
```
function foo(a,b) { 
    console.log( "a:" + a + ", b:" + b ); 
} 
 
// 我们的DMZ空对象 
var ø = Object.create( null ); 
 
// 把数组展开成参数 
foo.apply( ø, [2, 3] ); // a:2, b:3 
 
// 使用bind(..)进行柯里化 
var bar = foo.bind( ø, 2 );  
bar( 3 ); // a:2, b:3
```
#### 间接引用
容易在赋值时发生。比如在例子里，赋值表达式p.foo = o.foo的返回值是foo的引用，因此调用位置就是foo()。如果此时函数体处于严格模式，this就会绑定到undefined。

#### 软绑定（说实话这块的例子看不太懂）
硬绑定后不能再使用显式绑定或隐式绑定。那么如果给默认绑定指定一个非undefined的对象（也称为软绑定），那么就可以保留使用显式绑定或隐式绑定的能力。
```
if (!Function.prototype.softBind) {  
    Function.prototype.softBind = function(obj) { 
        var fn = this; 
        // 捕获所有 curried 参数 
        var curried = [].slice.call( arguments, 1 );  
        var bound = function() { 
            return fn.apply( 
                (!this || this === (window || global)) ? 
                    obj : this 
                curried.concat.apply( curried, arguments ) 
            );  
        }; 
        bound.prototype = Object.create( fn.prototype ); 
        return bound;  
    }; 
}
```
* 首先检查调用时的this，如果this绑定到undefined或全局对象上，就把传进来的obj绑定到this上。
* 还支持柯里化。

### this词法
箭头函数不适用这四条规则。它自己没有this，用的外层的。self = this和箭头函数看起来都可以取代bind(..)，但是从本质上来说，它们想替代的是this机制。所以作者建议：
1.用不6this就不要用了。用词法作用域就好了。
2.全程使用this。使用bind辅助，不要用箭头函数和self。

