## 表单校验库

A library of supports chained check data.

### 引用库模块：

```javascript

import v from 'form-validator'
// judge：判断函数（支持基本类型和引用类型），返回true || false
v.judge("dafb", v.str.len(4).min(3)) // true

// valid: 链式校验结果回调函数，通过then和catch处理校验后逻辑
v.valid("dafb").str.len(4).min(3).then(() => {
  // 输入校验正确后的逻辑
}).catch(e => {
  console.log('具体校验结果: ', e)
  // 输入校验不正确后的逻辑
})

// validate： 对象多个属性值同时校验结果回调函数，通过then和catch处理校验后逻辑
v.validate({
  a: 'string',
  b: [1,3],
  c: { c1: '123', c2: '4534' }
}, {
    a: v.str.min(6),
    b: v.arr.len(2),
    c: {
      c1: v.str.gt(100),
      c2: v.str
    }
  }).then(() => {
  // 输入校验正确后的逻辑
}).catch(e => {
  console.log('具体校验结果: ', e)
  // 输入校验不正确后的逻辑
})
```
------

### 方法说明

### 类型校验
* .str  字符串验证链式对象。
* .num  数字验证链式对象。
* .obj  对象值类型验证链式对象。
* .arr  数组值验证链式对象。
* .boolean  布尔值验证链式对象。
* .any  任意类型数据验证链式对象。

```javascript
// 类型校验
const str = 'str', num = 123, ob = {a: 1}, arrs = [1,2], bo = false
function valid (arg) {
  const str = v.judge(arg, v.str)
  const num = v.judge(arg, v.num)
  const ob = v.judge(arg, v.obj)
  const arr = v.judge(arg, v.arr)
  const bo = v.judge(arg, v.boolean)
  console.warn('-----my argument is %o, str is %o, num is %o, ob is %o, arr is %o, boolean is %o', arg, str, num, ob, arr, bo)
}
valid(str)
valid(num)
valid(ob)
valid(arrs)
valid(bo)
```


### 范围校验
* .eq 等于。argument: any
* .not 不等于。argument: any
* .gt  大于。value, argument: string | number | Date
* .gte  大于等于。value, argument: string | number | Date
* .lt  小于。value, argument: string | number | Date
* .lte  小于等于。value, argument: string | number | Date
* .between 范围。value, arguments: string | number | Date
* .len  长度校验。value: string | number | any[], argument: string | number

```javascript
// .eq
function eq () {
  const eq1 = v.judge('123', v.any.eq(123))
  const eq2 = v.judge(false, v.any.eq(true))
  const eq3 = v.judge('123', v.any.eq(345))
  const eq4 = v.judge({a: 1}, v.any.eq({a: 1}))
  const eq5 = v.judge({a: 2}, v.any.eq({a: 1}))
  const eq6 = v.judge([{a: 1}], v.any.eq([{a: 1}]))
  console.warn('----- my data is eq1 is %o, eq2 is %o, eq3 is %o, eq4 is %o, eq5 is %o, eq6 is %o', eq1, eq2, eq3, eq4, eq5, eq6)
}
eq()

// .not
function not () {
  const not1 = v.judge('123', v.any.not('123'))
  const not2 = v.judge(false, v.any.not(true))
  const not3 = v.judge('123', v.any.not(123))
  const not4 = v.judge({a: 1}, v.any.not({a: 1}))
  const not5 = v.judge({a: 2}, v.any.not({a: 1}))
  const not6 = v.judge([{a: 1}], v.any.not([{a: 1}]))
  console.warn('----- my data is not1 is %o, not2 is %o, not3 is %o, not4 is %o, not5 is %o, not6 is %o', not1, not2, not3, not4, not5, not6)
}
not()


// .gt, .gte, .lt, .lte
function gt () {
  const gt1 = v.judge('123', v.any.gt('100'))
  const gt2 = v.judge('123', v.any.gt(100))
  const gt3 = v.judge('123', v.any.gt(300))
  const gt4 = v.judge({a: 1}, v.any.gt({a: 1}))
  const gt5 = v.judge({a: 2}, v.any.gt({a: 1}))
  console.warn('----- my data is gt1 is %o, gt2 is %o, gt3 is %o, gt4 is %o, gt5 is %o', gt1, gt2, gt3, gt4, gt5)
}
gt()

// .between
function between () {
  const between1 = v.judge('123', v.any.between('100', 200))
  const between2 = v.judge('123', v.any.between(100, '250'))
  const between3 = v.judge('123', v.any.between(300, '400'))
  console.warn('----- my data is between1 is %o, between2 is %o, between3 is %o', between1, between2, between3)
}
between()
```

