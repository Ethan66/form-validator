import Chain, { StringObj, ResultObject, TypeStruct, StructObject, Callback, Method } from './chain'
import messages from './messages'
import methods, { methodKey } from './methods'
import { Validator } from './validator'


const _singleMode = false

type ResultArray = [
  (string|number)[],
  (string|number)[],
  string[],
  (string | number)[]?,
  [Callback?, Callback?]?
]

export type ValidateFnResult = {
  _then: boolean;
  _catchResult: ResultObject[];
  then(fn: (result: boolean) => any): ValidateFnResult;
  catch(fn: (result: ResultObject[]) => any): ValidateFnResult;
}
interface Obj {
  [key: string]: any;
}

/**
 * 获取错误文案模板
 * @param key
 * @param chainMsg
 */
export function getMsgTemplate(key: methodKey, chainMsg?: StringObj): string {
  let result
  
  if (chainMsg && chainMsg[key]) result = chainMsg[key]
  else if(messages[key]) result = messages[key]
  else result = messages.default
  return result as string
}


/**
 * 错误文案模板转为错误文案
 * @param message
 * @param name1
 * @param name2
 * @param allArgs
 */
export function msgTemplateToMsg(message: string, key: methodKey, name1?: string, name2?: (string|StringObj)[], allArgs?: string[]): string {
  name1 = name1 || ''
  // const n2 = name2 || targetDefault
  const n2 = name2 || []

  message = message.replace(/\$name/g, name1)
  if (/\$arg\d/.test(message) && n2.length) message = message.replace(/\$arg\d/g, () => {
    const ns = (n2.length > 0 ? n2[0] : '')
    if (methods.str(ns)) {
      n2.shift()
      return (ns? ns : '') as string
    }
    else {
      return (ns[key] ? ns[key] : '') as string
    }
  })
  if (allArgs && allArgs.length > 0 && /\$arg\d+/.test(message)) {
    allArgs.forEach((n: string, i) => message = message.replace(new RegExp(`\\$arg${i}` , 'g'), n))
  }
  return message
}

/**
 * 检查所有结果：所有为true为true
 * @param results
 */
export function checkResult(results: (boolean|ResultObject)[]) {
  return results.length > 0 ? results.every(item => item === true) : false
}

/**
 * 检查所有结果：所有为true为true
 * @param results
 */
export function checkResult2(results: (boolean|ResultObject)[]) {
  const data: ValidateFnResult = {
    _then: false,
    _catchResult: [],
    then(fn) {
      if (this._then) {
        fn(true)
      }
      return this
    },
    catch(fn) {
      if (!this._then) {
        fn(this._catchResult)
      }
      return this
    }
  }
  if (results.length) {
    const arr = results.filter(item => item !== true)
    if (!arr.length) {
      data._then = true
    } else {
      data._catchResult = arr as ResultObject[]
    }
  }
  return data
}

/**
 * 将value和arguments转为string
 * @param value
 * @param args
 */
export const argsToString = (value: any, args?: any[]) =>
  [value].concat(args).map(n => (methods.str(n) || methods.num(n)) ? String(n): '')

/**
 * 添加错误文案
 * @param errMsgs
 * @param chain
 * @param key
 * @param allArgs
 */
export const addMsg = (errMsgs: string[], chain: Chain, key: methodKey, allArgs?: string[]) => {
  const names = chain._names
  const msgTemplate = getMsgTemplate(key, chain._msgs)
  errMsgs.push(msgTemplateToMsg(msgTemplate, key, names[0], names[1], allArgs))
}
  
/**
 * 验证结果处理（生成对象，返回结果）
 * @param chain 
 * @param keys
 * @param path
 */
export function resultToBoolean(results: ResultArray, context?: TypeStruct, getResult?: boolean): boolean | ResultObject {
  if (!results) return true
  const errkeys: (string|number)[] = results[0],
    okeys: (string|number)[] = results[1],
    errMsgs: string[] = results[2],
    path = results[3],
    handlers = results[4]

  if (errkeys.length > 0 ) { 
    const errs: ResultObject = { keys: errkeys, msgs: errMsgs.length ? errMsgs : undefined, path: path?.length ? path : undefined }

    if (handlers && handlers[1]) handlers[1](errs)
    if (context && context instanceof Chain && context._then) {
      context._catchParams = errs
    }
    if (getResult) {
      return errs
    }
    // if (__printout) printout(errs)
    return false
  } else {
    if (handlers && handlers[0]) { 
      const oks: ResultObject = {keys: okeys}
      if (path && path.length > 0) oks.path = path

      handlers[0](oks)
    }    
    return true
  }
}


/**
 * 递归收集验证链
 * @param struct
 * @param path
 */
export function collectChains(struct: TypeStruct, path: (string | number)[]): [Chain, (string | number)[]][] {
  let result: [Chain, (string | number)[]][] = []
  if (!methods.obj(struct) && !methods.arr(struct)) {
    return result
  }
  if (struct instanceof Chain) {
    result.push([struct, path])
    return result
  }
  if (methods.arr(struct)) {
    struct.forEach((chain: Chain | undefined | StructObject, i: number) => {
      const p = [...path]
      p.push(i)
      chain && (result = result.concat(collectChains(chain, p)))
    })
  } else {
    Object.keys(struct).forEach(key => {
      const p = [...path]
      p.push(key)
      struct[key] && (result = result.concat(collectChains(struct[key], p)))
    })
  }
  return result
}


