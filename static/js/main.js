
$(document).ready(function(){
});
$(function(){
	/***** 全局参数 *****/
	var app = window.app || {};
	app.ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	app.weixin = !!navigator.userAgent.match(/micromessenger/i);
	app.width = $(window).width();
	app.height = $(window).height();
	app.ratio = window.devicePixelRatio?window.devicePixelRatio:1;
	app.isTouch = window.ontouchstart===undefined ? false : true;
	app.evtDown = app.isTouch?"touchstart":"mousedown";
	app.evtMove = app.isTouch?"touchmove":"mousemove";
	app.evtUp = app.isTouch?"touchend":"mouseup";
	app.evtClick = app.isTouch?"tap":"click";
	
	
	/***** 音频 *****/
	app.sound = {};
	app.sound.mute = false;
	app.sound.msg = new Audio('/sound/msg.mp3');
	app.sound.bg = new Audio('/sound/bg.mp3');
	app.sound.bg._loop = true;
	for(var i in app.sound){
		if(!app.sound[i].play){ continue;  }
		app.sound[i]._play = app.sound[i].play;
		app.sound[i].play = function(){ !app.sound.mute && this._play(); }
		app.sound[i].addEventListener('ended', function(e){
			if(e.target._loop){ e.target.play(); }
		});
	}
	$("body").one(app.evtDown, function(){
		for(var i in app.sound){
			if(!app.sound[i].load){ continue;  }
			app.sound[i].load();
		}
	});
	
	
	
	/***** 获取URL参数 *****/
	function GetQueryString(name) {
	   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	   var r = window.location.search.substr(1).match(reg);
	   if (r!=null) return decodeURIComponent(r[2]); return null;
	}
	
	
	/***** 自定义tap事件 *****/
	if(app.isTouch){
		 $.event.special.tap = {
			setup: function () {
				$(this).on('touchstart.tap', function (e) {
					$(this).data('@tap_startTime', e.timeStamp);
				});
				$(this).on('touchmove.tap', function (e) {
					$(this).removeData('@tap_startTime');
				});
				$(this).on('touchend.tap', function (e) {
					if($(this).data('@tap_startTime') && e.timeStamp-$(this).data('@tap_startTime')<800){
						$(this).removeData('@tap_startTime');
						var myevt=$.Event("tap");
						myevt.originalEvent=e.originalEvent;
						setTimeout(function(){ $.event.trigger(myevt, null, e.target); }, 100);
						//return false;
						//window.clearTimeout(this.tap_timer);
						//this.tap_timer=window.setTimeout(function(){ $.event.trigger(myevt, null, e.target); });
					} 
				});
			},
			teardown: function () {
				$(this).off('touchstart.tap').off('touchmove.tap').off('touchend.tap');
				$.event.remove(this, 'tap');
				$.removeData(this, '@tap_startTime');
				//this.tap_timer=undefined;
			}
		};
		$.fn.tap = function (callback) { // tap快捷方式
			return this.on('tap', callback);
		};
	}
	
	
	/***** 提示弹窗 *****/
	function myAlert(info, callback){
		var html='';
		if(info===undefined){ info = ''; }
		if(info===null){ info = 'null'; }
		if(typeof(info)==='boolean'){ info= info?'true':'false'; }
		html+='<div class="alert"><article>';
		html+='<header>'+info+'</header>';
		html+='<footer><a>确定</a></footer>';
		html+='</article></div>';
		html=$(html);
		html.find('footer').on(app.evtClick, function(){
			var div = $(this).parents('.alert');
			div.addClass('alert_out');
			setTimeout(function(){ 
				div.remove();
				if(typeof(callback)=='function'){ callback(); }
			},350);
		})
		$('body').append(html);
	}
	
	
	/***** 设置文档标题 *****/
	function setTitle(title){
		document.title = title;
	}
	
	
	/***** 滚动到底部 *****/
	function scrollBottom(speed, callback){
		if(!speed || typeof(speed)!='number' || speed<=0){
			window.scrollTo(0, document.body.scrollHeight);
			typeof(callback)=="function" && callback();
		}else{
			if(speed>20){ speed=20; }
			window._scroll_timer = window.setInterval(function(){
				var scrollMax = document.documentElement.scrollHeight-document.documentElement.clientHeight;
				if(window.scrollY>=scrollMax-1){ 
					window.clearInterval(window._scroll_timer); 
					window.scrollTo(0, scrollMax);
					typeof(callback)=="function" && callback();
					return;
				}
				window.scrollTo(0, window.scrollY+speed);
			}, 17);
		}
	}
	
	
	/***** s1 *****/
	$(".s1 footer").on(app.evtClick, 'i', function(){
		var num = parseInt($(this).text());
		var tid = $(".s1 header h4 i:empty:first").index();
		if(tid<0){ tid = $(".s1 header h4 i").length; }
		if($(this).index()==11){
			$(".s1 header h4 i").eq(tid-1).empty();
		}else if(!isNaN(num)){
			$(".s1 header h4 i").eq(tid).text(num);
			if(tid<$(".s1 header h4 i").length-1){ return; }
			if($(".s1 header h4").text()=='2018'){ //设置群聊密码
				$(".s1 footer").off(app.evtClick);
				setTimeout(function() {
					setTitle("我的掌上十八大");
				}, 2500)
				//setTimeout(function(){ $(".s1").addClass('step2'); }, 300)
				setTimeout(function(){ $(".s1 center a").trigger(app.evtClick); }, 600);
			}else{
				$(".s1 header h4").transit({x: '6%'}, 60)
					.transit({x: '-6%'}, 60)
					.transit({x: '4%'}, 60)
					.transit({x: '-3%'}, 60)
					.transit({x: '0%'}, 60)
			}
		}
	});
	$(".s1 center a").one(app.evtClick, function(){
		$("html, body").css('background-color', '#fff');
		$(".s1").addClass('no_animation').transit({x:'-100%'}, 300, function(){ $(this).remove(); });
		$(".s2, .s2input").css({display:'block', x:'100%'}).transit({x:0}, 300);
		setTimeout(function(){ playPage2(); app.sound.bg.play();  }, 350);
	});
	
	
	/***** s2 *****/
	function playPage2(){
		var li = $(".s2 li:hidden").eq(0);
		if(li.length==0){ app.useSystemScroll=true; return; }
		li.css({display:'block', opacity:0});
		scrollBottom(10, function(){
			li.css({opacity:1});
			if(!li.children().eq(0).is('center')){ !app.sound.mute && app.sound.msg.play(); }
			setTimeout(playPage2, li.attr('delay')*1000 || 2500);
		});
	}
	
	$(".s2 li figure b").on(app.evtClick, function(e){
		
		app.useSystemScroll=false;
		if($(".s2input").hasClass("lucky_out")){
			$(".s2input").removeClass("lucky_out")
		}
		$(".s2input").addClass("lucky_out")
		$(".lucky_con").css({
			"height": document.body.offsetHeight+"px",
			"width": document.body.offsetWidth+"px",
			"display": "block"
		})
		if($(".lucky_con").hasClass("lucky_out")){
			$(".lucky_con").removeClass("lucky_out");
		}
		$(".lucky_money").addClass("lucky_in");
	});
	$(".remove_btn").on(app.evtClick, function(){
		app.useSystemScroll=true;
		if($(".s2input").hasClass("lucky_out")){
			$(".s2input").removeClass("lucky_out")
		}
		$(".s2input").addClass("lucky_in")
		if($(".lucky_con").hasClass("lucky_out")){
			$(".lucky_con").removeClass("lucky_out");
		}
		$(".lucky_con").addClass("lucky_out");
		setTimeout(function(){
			$(".lucky_con").css({
				"display":"none"
			})
		}, 600)
	})
	$(".s2input").on(app.evtClick, function(e){
		if($(this).hasClass("bgm_on")){
			$(this).removeClass("bgm_on");
			app.sound.mute = true;
			app.sound.bg.pause();
			$(".s2input p").html("背景音乐 OFF")
		}else{
			$(this).addClass("bgm_on");
			app.sound.mute = false;
			app.sound.bg.play();
			$(".s2input p").html("背景音乐 ON")
		}
	})



	/***** init *****/
	if(app.ios){ //禁止ios双击屏幕上弹
		$('body').on('touchend', function(){
			var delta, time = new Date().getTime();
			if(!app._last_touchend_time){ app._last_touchend_time=time; return; }
			delta = time - app._last_touchend_time;
			app._last_touchend_time = time;
			if(delta<500){ return false; }
		});
	}
	$("body").on('contextmenu', function(e) { //禁止长按选择
		e.preventDefault();
	});
	$(".mute").on(app.evtClick, function(){ //静音按钮
		$(this).toggleClass('muted');
		if($(this).hasClass('muted')){
			app.sound.bg.pause();
		}else{
			app.sound.bg.play();
		}
	});
	// user info
	if(app.weixin){ // 微信内置浏览器
		// 获取用户信息
		var nickname = $(".ms_ms_self").attr("data-id");
		var headimgurl = $(".ms_ms_self").attr("data-imgurl");
		if(nickname != "undefined" && headimgurl != "undefined"){
			app.user = {
				name: nickname,
				head: headimgurl
			}
		}else{
			app.user = {
				name: 'null',
				head: 'img/user'+Math.floor(Math.random()*3+1)+'.jpg'
			}
		}	
	}else{
		app.user = {
			name: 'null',
			head: 'img/user'+Math.floor(Math.random()*3+1)+'.jpg'
		}
	}
	if(GetQueryString('pre_user_name') && GetQueryString('pre_user_head')){
		app.user_prev = {
			name: decodeURIComponent(GetQueryString('pre_user_name')),
			head: GetQueryString('pre_user_head')
		}
	}else{
		app.user_prev = {
			name: 'Sky_da',
			head: 'img/user_prev.jpg'
		}
	}


	/* 分享设置 */
	if(app.weixin){
		get_wx_config();
		var linkurl_wx = "http://www.moecai.com/";
		var linkurl_other = "http://www.moecai.com/szd";
		var title = "南航第十六次党代会喊你加入群聊";
		var title_other = "南航第十六次党代会喊你加入群聊";
		var des = "这次党代会的主要任务是：全面总结校第十五次党代会以来六年的工作和取得的经验，科学谋划学校未来五年的发展。";
		var imgurl300 = "http://www.moecai.com/img/logo300.jpg";
		var imgurl120 = "http://www.moecai.com/img/logo120.jpg"
		app.wx_config = {
			linkurl_wx:linkurl_wx,
			linkurl_other:linkurl_other,
			title: title,
			title_other: title_other,
			des:des,
			imgurl300: imgurl300,
			imgurl120: imgurl120
		}
		wx_share();
	}

	function get_wx_config () {
		var url = location.href.split('#')[0]
		$.ajax({
			type: "POST",
			url: "/js-jdk/post",
			data: {
				'url': url
			},
			dataType: "json",
			async: false,
			success: function (data) {
				data = data.data
				wx.config({
					debug: false,
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: [
						// 所有要调用的 API 都要加到这个列表中
						'onMenuShareAppMessage',
						'onMenuShareTimeline',
						'onMenuShareQQ',
						'onMenuShareWeibo',
						'onMenuShareQZone'
					]
				});
			}
		})
	}

	function wx_share () {
		wx.ready(function () {
			//微信分享
			wx.onMenuShareTimeline({
				title: app.wx_config.title_other, // 分享标题
				desc: app.wx_config.des, // 分享描述
				link: app.wx_config.linkurl_wx, // 分享链接
				imgUrl: app.wx_config.imgurl300, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
					//alert("成功");
					
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					//alert("失败");
				}
			});
			wx.onMenuShareAppMessage({
				title: app.wx_config.title, // 分享标题
				desc: app.wx_config.des, // 分享描述
				link: app.wx_config.linkurl_wx, // 分享链接
				imgUrl: app.wx_config.imgurl300, // 分享图标
				type: '', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// 用户确认分享后执行的回调函数
					//alert("成功");
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
					//alert("失败");
				}
			});
			wx.onMenuShareQQ({
				title: app.wx_config.title_other, // 分享标题
				desc: app.wx_config.des, // 分享描述
				link: app.wx_config.linkurl_other, // 分享链接
				imgUrl: app.wx_config.imgurl300, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			});
			wx.onMenuShareWeibo({
				title: app.wx_config.title_other, // 分享标题
				desc: app.wx_config.des, // 分享描述
				link: app.wx_config.linkurl_other, // 分享链接
				imgUrl: app.wx_config.imgurl300, // 分享图标
				success: function (res) {

				},
				cancel: function (res) {

				},
				fail: function (res) {

				}
			});
			wx.onMenuShareQZone({
				title: app.wx_config.title_other, // 分享标题
				desc: app.wx_config.des, // 分享描述
				link: app.wx_config.linkurl_other, // 分享链接
				imgUrl: app.wx_config.imgurl300, // 分享图标
				success: function (res) {

				},
				cancel: function (res) {

				},
				fail: function (res) {

				}
			});
			wx.error(function(res){
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				// alert("errorMSG:"+res);
			});
		});
	}
	
	
	/***** 应用开始 *****/
	function appBegin(){
		var sty;
		sty = '<style>\n';
		sty += 'body .user0 { background-image: url('+app.user.head+'); }\n';
		sty += 'body .user0:after { content: "'+app.user.name+'";}\n';
		sty += 'body .my_name:before { content: "'+app.user.name+'"; }\n';
		sty += 'body .user_prev {  background: url('+app.user_prev.head+') no-repeat 0 0 / 100% 100%; }\n';
		sty += 'body .user_prev:after { content: "'+app.user_prev.name+'";}\n';
		sty += '</style>';

		$("head").append(sty);
		$("img").each(function(){ $(this).attr('assetUrl') && $(this).attr('src', $(this).attr('assetUrl')); });
		$(".s4 figure").attr('class', 'type'+(app.weixin?1:2));
		$(".asset").transit({opacity:0}, 300, 'linear', function(){
			$(this).remove();
			$(".s1").show();		
		});
	};
	window.appBegin=appBegin;
	
	
});