### 长度校验
* .len  相等。value: string | number | any[], argument: string | number
* .min  小于。value: string | number | any[], argument: string | number
* .max  大于。value: string | number | any[], argument: string | number


```javascript
// .len
function len () {
  const len1 = v.judge('123', v.any.len(3))
  const len2 = v.judge([1, 2], v.any.len(2))
  console.warn('----- my data is len1 is %o, len2 is %o', len1, len2)
}
len()

// .min
function min () {
  const min1 = v.judge('123', v.any.min(2))
  const min2 = v.judge([1, 2], v.any.min(3))
  console.warn('----- my data is min1 is %o, min2 is %o', min1, min2)
}
min()

// .max
function max () {
  const max1 = v.judge('123', v.any.max(4))
  const max2 = v.judge([1, 2], v.any.max(1))
  console.warn('----- my data is max1 is %o, max2 is %o', max1, max2)
}
max()
```

### 包含
* .has。value: string | number| any[] | object, arg: string | number| any 

```javascript
function has () {
  const has1 = v.judge('123', v.any.has(3))
  const has2 = v.judge([1, 2], v.any.has(2))
  const has3 = v.judge({a: 1}, v.any.has('a'))
  console.warn('----- my data is has1 is %o, has2 is %o, has3 is %o', has1, has2, has3)
}
has()
```

### 文件名
* .ext: value: string, arg: string 

```javascript
function ext () {
  const ext1 = v.judge('123.png', v.any.ext('png'))
  const ext2 = v.judge('sdfs.txt', v.any.ext('txt'))
  const ext3 = v.judge('sdfs.txt', v.any.ext('png'))
  console.warn('----- my data is ext1 is %o, ext2 is %o, ext3 is %o', ext1, ext2, ext3)
}
ext()
```


### 正则
* .reg: any, arg: RegExp 

```javascript
function reg () {
  const reg1 = v.judge('123', v.any.reg(/\d/))
  const reg2 = v.judge([1, 2], v.any.reg(/\d/))
  const reg3 = v.judge({a: 1}, v.any.reg(/\d/))
  console.warn('----- my data is reg1 is %o, reg2 is %o, reg3 is %o', reg1, reg2, reg3)
}
reg()
```


### 内置正则
* required: 必传,
* english: 英文,
* alphanum: 英文+数字,
* chinese: 中文,
* nospace: 不含任何空格字符,
* float: 浮点型,
* positivefloat: 正浮点型,
* integer: 整数,
* positiveint: 正整数,
* decimal: 小数,
* percent: 百分数,
* email: email,
* http: http地址,
* phone: 手机号,
* year: 年份,
* month: 月份,
* day: 日,
* hour: 0-23数字,
* minute: 0-59数字,
* hmt: 时分,
* time: 时分秒,
* date: 日期2020/10/10
* datetime: 日期时间 2020-10-11 20:20:12
* path: 路径,
* file: 文件名,
* imgurl: 图片地址

```javascript
function reg2 () {
  const reg1 = v.judge('https://www.baidu.com/123.png', v.str.imgurl)
  const reg2 = v.judge('2020-10-10', v.str.date)
  const reg3 = v.judge('2000-05-02 20:08:10', v.str.datetime)
  console.warn('----- my data is reg1 is %o, reg2 is %o, reg3 is %o', reg1, reg2, reg3)
}
reg2()
```


