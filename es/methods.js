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

export default methods;
