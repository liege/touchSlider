console.log('ontouchstart' in window);

var imgData=[
	{'src':'bg1.jpg'},
	{'src':'bg2.jpg'},
	{'src':'bg3.jpg'},
	{'src':'bg4.jpg'},
	{'src':'bg5.jpg'}
]

function TouchSlider(opt){
	this.wrap = document.getElementById(opt.wrap);
	this.imgData = (function(arr,root){
		arr.forEach(function(v,i){
			arr[i] = root + v.src;	
		});
		return arr;
	})(opt.imgData,opt.root);
	this.page = 0;
	this.init();
	this.randerDom();
	this.bindDom();
}
TouchSlider.prototype.init = function(){
	var node = document.body || document.documentElement;
	console.log(node.scrollHeight);
	console.log(node.clientHeight);
	this.w = node.clientWidth;
	var wrap = this.wrap;
	var ul = document.createElement('ul');
	ul.id = "list";
	this.imgData.forEach(function(v,i){
		var li = document.createElement('li');
		li.style.backgroundImage = "url("+v+")";
		ul.appendChild(li);
	});
	wrap.appendChild(ul);

}
TouchSlider.prototype.randerDom = function(){
	var $li = $('li');
	var w = this.w;
	//$(li).css({'-webkit-transform':'translate3d('+i*node.clientWidth+'px,0,0)'})
	$li.css({'-webkit-transform':'translate3d(0,0,0)'});
	$li.eq(this.page).show().siblings().hide();
	this.nextPage = (function(idx){
		if(idx==$li.size()-1){		
			return $li.eq(0).show().css({'-webkit-transform':'translate3d('+w+'px,0,0)'});;
		}else{
			return $li.eq(idx+1).show().css({'-webkit-transform':'translate3d('+w+'px,0,0)'});
		}
	})(this.page);		
	this.prevPage = (function(idx){
		if(idx==0){
			return $li.eq(-1).show().css({'-webkit-transform':'translate3d('+-w+'px,0,0)'});;
		}else{
			return $li.eq(idx-1).show().css({'-webkit-transform':'translate3d('+-w+'px,0,0)'});;;
		}
	})(this.page);
	this.currentPage = $li.eq(this.page);	
}
TouchSlider.prototype.bindDom = function(){
	var _this = this;
	var start = function(e){
		var $li = $('#list').find('li');
		_this.s_x = e.touches[0].pageX;
		_this.s_y = e.touches[0].pageY;
		console.log(_this.page);

	}
	var move = function(e){
		e.preventDefault();
		_this.m_x = e.touches[0].pageX;
		_this.m_y = e.touches[0].pageY;
		_this.disX = _this.m_x-_this.s_x;
		$(this).css({'-webkit-transform':'translate3d('+_this.disX+'px,0,0)'})	
		_this.nextPage.css({'-webkit-transform':'translate3d('+(_this.w+_this.disX)+'px,0,0)'});
		_this.prevPage.css({'-webkit-transform':'translate3d('+(_this.disX-_this.w)+'px,0,0)'})	
	}
	var end = function(e){
		console.log(_this.s_y);
		console.log(_this.m_y);
		if(Math.abs(_this.disX)>30){  //滑动达到翻页距离
			_this.pageTurn();
		}
		else{	//距离不够，翻页失败
			_this.currentPage.animate({'-webkit-transform':'translate3d(0,0,0)'},200)
			_this.nextPage.animate({'-webkit-transform':'translate3d('+_this.w+'px,0,0)'},200)
			_this.prevPage.animate({'-webkit-transform':'translate3d('+ -_this.w+'px,0,0)'},200)
		}
	}
	$(document).on("touchstart","#slider li",start);
	$(document).on("touchmove","#slider li",move);
	$(document).on("touchend","#slider li",end);	
}
TouchSlider.prototype.pageTurn = function(){
	var _this = this;
	if(_this.m_x>_this.s_x){  //右滑
		if(_this.page==0){
			_this.page = $('li').size()-1;
		}else{
			_this.page--;
		}		
		_this.currentPage.animate({'-webkit-transform':'translate3d('+ _this.w+'px,0,0)'},200);
		_this.prevPage.animate({'-webkit-transform':'translate3d(0,0,0)'},200,function(){
			_this.randerDom();
		})
	}
	else if(_this.m_x<_this.s_x){  //左滑
		if(_this.page==$('li').size()-1){
			_this.page = 0;
		}else{
			_this.page++;
		}
		_this.currentPage.animate({'-webkit-transform':'translate3d('+ -_this.w+'px,0,0)'},200);
		_this.nextPage.animate({'-webkit-transform':'translate3d(0,0,0)'},200,function(){
			_this.randerDom();
		})
	}
}
window.onload = function(){
	var ts = new TouchSlider({
		root:"images/",
		wrap:"slider",
		imgData:imgData
	});
}