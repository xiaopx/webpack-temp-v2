let TweenMax = require('./TweenMax.min');
let _ = require('./underscore-min');
let $PX = require('./utils-new');
let AnyTouch  = require('./any-touch.umd.min');

class Slider{
	constructor(id,opt) {
		this.ele = $PX.gEle(id);
		this.par = this.ele.parentNode;
		this.cont = $PX.gEle(id+' .slider-img-cont')[0];
		this.oUl = $PX.gEle(id+' .slider-img-ul')[0];
		this.items = $PX.gEle(id+' li');
		this.oldLen = this.items.length;
		this.pointEles = null;
		this.nowIndex = 0;
		this.oldIndex = 0;
		this.realNowIndex = 0;
		this.realOldIndex = 0;
		this.sliderW = 0;
		this.sliderMiddW = 0;
		this.oldDistance = 0;
		this.bFlag = true;
		this.syncFn = null;
		this.callFn = null;
		this.bindTouchMove = null;
		this.destroyFlag = false;
		this.moveDirection = null;

		this.clonenum = 1;
		this.moveType = 'left';  //切换方式 left opacity
		this.sliderScale = 1;  //相对可视区的宽度比例
		this.midd = 1;  //相对父标签的填充比例
		this.middValue = 0;
		this.itemsScall = 1; //每个items 的比例
		this.pointFlag = true; //是否生成点点
		this.btnsFlag = true; //是否生成按钮
		this.isAuto = true; //是否自动轮播
		this.delayTime = 5000; //自动轮播间隔时间
		this.timer = null;
		this.isStopAuto = false; 

		this.init(id,opt);
		
	}

	cloneEles(id){
		let _this = this;
		if(this.moveType === 'left'){
			for (let i = 0; i < this.clonenum + 1; i++) {
				let newFirstLi = this.items[i].cloneNode(true);
				$PX.addC(newFirstLi, 'slider-img-clone');
				$PX.remC(newFirstLi, 'on');
				this.oUl.appendChild(newFirstLi);
			}
	
			for (let ii = this.clonenum + 1; ii > 0; ii--) {
				let newLastLi = this.items[this.oldLen - (ii)].cloneNode(true);
				$PX.addC(newLastLi, 'slider-img-clone');
				$PX.remC(newLastLi, 'on');
				this.oUl.insertBefore(newLastLi, this.items[0]);
			}

			this.items = $PX.gEle(id+' li');
			this.newLen = this.items.length;
			this.setItemsScal();
			this.setSize();
			let lazyLayout = _.debounce(function(){
				if(!_this.destroyFlag){
					_this.setSize()
				}
			}, 30);
			$PX.bindEvent(window,'resize',lazyLayout);
		}
		if(this.pointFlag){
			this.creatPoint();
		}
		if(this.btnsFlag){
			this.creatBtns();
		}
	}
	setSize(){
		if (this.moveType === 'left') {
			this.sliderW = this.sliderScale > 1 ? this.sliderScale : Math.floor($PX.reWH().tw * this.sliderScale);
			this.sliderMiddW = this.midd > 1 ? this.sliderW - (this.midd*2) : Math.floor(this.sliderW*this.midd);
			this.middValue = Math.floor((this.sliderW - this.sliderMiddW)/2);
			this.par.style.width = this.sliderW + 'px';
			this.cont.style.padding = '0 '+ this.middValue + 'px';
			this.oUl.style.transform = 'translate3d(' + -this.sliderMiddW * (2 + this.nowIndex) + 'px, 0px, 0px)';
			this.oUl.style.WebkitTransform = 'translate3d(' + -this.sliderMiddW * (2 + this.nowIndex) + 'px, 0px, 0px)';
		}
	}
	setItemsScal(){
		for (let i = 0; i < this.newLen; i++) {
			if(i!=this.nowIndex+2){
				TweenMax.to(this.items[i], 0, { scale: this.itemsScall, ease: Sine.easeInOut });
			}
		}
	}

