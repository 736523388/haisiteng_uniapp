(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/shop_cart/shop_cart"],{"07cd":function(t,e,o){"use strict";(function(t,e){var n=o("4ea4");o("be30");n(o("66fd"));var i=n(o("f4d6"));t.__webpack_require_UNI_MP_PLUGIN__=o,e(i.default)}).call(this,o("bc2e")["default"],o("543d")["createPage"])},"606a":function(t,e,o){"use strict";o.r(e);var n=o("d97d"),i=o.n(n);for(var s in n)["default"].indexOf(s)<0&&function(t){o.d(e,t,(function(){return n[t]}))}(s);e["default"]=i.a},"7b6d":function(t,e,o){},ae20:function(t,e,o){"use strict";o.d(e,"b",(function(){return i})),o.d(e,"c",(function(){return s})),o.d(e,"a",(function(){return n}));var n={uLoadingPage:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-loading-page/u-loading-page")]).then(o.bind(null,"8282"))},uIcon:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-icon/u-icon")]).then(o.bind(null,"4a55"))},uniIcons:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uni-icons/components/uni-icons/uni-icons")]).then(o.bind(null,"e3bf"))},uNumberBox:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-number-box/u-number-box")]).then(o.bind(null,"2f61"))},"u-Text":function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u--text/u--text")]).then(o.bind(null,"1e4d"))},uButton:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-button/u-button")]).then(o.bind(null,"4005"))},uEmpty:function(){return Promise.all([o.e("common/vendor"),o.e("uni_modules/uview-ui/components/u-empty/u-empty")]).then(o.bind(null,"bf53"))}},i=function(){var t=this,e=t.$createElement,o=(t._self._c,t.is_login&&t.loaded&&(t.carts.length>0||t.invalid.length>0)),n=o?t.carts.length:null,i=o?t.invalid.length:null,s=o&&i>0?t.invalid.length:null,a=t.loaded&&(0==t.carts.length&&0==t.invalid.length||!t.is_login);t._isMounted||(t.e0=function(e){t.showRemoveBtn=!t.showRemoveBtn}),t.$mp.data=Object.assign({},{$root:{g0:o,g1:n,g2:i,g3:s,g4:a}})},s=[]},d97d:function(t,e,o){"use strict";(function(t){var n=o("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=n(o("9523")),s=o("db75"),a=o("26cb");function r(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function c(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?r(Object(o),!0).forEach((function(e){(0,i.default)(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var u={data:function(){return{carts:[],invalid:[],totalPrice:0,selectAllStatus:!1,loaded:!1,loading:!1,showRemoveBtn:!1}},computed:c(c({},(0,a.mapState)({goods_cart_number:function(t){return t.goods_cart.goods_cart_number}})),(0,a.mapGetters)({is_login:"user/is_login"})),onShow:function(){console.log("当前购物车数量",this.goods_cart_number),this.selectAllStatus=!1,this.is_login?this.loadData():this.loaded=!0},onHide:function(){},methods:{removeLoseGoods:function(){var e=this;console.log("移除失效商品");var o="";for(var n in this.invalid)o+=o?",":"",o+=this.invalid[n].id;o?t.showModal({title:"提示",content:"确定移除失效商品?",success:function(n){n.confirm&&s.axios.post("/api/v1/user/goods_cart/remove",{id:o}).then((function(o){t.$u.toast(o.info,1200),1===o.code&&(e.$store.dispatch("goods_cart/update_goods_cart_number_badge",{number:o.data}),setTimeout((function(){e.loadData()}),1200))})).catch((function(e){t.$u.toast("删除失败")}))}}):t.showToast({title:"没有要移除的商品",icon:"none"})},loadData:function(){var t=this;s.axios.get("/api/v1/user/goods/cart").then((function(e){if(1===e.code){var o=e.data.list;for(var n in o)o[n].selected=!1;t.carts=o,t.getTotalPrice(),t.invalid=e.data.invalid}})).finally((function(){t.loaded=!0}))},getTotalPrice:function(){var t=0;for(var e in this.carts)!0===this.carts[e].selected&&(t+=this.carts[e].goods_number*this.carts[e].price_selling);this.totalPrice=t.toFixed(2)},selectList:function(e){var o=e.currentTarget.dataset.index;if(this.carts[o].stock<1)t.showToast({title:"库存不足",icon:"none"});else{this.carts[o].selected=!this.carts[o].selected;var n=!0;for(var i in this.carts)n=n&&this.carts[i].selected;this.selectAllStatus=n,this.getTotalPrice()}},valChange:function(e,o){var n=this;console.log(e,o),console.log(this.carts[e].goods_number);this.carts[e].goods_number;o.value>0?(t.showLoading(),s.axios.post("/api/v1/user/goods/cart",c(c({},this.carts[e]),{goods_number:o.value})).then((function(i){t.hideLoading(),1!==i.code?setTimeout((function(){t.$u.toast(i.info)}),200):(n.$store.dispatch("goods_cart/update_goods_cart_number_badge",{number:i.data}),n.carts[e].goods_number=o.value,n.getTotalPrice())})).catch((function(e){t.hideLoading(),setTimeout((function(){t.$u.toast("操作失败")}),300)}))):t.showModal({title:"提示",content:"确定移除购物车?",success:function(o){o.confirm&&(console.log("确定移除购物车"),s.axios.delete("/api/v1/user/goods/cart/"+n.carts[e].id).then((function(e){if(1===e.code){var o=n.goods_cart_number-1;n.$store.dispatch("goods_cart/update_goods_cart_number_badge",{number:o}),t.$u.toast(e.info),setTimeout((function(){n.loadData()}),1500)}else t.$u.toast("网络错误，请稍后再试！")})).catch((function(e){t.$u.toast("网络错误，请稍后再试！")})))}})},selectAll:function(){for(var t in this.selectAllStatus=!this.selectAllStatus,this.carts)this.carts[t].stock>0&&(this.carts[t].selected=this.selectAllStatus);this.getTotalPrice()},createParams:function(){var t="";for(var e in this.carts)this.carts[e].selected&&(t+=t?"||":"",t+=this.carts[e].goods_id+"@"+this.carts[e].goods_spec+"@"+this.carts[e].goods_number);return console.log(t),t},topay:function(e){var o=this.createParams();if(!o)return t.showToast({title:"请选择要购买的商品",icon:"none"}),!1;t.navigateTo({url:"/pages/my/confirm_order/confirm_order?key="+o+"&from_cart=1"})},removeGoodsFromCart:function(){var e=this,o="";for(var n in this.carts)this.carts[n].selected&&(o+=o?",":"",o+=this.carts[n].id);o?t.showModal({title:"提示",content:"确定移除选中商品?",success:function(n){n.confirm&&s.axios.post("/api/v1/user/goods_cart/remove",{id:o}).then((function(o){t.$u.toast(o.info,1200),1===o.code&&(e.$store.dispatch("goods_cart/update_goods_cart_number_badge",{number:o.data}),setTimeout((function(){e.loadData()}),1200))})).catch((function(e){t.$u.toast("删除失败")}))}}):t.showToast({title:"请选择要移除的商品",icon:"none"})}}};e.default=u}).call(this,o("543d")["default"])},f3ee:function(t,e,o){"use strict";var n=o("7b6d"),i=o.n(n);i.a},f4d6:function(t,e,o){"use strict";o.r(e);var n=o("ae20"),i=o("606a");for(var s in i)["default"].indexOf(s)<0&&function(t){o.d(e,t,(function(){return i[t]}))}(s);o("f3ee");var a=o("f0c5"),r=Object(a["a"])(i["default"],n["b"],n["c"],!1,null,"0c228a04",null,!1,n["a"],void 0);e["default"]=r.exports}},[["07cd","common/runtime","common/vendor"]]]);