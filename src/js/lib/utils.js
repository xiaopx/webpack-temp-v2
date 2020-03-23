var UNTILS = {};
var rotateWidth, rotateHeight;
var totalW = document.documentElement.clientWidth || window.innerWidth;
var totalH = document.documentElement.clientHeight || window.innerHeight;

rotateWidth = totalW;
rotateHeight = totalH;

if (totalW > totalH) {
	rotateWidth = totalW;
	rotateHeight = totalH;
} else {
	rotateWidth = totalH;
	rotateHeight = totalW;
}

function isTouch() {
	var SupportsTouches = ("createTouch" in document);
	var flag = SupportsTouches ? true : false;
	return flag;
}

function $ele(ele) {
	var eles = null;
	if (ele.match(/^\#/)) {

		eles = document.getElementById(ele.replace('#', ''));
	} else if (ele.match(/^\./)) {
		eles = document.getElementsByClassName(ele.replace('.', ''));
	} else {
		eles = document.getElementsByTagName(ele);
	}
	return eles;
}

function stopBubble(e) {
	if (e && e.stopPropagation) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true;
	}
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
	if (!this._hasClass(ele, cls)) ele.className += " " + cls;
}
function removeClass(ele, cls) {
	if (_hasClass(ele, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		ele.className = ele.className.replace(reg, ' ');
	}
}
function request(paras) {
	var url = window.location.href;
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	var paraObj = {}
	for (i = 0; j = paraString[i]; i++) {
		paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
	}
	var returnValue = paraObj[paras.toLowerCase()];
	if (typeof (returnValue) == "undefined") {
		return "";
	} else {
		return returnValue;
	}
}

function checkHover(e, target) {
	if (getEvent(e).type == "mouseover") {
		return !contains(target, getEvent(e).relatedTarget || getEvent(e).fromElement) && !((getEvent(e).relatedTarget || getEvent(e).fromElement) === target);
	} else {
		return !contains(target, getEvent(e).relatedTarget || getEvent(e).toElement) && !((getEvent(e).relatedTarget || getEvent(e).toElement) === target);
	}
}
function contains(parentNode, childNode) {
	if (parentNode.contains) {
		return parentNode != childNode && parentNode.contains(childNode);
	} else {
		return !!(parentNode.compareDocumentPosition(childNode) & 16);
	}
}
function getEvent(e) {
	return e || window.event;
}
function getScrollbarWidth() {
	var oP = document.createElement('p'),
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

var musicContrl = (function () {
	var musicFlag = false;
	var musicBtnFlag = false;
	var btn = $ele('.music-btn')[0];
	var audio = $ele('#bjMusic');
	if (!btn) return false;

	if (browser.versions.iPhone || browser.versions.iPad) {
		document.addEventListener('touchstart', iphonePlay, false);
	} else {
		document.addEventListener('touchstart', iphonePlay, false);//isplay();
	}
	function musicplay() {
		musicFlag = false;
		isplay();
	}
	function musicpause() {
		musicFlag = true;
		isplay();
	}
	function isplay() {
		if (!musicFlag) {
			audio.play();
			removeClass(btn, 'music-pause')
			addClass(btn, 'music-play');
		} else {
			audio.pause();
			removeClass(btn, 'music-play')
			addClass(btn, 'music-pause');
		}
	}
	btn.onclick = function (e) {
		musicBtnFlag = true;
		musicFlag = !musicFlag;
		isplay();
		e.stopPropagation();
	}
	btn.ontouchstart = function (e) {
		e.stopPropagation();
	}

	function iphonePlay() {
		if (!musicBtnFlag) {
			isplay();
			document.removeEventListener('touchstart', iphonePlay, false);
		}
	}

	document.addEventListener("WeixinJSBridgeReady", function () {
		isplay();
	}, false);
	document.addEventListener('YixinJSBridgeReady', function () {
		isplay();
	}, false);

	function loopbgMusic() {
		audio.currentTime = 0.05;
		audio.play();
	}
	return {
		play: function () {
			return musicplay();
		},
		pause: function () {
			return musicpause();
		}
	}
})();

function preloadfn(arr, goon, call) {
	var pageLoadEnd = false;
	var loader1 = new PxLoader();
	var allImgLen = arr.length;
	for (var i = 0; i < allImgLen; i++) {
		var pxImage = new PxLoaderImage(arr[i]);
		pxImage.imageNumber = i + 1;
		loader1.add(pxImage);
	}
	loader1.addProgressListener(function (e) {
		var completedCount = e.completedCount;
		var totalCount = e.totalCount;
		if (goon && typeof goon == 'function') {
			var percent = Math.ceil((completedCount / totalCount) * 100);
			goon(percent, completedCount);
		}
		if (allImgLen == e.completedCount) {
			call && call();
		}
	})
	loader1.start();
}
function Sliderplus(id, options) {
	var _this = this;
	this.totalW = document.documentElement.clientWidth;
	this.totalH = document.documentElement.clientHeight;
	this.ele = document.getElementById(id);
	this.vMaxw = 750, this.imgMaxw = 600, this.veiww = 0.9, this.imgpadd = 7, this.clonenum = 1;
	this.minpadd = 0, this.maxpadd = 0, this.minpadd_1 = 0, this.minpadd_2 = 0, this.scaleValue = 1;
	this.vMaxw_1 = 749, this.vMaxw_2 = 520;
	this.ele, this.oUl, this.items, this.btn, this.line, this.scrobtn, this.warpcont, this.point, this.pointspan;
	this.len = 0, this.nowIndex = 0, this.oldIndex = 0, this.bFlag = true, this.oldlen = 0;
	this.firstNode, this.lastNode;
	this.fixed = false;
	this.imgclick = null;
	this.imgcurrnum = 0;
	this.initFlag = false;
	this.isalways = false;
	this.isauto = false;
	this.isdelaytimer = 5000;
	this.timer = null;
	this.iscall = false;
	this.isSync = false;
	this.callfn = null;
	this.full = false;
	this.moveType = null;
	this.double = false;
	_this.stopMoveFlag = false;

	this.init(id, options);

}
Sliderplus.prototype.cloneEle = function (id, options) {
	var _this = this;
	this.warpcont = this.ele.getElementsByClassName('slider-img-cont')[0];
	this.btn = this.ele.getElementsByClassName('slider-img-btn');
	this.oUl = this.ele.getElementsByClassName('slider-img-ul')[0];
	this.items = this.ele.getElementsByClassName('slider-img-item');
	this.itemsImgs = this.items[0].getElementsByTagName('img');
	this.len = this.items.length;
	this.oldlen = this.items.length;

	if (this.ele.className.indexOf('slider-img-alone') > -1) {
		this.imgpadd = 0;
	}

	if (this.moveType === 'left') {
		//clone
		for (var i = 0; i < this.clonenum + 1; i++) {
			var newFirstLi = this.items[i].cloneNode(true);
			addClass(newFirstLi, 'slider-img-clone');
			removeClass(newFirstLi, 'on');
			this.oUl.appendChild(newFirstLi);
		}

		for (var ii = 0; ii < this.clonenum + 1; ii++) {
			var newLastLi = this.items[this.len - 1].cloneNode(true);
			addClass(newLastLi, 'slider-img-clone');
			removeClass(newLastLi, 'on');
			this.oUl.insertBefore(newLastLi, this.items[0]);
		}

		//addClass(this.items[3],'slider-img-active');

		this.items = this.ele.getElementsByClassName('slider-img-item');
		this.len = this.items.length;
		this.firstNode = this.items[0];
		this.lastNode = this.items[this.len - 1];
	}

	this.setSize(options);
	bindEvent(window, 'resize', function () {
		//_this.throttle(_this.setSize(), _this);
		_this.setSize(options);
	});


	this.point = document.createElement('div');
	this.point.className = 'slider-point';

	if (this.double) {
		for (var iii = 0; iii < 2; iii++) {
			var ca = document.createElement('span');
			ca.innerHTML = iii;
			if (iii === 0) ca.className = 'on';
			this.point.appendChild(ca);
		}
	} else {
		for (var iii = 0; iii < this.oldlen; iii++) {
			var ca = document.createElement('span');
			ca.innerHTML = iii;
			if (iii === 0) ca.className = 'on';
			this.point.appendChild(ca);
		}
	}

	this.ele.appendChild(this.point);
	this.pointspan = this.point.getElementsByTagName('span');

	this.initFlag = true;

}
Sliderplus.prototype.throttle = function (method, context) {
	var timer = null;
	clearTimeout(method.id);
	method.id = setTimeout(function () {
		method.call(context);
	}, 30);
}
Sliderplus.prototype.setSize = function (options) {
	this.totalW = document.documentElement.clientWidth;
	//this.totalW=this.totalW>1440?1440:this.totalW;

	if (this.totalW + getScrollbarWidth() <= 750) {
		/* if(this.full){
			this.imgMaxw = this.totalW
		}else{
			this.imgMaxw = this.totalW - 60;
		} */
	} else {
		if (this.full) {
			this.totalW = this.totalW <= 1200 ? 1200 : this.totalW;
		} else {
			this.totalW = this.totalW > 1680 ? 1680 : this.totalW;
		}
		this.imgMaxw = Math.floor(this.totalW * this.maxpadd);
	}

	this.imgscaleValue = this.itemsImgs[0].offsetWidth / this.itemsImgs[0].offsetHeight;


	this.warpcont.style.padding = '0 ' + Math.floor(this.totalW * this.minpadd) + 'px';

	//this.ele.style.width=this.imgMaxw+'px';
	this.oUl.style.width = this.len * this.imgMaxw + 'px';

	//this.oUl.style.height= Math.floor(this.imgMaxw/this.imgscaleValue) + 'px';

	if (this.moveType === 'left') {
		this.oUl.style.transform = 'translate3d(' + -this.imgMaxw * (2 + this.nowIndex) + 'px, 0px, 0px)';
		this.oUl.style.WebkitTransform = 'translate3d(' + -this.imgMaxw * (2 + this.nowIndex) + 'px, 0px, 0px)';
	}

	for (var i = 0; i < this.len; i++) {
		if (this.items[i]) {
			this.items[i].style.width = this.imgMaxw + 'px';
			this.items[i]['data-index'] = (i - (this.clonenum + 1));
		}
	}

	/*
	if(this.point){
		if(this.isalways && (this.totalW+getScrollbarWidth())<=750){
			this.point.style.top = (Math.floor(this.totalW/2.2) - 25) + 'px';
		}else{
			this.point.style.top='';
		}
	}
	*/
}

Sliderplus.prototype.bindClick = function (options) {
	var _this = this;

	if (this.btn[0]) {
		this.btn[0].onclick = function () {
			_this.right(options);
		}
		this.btn[1].onclick = function () {
			_this.left(options);
		}
	}

	if (this.pointspan) {
		for (var i = 0; i < this.oldlen; i++) {
			if (this.pointspan[i]) {
				this.pointspan[i].onclick = function () {
					if (_this.bFlag && _this.nowIndex != parseInt(this.innerHTML)) {
						_this.nowIndex = parseInt(this.innerHTML);
						_this.move(_this.oUl, options);
					}
				}
			}
		}
	}

	//if(isTouch()){
	/* util.toucher(_this.ele).on('swipeLeft',function(){
		_this.left(options);
		return false;
	}).on('swipeRight',function(){
		_this.right(options);
		return false;
	}) */
	//}

	for (var i = 0; i < this.len; i++) {
		if (this.items[i]) {
			this.items[i].onclick = function () {
				_this.imgcurrnum = this['data-index'];
			}
		}
	}
}
Sliderplus.prototype.automove = function (options) {
	var _this = this;
	_this.timer = setInterval(function () {
		if (_this.bFlag) {
			_this.nowIndex++;
			_this.move(_this.oUl, options);
		}
	}, _this.isdelaytimer);
	_this.stopMoveFlag = false;
}
Sliderplus.prototype.stopmove = function (options) {
	var _this = this;
	_this.stopMoveFlag = true;
	clearInterval(_this.timer);
}
Sliderplus.prototype.left = function (options) {
	if (this.bFlag) {
		this.nowIndex++;
		this.move(this.oUl, options);
	}
}

Sliderplus.prototype.right = function (options) {
	if (this.bFlag) {
		this.nowIndex--;
		this.move(this.oUl, options);
	}
}

Sliderplus.prototype.move = function (obj, options) {
	var _this = this;

	if (this.moveType === 'left') {
		var target = { to: -((_this.oldIndex + 2) * _this.imgMaxw) };
		TweenMax.to(target, .5, {
			to: -((_this.nowIndex + 2) * _this.imgMaxw),
			ease: Sine.easeInOut,
			onUpdate: function () {
				_this.oUl.style.transform = 'translate3d(' + target.to + 'px, 0px, 0px)';
				_this.oUl.style.WebkitTransform = 'translate3d(' + target.to + 'px, 0px, 0px)';
			},
			onComplete: function () {
				movecallback();
			}
		})

		TweenMax.to(this.items[this.nowIndex + 2], .5, { scale: 1, ease: Sine.easeInOut });
		TweenMax.to(this.items[this.oldIndex + 2], .5, { scale: this.scaleValue, ease: Sine.easeInOut });


	}

	if (_this.moveType === 'opacity') {

		if (_this.nowIndex < 0) {
			_this.nowIndex = _this.oldlen - 1;
		}

		if (_this.nowIndex >= _this.oldlen) {
			_this.nowIndex = 0;
		}

		TweenMax.to(_this.items[_this.oldIndex], .6, { opacity: 0, ease: Sine.easeInOut });

		TweenMax.to(_this.items[_this.nowIndex], .6, {
			opacity: 1, ease: Power0.easeNone, onComplete: function () {
				movecallback();
			}
		})
	}

	_this.bFlag = false;

	function movecallback(e) {

		if (_this.moveType === 'left') {

			if (_this.nowIndex == _this.oldlen) {

				_this.nowIndex = 0;

				TweenMax.to(_this.items[_this.nowIndex + 2], 0, { scale: 1, ease: Sine.easeInOut });
				TweenMax.to(_this.items[1], 0, { scale: _this.scaleValue, ease: Sine.easeInOut });

				_this.oUl.style.transform = 'translate3d(' + (-_this.imgMaxw * 2) + 'px, 0px, 0px)';
				_this.oUl.style.WebkitTransform = 'translate3d(' + (-_this.imgMaxw * 2) + 'px, 0px, 0px)';


				//addClass(_this.items[_this.nowIndex+2],'on');
				//removeClass(_this.items[_this.oldIndex+2],'on');


			} else if (_this.nowIndex == -1) {
				_this.nowIndex = _this.oldlen - 1;

				TweenMax.to(_this.items[_this.nowIndex + 2], 0, { scale: 1, ease: Sine.easeInOut });
				TweenMax.to(_this.items[_this.len - 2], 0, { scale: _this.scaleValue, ease: Sine.easeInOut });

				_this.oUl.style.transform = 'translate3d(' + (-_this.imgMaxw * (_this.oldlen + 1)) + 'px, 0px, 0px)';
				_this.oUl.style.WebkitTransform = 'translate3d(' + (-_this.imgMaxw * (_this.oldlen + 1)) + 'px, 0px, 0px)';

			} else {
				TweenMax.to(_this.items[1], 0, { scale: _this.scaleValue, ease: Sine.easeInOut });
				TweenMax.to(_this.items[_this.len - 2], 0, { scale: _this.scaleValue, ease: Sine.easeInOut });

			}
		}

		if (_this.iscall) {
			_this.callfn(_this.oldIndex, _this.nowIndex);
		}


		if (_this.double) {
			_this.pointspan[_this.oldIndex % 2].className = '';
			_this.pointspan[_this.nowIndex % 2].className = 'on';

		} else {
			if (_this.pointspan[_this.oldIndex] && _this.pointspan[_this.nowIndex]) {
				_this.pointspan[_this.oldIndex].className = '';
				_this.pointspan[_this.nowIndex].className = 'on';
			}
		}

		_this.oldIndex = _this.nowIndex;

		if (_this.moveType === 'opacity') {
			// 			if (_this.nowIndex == _this.oldlen-1) {
			// 				_this.nowIndex = -1;
			// 			}
		}
		_this.bFlag = true;
	}

	if (_this.isSync) {
		_this.Syncfn(_this.oldIndex, _this.nowIndex);
	}

}

Sliderplus.prototype.setCurrNum = function (n) {
	this.nowIndex = n;
	if (this.pointspan[this.oldIndex] && this.pointspan[this.nowIndex]) {
		this.pointspan[this.oldIndex].className = '';
		this.pointspan[this.nowIndex].className = 'on';
	}
	this.oldIndex = this.nowIndex;
	//setCss3(this.oUl, -this.imgMaxw * (2 + this.nowIndex));
	//this.scrobtn.style.left = (100 / (this.oldlen)) * this.nowIndex + '%';
}
Sliderplus.prototype.resetItem = function (n) {
	TweenMax.to(this.items[this.nowIndex], 0, { opacity: 0, ease: Sine.easeInOut });
	TweenMax.to(this.items[n], 0, { opacity: 1, ease: Power0.easeNone, onComplete: function () { } })
	this.nowIndex = n;
	this.setCurrNum(n)
}
Sliderplus.prototype.destroy = function () {
	this.nowIndex = 0;
	this.oldIndex = 0;
	this.len = 0;
	this.oldlen = 0;
	this.ele.removeChild(this.point);
}

Sliderplus.prototype.init = function (id, options) {
	var _this = this;

	if (options) {
		if (options.minpadd) {
			this.maxpadd = 0;
			this.minpadd_1 = 0;
			this.minpadd_2 = 0;
			this.minpadd = options.minpadd;
		}
		if (options.alone) {
			this.clonenum = 1;
		}
		if (options.double) {
			this.double = options.double;
		}
		if (options.fixedw && options.fixedw > 0) {
			this.maxpadd = options.fixedw;
			this.fixed = true;
		}
		if (options.scaleValue) {
			this.scaleValue = options.scaleValue;
		}

		if (options.full) {
			this.full = options.full;
		}

		if (options.isalways) {
			this.isalways = true;
		}

		if (options.call && typeof options.call == 'function') {
			this.iscall = true;
			this.callfn = options.call;
		}

		if (options.sync && typeof options.sync == 'function') {
			this.isSync = true;
			this.Syncfn = options.sync;
		}

		if (options.isauto && typeof options.isauto == 'boolean') {
			if (options.delaytimer) {
				this.isdelaytimer = options.delaytimer;
			}
			this.isauto = true;
			this.automove(options);

			if (isTouch()) {
				bindEvent(this.ele, 'touchstart', function () {
					clearInterval(_this.timer);
				})
				bindEvent(this.ele, 'touchend', function () {
					if (!_this.stopMoveFlag) {
						_this.automove(options);
					}
				})
			} else {
				bindEvent(this.ele, 'mouseover', function () {
					clearInterval(_this.timer);
				})

				bindEvent(this.ele, 'mouseleave', function () {
					if (!_this.stopMoveFlag) {
						_this.automove(options);
					}
				})
			}
		}

		if (options.moveType === 'left') {
			this.moveType = 'left';
		}
		if (options.moveType === 'opacity') {
			this.moveType = 'opacity';
		}


	} else {
		this.minpadd = 0;
		this.maxpadd = 0;
		this.minpadd_1 = 0;
		this.minpadd_2 = 0;
	}
	this.cloneEle(id, options);
	this.bindClick(options);
}

function _sendfn(data) {
	var _pagetit = document.title || parent.window.document.title;
	if (data.length != '') {
		if (typeof stm_clicki != 'undefined') {
			stm_clicki('send', 'event', _pagetit, 'Click', data);
		}
		if (typeof _hmt != 'undefined') {
			hmt.push(['_trackEvent', pagetit, data]);
		}
	}
}
(function () {
	var _ele = document.getElementsByClassName('setMZTrack');
	var _len = _ele.length, _data = null, _target = '', _href = '';
	var re = /\/|\.html/;

	for (var i = 0; i < _len; i++) {
		target = _ele[i].getAttribute('target') ? _ele[i].getAttribute('target') : '';
		href = _ele[i].getAttribute('href') ? _ele[i].getAttribute('href') : '';
		if (_href.search(re) > -1 && _target != '_blank') {
			_ele[i].onclick = function () {
				_data = this.getAttribute('data-track');
				_sendfn(_data);
				var d = this.target ? this.target : "_self",
					e = this.href;
				setTimeout(function () {
					window.open(e, d);
				}, 200);
				return false;
			}
		} else {
			_trackBindEvent(_ele[i], 'click', function () {
				_data = this.getAttribute('data-track');
				_sendfn(_data);
			})
		}
	}

	function _trackBindEvent(obj, ev, fn) {
		obj.addEventListener ? obj.addEventListener(ev, fn, false) : obj.attachEvent('on' + ev, fn);
	}
})()
