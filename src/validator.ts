import Chain, { TypeStruct, ResultObject } from './chain'
import methods from './methods'
import { findValue, check } from './utils'

interface Callback {
  (result: (boolean|ResultObject)[]): any;
}

export interface Validator<T> {
  readonly str: T;
  readonly num: T;
  readonly obj: T;
  readonly arr: T;
  readonly boolean: T;
  readonly any: T;
  _then: boolean;
  _catchResult: ResultObject[];
  judge(data: string|number|boolean|null|undefined, struct: T): boolean | Promise<boolean> | Validator<T>;
  judge(data: object, struct: TypeStruct): boolean | Promise<boolean> | Validator<T>;
  judge(data: any, struct: TypeStruct): boolean | Promise<boolean> | Validator<T>;
  validate(data: any, struct: TypeStruct): Validator<T>;
  valid(data: string|number|boolean|null|undefined): T;
  valid(data: string|number|boolean|null|undefined, path: string | (string|number) []): T;
  get(obj: Obj, path: string | (string|number) []): any;
  then(fn: (result: boolean) => any): Validator<T>;
  catch(fn: (result: ResultObject[]) => any): Validator<T>;
}

interface Obj {
  [key: string]: any;
}

const validator: Validator<Chain> = {
  get str() {
    return new Chain().str
  },
  get num() {
    return new Chain().num
  },
  get obj() {
    return new Chain().obj
  },
  get arr() {
    return new Chain().arr
  },
  get boolean() {
    return new Chain().boolean
  },
  get any() {
    return new Chain()
  },
  _then: false,
  _catchResult: [],
  judge: (data: any, struct: TypeStruct): boolean | Promise<boolean> | Validator<Chain> => check(data, struct),
  validate(data: any, struct: TypeStruct): Validator<Chain> {
    return check.call(this, data, struct, [], true) as Validator<Chain>
  },
  get: (obj: Obj, path: string | (string|number) []): any => {
    return findValue(obj, methods.str(path) ? path.split('.'): path)
  },
  then(fn: (result: boolean) => any): Validator<Chain> {
    if (this._then) {
      fn(true)
    }
    return this
  },
  catch(fn: (result: ResultObject[]) => any): Validator<Chain> {
    if (!this._then) {
      fn(this._catchResult)
    }
    return this
  },
  valid: (obj: any, path?: string | (string|number) []): Chain => {
    let val = obj
    if (path) {
      val = findValue(obj, methods.str(path) ? path.split('.'): path)
    }
    const cons = new Chain()
    cons._val = val
    return cons
  }
}

export default validator