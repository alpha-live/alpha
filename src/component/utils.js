import BigNumber from "bignumber.js";

export function formatDate(time) {
    const Y = time.getFullYear();
    const M = getDate(time.getMonth() + 1);
    const d = getDate(time.getDate());
    const h = getDate(time.getHours());
    const m = getDate(time.getMinutes());
    // var s =getDate(time.getSeconds());
    return `${Y}-${M}-${d} ${h}:${m}`;
}

function getDate(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

function sub(text) {
    for (var i = text.length - 1; i > 0; i--) {
        if (text.charAt(i) != '0') {
            if (text.charAt(i) == '.') {
                return text.substring(0, i);
            } else {
                return text.substring(0, i + 1);
            }
        }
    }
}

export function decimals(val) {
    let text = new BigNumber(val).dividedBy(new BigNumber(10).pow(18)).toFixed(18);
    let index = text.indexOf(".");
    if (index > -1 && text.charAt(text.length - 1) == '0') {
        text = sub(text);
    }

    if (index != -1) {
        if (text.substring(index + 1).length > 4) {
            text = text.substring(0, index + 5);
        }
    }
    return text;
}