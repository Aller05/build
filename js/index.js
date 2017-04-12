/**
 * Created by Administrator on 2017/4/8.
 */
;(function (angular) {
    var app = angular.module('app',['ui.router']);
    app.controller('appController',['$scope','$stateParams',function ($scope,$stateParams) {
        $scope.title = '今日一刻';
        $scope.isNav = false;//记录是否点击了导航图标
        $scope.click = function (type) {//导航栏点击时切换顶部文字
            $scope.title = type;
        };
        //当导航按钮点击时,判断当前导航栏是存在还是不存在,存在就隐藏,隐藏就显示.
        $scope.nav = function () {
            if($scope.isNav){
                $scope.isNav = false;
            }else{
                $scope.isNav = true;
            }
        };

    }])
})(angular);
/**
 * Created by Administrator on 2017/4/8.
 */
;(function (angular) {
    angular.module('app').config(['$sceDelegateProvider',function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://139.199.107.194:8088/**'
        ])
    }])
})(angular);
/**
 * Created by Administrator on 2017/4/8.
 */
;(function (angular) {
    //多视图 ==> 视图模板再次作为视图,控制器跳转到app下的子路由 ==>子路由模板直接插入组件(指令) ==>组件(指令)中发送请求,指令模板为当前视图的真正内容.
    angular.module('app').config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
        $stateProvider.state('app',{
            url:'/app',
            views:{
                home:{
                    templateUrl:'view/home_tpl.html',
                    controller:'homeController'
                },
                author:{
                    template:'author',
                    // controller:'homeController'
                },
                content:{
                    template:'content',
                    // controller:'homeController'
                },
                my:{
                    template:'my',
                    // controller:'homeController'
                }
            }
        }).state('app.home',{
            url:'/home',
            template:'<homelist></homelist>'
            //10001 无图  10002有图有文字  10003有图无文字
        }).state('app.detail',{
            url:'/detail/:index',
            //根据参数的索引值,取出当前点击的为哪一个,获取详细内容
            controller:['$scope','$stateParams',function ($scope, $stateParams) {
                $scope.listItem = $scope.homelist[$stateParams.index];
            }],
            template:'<detail></detail>'
        });
        $urlRouterProvider.otherwise('app/home');
    }]);
    //home的路由不管怎么跳转,都在home视图内,所以都属于home控制器范围.
})(angular);

/**
 * Created by Administrator on 2017/4/8.
 */
;(function (angular) {
    angular.module('app').controller('homeController',['$scope','$state','myHttp',function ($scope,$state,myHttp) {
        //程序刚启动时,使其处于加载状态
        $scope.isLoading = true;
        //定义用于反盗链的前缀地址
        $scope.fangdaolian = 'http://read.html5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=';
        var args = {
            url:'http://139.199.107.194:8088/moment/homelist.php',
            method:'jsonp',
            params:null
        };
        myHttp.getHttp(args,function (res) {
            console.log(res);
            $scope.homelist = res.posts;
            //数据获取后,取消加载状态,即为加载完成
            $scope.isLoading = false;
        },function (err) {
            console.log(err);
        });


    }])
})(angular);
/**
 * Created by Administrator on 2017/4/9.
 */
;(function (angular) {
    angular.module('app').directive('detail',function ($http) {
        return{
            restrict:'EA',
            template:'<div id="detail-content"></div>',//添加id是为了给获取到的详情页加样式不冲突
            link:function ($scope, ele, attr) {
/*总思路:因为获取到的详情内有图片,但是没有图片地址,每个详情页的图片第一个和最后一个都是作者头像,中间的图片与json数据内photo的数据一致,而且顺序也一致,所以有了以下逻辑*/
                //0.一进入详情页,就将整个页面滚动到顶部
                //1.将获取到的html片段注入到指令内
                ele.html($scope.listItem.content);
                //2.获取所有的img标签
                var allImg = ele.find('img');
                for (var i = 1; i < allImg.length-1; i++) {
                    //3.遍历时避开第一个和最后一个,拼接url地址
                    var url = $scope.fangdaolian+$scope.listItem.photos[i-1].small.url;
                    //4.设置内容图片src属性
                    allImg[i].setAttribute('src',url);
                }
                //5.设置第一个和最后一个作者头像图片
                allImg[0].setAttribute('src',$scope.fangdaolian+$scope.listItem.author.avatar);
                allImg[allImg.length-1].setAttribute('src',$scope.fangdaolian+$scope.listItem.author.avatar);
            },
            replace:true
        }
    })
})(angular);

/**
 * Created by Administrator on 2017/4/8.
 */
;(function (angular) {
    angular.module('app').directive('homelist',function () {
        return{
            restrict:'EA',
            templateUrl:'view/tpl/homelist_tpl.html'
        }
    })
})(angular);

/**
 * Created by Administrator on 2017/4/8.
 */
;(function (angular) {
    angular.module('app').directive('nav',['$location',function ($location) {
        return{
            restrict:'EA',
            templateUrl:'view/tpl/nav_tpl.html',
            link:function ($scope, ele, attr) {
                //初始时,显示导航,隐藏返回
                //监听锚点变化,当进入详情时,隐藏导航,显示返回
                //返回图标点击时,历史回退,导航显示,返回隐藏
                ele.find('img')[1].style.display='none';
                $scope.$location = $location;
                $scope.$watch('$location.url()',function (newValue, oldValue) {
                    if( newValue != '/app/home'){
                        ele.find('img')[0].style.display='none';
                        ele.find('img')[1].style.display='block';
                    }
                });
                $scope.goBack = function () {
                    window.history.back();
                    ele.find('img')[0].style.display='block';
                    ele.find('img')[1].style.display='none';
                    window.scrollTo(0,0);
                }
            }

        }
    }])
})(angular);
/**
 * Created by Administrator on 2017/4/8.
 */
;(function (angular) {
    angular.module('app').directive('tabbar',function () {
        return{
            restrict:'EA',
            templateUrl:'view/tpl/tabbar_tpl.html'
        }
    })
})(angular);
/**
 * Created by Administrator on 2017/4/8.
 */
;(function (angular) { //封装ajax,提高扩展性
    angular.module('app').service('myHttp',['$http',function ($http) {
        this.getHttp = function (args, success, error) {
            if(args.method == 'post'){
                var res = '';
                for(var key in args.params){
                    res += key + '=' + args.params[key] + '&';
                }
                res = res.slice(0,-1);
                $http({
                    url:args.url,
                    method:args.method,
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded'
                    },
                    data:res
                }).then(function (res) {
                    success(res.data);
                }).catch(function (err) {
                    error(err)
                })
            }else if(args.method == 'get' || args.method == 'jsonp'){
                $http({
                    url:args.url,
                    method:args.method,
                    params:args.params
                }).then(function (res) {
                    success(res.data);
                }).catch(function (err) {
                    error(err);
                })
            }
        }
    }]);
})(angular);