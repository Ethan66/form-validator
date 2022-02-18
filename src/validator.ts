import Chain, { TypeStruct, ResultObject } from './chain'
import methods from './methods'
import { findValue, check, ValidateFnResult } from './utils'

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
  judge(data: string|number|boolean|null|undefined, struct: T): boolean | Promise<boolean>;
  judge(data: object, struct: TypeStruct): boolean | Promise<boolean>;
  judge(data: any, struct: TypeStruct): boolean | Promise<boolean>;
  validate(data: any, struct: TypeStruct): ValidateFnResult;
  valid(data: string|number|boolean|null|undefined): T;
  valid(data: string|number|boolean|null|undefined, path: string | (string|number) []): T;
  get(obj: Obj, path: string | (string|number) []): any;
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
  judge: (data: any, struct: TypeStruct): boolean | Promise<boolean> => check(data, struct),
  validate(data: any, struct: TypeStruct): ValidateFnResult {
    return check.call(this, data, struct, [], true)
  },
  get: (obj: Obj, path: string | (string|number) []): any => {
    return findValue(obj, methods.str(path) ? path.split('.'): path)
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