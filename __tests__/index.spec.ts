import v from '../src/validator'
import m, { methodKey } from '../src/methods'

// 类型校验
describe('type validate', () => {
  function valid (value: any, result: string) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : value
    it(`${newVal} is string is ${result === 'string'}`, () => {
      expect(v.judge(value, v.str)).toBe(result === 'string')
    })
    it(`${newVal} is number is ${result === 'number'}`, () => {
      expect(v.judge(value, v.num)).toBe(result === 'number')
    })
    it(`${newVal} is boolean is ${result === 'boolean'}`, () => {
      expect(v.judge(value, v.boolean)).toBe(result === 'boolean')
    })
    it(`${newVal} is object is ${result === 'object'}`, () => {
      expect(v.judge(value, v.obj)).toBe(result === 'object')
    })
    it(`${newVal} is array is ${result === 'array'}`, () => {
      expect(v.judge(value, v.arr)).toBe(result === 'array')
    })
  }
  valid('abc', 'string')
  valid(123, 'number')
  valid(false, 'boolean')
  valid({ a: 1, b: 2 }, 'object')
  valid([1,2], 'array')
})

// 相等or不相等
describe('equality or not equality', () => {
  function eq (value: any, value2: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    const newRes = typeof value2 === 'object' ? JSON.stringify(value2) : typeof value2 === 'string' ? "'" + value2 + "'" : value2
    it(`${newVal} == ${newRes} is ${result}`, () => {
      expect(v.judge(value, v.any.eq(value2))).toBe(result)
    })
    it(`${newVal} != ${newRes} is ${!result}`, () => {
      expect(v.judge(value, v.any.not(value2))).toBe(!result)
    })
  }
  eq(111, 111, true)
  eq(111, '111', true)
  eq('123', '123', true)
  eq('123', 123, true)
  eq(false, false, true)
  eq(false, 0, true)
  eq(true, true, true)
  eq(true, 1, true)
  eq([1, 2], [1, 2], true)
  eq([1, 2], '1,2', false)
  eq({a: 1}, {a: 1}, true)
  eq({a: 1}, ['a', 1], false)
})

// 大于or小于
describe('greater than or less than', () => {
  function greater (value: any, value2: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    const val2 = typeof value2 === 'object' ? JSON.stringify(value2) : typeof value2 === 'string' ? "'" + value2 + "'" : value2
    it(`${newVal} > ${val2} is ${result}`, () => {
      expect(v.judge(value, v.any.gt(value2))).toBe(result)
    })
    const newRes = typeof value || typeof value2 ? false : !result
    it(`${newVal} < ${val2} is ${newRes}`, () => {
      expect(v.judge(value, v.any.lt(value2))).toBe(newRes)
    })
  }
  greater(123, 100, true)
  greater(123, '100', true)
  greater('123', '100', true)
  greater('123', 100, true)
  greater('123', false, true)
  greater('123', true, true)
  greater('123', [100], true)
  greater([123], 100, true)
  greater({a: 1}, 123, false)
  greater(123, {a: 1}, false)
  greater([1,2, 3], {a: 1}, false)
})

// // 范围
describe('between', () => {
  function between (value: any, value2: any, value3: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    const val2 = typeof value2 === 'object' ? JSON.stringify(value2) : typeof value2 === 'string' ? "'" + value2 + "'" : value2
    const val3 = typeof value3 === 'object' ? JSON.stringify(value3) : typeof value3 === 'string' ? "'" + value3 + "'" : value3
    it(`${val2} < ${newVal} < ${val3} is ${result}`, () => {
      expect(v.judge(value, v.any.between(value2, value3))).toBe(result)
    })
  }
  between(123, 100, 200, true)
  between('123', '100', '200', true)
  between('123', ['100'], '200', true)
  between('100', ['100'], '200', false)
  between('50', ['100'], '200', false)
  between({a: 1}, 0, 1000, false)
})

// 长度
describe('length', () => {
  function length (value: any, value2: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    const val2 = typeof value2 === 'object' ? JSON.stringify(value2) : typeof value2 === 'string' ? "'" + value2 + "'" : value2
    it(`the length of ${newVal} == ${val2} ${result}`, () => {
      expect(v.judge(value, v.any.len(value2))).toBe(result)
    })
  }
  length(123, 3, true)
  length('123', 3, true)
  length([1,2, 3], 3, true)
  length({a: 1, b: 2}, 2, false)
})

