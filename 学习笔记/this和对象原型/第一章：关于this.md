## 关于this
this可以在不同的上下文对象中灵活使用函数。所以this提供了一种更优雅的方式来隐式“传递”一个对象引用。

### 误解

* this并不像我们所想的那样指向函数本身。
* 作者给了个例子，把属性先赋给函数，然后在函数体内操作this.属性，结果并没有变化。
* 虽然可以用词法作用域的东西逃避解决，但是并不完美。
* 被弃用和批判的用法，是使用arguments.callee。
* 另一种方法是强制this指向foo函数对象：foo.call( foo, i ); //this = foo

#### 它的作用域

this在任何情况下都不指向函数的词法作用域。不要把this和词法作用域的查找混合使用。
这一段给的例子运行结果和给的结果不一样。

### this到底是什么

当一个函数被调用时，会创建一个活动记录。this就是记录的其中一个属性。
