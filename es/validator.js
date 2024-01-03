var ext = function (types) {
    return new RegExp("\\.(" + types + ")$", 'i');
};
var turl = function (prefix, files) {
    if (files === void 0) { files = ''; }
    var s = "^(" + prefix + "):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?";
    if (files !== '')
        s = s + (".(" + files + ")+");
    s = s + '$';
    return new RegExp(s, 'i');
};
var rules = {
    required: /.+/,
    english: /^[A-Za-z]+$/,
    alphanum: /^[a-zA-Z0-9]+$/,
    chinese: /^[\u2E80-\uFE4F]+$/,
    nospace: /^\S+$/,
    float: /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/,
    positivefloat: /^(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/,
    integer: /^-?\d+$/,
    positiveint: /^\d+$/,
    decimal: /^-?\d+\.\d+$/,
    percent: /^-?\d+(\.\d+)?%$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    http: turl('https?'),
    phone: /^((\+86)|(86))?1[3-9]\d{9}$/,
    year: /^(19|20)\d{2}$/,
    month: /^(0?[1-9]|1[0-2])$/,
    day: /^((0?[1-9])|([1-2]\d)|(3[0-1]))$/,
    hour: /^(([01]?\d)|(2[0-3]))$/,
    minute: /^(([01]?\d)|([2-5]\d))$/,
    hmt: /^(\d|[01]\d|2[0-3]):[0-5]\d$/,
    time: /^(\d|([01]\d|2[0-3])):([0-5]\d):([0-5]\d)$/,
    date: /^((((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13578]|1[02])\5(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13456789]|1[012])\11(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)0?2\17(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\/)0?2\25(29)))$/,
    datetime: /^((((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13578]|1[02])\5(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13456789]|1[012])\11(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)0?2\17(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\/)0?2\25(29)))\s+(\d|([0-1]\d|2[0-3])):(\d|([0-5]?\d)):(\d|([0-5]?\d))$/,
    path: /^[a-zA-Z]:[\\]((?! )(?![^\\/]*\s+[\\/])[\w -]+[\\/])*(?! )(?![^.]*\s+\.)[\w -]+$/,
    file: /^[^<>/\\\|:''\*\?]+\.\w+$/,
    imgurl: turl('https?', 'gif|png|jpg|jpeg|webp|svg')
};

