const $PX = (function(){
	let browser = {
		versions: function() {
			let u = navigator.userAgent,app = navigator.appVersion;
			let sUserAgent = navigator.userAgent;
			return {
				mobile: !!u.match(/AppleWebKit.*Mobile.*/),
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
				iPhone: u.indexOf('iPhone') > -1,
				iPad: u.indexOf('iPad') > -1,
				iWinPhone: u.indexOf('Windows Phone') > -1
			};
		}()
	}
	let deviceType = null;
	if(browser.versions.mobile || browser.versions.iWinPhone || browser.versions.android || browser.versions.iPhone || browser.versions.iPad){
		deviceType = 'mobile';
	}else{
		deviceType = 'pc';
	}

	let rotateWidth, rotateHeight;
	let totalW = document.documentElement.clientWidth || window.innerWidth;
	let totalH = document.documentElement.clientHeight || window.innerHeight;
	function resizeWH(){
		totalW = document.documentElement.clientWidth || window.innerWidth;
		totalH = document.documentElement.clientHeight || window.innerHeight;
		if (totalW > totalH) {
			rotateWidth = totalW;
			rotateHeight = totalH;
		} else {
			rotateWidth = totalH;
			rotateHeight = totalW;
		}
		return {rw: rotateWidth,rh:rotateHeight,tw:totalW,th: totalH}
	}

	function getEle(ele){
		let eles = null;
		ele = ele.replace(/(^\s+)|(\s+$)/g,'');
		if(ele.match(/\s+/)){
			eles = document.querySelectorAll(ele);
		}else{
			if (ele.match(/^\#/)) {
				eles = document.getElementById(ele.replace('#', ''));
			} else if (ele.match(/^\./)) {
				eles = document.getElementsByClassName(ele.replace('.', ''));
			}
		}
		return eles;
	}
	function getScrollbarWidth() {
		let oP = document.createElement('p'),
			styles = {
				width: '100px',
				height: '100px',
				overflowY: 'scroll'
			},
			i, scrollbarWidth;
		for (i in styles) oP.style[i] = styles[i];
		document.body.appendChild(oP);
		scrollbarWidth = oP.offsetWidth - oP.clientWidth;
		document.body.removeChild(oP);
		return scrollbarWidth;
	}
	function bindEvent(obj, ev, fn) {
		obj.addEventListener ? obj.addEventListener(ev, fn, false) : obj.attachEvent('on' + ev, fn);
	}
	function unbindEvent(obj, ev, fn) {
		obj.removeEventListener ? obj.removeEventListener(ev, fn, false) : obj.detachEvent('on' + ev, fn);
	}

	function _hasClass(ele, cls) {
		return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
	function addClass(ele, cls) {
		if (!_hasClass(ele, cls)) ele.className += " " + cls;
	}
	function removeClass(ele, cls) {
		if (_hasClass(ele, cls)) {
			let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			ele.className = ele.className.replace(reg, ' ');
		}
	}

	function request(paras) {
		let url = window.location.href;
		let paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		let paraObj = {}
		for (i = 0; j = paraString[i]; i++) {
			paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		let returnValue = paraObj[paras.toLowerCase()];
		if (typeof (returnValue) == "undefined") {
			return "";
		} else {
			return returnValue;
		}
	}

	function preloadfn(arr, goon, call) {
		let pageLoadEnd = false;
		let loader1 = new PxLoader();
		let allImgLen = arr.length;
		for (let i = 0; i < allImgLen; i++) {
			let pxImage = new PxLoaderImage(arr[i]);
			pxImage.imageNumber = i + 1;
			loader1.add(pxImage);
		}
		loader1.addProgressListener(function (e) {
			let completedCount = e.completedCount;
			let totalCount = e.totalCount;
			if (goon && typeof goon == 'function') {
				let percent = Math.ceil((completedCount / totalCount) * 100);
				goon(percent, completedCount);
			}
			if (allImgLen == e.completedCount) {
				call && call();
			}
		})
		loader1.start();
	}

	return {
		deviceType: deviceType,
		reWH: function(){
			return resizeWH();
		},
		gEle: function(e,p){
			return getEle(e);
		},
		addC: function(ele, cls){
			return addClass(ele, cls);
		},
		remC: function(ele, cls){
			return removeClass(ele, cls);
		},
		req: function(p){
			return request(p)
		},
		preloadfn: function(arr, goon, call){
			return preloadfn(arr, goon, call)
		},
		bindEvent: function(obj, ev, fn){
			return bindEvent(obj, ev, fn)
		},
		unbindEvent: function(obj, ev, fn){
			return bindEvent(obj, ev, fn)
		},
		getScrollbarWidth: function(){
			return getScrollbarWidth();
		}
	}
})();
module.exports = $PX;