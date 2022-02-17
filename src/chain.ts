import methods, { methodKey } from './methods'
import { check } from './utils'

export interface Method {
  (...values: any[]): boolean;
}

export interface AsyncMethod {
  (...values: any[]): Promise<boolean>;
}

export interface StructObject {
  [key: string]: TypeStruct;
}
export type TypeStruct = StructObject | 
  (StructObject|undefined)[] | Chain | 
  (Chain|undefined)[]

export type StringObj = {
  [key in keyof typeof methods]?: string
}

export interface ResultObject {
  keys: (string|number)[];
  msgs?: string[];
  path?: (string|number)[];
}

export interface Callback {
  (result: ResultObject): any;
}

const props = Object.create(null)

interface Chain {
  readonly required: this;
  readonly english: this;
  readonly alphanum: this;
  readonly chinese: this;
  readonly nospace: this;
  readonly float: this;
  readonly positivefloat: this;
  readonly integer: this;
  readonly positiveint: this;
  readonly decimal: this;
  readonly percent: this;
  readonly email: this;
  readonly http: this;
  readonly phone: this;
  readonly year: this;
  readonly month: this;
  readonly day: this;
  readonly hour: this;
  readonly minute: this;
  readonly hmt: this;
  readonly time: this;
  readonly date: this;
  readonly datetime: this;
  readonly path: this;
  readonly file: this;
  readonly imgurl: this;
  readonly obj: this;
  readonly boolean: this;
  readonly str: this;
  readonly num: this;
  readonly arr: this;
  readonly empty: this;
  eq(value: any): this;
  not(value: any): this;
  gt(value: string | number | Date): this;
  has(value: any): this;
  gte(value: string | number | Date): this;
  lt(value: string | number | Date): this;
  lte(value: string | number | Date): this;
  len(value: string | number): this;
  min(value: string | number): this;
  max(value: string | number): this;
  reg(val: RegExp): this;
  ext(value: string): this;
  enum(val: any, ...vals: any[]): this;
  between(val1: string | number | Date, val2: string | number | Date): this;
}

class Chain {
  _val: string|number|boolean|null|undefined = ''
  _then = false
  _catchParams: ResultObject= { keys: [] }
  _types: (methodKey | [methodKey, any])[] = []
  _handler: [Callback?, Callback?] = []
  _msgs: StringObj| undefined
  _customs: ['sync'|'async', Method|AsyncMethod, any[]?][] = []
  _names: [string?, (string|StringObj)[]?] = []
  isAsync = false // 是否为一个异步请求链

  get any() {
    return this
  }

  // error(fn: Callback) { // 验证失败处理
  //   if(methods.func(fn)) this._handler[0] = fn
  //   return this
  // }
  // ok(fn: Callback) { // 验证成功处理
  //   if(methods.func(fn)) this._handler[1] = fn
  //   return this
  // }

  define(method: Method, ...args: any[]) { // 自定义验证方法
    if(methods.func(method)) this._customs.push(['sync', method, args])
    return this
  }

  async(method: AsyncMethod) { // 自定义异步验证方法
    if(methods.func(method)) this._customs.push(['async', method])
    this.isAsync = true
    return this
  }

  then(fn: Callback) {
    if(methods.func(fn)) this._handler[0] = fn
    this._then = true
    check(this._val, this)
    return this
  }

  catch(fn: Callback) {
    if (this._catchParams.keys.length) {
      fn(this._catchParams)
    } else if (!this._then) {
      if(methods.func(fn)) this._handler[1] = fn
      check(this._val, this)
    }
  }

  /**
   * 设置名称
   * @param key
   * @param info
   */
  alias(n: string, names?: string | StringObj) {
    const n1 = this._names[0],
      n2 = this._names[1]

    if (!n1) this._names[0] = n
    else if (n1 && !n2) this._names[1] = [n]
    else if(n1 && n2) n2.push(n)
    if (names) {
      if (methods.str(names)) {
        if (!n2) this._names[1]  = [names]
        else this._names[1]  = n2.concat(names)
      } else {
        if (!n2) this._names[1]  = [names]
        else this._names[1]  = n2.concat(names)
      }
    }
    return this
  }

  /**
   * 收集错误文案
   * @param key
   * @param info
   */
  msg(key: keyof typeof methods, info: string): this
  msg(msgs: StringObj): this
  msg(key: keyof typeof methods|StringObj, info?: string): this {
    if (!this._msgs)  this._msgs = ({} as StringObj)
    if(methods.str(key) && info) this._msgs[key] = info
    else if(methods.obj(key)) {
      Object.assign(this._msgs, key)
    }
    return this
  }
}

Object.keys(methods).forEach(key => {
  const fn = (methods as { [k: string]: Method })[key]
  if (fn.length === 1) {
    props[key] = {
      get() {
        this._types.push(key)
        return this
      }
    }
  } else {
    props[key] = {
      value(...args: any[]) {
        this._types.push([key, args])
        return this
      }
    }
  }
})

Object.defineProperties(Chain.prototype, props)

export default Chain