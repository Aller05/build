!function(t){t.module("app",["ui.router","ngTouch","infinite-scroll","angularLazyImg"]).controller("appController",["$scope","$location",function(o,e){document.body.addEventListener("touchstart",function(){}),o.$location=e,o.title="今日一刻",o.isNav=!1,o.loginIn=!1,o.iLike=[],o.click=function(t){o.title=t,o.isNav=!o.isNav,o.$broadcast("calltitle",{title:t})},o.fangdaolian="http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=",o.authortitle=function(t){o.title=t.name+"的主页",o.$broadcast("authorDetailObj",t)},o.autoNav=function(){o.homeItem=document.getElementsByTagName("homelist").length>0?document.getElementsByTagName("homelist"):document.getElementsByClassName("helpTarget"),t.forEach(o.homeItem,function(t,e,i){t.addEventListener("click",function(){"tabbar"!=event.target.id&&o.isNav&&(o.isNav=!o.isNav,o.$apply(),event.stopPropagation())},!0)})},o.swipeRight=function(){"-1"!=e.url().indexOf("detail")?o.$broadcast("swipeBack"):(o.isNav=!o.isNav,o.autoNav())},o.swipeLeft=function(){o.isNav&&(o.isNav=!o.isNav)},o.nav=function(){o.isNav=!o.isNav,event.stopPropagation(),o.autoNav()},o.goPast=function(){o.title="往期内容"},o.toDetail=function(t){o.listItem=t,o.$broadcast("preScroll",{scrollNum:$("body").scrollTop(),detailObj:t})},o.$location=e,o.$watch("$location.url()",function(t,e){o.isLikeNow="/app/iLike"==t})}])}(angular),function(t){t.module("app").config(["$sceDelegateProvider",function(t){t.resourceUrlWhitelist(["self","http://139.199.107.194:8088/**","http://127.0.0.1/api/**"])}])}(angular),function(t){t.module("app").config(["lazyImgConfigProvider",function(t){document.querySelector("#scrollable");t.setOptions({offset:100,errorClass:null,successClass:"imgAnimate",onError:function(){},onSuccess:function(){}})}])}(angular),function(t){t.module("app").config(["$stateProvider","$urlRouterProvider",function(t,o){o.otherwise("app/home"),t.state("app",{url:"/app",views:{home:{templateUrl:"view/home_tpl.html",controller:"homeController"},past:{templateUrl:"view/past_tpl.html",controller:"pastController"},author:{templateUrl:"view/author_tpl.html",controller:"authorController"},column:{templateUrl:"view/column_tpl.html",controller:"columnController"},my:{templateUrl:"view/iLike_tpl.html",controller:"iLikeController"}}}).state("app.home",{url:"/home",template:"<homelist></homelist>"}).state("app.past",{url:"/past",template:"<homelist></homelist>"}).state("app.detail",{url:"/detail",template:"<detail></detail>"}).state("app.author",{url:"/author",templateUrl:"view/tpl/authorlist_tpl.html"}).state("app.authordetail",{url:"/authordetail",template:"<homelist></homelist>"}).state("app.column",{url:"/column",templateUrl:"view/tpl/columns_tpl.html"}).state("app.columndetail",{url:"/columndetail",template:"<homelist></homelist>"}).state("app.iLike",{url:"/iLike",template:"<homelist></homelist>"})}])}(angular),function(t){t.module("app").controller("authorController",["$scope","myHttp","$timeout","$rootScope","$location",function(t,o,e,i,n){t.isLoading=!0,t.noMore=!1;var a=0;t.authrolist=[],t.authroListData=function(e,i){t.isLoading=!0;var n={url:"http://139.199.107.194:8088/moment/authorlist.php",method:"jsonp",params:{start:e,count:i}};o.getHttp(n,function(o){for(var e=0;e<o.authors.length;e++)t.authrolist.push(o.authors[e]);t.authorlistTotal=o.total,t.isLoading=!1},function(t){console.log(t)})},t.authroListData(a,20),t.authorListMore=function(){if(!t.isLoading&&"/app/author"==n.url()){e.cancel(o);var o=e(function(){if((a+=20)>=t.authorlistTotal)return void(t.noMore=!0);t.authroListData(a,20)},40)}},t.$on("authorDetailObj",function(n,a){t.isLoading=!0;var l={url:"http://139.199.107.194:8088/moment/author.php",method:"jsonp",params:{id:a.uid}};o.getHttp(l,function(o){t.homelist=o.posts,t.authormsg=o.author,t.isLoading=!1,e(function(){i.$emit("lazyImg:refresh")},1e3)},function(t){console.log(t)})})}])}(angular),function(t){t.module("app").controller("columnController",["$scope","myHttp","$stateParams","$window","$timeout","$rootScope",function(t,o,e,i,n,a){t.isLoading=!0,t.noSmallTitle=!0;var l={url:"http://139.199.107.194:8088/moment/column.php",method:"jsonp",params:null};o.getHttp(l,function(o){t.columns=o.columns,t.isLoading=!1,n(function(){a.$emit("lazyImg:refresh")},1e3)},function(t){console.log(t)}),t.toColumnDetail=function(e){t.columnDetailId=e,t.pastnow=!0,t.isLoading=!0;var i={url:"http://139.199.107.194:8088/moment/columnDetail.php",method:"jsonp",params:{id:e.id}};o.getHttp(i,function(o){t.homelist=o.posts,t.isLoading=!1,n(function(){a.$emit("lazyImg:refresh")},1e3)},function(t){console.log(t)})}}])}(angular),function(t){t.module("app").controller("homeController",["$scope","myHttp","$stateParams","$window","$timeout","$rootScope",function(t,o,e,i,n,a){t.pastnow=!1,t.isLoading=!0,t.isDetailCss=!0;var l={url:"http://139.199.107.194:8088/moment/homelist.php",method:"jsonp",params:null};o.getHttp(l,function(o){o.posts[0].topdate=o.date,t.homelist=o.posts,t.isLoading=!1,n(function(){a.$emit("lazyImg:refresh")},1e3)},function(t){console.log(t)})}])}(angular),function(t){t.module("app").controller("iLikeController",["$scope","$location",function(t,o){t.homelist=t.iLike}])}(angular),function(t){t.module("app").controller("pastController",["$scope","myHttp","$location","$timeout",function(t,o,e,i){t.pastnow=!0,t.isLoading=!0;var n=1,a=new Date;t.homelist=[],t.pastData=function(){t.isLoading=!0;var e=a.getFullYear()+"-"+(a.getMonth()+1)+"-"+(a.getDate()-n),i={url:"http://139.199.107.194:8088/moment/past.php",method:"jsonp",params:{index:e}};o.getHttp(i,function(o){o.posts[1].topdate=o.date,o.posts[1].isPast=!0;for(var e=1;e<o.posts.length;e++)t.homelist.push(o.posts[e]);t.isLoading=!1},function(t){console.log(t)})},t.pastData(),t.pastMore=function(){if(!t.isLoading){i.cancel(o);var o=i(function(){"/app/past"!=e.url()||t.isLoading||(n++,t.pastData())},40)}},t.flag=!0,$(window).scroll(function(){t.flag&&(t.flag=!1,i(function(){$(".isPastNow").each(function(){$(window).scrollTop()+175>=$(this).parent().offset().top?$(this).addClass("pastListDate"):$(this).removeClass("pastListDate")}),t.flag=!0},50))})}])}(angular),function(t){t.module("app").directive("detail",["$timeout","$window",function(t,o){return{restrict:"EA",template:'<div id="detail-content"  ng-class="{detailCss:isDetailCss}" ></div>',link:function(o,e,i){window.scrollTo(0,0),t(function(){o.isDetailCss=!1},20),e.html(o.listItem.content);var n=e.find("img"),a=1;if(e.find(".auth_author_mark").length>0&&(a=2,n[1].style.display="none",n[n.length-a].style.display="none"),0!=o.listItem.photos.length)for(var l=a;l<n.length-a;l++){var r=o.listItem.photos[l-a].small.url;n[l].setAttribute("src",r)}n[0].setAttribute("src",o.listItem.author.avatar),n[n.length-1].setAttribute("src",o.listItem.author.avatar)},replace:!0}}])}(angular),function(t){t.module("app").directive("homelist",function(){return{restrict:"EA",templateUrl:"view/tpl/homelist_tpl.html",link:function(t,o,e){window.scrollTo(0,0)}}})}(angular),function(t){t.module("app").directive("login",["$timeout",function(t){return{restrict:"EA",templateUrl:"view/tpl/login_tpl.html",link:function(o,e,i){o.blur=function(e){t(function(){"user"==e?o.userblur=!1:o.passwordblur=!1},100)}}}}])}(angular),function(t){t.module("app").directive("nav",["$location","$timeout",function(t,o){return{restrict:"EA",templateUrl:"view/tpl/nav_tpl.html",link:function(e,i,n){e.$location=t,e.$on("calltitle",function(t,o){e.preTitleName=o.title}),e.$on("preScroll",function(t,o){if(e.scrollToY=o.scrollNum,e.detailObj=o.detailObj,0==e.iLike.length)e.isInLike=!1;else{delete e.iLike[0].likeNum;for(var i=0;i<e.iLike.length;i++){if(e.iLike[i].id==e.detailObj.id){e.isInLike=!0,e.theLikeIndex=i;break}e.isInLike=!1}}}),e.saveLike=function(){e.isInLike=!0,e.detailObj.like_count++,e.iLike.unshift(e.detailObj)},e.deleteLike=function(){e.isInLike=!1,e.detailObj.like_count--,e.iLike.splice(e.theLikeIndex,1)},i.find("a")[1].style.display="none",i.find("a")[2].style.opacity=0,e.$watch("$location.url()",function(t,o){"-1"!=t.indexOf("detail")?(i.find("a")[0].style.display="none",i.find("a")[1].style.display="block",i.find("a")[2].style.opacity=1,"-1"==t.indexOf("author")&&"-1"==t.indexOf("column")||(i.find("a")[2].style.opacity=0)):e.helpLoading="/app/past"!=t}),e.goBack=function(){i.find("a")[0].style.display="block",i.find("a")[1].style.display="none",i.find("a")[2].style.opacity=0,o(function(){e.isDetailCss=!0},1),e.preTitleName&&(e.title=e.preTitleName),window.history.back(),$("body").animate({scrollTop:e.scrollToY},15),e.iLike.length>0&&(e.iLike[0].likeNum="喜欢("+e.iLike.length+")")},e.$on("swipeBack",function(){e.goBack()})}}}])}(angular),function(t){t.module("app").directive("tabbar",function(){return{restrict:"EA",templateUrl:"view/tpl/tabbar_tpl.html"}})}(angular),function(t){t.module("app").service("myHttp",["$http",function(t){this.getHttp=function(o,e,i){if("post"==o.method){var n="";for(var a in o.params)n+=a+"="+o.params[a]+"&";n=n.slice(0,-1),t({url:o.url,method:o.method,headers:{"Content-Type":"application/x-www-form-urlencoded"},data:n}).then(function(t){e(t.data)}).catch(function(t){i(t)})}else"get"!=o.method&&"jsonp"!=o.method||t({url:o.url,method:o.method,params:o.params}).then(function(t){e(t.data)}).catch(function(t){i(t)})}}])}(angular);