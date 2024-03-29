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
  app.sound.msg = new Audio('http://qiniuyun.dounine.live/sound/msg.mp3');
  app.sound.bg = new Audio('http://qiniuyun.dounine.live/sound/bg.mp3');
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
      if(!app.sound[i].load) continue;
      app.sound[i].load();
    }
  });

  /***** 自适应 *****/
  // 源代码中需要以320px宽、500px高为标准进行设置
  scaleW=window.innerWidth/320;
  scaleH=window.innerHeight/500;
  console.log(window.innerWidth, window.innerHeight);

  var resizes = document.querySelectorAll('.resize');

  for (let j=0; j<resizes.length; j++) {
    resizes[j].style.width=parseInt(resizes[j].style.width)*scaleW+'px';
    resizes[j].style.height=parseInt(resizes[j].style.height)*scaleH+'px';

    resizes[j].style.top=parseInt(resizes[j].style.top)*scaleH+'px';
    resizes[j].style.left=parseInt(resizes[j].style.left)*scaleW+'px';
    resizes[j].style.bottom=parseInt(resizes[j].style.bottom)*scaleH+'px';
    resizes[j].style.right=parseInt(resizes[j].style.right)*scaleW+'px';

    resizes[j].style.fontSize=parseInt(resizes[j].style.fontSize)*scaleW+'px';
    resizes[j].style.lineHeight=parseInt(resizes[j].style.lineHeight)*scaleH+'px';
  }

  /***** 获取用户信息 *****/
  var userinfo = $('#userinfo').text();
  console.log(userinfo);
  userinfo = userinfo.replace(/'/g, '"');
  userinfo = JSON.parse(userinfo);
  userinfo['headimgurl'] = userinfo.headimgurl.replace(/\\\//g, '/');
  console.log(userinfo);


  /***** 获取URL参数 *****/
  // function GetQueryString(name) {
  //   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
  //   var r = window.location.search.substr(1).match(reg);
  //   if (r!=null) return decodeURIComponent(r[2]); return null;
  // }


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
  // function myAlert(info, callback){
  //   var html='';
  //   if(info===undefined){ info = ''; }
  //   if(info===null){ info = 'null'; }
  //   if(typeof(info)==='boolean'){ info= info?'true':'false'; }
  //   html+='<div class="alert"><article>';
  //   html+='<header>'+info+'</header>';
  //   html+='<footer><a>确定</a></footer>';
  //   html+='</article></div>';
  //   html=$(html);
  //   html.find('footer').on(app.evtClick, function(){
  //     var div = $(this).parents('.alert');
  //     div.addClass('alert_out');
  //     setTimeout(function(){ 
  //       div.remove();
  //       if(typeof(callback)=='function'){ callback(); }
  //     },350);
  //   })
  //   $('body').append(html);
  // }


  /***** 设置文档标题 *****/
  function setTitle(title){
    document.title = title;
  }


  /***** 滚动到底部 *****/
  function scrollBottom(speed, callback){
    console.log('=====scrollBottom()=====');
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
      //设置群聊密码
      if($(".s1 header h4").text()=='2019') { 
        $(".s1 footer").off(app.evtClick);
        setTimeout(function() {
          setTitle("我们都是升旗手"); // 设置标题
        }, 2500)

        // 创建点击事件触发该点击函数（下一个函数）
        setTimeout(function() {
          $(".s1 center a").trigger(app.evtClick);
        }, 600);
      } else {
        $(".s1 header h4").transit({x: '6%'}, 60)
          .transit({x: '-6%'}, 60)
          .transit({x: '4%'}, 60)
          .transit({x: '-3%'}, 60)
          .transit({x: '0%'}, 60)
      }
    }
  });


  $(".s1 center a").one(app.evtClick, function() {
    $("html, body").css('background-color', '#fff');
    $(".s1").addClass('no_animation').transit({x:'-100%'}, 300, function(){ $(this).remove(); });
    $(".s2, .s2input").css({display:'block', x:'100%'}).transit({x:0}, 300);
    setTimeout(function() {
      if(stop == true) return;
      playPage2();
      app.sound.bg.play();
    }, 350);
  });


  /***** s2 *****/
  var stop = false;

  // 显示一条对话信息
  function playPage2() {
    console.log('=====playPage2()=====');
    // 如果设置了暂停，则退出
    console.log(stop);
    if (stop == true) return;

    var li = $(".s2 li:hidden").eq(0);
    if(li.length==0){ app.useSystemScroll=true; return; }

    // 如果碰到停止标签，则退出
    if (li.attr('href') == 'wait') {
      stop = true;
      return;
    }
    if (li.attr('href') == 'bless') {
      $("#input_msg").attr('placeholder', '留言祝福')
      getDM(); // 获取弹幕
    }

    li.css({display:'block', opacity:0});
    scrollBottom(10, function() {
      li.css({opacity:1});
      if(!li.children().eq(0).is('center')){ !app.sound.mute && app.sound.msg.play(); }
      setTimeout(playPage2, li.attr('delay')*1000 || 2500);
    });
  }

  // 发送信息按钮
  $("#send_btn").on(app.evtClick, function(e){
    let msg = $("#input_msg").val();
    msg = msg.replace(/(^\s*)|(\s*$)/g, ""); // 去空格
    console.log(msg);

    if (msg == '') return; // 空输入无效
    $("#input_msg").val(''); // 清空输入

    // 如果是留言祝福
    if ($(".s2 li:visible:last").attr('href') == 'bless') {
      sendDM(userinfo, msg);
      $(".s2 li:hidden[href='wait']:first").remove();
      stop = false;
      playPage2();
      return;
    }

    // 如果是回答问题
    $(".s2 li:visible:last").after(`
      <li delay="1.5" class="my">
        <h2 class="user0"></h2>
        <p>${msg}</p>
      </li>
    `);

    // 如果未暂停却发了信息，就当作瞎发的信息
    if (stop == false) return;

    // 检验回答
    msg = msg.toUpperCase(); // 小写转大写
    switch ($(".s2 li:visible[href='question']:last").attr('id')) {
      case 'question1':
        $(".s2 li:hidden:first").after(question1(msg));
        break;
      case 'question2':
        $(".s2 li:hidden:first").after(question2(msg));
        break;
      case 'question3':
        $(".s2 li:hidden:first").after(question3(msg));
        break;
      case 'question4':
        $(".s2 li:hidden:first").after(question4(msg));
        break;
      case 'question5':
        $(".s2 li:hidden:first").after(question5(msg));
        break;
      case 'question6':
        $(".s2 li:hidden:first").after(question6(msg));
        break;
      case 'question7':
        $(".s2 li:hidden:first").after(question7(msg));
        break;
      case 'question8':
        $(".s2 li:hidden:first").after(question8(msg));
        break;
      default:
        break;
    }
    stop = false;
    playPage2();
  });

  // 视频监听事件
  let isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  let videos = document.getElementsByTagName('video');
  console.log(videos);
  for (let index = 0; index < videos.length; index++) {
    // 播放结束重新开始（去广告
    videos[index].addEventListener('ended', () => {
      console.log('ended');
      if (!isiOS) {
        videos[index].play();
        stop = false;
        videos[index].pause();
      }
    })
    // 播放视频时，停止对话
    videos[index].addEventListener('play', () => {
      console.log('play');
      stop = true;
    })
    // 暂停视频时，开始对话
    videos[index].addEventListener('pause', () => {
      setTimeout(() => {
        console.log('pause');
        if (stop == false) return;
        stop = false;
        playPage2();
      }, 2000);
    })
  }


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

  //禁止长按选择
  $("body").on('contextmenu', function(e) {
    e.preventDefault();
  });

  //静音按钮
  $(".mute").on(app.evtClick, function() {
    $(this).toggleClass('muted');
    if($(this).hasClass('muted')){
      app.sound.bg.pause();
    }else{
      app.sound.bg.play();
    }
  });

  // 如果是微信内置浏览器打开，获取并设置用户信息
  if(app.weixin){
    // 从资源加载列表的ms_ms_self一项中，获取用户信息
    var nickname = $(".ms_ms_self").attr("data-id");
    var headimgurl = $(".ms_ms_self").attr("data-imgurl");
    if(nickname != "undefined" && headimgurl != "undefined"){
      app.user = {
        name: nickname,
        head: headimgurl
      }
    } else {
      app.user = {
        name: 'null',
        head: '../img/userimg/user0.jpg'
      }
    }
  } else {
    app.user = {
      name: 'null',
      head: '../img/userimg/user0.jpg'
    }
  }


  // if(GetQueryString('pre_user_name') && GetQueryString('pre_user_head')){
  //   app.user_prev = {
  //     name: decodeURIComponent(GetQueryString('pre_user_name')),
  //     head: GetQueryString('pre_user_head')
  //   }
  // }else{
  //   app.user_prev = {
  //     name: 'Sky_da',
  //     head: 'img/user_prev.jpg'
  //   }
  // }


  /******* 分享设置 *********/
  if(app.weixin){
    get_wx_config();
    var linkurl_wx = "http://dev2.dounine.live/";
    var linkurl_other = "http://dev2.dounine.live/";
    var title = "我们都是升旗手";
    var title_other = "我们都是升旗手";
    var des = "我们都是升旗手";
    var imgurl300 = "/static/img/logo.ico";
    var imgurl120 = "/static/img/logo.ico"
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


  /***** 应用开始 *****/
  function appBegin() {
    console.log('appBegin()');
    // 设置用户信息的显示
    var sty;
    sty = '<style>\n';
    sty += 'body .user0 { background-image: url('+app.user.head+'); }\n';
    sty += 'body .user0:after { content: "'+app.user.name+'";}\n';
    sty += 'body .my_name:before { content: "'+app.user.name+'"; }\n';
    // sty += 'body .user_prev {  background: url('+app.user_prev.head+') no-repeat 0 0 / 100% 100%; }\n';
    // sty += 'body .user_prev:after { content: "'+app.user_prev.name+'";}\n';
    sty += '</style>';
    $("head").append(sty);
    // 图片加载
    $("img").each(function(){ $(this).attr('assetUrl') && $(this).attr('src', $(this).attr('assetUrl')); });
    $(".s4 figure").attr('class', 'type'+(app.weixin?1:2));
    $(".asset").transit({opacity:0}, 300, 'linear', function(){
      $(this).remove();
      $(".s1").show();
    });
  };


  window.appBegin = appBegin;
});
