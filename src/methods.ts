import rules, {ext} from './rules'

const isObject = (arg: any): arg is object => {
  return Object.prototype.toString.call(arg) === '[object Object]'
}
const num2str = (arg: string | number | any[]): string | any[] => 
  typeof arg === 'number' ? String(arg) : arg

function checkInclude(value: any, arg: any) {
  if ((typeof value === 'number' || typeof value === 'string') &&
        (typeof arg === 'number' || typeof arg === 'string')) {
    return String(value).indexOf(String(arg)) > -1
  } else if (Array.isArray(value)) { return value.indexOf(arg) > -1 }
  else if (isObject(value) && typeof arg === 'string') {
    return Object.keys(value).indexOf(arg) > -1
  }
  return false
}
  
function has(value: string | number, arg: string | number): boolean
function has(value: any[], arg: any): boolean
function has(value: object, arg: string): boolean
function has(value: string | number| any[] | object, arg: string | number| any ): boolean {
  return checkInclude(value, arg)
}

function eq(value: any, arg: any) {
  if (typeof value === 'object' || typeof arg === 'object') {
    return JSON.stringify(value) === JSON.stringify(arg)
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (methods.num(value) || methods.num(arg) || methods.str(value) || methods.str(arg) || methods.boolean(value) || methods.boolean(arg)) {
    return value == arg
  }
  return value === arg
}

const methods = {
  // 一位参数：
  obj: isObject,
  boolean: (value: any): value is boolean => typeof value === 'boolean',
  str: (value: any): value is string => typeof value === 'string',
  num: (value: any): value is number => typeof value === 'number',
  arr: (value: any): value is any[] => Array.isArray(value),
  func: (value: any): value is Function  => typeof value === 'function',
  empty: (value: any) => value ? 
    (Array.isArray(value) ? value.length === 0: (isObject(value))? Object.keys(value).length === 0 : false): true,

  // 两位参数：
  eq,
  not: (value: any, arg: any) => !eq(value, arg),
  gt: <T extends string | number | Date>(value: T, arg: T) => +value > +arg,
  gte: <T extends string | number | Date>(value: T, arg: T) => +value >= +arg,
  lt: <T extends string | number | Date>(value: T, arg: T) => +value < +arg,
  lte: <T extends string | number | Date>(value: T, arg: T) => +value <= +arg,
  len: (value: string | number | any[], arg: string | number) => 
    num2str(value).length === +arg,
  min: (value: string | number | any[], arg: string | number) =>
    num2str(value).length >= +arg,
  max: (value: string | number | any[], arg: string | number) => 
    num2str(value).length <= +arg,   
  reg: (value: any, arg: RegExp): boolean => arg.test(value),
  has,
  ext: (value: string, arg: string) => ext(arg).test(value),
  
  // 两位参数或以上
  enum: (value: any, arg1: any, ...args: any) => [arg1].concat(args).indexOf(value) > -1,
  between: <T extends string | number | Date>(value: T, arg1: T, arg2: T) =>
    +value > +arg1 && +value < +arg2,
}

Object.keys(rules).forEach(key => {
  (methods as {[key: string]: (...values: any[]) => boolean })[key] = (value: string | number) => {
    if ([null, undefined].includes(value as any)) value = ''
    if (typeof value === 'number') value = String(value)
    return ((rules as {[key: string]: RegExp})[key]).test(value)
  }
})

export default methods as (typeof methods & { 
  [k in keyof typeof rules]: (value: string | number) => boolean  
})

export type methodKey = keyof typeof methods | keyof typeof rules