### 链式调用

```javascript
function name (n) {
  const rules = {
    username: [
      {required: true, message: '用户名不能为空', trigger: 'blur'},
      {type: 'string', message: '用户名必须为字符串', trigger: 'blur'},
      {min: 2,  message: '用户名长度必须为大于2', trigger: 'blur'},
      {pattern: /^[A-Za-z]+[\w\-_]*[A-Za-z0-9]+$/, message: '用户名必需字母或数字组合', trigger: 'blur'},
    ]
  }
  const name2 = v.judge(n, v.str.required.min(2).alphanum)
  console.warn('----- my data is name: ', name2)
}
name('1s')
```


### 对象链式调用

```javascript
function name2 (n) {
  const name2 = v.judge(n, {
    a: v.str.min(6),
    b: v.arr.len(2),
    c: {
      c1: v.num.gt(100),
      c2: v.str
    }
  })
  console.warn('----- my data is name2: ', name2)
}
name2({
  a: 'string',
  b: [1,3],
  c: { c1: 123, c2: '4534' }
})
```


### 对象的单项链式调用

```javascript
function name3 (n) {
  const val = v.get(n, 'c.c1')
  const name2 = v.judge(val, { c1: v.num.gt(100), c2: v.str })
  console.warn('----- my data is name3: ', name2)
}
name3({
  a: 'string',
  b: [1,3],
  c: { c1: 123, c2: '4534' }
})
```


### 验证结果逻辑处理

```javascript
function line (n) {
  const name2 = v.valid(n).str.required.min(2).alphanum.then(res => {
    console.warn('----- my data is res: ', res)
  }).catch(e => {
    console.warn('----- my data is e: ', e)
  })
}
line('sdf')
```



### 对象验证结果逻辑处理

```javascript
function object (n) {
  const name2 = v.validate(n, {
    a: v.str.min(6),
    b: v.arr.len(2),
    c: {
      c1: v.num.gt(100),
      c2: v.str
    }
  }).then(res => {
    console.warn('----- my data is success: ', res)
  }).catch(e => {
    console.warn('----- my data is name2: ', e)
  })
}
object({
  a: 'string',
  b: [1,3],
  c: { c1: '123', c2: '4534' }
})
```


### message处理

```javascript
function msg (n) {
  v.valid(n).any.required.gt(18).lt(30).alias('年龄').then(res => {
    console.warn('----- my data is res: ', res)
  }).catch(e => {
    console.warn('----- my data is e: ', e)
  })


  v.valid(n).any.required.gt(18).lt(30).msg({
    'gt': '我的年龄必须大于十八',
    'lt': '我的年龄必须大于三十'
  }).then(res => {
    console.warn('----- my data is res: ', res)
  }).catch(e => {
    console.warn('----- my data is e: ', e)
  })


  v.valid(n).any.required.gt(18).lt(30).alias('年龄', '十八').then(res => {
    console.warn('----- my data is res: ', res)
  }).catch(e => {
    console.warn('----- my data is e: ', e)
  })

  v.valid(n).num.between(18, 30).msg('between', '$name不仅要大于$arg1，也要小于$arg2！').then(res => {
    console.warn('----- my data is res: ', res)
  }).catch(e => {
    console.warn('----- my data is e: ', e)
  })
}
msg(12)
```


### 自定义校验

```javascript
function define (n) {
  v.valid(n).any.num.define(r => r>0).then(res => {
    console.warn('----- my data is res: ', res)
  }).catch(e => {
    console.warn('----- my data is e: ', e)
  })
}
define(-123)
```


### 异步校验

```javascript
function async (n) {
  v.judge(n, v.any.str.async(() => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(true)
      }, 1000)
    })
  }))
  .then(res => {
    console.warn('----- my data is res: ', res)
  }).catch(e => {
    console.warn('----- my data is e: ', e)
  })
}
async(123)
```
