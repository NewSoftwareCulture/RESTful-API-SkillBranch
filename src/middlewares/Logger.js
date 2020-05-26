const none = '\u001b[0m';
const green = '\u001B[32m';
const blue =  "\u001B[34m";
const red = "\u001B[31m";
const cyan = "\u001B[36m";
const yellow = "\u001B[33m";

const __DEV__ = true;

const log = (arg = '') => {
    if (__DEV__ === true) console.log(arg);
};
log.GET = (arg) => {
    if (__DEV__ === true) console.log(`${green}[GET]\t\t${none}${arg}`);
};
log.POST = (arg) => {
    if (__DEV__ === true) console.log(`${blue}[POST]\t\t${none}${arg}`);
};
log.PUT = (arg) => {
    if (__DEV__ === true) console.log(`${cyan}[PUT]\t\t${none}${arg}`);
};
log.DELETE = (arg) => {
    if (__DEV__ === true) console.log(`${red}[DELETE]\t${none}${arg}`);
};
log.work = (arg) => {
    if (__DEV__ === true) console.log(`${yellow}[WORK]\t\t${none}${arg}`);
}
log.connect = (arg) => {
    if (__DEV__ === true) console.log(`${green}[CONNECT]\t${none}${arg}`);
}
log.db = (arg) => {
    if (__DEV__ === true) console.log(`${green}[MongoDB]\t${none}${arg}`);
}
log.ERROR = (arg) => {
    if (__DEV__ === true) console.log(`${red}[ERROR]\t\t${arg}`);
};

module.exports = log;