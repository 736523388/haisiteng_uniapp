const formatTime = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return (
		[year, month, day].map(formatNumber).join("/") +
		" " + [hour, minute, second].map(formatNumber).join(":")
	);
};

const formatNumber = (n) => {
	n = n.toString();
	return n[1] ? n : "0" + n;
};
const change = (t) => {
	if (t < 10) {
		return "0" + t;
	} else {
		return t;
	}
};

const timestampToTime = (timestamp) => {
	var date = new Date(timestamp * 1000);
	let Y = date.getFullYear() + "-";
	let M =
		(date.getMonth() + 1 < 10 ?
			"0" + (date.getMonth() + 1) :
			date.getMonth() + 1) + "-";
	let D = change(date.getDate()) + "";
	let h = change(date.getHours()) + ":";
	let m = change(date.getMinutes()) + ":";
	let s = change(date.getSeconds());
	return Y + M + D;
};

const getDateByDate = (range = 0) => {
	var date = new Date()
	date.setDate(date.getDate() + range);
	let Y = date.getFullYear() + "-";
	let M =
		(date.getMonth() + 1 < 10 ?
			"0" + (date.getMonth() + 1) :
			date.getMonth() + 1) + "-";
	let D = change(date.getDate()) + "";
	return Y + M + D;
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === "string" && typeof latitude === "string") {
		longitude = parseFloat(longitude);
		latitude = parseFloat(latitude);
	}

	longitude = longitude.toFixed(2);
	latitude = latitude.toFixed(2);

	return {
		longitude: longitude.toString().split("."),
		latitude: latitude.toString().split("."),
	};
}
var Calc = {
	Add: function(arg1, arg2) {
		arg1 = arg1.toString(), arg2 = arg2.toString();
		var arg1Arr = arg1.split("."),
			arg2Arr = arg2.split("."),
			d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
			d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
		var maxLen = Math.max(d1.length, d2.length);
		var m = Math.pow(10, maxLen);
		var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
		var d = arguments[2];
		return typeof d === "number" ? Number((result).toFixed(d)) : result;
	},
	Sub: function(arg1, arg2) {
		return this.Add(arg1, -Number(arg2), arguments[2]);
	},
	Mul: function(arg1, arg2) {
		var r1 = arg1.toString(),
			r2 = arg2.toString(),
			m, resultVal, d = arguments[2];
		m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
		resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
		return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
	},
	Div: function(arg1, arg2) {
		var r1 = arg1.toString(),
			r2 = arg2.toString(),
			m, resultVal, d = arguments[2];
		m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
		resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
		return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
	}
}
var dateUtils = {
	UNITS: {
		年: 31557600000,
		月: 2629800000,
		天: 86400000,
		小时: 3600000,
		分钟: 60000,
		秒: 1000,
	},
	humanize: function(milliseconds) {
		var humanize = "";
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + "前";
				break;
			}
		}
		return humanize || "刚刚";
	},
	format: function(dateStr) {
		var date = this.parse(dateStr);
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS["天"]) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return number < 10 ? "0" + number : number;
		};
		return (
			date.getFullYear() +
			"/" +
			_format(date.getMonth() + 1) +
			"/" +
			_format(date.getDay()) +
			"-" +
			_format(date.getHours()) +
			":" +
			_format(date.getMinutes())
		);
	},
	parse: function(str) {
		//将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	},
};

export {
	formatTime,
	timestampToTime,
	formatLocation,
	dateUtils,
	Calc,
	getDateByDate
};