	creatPoint(){
		let cDiv = document.createElement('div');
		cDiv.className = 'slider-img-point';
		for (let i = 0; i < this.oldLen; i++) {
			let cSpan = document.createElement('span');
			cSpan.innerHTML = (i+1);
			cSpan.dataset.index = i;
			cSpan.className = 'slider-img-points';
			if(i===0)cSpan.className = 'slider-img-points on';
			cSpan.onclick = () => {
				if (this.bFlag && !this.destroyFlag && this.nowIndex != parseInt(cSpan.dataset.index)) {
					this.nowIndex = parseInt(cSpan.dataset.index);
					this.move();
				}
			}
			cDiv.appendChild(cSpan);
		}
		this.par.appendChild(cDiv);
		this.sliderImgPoint = this.par.querySelectorAll('.slider-img-point');
		this.pointEles = this.par.querySelectorAll('.slider-img-points');
	}
	creatBtns(){
		let cDiv = document.createElement('div');
		cDiv.className = 'slider-img-btns slider-img-btns-left';
		cDiv.innerHTML = '左';
		cDiv.onclick= () => {
			this.moveToRight();
		}

		let cDiv1 = document.createElement('div');
		cDiv1.className = 'slider-img-btns slider-img-btns-right';
		cDiv1.innerHTML = '右';
		cDiv1.onclick= () => {
			this.moveToLeft();
		}

		this.par.appendChild(cDiv);
		this.par.appendChild(cDiv1);

		this.sliderBtns = this.par.querySelectorAll('.slider-img-btns');
	}
	moveToLeft(){
		if (this.bFlag && !this.destroyFlag) {
			this.nowIndex++;
			this.moveDirection = 'left';
			this.move();
		}
	}
	moveToRight(){
		if (this.bFlag && !this.destroyFlag) {
			this.nowIndex--;
			this.moveDirection = 'right';
			this.move();
		}
	}
	moveToItem(n,f){
		this.nowIndex = n;
		this.move(f);
	}
	setLightPoint(){
		if(this.pointFlag){
			$PX.remC(this.pointEles[this.oldIndex],'on');
			$PX.addC(this.pointEles[this.realNowIndex],'on');
		}
	}
	bindMoveEv(){
		let _this = this;
		let isPreventDefault = $PX.deviceType == "mobile" ? false : true;
		this.bindTouchMove = new AnyTouch(this.ele,{
			isPreventDefault: isPreventDefault
			//preventDefaultExclude: (ev) => 'A' === ev.target.tagName
		});
		if (this.bFlag && !this.destroyFlag) {
			
			_this.bindTouchMove.on('pan', (ev) => {
				if(ev.distanceY - ev.distanceX > 1) return false;
				if (this.moveType === 'left') {
					this.oldDistance = ev.displacementX;
					_this.oUl.style.transform = 'translate3d(' + (-((this.oldIndex + 2) * this.sliderMiddW) + this.oldDistance) + 'px, 0px, 0px)';
					_this.oUl.style.WebkitTransform = 'translate3d(' + (-((this.oldIndex + 2) * this.sliderMiddW) + this.oldDistance) + 'px, 0px, 0px)';
				}
			})
			_this.bindTouchMove.on('panend', (ev) => {
				if(ev.distanceX>=50){
					if(ev.overallDirection == 'left'){
						this.moveToLeft();
					}else if(ev.overallDirection == 'right'){
						this.moveToRight();
					}else{
						if (this.moveType === 'left') {
							this.moveToItem(this.nowIndex)
							this.moveDirection = null;
						}
					}
				}else{
					if (this.moveType === 'left') {
						this.moveToItem(this.nowIndex)
						this.moveDirection = null;
					}
				}
			})
		}
	}
	autoMove(){
		this.timer = setInterval(() => {
			this.moveToLeft();
		}, this.delayTime);
	}
	stopAutoMove(){
		clearInterval(this.timer);
	}
	destroySlider(){
		if(!this.destroyFlag){
			this.bindTouchMove.destroy();
			for (let i = 0; i < this.clonenum + 1; i++) {
				this.oUl.removeChild(this.items[i]);
				this.oUl.removeChild(this.items[this.newLen-(i+1)]);
			}
			if(this.pointFlag){
				this.par.removeChild(this.sliderImgPoint[0]);
			}
			if(this.btnsFlag){
				this.par.removeChild(this.sliderBtns[0]);
				this.par.removeChild(this.sliderBtns[1]);
			}
			this.midd = 1;
			this.par.style.width = '';
			this.cont.style.padding = '';
			this.oUl.style.transform = 'translate3d(0px, 0px, 0px)';
			this.oUl.style.WebkitTransform = 'translate3d(0px, 0px, 0px)';
			this.stopAutoMove();
			this.destroyFlag = true;
		}
	}
	move(f){
		let _this = this;
		let target = null;
		if(this.isAuto){
			this.stopAutoMove();
		}
		let mspeed = .5;
		if(f==='no') mspeed = .001;
		if (this.moveType === 'left') {
			target = { to: -((_this.oldIndex + 2) * _this.sliderMiddW) + _this.oldDistance};
			TweenMax.to(target, mspeed, {
				to: -((_this.nowIndex + 2) * _this.sliderMiddW),
				ease: Sine.easeInOut,
				onUpdate: function () {
					_this.oUl.style.transform = 'translate3d(' + target.to + 'px, 0px, 0px)';
					_this.oUl.style.WebkitTransform = 'translate3d(' + target.to + 'px, 0px, 0px)';
				},
				onComplete: function () {
					movecallback();
				}
			})
			TweenMax.to(_this.items[_this.nowIndex + 2], .5, { scale: 1, ease: Sine.easeInOut });
			TweenMax.to(_this.items[_this.oldIndex + 2], .5, { scale: _this.itemsScall, ease: Sine.easeInOut });
		}else if(this.moveType === 'opacity'){
			
			if (_this.nowIndex < 0) {
				_this.nowIndex = _this.oldLen - 1;
			}
			if (_this.nowIndex >= _this.oldLen) {
				_this.nowIndex = 0;
			}

			console.log(_this.nowIndex, _this.oldIndex);

			TweenMax.to(_this.items[_this.oldIndex], mspeed, { opacity: 0, ease: Sine.easeInOut });
			TweenMax.to(_this.items[_this.nowIndex], mspeed, {
				opacity: 1, ease: Power0.easeNone, onComplete: function () {
					movecallback();
				}
			})
		}
		
		this.bFlag = false;
		function movecallback() {
			if (_this.moveType === 'left') {
				if (_this.nowIndex >= _this.oldLen) {
					_this.nowIndex = 0;
					TweenMax.to(_this.items[_this.nowIndex + 2], 0, { scale: 1, ease: Sine.easeInOut });
					TweenMax.to(_this.items[1], 0, { scale: _this.itemsScall, ease: Sine.easeInOut });
					_this.oUl.style.transform = 'translate3d(' + (-_this.sliderMiddW * 2) + 'px, 0px, 0px)';
					_this.oUl.style.WebkitTransform = 'translate3d(' + (-_this.sliderMiddW * 2) + 'px, 0px, 0px)';
				} else if (_this.nowIndex <= -1) {
					_this.nowIndex = _this.oldLen - 1;
					TweenMax.to(_this.items[_this.nowIndex + 2], 0, { scale: 1, ease: Sine.easeInOut });
					TweenMax.to(_this.items[_this.newLen - 2], 0, { scale: _this.itemsScall, ease: Sine.easeInOut });
					_this.oUl.style.transform = 'translate3d(' + (-_this.sliderMiddW * (_this.oldLen + 1)) + 'px, 0px, 0px)';
					_this.oUl.style.WebkitTransform = 'translate3d(' + (-_this.sliderMiddW * (_this.oldLen + 1)) + 'px, 0px, 0px)';
				} else {
					TweenMax.to(_this.items[1], 0, { scale: _this.itemsScall, ease: Sine.easeInOut });
					TweenMax.to(_this.items[_this.newLen - 2], 0, { scale: _this.itemsScall, ease: Sine.easeInOut });
				}

				$PX.addC(_this.items[_this.realNowIndex + 2],'on');
				$PX.remC(_this.items[_this.oldIndex + 2],'on');

			}

			if(_this.moveType === 'opacity'){
				$PX.addC(_this.items[_this.nowIndex],'on');
				$PX.remC(_this.items[_this.oldIndex],'on');
			}

			if(typeof(_this.callFn) === 'function'){
				_this.callFn(_this.realNowIndex, _this.oldIndex);
			}


			

			_this.oldIndex = _this.nowIndex;
			_this.oldDistance = 0;
			if(_this.isAuto){
				_this.autoMove();
			}
			_this.moveDirection = null;
			_this.bFlag = true;
		}

		if(this.nowIndex == this.oldLen){
			this.realNowIndex = 0;
		}else if(this.nowIndex < 0){
			this.realNowIndex = this.oldLen - 1;
		}else{
			this.realNowIndex = this.nowIndex;
		}
		this.setLightPoint();
		if(typeof(this.syncFn) === 'function'){
			this.syncFn(this.realNowIndex, this.oldIndex);
		}
	}
	init(id,opt){
		if(opt.moveType){
			opt.moveType === 'left' ? this.moveType = 'left' : this.moveType = 'opacity'
		}
		opt.sliderScale && (typeof(opt.sliderScale) === 'number') ? this.sliderScale = opt.sliderScale : this.sliderScale = 1;
		opt.midd && (typeof(opt.midd) === 'number') ? this.midd = opt.midd : this.midd = 1;
		opt.itemsScall && (typeof(opt.itemsScall) === 'number') ? this.itemsScall = opt.itemsScall : this.itemsScall = 1;
		opt.delayTime && (typeof(opt.delayTime) === 'number') ? this.delayTime = opt.delayTime : this.delayTime = 5000;
		opt.syncFn && typeof(opt.syncFn) === 'function' ? this.syncFn = opt.syncFn : null;
		opt.callFn && typeof(opt.callFn) === 'function' ? this.callFn = opt.callFn : null;
		if((typeof(opt.pointFlag) != 'undefined') && (typeof(opt.pointFlag) === 'boolean')){
			this.pointFlag = opt.pointFlag;
		}
		if((typeof(opt.btnsFlag) != 'undefined') && (typeof(opt.btnsFlag) === 'boolean')){
			this.btnsFlag = opt.btnsFlag;
		}
		if((typeof(opt.isAuto) != 'undefined') && (typeof(opt.isAuto) === 'boolean')){
			this.isAuto = opt.isAuto;
		}
		if(this.isAuto){
			this.autoMove();
		}
		this.cloneEles(id);
		this.bindMoveEv();
	}
};

module.exports = Slider;
