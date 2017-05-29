## 混合环境JavaScript

JS会在不同的宿主上运行，不同的JS引擎运行代码时差异也会显现出来。

### Annex B（ECMAScript）
ECMAScript才是官方名称，JS是在浏览器上运行的。Annex B介绍了由于浏览器兼容性问题导致的与官方规范的差异。

* 在非严格模式中允许八进制数值常量存在
* window.escape(..)和window.unescape(..)让你能够转义（escape）和回转（unescape）
带有%分隔符的十六进制字符串。
* String.prototype.substr和String.prototype.substring十分相似，除了前者的第二个参数是结束位置索引，后者的第二个参数是长度。

#### Web ECMAScript
其中的内容对浏览器来说是“必需的”。

* <!--和-->是合法的单行注释分隔符。
* String.prototype中返回HTML格式字符串的附加方法：anchor(..)等
* RegExp扩展：RegExp.$1 .. RegExp.$9（匹配组） 和RegExp.lastMatch/RegExp["$&"]（最近匹配）。
* Function.prototype附加方法：Function.prototype.arguments和Function.caller。(不推荐)

### 宿主对象
由宿主元素提供的对象。

* 如DOM元素,其内部的[[Class]]值（为"HTMLDivElement"）来自预定义的属性。
* 无法访问正常的object内建方法，如toString()
* 无法写覆盖,无法将this重载为其他对象的方法
* 包含一些预定义的只读属性

### 全局DOM变量
在创建带有id属性的DOM元素时也会创建同名的全局变量。

* 尽量不要使用全局变量,避免与其他地方的变量产生冲突。

### 原生原型
不要扩展原生原型。

* 前人挖坑，后人跳坑
* 实在要加的话在使用之前加个判断条件,但是也会有坑,原生的方法可能和自定义的逻辑不一样
* 既检测原生方法是否存在，又要测试它能否执行我们想要的功能的话代价太高
* 单元和回归测试能够早点发现问题

### shim/polyfill
polyfill能有效地为不符合最新规范的老版本浏览器填补缺失的功能

* ES5-Shim（https://github.com/es-shims/es5-shim）和ES6-Shim（https://github.com/es-shims/es6-shim）
* Traceur（https://github.com/google/traceur-compiler/wiki/GettingStarted）或Babel可以实现语法间的转换
* polyfill很多时候做不到100%
* 区别shim（有兼容性测试）和polyfill（检查功能是否存在）。
* 要编写健壮的代码，并且写好文档。

### <script>
各种<script>共享一个全局变量

* 全局变量作用域的提升机制不适用这种情况
* 内联代码的script标签没有charset属性。
* 内联代码中可以额包含HTML或XHTML格式的注释,但是不推荐。

### 保留字
不能将它们用作变量名。

* 关键字,如function和switch
* 预留关键字,如enum和class
* null常量
* true/false布尔常量
* ES5之后能用来作为对象常量中的属性名称或者键值

### 实现中的限制
由于JavaScript引擎实现各异，规范在某些地方有一些限制。

* 字符串常量中允许的最大字符数（并非只是针对字符串值）；
* 可以作为参数传递到函数中的数据大小（也称为栈大小，以字节为单位）；
* 函数声明中的参数个数；
* 未经优化的调用栈（例如递归）的最大层数，即函数调用链的最大长度；
* JavaScript程序以阻塞方式在浏览器中运行的最长时间（秒）；
* 变量名的最大长度。