// 长度2
describe('min or max', () => {
  function length (value: any, value2: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    const val2 = typeof value2 === 'object' ? JSON.stringify(value2) : typeof value2 === 'string' ? "'" + value2 + "'" : value2
    it(`the length of ${newVal} >= ${val2} is ${result}`, () => {
      expect(v.judge(value, v.any.min(value2))).toBe(result)
    })
    let newRes = value.length === value2 ? true : !result
    if (v.judge(value, v.obj)) newRes = false
    it(`the length of ${newVal} <= ${val2} is ${newRes}`, () => {
      expect(v.judge(value, v.any.max(value2))).toBe(newRes)
    })
  }
  length(123, 2, true)
  length('123', 2, true)
  length('123', 3, true)
  length([1,2, 3], 2, true)
  length({a: 1, b: 2}, 2, false)
})

// 包含
describe('has', () => {
  function has (value: any, value2: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    const val2 = typeof value2 === 'object' ? JSON.stringify(value2) : typeof value2 === 'string' ? "'" + value2 + "'" : value2
    it(`the ${newVal} has ${val2} is ${result}`, () => {
      expect(v.judge(value, v.any.has(value2))).toBe(result)
    })
  }
  has(123, 2, true)
  has('123', '2', true)
  has([1,2, 3], 2, true)
  has([1,2, 3], '2', false)
  has({a: 1, b: 2}, 'a', true)
  has({a: 1, b: 2}, 'c', false)
})

// 文件名
describe('extension', () => {
  function extension (value: string, value2: string, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    const val2 = typeof value2 === 'object' ? JSON.stringify(value2) : typeof value2 === 'string' ? "'" + value2 + "'" : value2
    it(`the extension of ${newVal} is ${val2} is ${result}`, () => {
      expect(v.judge(value, v.any.ext(value2))).toBe(result)
    })
  }
  extension('123.png', 'png', true)
  extension('123.png', 'txt', false)
  extension('123.txt', 'png', false)
  extension('123', 'png', false)
})

// 正则
describe('regexp', () => {
  function regexp (value: any, value2: RegExp, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    const val2 = typeof value2 === 'object' ? JSON.stringify(value2) : typeof value2 === 'string' ? "'" + value2 + "'" : value2
    it(`the regexp of ${newVal} is ${val2} is ${result}`, () => {
      expect(v.judge(value, v.any.reg(value2))).toBe(result)
    })
  }
  regexp('123.png', /\d+\.png/, true)
  regexp([123], /\d+\.png/, false)
  regexp('123.png', /[a-z]+\.png/, false)
})

// 链式调用
describe('chain', () => {
  function chain (value: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    it(`the chain of ${newVal} is ${result}`, () => {
      expect(v.judge(value, v.str.required.min(5).alphanum)).toBe(result)
    })
  }
  chain('123png', true)
  chain('123.png', false)
  chain('12345', true)
  chain('', false)
  chain(123, false)
  chain('1234', false)
})

// 对象调用
describe('object', () => {
  function object (value: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    it(`the object of ${newVal} is ${result}`, () => {
      expect(v.judge(value, {
        a: v.str.min(6),
        b: v.arr.len(2),
        c: {
          c1: v.num.gt(100),
          c2: v.str
        }
      })).toBe(result)
    })
  }
  object({
    a: 'string',
    b: [1,3],
    c: { c1: 123, c2: '4534' }
  }, true)
  object({
    a: 123,
    b: [1,3],
    c: { c1: 123, c2: '4534' }
  }, false)
  object({
    a: 123,
    b: [1,3],
    c: { c1: 123, c2: 567 }
  }, false)
})

// 对象属性值调用
describe('objVal', () => {
  function objVal (value: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    it(`the objVal of ${newVal} is ${result}`, () => {
      const val = v.get(value, 'a.b.c')
      expect(v.judge(val, v.any.required.num)).toBe(result)
    })
  }
  objVal({
    a: { b: { c: 123 }}
  }, true)
  objVal({
    a: { b: 123}
  }, false)
})

// 验证结果逻辑处理
describe('cb', () => {
  function cb (value: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    it(`the callback of ${newVal} is ${result}`, () => {
      v.valid(value).str.required.min(2).alphanum.then(res => {
        if (result) {
          expect(JSON.stringify(res.keys) === JSON.stringify(['str', 'required', 'min', 'alphanum'])).toBe(result)
        }
      }).catch(e => {
        if (!result) {
          expect(JSON.stringify(e.keys) === JSON.stringify(['min'])).toBe(!result)
        }
      })
    })
  }
  cb('123', true)
  cb('1', false)
})

