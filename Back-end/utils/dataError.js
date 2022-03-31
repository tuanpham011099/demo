const day = require('dayjs');
const customFormat = require('dayjs/plugin/customParseFormat');
const duration = require('dayjs/plugin/duration');
day.extend(customFormat)
day.extend(duration)

const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];


exports.missingData = (...theArgs) => {
    let a = {};
    theArgs.forEach(element => {
        a[element] = 'required';
    })
    return a;
};

exports.validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.validDay = (date) => {
    let flag = false;
    dayOfWeek.forEach(el => {
        if (date === el)
            flag = true;
    })
    return flag;
};

exports.isRightTime = (start, end) => {
    const [fh, fm] = start.split(':');
    const [th, tm] = end.split(':');
    return day.duration({ hours: th, minutes: tm }).$ms -
        day.duration({ hours: fh, minutes: fm }).$ms < 0 ? false : true;
};