var isObject = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
};
var num2str = function (arg) {
    return typeof arg === 'number' ? String(arg) : arg;
};
function checkInclude(value, arg) {
    if ((typeof value === 'number' || typeof value === 'string') &&
        (typeof arg === 'number' || typeof arg === 'string')) {
        return String(value).indexOf(String(arg)) > -1;
    }
    else if (Array.isArray(value)) {
        return value.indexOf(arg) > -1;
    }
    else if (isObject(value) && typeof arg === 'string') {
        return Object.keys(value).indexOf(arg) > -1;
    }
    return false;
}
function has(value, arg) {
    return checkInclude(value, arg);
}
function eq(value, arg) {
    if (typeof value === 'object' || typeof arg === 'object') {
        return JSON.stringify(value) === JSON.stringify(arg);
    }
    if (methods.num(value) || methods.num(arg) || methods.str(value) || methods.str(arg) || methods.boolean(value) || methods.boolean(arg)) {
        return value == arg;
    }
    return value === arg;
}
var methods = {
    obj: isObject,
    boolean: function (value) { return typeof value === 'boolean'; },
    str: function (value) { return typeof value === 'string'; },
    num: function (value) { return typeof value === 'number'; },
    arr: function (value) { return Array.isArray(value); },
    func: function (value) { return typeof value === 'function'; },
    empty: function (value) { return value ?
        (Array.isArray(value) ? value.length === 0 : (isObject(value)) ? Object.keys(value).length === 0 : false) : true; },
    eq: eq,
    not: function (value, arg) { return !eq(value, arg); },
    gt: function (value, arg) { return +value > +arg; },
    gte: function (value, arg) { return +value >= +arg; },
    lt: function (value, arg) { return +value < +arg; },
    lte: function (value, arg) { return +value <= +arg; },
    len: function (value, arg) {
        return num2str(value).length === +arg;
    },
    min: function (value, arg) {
        return num2str(value).length >= +arg;
    },
    max: function (value, arg) {
        return num2str(value).length <= +arg;
    },
    reg: function (value, arg) { return arg.test(value); },
    has: has,
    ext: function (value, arg) { return ext(arg).test(value); },
    enum: function (value, arg1) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return [arg1].concat(args).indexOf(value) > -1;
    },
    between: function (value, arg1, arg2) {
        return +value > +arg1 && +value < +arg2;
    },
};
Object.keys(rules).forEach(function (key) {
    methods[key] = function (value) {
        if ([null, undefined].includes(value))
            value = '';
        if (typeof value === 'number')
            value = String(value);
        return (rules[key]).test(value);
    };
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var messages = {
    default: '$name未通过验证！',
    required: '$name不能为空！',
    english: '$name必须是英文字母！',
    alphanum: '$name必须是字母与数字混合！',
    chinese: '$name必须是中文！',
    nospace: '$name不得含任何空格字符！',
    float: '$name必须是浮点数！',
    positivefloat: '$name必须是正浮点数！',
    integer: '$name必须是整数！',
    positiveint: '$name必须是正整数！',
    decimal: '$name必须是小数！',
    percent: '$name必须是百分数！',
    email: '$name邮箱格式不对！',
    http: '$nameHttp地址格式有误！',
    phone: '$name手机号码格式不对！',
    year: '$name必须是四位年份数字！',
    month: '$name必须是1~12月份数字！',
    day: '$name必须是1~31日的数字！',
    hour: '$name必须是0~23小时数字！',
    minute: '$name必须是0~59分秒数字！',
    hmt: '$name时分的格式不对！',
    time: '$name时分秒的时间格式不对！',
    date: '$name日期格式不对！',
    datetime: '$name日期与时间格式不对！',
    obj: '$name必须是对象类型！',
    str: '$name必须是字符串类型！',
    num: '$name必须是数字类型！',
    boolean: '$name必须是布尔类型！',
    func: '$name必须是函数类型！',
    enum: '$name必须是枚举类型！',
    arr: '$name必须是数组类型！',
    not: '$name不能等于$arg1！',
    eq: '$name必须等于$arg1！',
    gt: '$name要大于$arg1！',
    gte: '$name要大于等于$arg1！',
    lt: '$name要小于$arg1！',
    lte: '$name要小于等于$arg1！',
    between: '$name要大于等于$arg1，小于等于$arg2！',
    len: '$name长度要等于$arg1！',
    min: '$name最小长度应为$arg1！',
    max: '$name最大长度应为$arg1！',
    has: '$name不存在$arg0！',
    empty: '$name必须是空的值！',
    reg: '$name没有匹配正确！',
    path: '$name必须是合法路径！',
    file: '$name必须是合法文件名！',
    imgurl: '$name必须是合法图片文件名！',
    ext: '$name必须是$arg1格式'
};

function getMsgTemplate(key, chainMsg) {
    var result;
    if (chainMsg && chainMsg[key])
        result = chainMsg[key];
    else if (messages[key])
        result = messages[key];
    else
        result = messages.default;
    return result;
}
function msgTemplateToMsg(message, key, name1, name2, allArgs) {
    name1 = name1 || '';
    var n2 = name2 || [];
    message = message.replace(/\$name/g, name1);
    if (/\$arg\d/.test(message) && n2.length)
        message = message.replace(/\$arg\d/g, function () {
            var ns = (n2.length > 0 ? n2[0] : '');
            if (methods.str(ns)) {
                n2.shift();
                return (ns ? ns : '');
            }
            else {
                return (ns[key] ? ns[key] : '');
            }
        });
    if (allArgs && allArgs.length > 0 && /\$arg\d+/.test(message)) {
        allArgs.forEach(function (n, i) { return message = message.replace(new RegExp("\\$arg" + i, 'g'), n); });
    }
    return message;
}
function checkResult(results) {
    return results.length > 0 ? results.every(function (item) { return item === true; }) : false;
}
function checkResult2(results) {
    var data = {
        _then: false,
        _catchResult: [],
        then: function (fn) {
            if (this._then) {
                fn(true);
            }
            return this;
        },
        catch: function (fn) {
            if (!this._then) {
                fn(this._catchResult);
            }
            return this;
        }
    };
    if (results.length) {
        var arr = results.filter(function (item) { return item !== true; });
        if (!arr.length) {
            data._then = true;
        }
        else {
            data._catchResult = arr;
        }
    }
    return data;
}
var argsToString = function (value, args) {
    return [value].concat(args).map(function (n) { return (methods.str(n) || methods.num(n)) ? String(n) : ''; });
};
var addMsg = function (errMsgs, chain, key, allArgs) {
    var names = chain._names;
    var msgTemplate = getMsgTemplate(key, chain._msgs);
    errMsgs.push(msgTemplateToMsg(msgTemplate, key, names[0], names[1], allArgs));
};
function resultToBoolean(results, context, getResult) {
    if (!results)
        return true;
    var errkeys = results[0], okeys = results[1], errMsgs = results[2], path = results[3], handlers = results[4];
    if (errkeys.length > 0) {
        var errs = { keys: errkeys, msgs: errMsgs.length ? errMsgs : undefined, path: (path === null || path === void 0 ? void 0 : path.length) ? path : undefined };
        if (handlers && handlers[1])
            handlers[1](errs);
        if (context && context instanceof Chain && context._then) {
            context._catchParams = errs;
        }
        if (getResult) {
            return errs;
        }
        return false;
    }
    else {
        if (handlers && handlers[0]) {
            var oks = { keys: okeys };
            if (path && path.length > 0)
                oks.path = path;
            handlers[0](oks);
        }
        return true;
    }
}
function collectChains(struct, path) {
    var result = [];
    if (!methods.obj(struct) && !methods.arr(struct)) {
        return result;
    }
    if (struct instanceof Chain) {
        result.push([struct, path]);
        return result;
    }
    if (methods.arr(struct)) {
        struct.forEach(function (chain, i) {
            var p = __spreadArrays(path);
            p.push(i);
            chain && (result = result.concat(collectChains(chain, p)));
        });
    }
    else {
        Object.keys(struct).forEach(function (key) {
            var p = __spreadArrays(path);
            p.push(key);
            struct[key] && (result = result.concat(collectChains(struct[key], p)));
        });
    }
    return result;
}
function findValue(obj, path) {
    if (!path || !path.length)
        return obj;
    try {
        return path.reduce(function (res, cur) { return res[cur]; }, obj);
    }
    catch (e) {
        return void 0;
    }
}
function check(value, struct, parentPath, getResult) {
    if (typeof value !== 'object' && !(struct instanceof Chain))
        throw new Error('无效参数');
    var results = [], asyncFuncs = [];
    if (struct instanceof Chain) {
        var res = checkchain(value, struct);
        if (struct.isAsync) {
            asyncFuncs.push(res);
        }
        else {
            results.push(resultToBoolean(res, struct));
        }
    }
    else if (typeof value === 'object' && typeof struct === 'object') {
        var chains = [];
        chains = collectChains(struct, []);
        chains.forEach(function (item) {
            var chain = item[0], p = item[1], val = findValue(value, p), path = parentPath ? parentPath.concat(p) : p, res = checkchain(val, chain, path);
            if (chain.isAsync) {
                asyncFuncs.push(res);
            }
            else {
                results.push(resultToBoolean(res, undefined, getResult));
            }
        });
    }
    else
        throw new Error('Invalid arguments');
    if (asyncFuncs.length > 0) {
        return new Promise(function (resolve, reject) {
            Promise.all(asyncFuncs).then(function (res) {
                res.forEach(function (n) {
                    results.push(resultToBoolean(n));
                });
                resolve(checkResult(results));
            }).catch(function (error) {
                reject(error);
            });
        });
    }
    else if (getResult) {
        return checkResult2.call(this, results);
    }
    else
        return checkResult(results);
}
function checkchain(value, chain, path) {
    if (typeof value === 'string')
        value = value.trim();
    if (typeof value !== 'boolean' && methods.empty(value) && chain._types.indexOf('required') === -1)
        return void 0;
    var totalMethods = methods, asyncFn = [], errkeys = [], okeys = [], errMsgs = [], result = [
        errkeys, okeys, errMsgs,
        path,
        chain._handler
    ];
    for (var i = 0, len = chain._types.length; i < len; i++) {
        var t = chain._types[i];
        if (typeof t === 'string') {
            if (totalMethods[t](value) === false) {
                errkeys.push(t);
                addMsg(errMsgs, chain, t, argsToString(value));
            }
            else
                okeys.push(t);
        }
        else if (Array.isArray(t)) {
            if (totalMethods[t[0]].apply(totalMethods, __spreadArrays([value], t[1])) === false) {
                errkeys.push(t[0]);
                addMsg(errMsgs, chain, t[0], argsToString(value, t[1]));
            }
            else
                okeys.push(t[0]);
        }
    }
    for (var i = 0, len = chain._customs.length; i < len; i++) {
        var item = chain._customs[i];
        var type = item[0];
        var method = item[1];
        var args = item[2] || [];
        if (type === 'sync') {
            var key = "sync" + (i || '');
            var syncRes = method.apply(void 0, __spreadArrays([value], args));
            if (syncRes !== true) {
                errkeys.push(key);
                errMsgs.push(syncRes);
            }
            else
                okeys.push(key);
        }
        else if (type === 'async') {
            asyncFn.push(method.apply(void 0, __spreadArrays([value], args)));
        }
    }
    if (chain.isAsync) {
        return new Promise(function (resolve, reject) {
            Promise.all(asyncFn).then(function (res) {
                res.forEach(function (n, i) {
                    var key = "async" + (i || '');
                    if (n === false) {
                        errkeys.push(key);
                        errMsgs.push(key + "\u6821\u9A8C\u5931\u8D25");
                    }
                    else
                        okeys.push(key);
                });
                resolve(result);
            }).catch(function (error) {
                reject(error);
            });
        });
    }
    else
        return result;
}

var props = Object.create(null);
var Chain = (function () {
    function Chain() {
        this._val = '';
        this._then = false;
        this._catchParams = { keys: [] };
        this._types = [];
        this._handler = [];
        this._customs = [];
        this._names = [];
        this.isAsync = false;
    }
    Object.defineProperty(Chain.prototype, "any", {
        get: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
    Chain.prototype.define = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (methods.func(method))
            this._customs.push(['sync', method, args]);
        return this;
    };
    Chain.prototype.async = function (method) {
        if (methods.func(method))
            this._customs.push(['async', method]);
        this.isAsync = true;
        return this;
    };
    Chain.prototype.then = function (fn) {
        if (methods.func(fn))
            this._handler[0] = fn;
        this._then = true;
        check(this._val, this);
        return this;
    };
    Chain.prototype.catch = function (fn) {
        if (this._catchParams.keys.length) {
            fn(this._catchParams);
        }
        else if (!this._then) {
            if (methods.func(fn))
                this._handler[1] = fn;
            check(this._val, this);
        }
    };
    Chain.prototype.alias = function (n, names) {
        var n1 = this._names[0], n2 = this._names[1];
        if (!n1)
            this._names[0] = n;
        else if (n1 && !n2)
            this._names[1] = [n];
        else if (n1 && n2)
            n2.push(n);
        if (names) {
            if (methods.str(names)) {
                if (!n2)
                    this._names[1] = [names];
                else
                    this._names[1] = n2.concat(names);
            }
            else {
                if (!n2)
                    this._names[1] = [names];
                else
                    this._names[1] = n2.concat(names);
            }
        }
        return this;
    };
    Chain.prototype.msg = function (key, info) {
        if (!this._msgs)
            this._msgs = {};
        if (methods.str(key) && info)
            this._msgs[key] = info;
        else if (methods.obj(key)) {
            Object.assign(this._msgs, key);
        }
        return this;
    };
    return Chain;
}());
Object.keys(methods).forEach(function (key) {
    var fn = methods[key];
    if (fn.length === 1) {
        props[key] = {
            get: function () {
                this._types.push(key);
                return this;
            }
        };
    }
    else {
        props[key] = {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this._types.push([key, args]);
                return this;
            }
        };
    }
});
Object.defineProperties(Chain.prototype, props);

var validator = {
    get str() {
        return new Chain().str;
    },
    get num() {
        return new Chain().num;
    },
    get obj() {
        return new Chain().obj;
    },
    get arr() {
        return new Chain().arr;
    },
    get boolean() {
        return new Chain().boolean;
    },
    get any() {
        return new Chain();
    },
    judge: function (data, struct) { return check(data, struct); },
    validate: function (data, struct) {
        return check.call(this, data, struct, [], true);
    },
    get: function (obj, path) {
        return findValue(obj, methods.str(path) ? path.split('.') : path);
    },
    valid: function (obj, path) {
        var val = obj;
        if (path) {
            val = findValue(obj, methods.str(path) ? path.split('.') : path);
        }
        var cons = new Chain();
        cons._val = val;
        return cons;
    }
};

export default validator;
//# sourceMappingURL=validator.js.map