// 对象验证结果逻辑处理
describe('objCallback', () => {
  function objCallback (value: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
      it(`the callback of ${newVal} is ${result}`, () => {
      v.validate(value, {
        a: v.str.min(6),
        b: v.arr.len(2),
        c: {
          c1: v.num.gt(100),
          c2: v.str
        }
      }).then(res => {
        if (result) {
          expect(res === true).toBe(result)
        }
      }).catch(e => {
        if (!result) {
          expect(JSON.stringify(e[0]?.keys) === JSON.stringify(['str'])).toBe(!result)
        }
      })
    })
  }
  objCallback({
    a: 'string',
    b: [1,3],
    c: { c1: 123, c2: '4534' }
  }, true)
  objCallback({
    a: 123456,
    b: [1,3],
    c: { c1: 123, c2: '4534' }
  }, false)
})

// message处理
describe('message', () => {
  function message (value: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    it(`the message of ${newVal} is ${result}`, () => {
      v.valid(value).any.required.gt(18).lt(30).alias('年龄').then(() => {}).catch(e => {
        if (value > 30) {
          expect(e.msgs![0] === '年龄要小于30！').toBe(!result)
        } else if (value < 18) {
          expect(e.msgs![0] === '年龄要大于18！').toBe(!result)
        }
      })
    })
  }
  message(50, false)
  message(12, false)
})


// message2处理
describe('message2', () => {
  function message2 (value: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    it(`the message2 of ${newVal} is ${result}`, () => {
      v.valid(value).any.required.gt(18).lt(30).msg({
        gt: '我的年龄必须大于十八',
        lt: '我的年龄必须大于三十'
      }).then(() => {}).catch(e => {
        if (value > 30) {
          expect(e.msgs![0] === '我的年龄必须大于三十').toBe(!result)
        } else if (value < 18) {
          expect(e.msgs![0] === '我的年龄必须大于十八').toBe(!result)
        }
      })
    })
  }
  message2(50, false)
  message2(12, false)
})

// define处理
describe('define', () => {
  function define (value: any, result: boolean) {
    const newVal = typeof value === 'object' ? JSON.stringify(value) : typeof value === 'string' ? "'" + value + "'" : value
    it(`the define of ${newVal} is ${result}`, () => {
      v.valid(value).any.num.define(r => r > 0).then(() => {
        expect(true).toBe(result)
      }).catch(e => {
        expect(e.keys![0] === 'sync').toBe(!result)
      })
    })
  }
  define(50, true)
  define(-50, false)
})


// 正则校验
describe('regExp validate', () => {
  function valid (value: any, type: methodKey, result: boolean) {
    it(`${type} is passed`, () => {
      const fn = m[type] as ((val: string) => boolean)
      expect(fn(value)).toBe(result)
    })
  }
  valid('abc', 'required', true)
  valid('', 'required', false)
  valid('abc', 'english', true)
  valid('123', 'english', false)
  valid('1ab', 'alphanum', true)
  valid('#12', 'alphanum', false)
  valid('我是', 'chinese', true)
  valid('#12', 'chinese', false)
  valid('abc123', 'nospace', true)
  valid('abc 123', 'nospace', false)
  valid('-1.234', 'float', true)
  valid('123sfs', 'float', false)
  valid('1.234', 'positivefloat', true)
  valid('-123.234', 'positivefloat', false)
  valid('123', 'integer', true)
  valid('23.23', 'integer', false)
  valid('123', 'positiveint', true)
  valid('-123', 'positiveint', false)
  valid('123.12', 'decimal', true)
  valid('-123', 'decimal', false)
  valid('3.12%', 'percent', true)
  valid('123', 'percent', false)
  valid('11@qq.com', 'email', true)
  valid('123', 'email', false)
  valid('http://www.baidu.com', 'http', true)
  valid('www.baidu.com', 'http', false)
  valid('13688881111', 'phone', true)
  valid('12012345678', 'phone', false)
  valid('2001', 'year', true)
  valid('1850', 'year', false)
  valid('12', 'month', true)
  valid('13', 'month', false)
  valid('31', 'day', true)
  valid('32', 'day', false)
  valid('23', 'hour', true)
  valid('24', 'hour', false)
  valid('59', 'minute', true)
  valid('60', 'minute', false)
  valid('05:10', 'hmt', true)
  valid('24:00', 'hmt', false)
  valid('05:10:10', 'time', true)
  valid('24:00:00', 'time', false)
  valid('2020-10-10', 'date', true)
  valid('2020-13-1', 'date', false)
  valid('2020-10-10 10:10:10', 'datetime', true)
  valid('2020-10-10 24:00:00', 'datetime', false)
  valid('c:\\d\mypath', 'path', true)
  valid('d\mypath', 'path', false)
  valid('http://www.baidu.com/img.png', 'imgurl', true)
  valid('http://www.baidu.com/img.txt', 'imgurl', false)
})
