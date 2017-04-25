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