/**
 * 匹配数据项
 * @param obj
 * @param path
 */
export function findValue(obj: Obj, path: (string | number)[]): any {
  if (!path || !path.length) return obj  
  try {
    return path.reduce((res, cur) => res[cur], obj)
  } catch (e) {
    return void 0
  }
}


/**
 * 数据验证
 * @param value
 * @param struct
 * @param parentPath
 * @param getResult
 */
 export function check(data: string|number|boolean|null|undefined, struct: TypeStruct): boolean | Promise<boolean>;
 export function check(data: object, struct: TypeStruct, parentPath?: (string | number)[], getResult?: boolean): ValidateFnResult;
export function check(value: any, struct: TypeStruct, parentPath?: (string | number)[], getResult?: boolean):
 boolean | Promise<boolean> |  ValidateFnResult {
  if(typeof value !== 'object' && !(struct instanceof Chain)) throw new Error('无效参数')
  const results: (boolean|ResultObject)[] = [], asyncFuncs: (Promise<ResultArray>)[] = []
  if (struct instanceof Chain) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const res = checkchain(value, struct)
    if (struct.isAsync) {
      asyncFuncs.push(res as Promise<ResultArray>)
    } else {
      results.push(resultToBoolean(res as ResultArray, struct))
    }
  } else if(typeof value === 'object' && typeof struct === 'object') {
    let chains: [Chain, (string | number)[]][] = []
 
    chains = collectChains(struct, []) // 递归收集验证链
 
    chains.forEach(item => {
      const chain = item[0],
        p = item[1],
        val = findValue(value, p),
        path = parentPath ? parentPath.concat(p) : p, // 父链路径
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        res = checkchain(val, chain, path)
 
      if (chain.isAsync) {
        asyncFuncs.push(res as Promise<ResultArray>)
      } else {
        results.push(resultToBoolean(res as ResultArray, undefined, getResult))
      }
    })
  } else throw new Error('Invalid arguments')
   
  if(asyncFuncs.length > 0) { // 异步合并处理
    return new Promise((resolve, reject) => {
      Promise.all(asyncFuncs).then(res => {
        res.forEach(n => {
          results.push(resultToBoolean(n))
        })
        resolve(checkResult(results))
      }).catch(error => {
        reject(error)
      })
    })
   
  } else if (getResult) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return checkResult2.call(this, results)
  } else return checkResult(results)
}
 
/**
  * 类型链验证
  * @param data
  * @param chain
  */
function checkchain(value: any, chain: Chain, path?: (string | number)[]):
 ResultArray | Promise<ResultArray> | undefined {
  if (typeof value === 'string') value = value.trim()
  if (typeof value !== 'boolean' && methods.empty(value) && chain._types.indexOf('required' as methodKey) === -1) return void 0 // 非必填项无值，视为通过
  const totalMethods = methods as { [k: string]: Method },
    asyncFn: Promise<boolean>[] = [],
    errkeys: (string|number)[] = [],
    okeys: (string|number)[] = [],
    errMsgs: string[] = [],
    result: ResultArray = [
      errkeys, okeys, errMsgs,
      path,
      chain._handler
    ]
 
  for (let i = 0, len = chain._types.length; i < len; i++) {
    const t = chain._types[i]
   
    if (typeof t === 'string') { // 内置单参数方法验证失败
      if (totalMethods[t](value) === false) {
        errkeys.push(t)
        addMsg(errMsgs, chain, t, argsToString(value))
        if(_singleMode) break
      } else okeys.push(t)
    }
    else if (Array.isArray(t)) { // 内置多参数方法验证失败
      if(totalMethods[t[0]](value, ...t[1]) === false) {
        errkeys.push(t[0])
        addMsg(errMsgs, chain, t[0], argsToString(value, t[1]))
        if(_singleMode) break
      } else okeys.push(t[0])
    }
  }
  for (let i = 0, len = chain._customs.length; i < len; i++) {
    const item = chain._customs[i]
    const type = item[0]
    const method = item[1]
    const args = item[2] || []
   
    if (type === 'sync') {
      const key = `sync${i || ''}`
      const syncRes = method(value, ...args)
      if (syncRes !== true) {
        errkeys.push(key)
        errMsgs.push(syncRes as unknown as string)
        if(_singleMode) break
      } else okeys.push(key)
    } else if (type === 'async') { // 链内异步合并
      asyncFn.push(method(value, ...args) as Promise<boolean>)
    }
  }
   
  if(chain.isAsync) {  // 异步方法验证
    return new Promise((resolve, reject) => {
      Promise.all(asyncFn).then(res => {
        res.forEach((n, i) => {
          const key = `async${i || ''}`
          if(n === false) {
            errkeys.push(key)
            errMsgs.push(`${key}校验失败`)
          } else okeys.push(key)
        })
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
     
  } else return result
}