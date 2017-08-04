## 新增API
ES6给各种内建原生类型和对象增加了许多静态属性和方法来辅助开发。

* “ES6 Shim”(https://github.com/paulmillr/es6­shim/)

###  Array 
毕竟用的多，拓展的也最给力。

#### Array.of(..)  
Array.of(..)比直接用Array构造好
```
var b = Array.of( 3 ); 
b[0];                           // 3 
```
* 当需要包装一个单值为一个数组时可以用
* 扩展 Array 构成它的子类，而且希望能够在子类的实例中创建和初始化元素(弥补Array父类的构造缺点)
#### Array.from(..)  
把类数组转成数组,比Array.prototype.xx.call好
```
var arrLike = { 
    length: 4, 
    2: "foo" 
}; 
Array.from( arrLike ); 
// [ undefined, undefined, "foo", undefined ] 
```

##### 避免空值槽
Array.from(..)是没有空值槽的
```
var c = Array.from( { length: 4 } );
c.map(e=>{return 4;});//[4,4,4,4]
```

##### 映射
Array.from(..)的第二个参数是一个映射函数

* 第三个参数是this绑定

#### 创建 Arrays 和子类型
of(..) 和 from(..) 返回的都是子类对象

* 要覆盖使用的话使用@@species,但仅适用于原型方法，of(..) 和 from(..)不适用
```
static get [Symbol.species]() { return Array; } 
```

#### copyWithin(..)  原型方法
copyWithin(target,start,end) 将数组的一部分拷贝到同一个数组的其他位置，覆盖之前存在在那里的任何东西。
```
[1,2,3,4,5].copyWithin( 3, 0 );         // [1,2,3,1,2] 
[1,2,3,4,5].copyWithin( 3, 0, 1 );      // [1,2,3,1,5]
```

* 不是单纯的从左到右拷贝
```
[1,2,3,4,5].copyWithin( 2, 1 );     // [1,2,2,3,4]
```

#### fill(..)  原型方法
填充,必选填充元素，可选地接收 开始 与 结束 参数

#### find(..)  原型方法
比indexOf优雅,比some(..)精确
```
var a = [1,2,3,4,5]; 
a.find( function matcher(v){ 
    return v == "2"; 
} );                                // 2 
a.find( function matcher(v){ 
    return v == 7;                  // undefined 
}); 
```
* 匹配对象也是可以的
* 同样支持第二个参数绑定this

#### findIndex(..)  原型方法
专业找索引,和find()类似

#### entries() ,  values() ,  keys()  原型方法
Array提供了相同的迭代器方法： entries() ， values() ，和 keys()
```
var a = [1,2,3]; 
[...a.values()];                    // [1,2,3] 
[...a.keys()];                      // [0,1,2] 
[...a.entries()];                   // [ [0,1], [1,2], [2,3] ] 
[...a[Symbol.iterator]()];          // [1,2,3]
```
### Object
增强对象操作能力，还用于任意种类的通用全局API
#### Object.is(..)
进行值的严格比较,比===还严格

* 注意
```
Object.is( NaN,NaN );                  // true 
Object.is( 0, -0);                  // false
```

#### Object.getOwnPropertySymbols(..)
仅取回直接存在于对象上的symbol属性。
#### Object.setPrototypeOf(..)
实现行为委托,设置一个对象的 [[Prototype]]
```
var o1 = { 
    foo() { console.log( "foo" ); } 
}; 
var o2 = { 
    // .. o2 的定义 .. 
}; 
Object.setPrototypeOf( o2, o1 ); 
// 委托至 ò1.foo()` 
o2.foo();                           // foo 
```
#### Object.assign(..)
对象浅拷贝

* defineProperty()设置的属性会被忽略
* 非枚举属性和非自身属性将会被排除在赋值之外
* 可以配合Object.create(..)
```
var o1 = { 
    foo() { console.log( "foo" ); } 
}; 
var o2 = Object.assign( 
    Object.create( o1 ), 
    { 
        // .. o2 的定义 .. 
    } 
); 
// 委托至 ò1.foo()` 
o2.foo();                           // foo
```

### Math
计算专用

* 三角函数：X弦/反X弦/勾股计算
* 算数函数：立方根...
* 元函数：sign(..)返回数字的符号, trunc(..)返回一个数字的整数部分,fround(..)舍入到最接近的32位（单精度）浮点数值

### Number
辅助常见的数字操作
#### 静态属性
有用的数字常数

* Number.EPSILON  ­ 在任意两个数字之间的最小值
* Number.MAX_SAFE_INTEGER  ­ 可以用一个JS数字值明确且“安全地”表示的最大整数： 2^53 ‐1 
* Number.MIN_SAFE_INTEGER  ­ 可以用一个JS数字值明确且“安全地”表示的最小整数： ‐(2^53‐ 1) 或 (‐2)^53 + 1 

#### Number.isNaN(..)
Number.isNaN(..)弥补isNaN()的bug
#### Number.isFinite(..)
Number.isFinite(..)省略强制转换，而isFinite(..)不会
#### 整数相关的静态函数
Number.isInteger(..)

* 过滤了一些明显的非整数值，在算法中特别有用
* 还定义了一个 Number.isSafeInteger(..)

###  String 
辅助常见的字符串操作
#### Unicode 函数
String.fromCodePoint(..) ， String#codePointAt(..) ， String#normalize(..) 

#### String.raw(..)
String.raw(..)被作为一个内建的标签函数来与字符串字面模板一起使用，取得不带有任何转译序列处理的未加工的字符串值
```
var str = "bc"; 
String.raw`\ta${str}d\xE9`; 
// "\tabcd\xE9", not "  abcdé"
```
#### repeat(..)
重复字符串
```
"foo".repeat( 3 );                  // "foofoofoo"
```
#### 字符串检验函数
对String#indexOf(..) 和 String#lastIndexOf(..) 的补充

* startsWith(..)判断开始
* endsWith(..)判断结束
* includes(..)判断包含
* 不接受正则表达式作为检索字符串。