(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/index"],{"2a61":function(e,n,t){"use strict";(function(e,n){var o=t("4ea4");t("be30");o(t("66fd"));var a=o(t("68bc"));e.__webpack_require_UNI_MP_PLUGIN__=t,n(a.default)}).call(this,t("bc2e")["default"],t("543d")["createPage"])},"68bc":function(e,n,t){"use strict";t.r(n);var o=t("7ac5"),a=t("f082");for(var i in a)["default"].indexOf(i)<0&&function(e){t.d(n,e,(function(){return a[e]}))}(i);t("6b70");var r=t("f0c5"),u=Object(r["a"])(a["default"],o["b"],o["c"],!1,null,"41af0790",null,!1,o["a"],void 0);n["default"]=u.exports},"6b70":function(e,n,t){"use strict";var o=t("f880"),a=t.n(o);a.a},"7ac5":function(e,n,t){"use strict";t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return i})),t.d(n,"a",(function(){return o}));var o={uImage:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-image/u-image")]).then(t.bind(null,"fcd4"))},uButton:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-button/u-button")]).then(t.bind(null,"4005"))},customTabbar:function(){return t.e("components/custom-tabbar/custom-tabbar").then(t.bind(null,"61d1"))}},a=function(){var e=this.$createElement;this._self._c},i=[]},"905f":function(e,n,t){"use strict";(function(e,o){var a=t("4ea4");Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=a(t("278c")),r=a(t("9523")),u=t("26cb");function c(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?c(Object(t),!0).forEach((function(n){(0,r.default)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}var d={data:function(){return{value1:0,defaultAvatarUrl:"https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",brand_desc:"在海丝腾门店或线上渠道购买任意产品，即可升级为尊贵会员，获得丰富尊享礼遇。",top_menu:[{url:"https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E6%88%91%E7%9A%84%E5%BA%8A%E5%85%B71634107333713.png",title:"我的床具",path:"/pages/my/my_beds/my_beds"},{url:"https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E5%85%BB%E6%8A%A4%E4%B8%AD%E5%BF%831634107335313.png",title:"预约保养",path:"/pages/index/maintenance_service/maintenance_service"},{url:"https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E6%88%91%E7%9A%84%E5%8D%A1%E5%88%B81634107335923.png",title:"会员福利",path:"/pages/index/coupon/coupon"}]}},computed:s(s({},(0,u.mapState)({app_logo:function(e){return e.global.app_logo},index_banner:function(e){return e.global.index_banner},page_decoration:function(e){return e.global.page_decoration},userinfo:function(e){return e.user.userinfo}})),(0,u.mapGetters)({is_login:"user/is_login"})),onLoad:function(n){console.log("index onLoad"),n.uid&&e.setStorageSync("pid",n.uid)},onShareAppMessage:function(e){var n="pages/index/index";return this.is_login&&(n=n+"?uid="+this.userinfo.id),console.log(n),{title:"My Hastens",path:n}},methods:{jump2view:function(n){console.log(n),e.navigateTo({url:n})},switchTab:function(e){console.log(e)},decorationClick:function(n){var t;switch(n){case 0:t="/pages/index/coupon_new/coupon_new";break;case 1:t="/pages/shop/index/index";break;case 2:t="/pages/shop/goods_index/goods_index";break;case 3:t="/pages/index/share/share";break}t&&e.navigateTo({url:t})},swiperClick:function(e){var n=this.index_banner[e.currentTarget.dataset.index].rule,t=n.split("#"),a=(0,i.default)(t,2),r=a[0],u=a[1];"#"!=n&&void 0===u?o.navigateTo({url:"/pages/web_view/web_view?url="+encodeURI(n)}):void 0!==u&&"GOODS"==r&&o.navigateTo({url:"/pages/shop/goods_datail/goods_datail?id="+u})}}};n.default=d}).call(this,t("543d")["default"],t("bc2e")["default"])},f082:function(e,n,t){"use strict";t.r(n);var o=t("905f"),a=t.n(o);for(var i in o)["default"].indexOf(i)<0&&function(e){t.d(n,e,(function(){return o[e]}))}(i);n["default"]=a.a},f880:function(e,n,t){}},[["2a61","common/runtime","common/vendor"]]]);