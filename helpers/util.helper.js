const result = {};
result.distanceToString = (val) => {
  let result = "";
  if (val > 1000) {
    result = `${(val / 1000).toFixed(2)} Km`;
  } else {
    result = `${val} M`;
  }
  return result;
};
result.getDisplayDate = (val) => {
    const dDate = new Date(val);
    let result = '';
    const timestamp = dDate.getTime();
    if (!timestamp) {
        result = val;
    } else {
        let year = dDate.getFullYear();
        if (year < 2500) {
            year += 543;
        }
        const month = dDate.getMonth();
        const monthText = listOfThaiMonth()[month];
        result = `${("0" + dDate.getDate()).slice(-2)} ${monthText} ${year}`;//date("d {$month} {$year}", $timestamp);
    }
    return result;
};
result.getDisplayOfCounting = (val) => {
  let result = 0;
  let postfix = "";
  if (!isNaN(parseFloat(val)) && isFinite(val)) {
    if (val > 1000000000) {
      result = val / 1000000000;
      postfix = "B";
    } else if (val > 1000000) {
      result = val / 1000000;
      postfix = "M";
    } else if (val > 1000) {
      result = val / 1000;
      postfix = "K";
    } else {
      result = val;
    }
    if (numberOfDecimals(result) > 0) {
      result = roundWithDec(result, 2);
    } else {
      result = parseFloat(result);
    }
  }
  return `${result}${postfix}`;
};
result.minuteToString = (val) => {};
function numberOfDecimals(val) {
  if (Number.isInteger(val)) {
    return 0;
  } else if (!(isNaN(parseFloat(val)) || !isFinite(val))) {
    return false;
  }
  return val.toString().length - val.toString().indexOf(".") - 1;
}
function roundWithDec(num, dec) {
    console.log('num', num);
    console.log('dec', dec);
  var num_sign = num >= 0 ? 1 : -1;
  return parseFloat(
    (
      Math.round(num * Math.pow(10, dec) + num_sign * 0.0001) /
      Math.pow(10, dec)
    ).toFixed(dec)
  );
}
function listOfThaiMonth() {
    return ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤษจิกายน","ธันวาคม"];
}
export default result;
