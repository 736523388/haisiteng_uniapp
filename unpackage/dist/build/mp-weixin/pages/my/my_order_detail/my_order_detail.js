(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/my/my_order_detail/my_order_detail"],{"3d45":function(e,n,o){"use strict";var t=o("a2e5"),r=o.n(t);r.a},"686a":function(e,n,o){"use strict";o.d(n,"b",(function(){return r})),o.d(n,"c",(function(){return i})),o.d(n,"a",(function(){return t}));var t={uLoadingPage:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-loading-page/u-loading-page")]).then(o.bind(null,"8282"))},uImage:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-image/u-image")]).then(o.bind(null,"fcd4"))},uIcon:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-icon/u-icon")]).then(o.bind(null,"4a55"))},uTag:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-tag/u-tag")]).then(o.bind(null,"cb48"))},uCellGroup:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-cell-group/u-cell-group")]).then(o.bind(null,"dee4"))},uCell:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-cell/u-cell")]).then(o.bind(null,"8968"))},uButton:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-button/u-button")]).then(o.bind(null,"4005"))}},r=function(){var e=this.$createElement;this._self._c},i=[]},a2e5:function(e,n,o){},a64b:function(e,n,o){"use strict";(function(e,n){var t=o("4ea4");o("be30");t(o("66fd"));var r=t(o("cad4"));e.__webpack_require_UNI_MP_PLUGIN__=o,n(r.default)}).call(this,o("bc2e")["default"],o("543d")["createPage"])},b4d0:function(e,n,o){"use strict";(function(e){var t=o("4ea4");Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=t(o("9523")),i=o("db75");function a(e,n){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),o.push.apply(o,t)}return o}function u(e){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?a(Object(o),!0).forEach((function(n){(0,r.default)(e,n,o[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(o,n))}))}return e}var c={data:function(){return{loaded:!1,orderid:"",order_desc:{},order_status_txt_arr:["已取消","待支付","待支付","待支付","待发货","待收货","待评价","已完成"],order_status_icon_arr:["warning-o","tosend","tosend","pending-payment","paid","logistics","comment-o","notes-o"],order_status_desac_arr:["订单已取消，感谢您的支持","等待付款，请在半小时内支付","等待付款，请在半小时内支付","等待付款，请在半小时内支付","订单已支付，稍后为您安排发货","订单配送中，请留意签收~","订单已收货，请进行评价哦~","订单已完成，感谢您的支持"]}},onLoad:function(e){this.orderid=e.id||"",this.loadData()},methods:{loadData:function(){var e=this;i.axios.get("/api/v1/user/order?order_no="+this.orderid).then((function(n){1===n.code&&(e.order_desc=n.data.list[0],console.log(e.order_desc))})).finally((function(){e.loaded=!0}))},cancel:function(n){var o=this;e.showModal({title:"提示",content:"确认取消订单吗？",success:function(t){if(t.confirm){var r=n.currentTarget.dataset.order_no;i.axios.get("/api/v1/user/order/cancel",{params:{order_no:r}}).then((function(n){e.showToast({title:n.info,icon:"none",duration:1500}),1===n.code&&setTimeout((function(){o.loadData()}),1500)})).catch((function(n){e.showToast({title:"网络异常，请稍后再试！",icon:"none",duration:1500})}))}else t.cancel&&console.log("用户点击取消")}})},remove:function(n){e.showModal({title:"提示",content:"订单删除后无法找回，是否确认？",success:function(o){if(o.confirm){var t=n.currentTarget.dataset.order_no;i.axios.get("/api/v1/user/order/remove",{params:{order_no:t}}).then((function(n){e.showToast({title:n.info,icon:"none",duration:1500}),1===n.code&&setTimeout((function(){e.navigateBack()}),1500)})).catch((function(n){e.showToast({title:"网络异常，请稍后再试！",icon:"none",duration:1500})}))}else o.cancel&&console.log("用户点击取消")}})},pay:function(n){var o=this;i.axios.post("/api/v1/user/order/payment",{order_no:n.currentTarget.dataset.order_no}).then((function(n){1===n.code?e.requestPayment(u(u({provider:"wxpay"},n.data.param),{},{success:function(e){"requestPayment:ok"==e.errMsg&&setTimeout((function(){o.loadData()}),200)}})):setTimeout((function(){e.showToast({title:n.info,icon:"none"})}),200)})).catch((function(n){setTimeout((function(){e.showToast({title:"网络异常，请稍后再试！",icon:"none"})}),200)}))},receive:function(n){var o=this,t=n.currentTarget.dataset.order_no;e.showLoading({title:"请稍后~"}),i.axios.get("/api/v1/user/order/receive",{params:{order_no:t}}).then((function(n){e.showToast({title:n.info,icon:"none",duration:1500}),1===n.code&&setTimeout((function(){o.loadData()}),1500)})).finally((function(){e.hideLoading()}))},skip_logistic:function(n){console.log(n);var o=n.currentTarget.dataset,t=o.code,r=o.number;e.navigateTo({url:"/pages/my/logistics/logistics?code=".concat(t,"&number=").concat(r)})},appraise:function(n){var o=n.currentTarget.dataset.order_no;e.navigateTo({url:"/pages/my/appraise/appraise?order_no="+o})},copy:function(n){e.setClipboardData({data:this.order_desc.truck.send_number,success:function(n){e.showToast({title:"复制成功",icon:"none",duration:2e3})}})},copyOrderNo:function(){e.setClipboardData({data:this.order_desc.order_no,success:function(n){e.showToast({title:"复制成功",icon:"none",duration:2e3})}})}}};n.default=c}).call(this,o("543d")["default"])},bc16:function(e,n,o){"use strict";o.r(n);var t=o("b4d0"),r=o.n(t);for(var i in t)["default"].indexOf(i)<0&&function(e){o.d(n,e,(function(){return t[e]}))}(i);n["default"]=r.a},cad4:function(e,n,o){"use strict";o.r(n);var t=o("686a"),r=o("bc16");for(var i in r)["default"].indexOf(i)<0&&function(e){o.d(n,e,(function(){return r[e]}))}(i);o("3d45");var a=o("f0c5"),u=Object(a["a"])(r["default"],t["b"],t["c"],!1,null,"141f7d8d",null,!1,t["a"],void 0);n["default"]=u.exports}},[["a64b","common/runtime","common/vendor"]]]);