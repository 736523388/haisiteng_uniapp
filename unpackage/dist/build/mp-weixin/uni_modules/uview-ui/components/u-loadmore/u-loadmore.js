(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/uview-ui/components/u-loadmore/u-loadmore"],{"2b11":function(t,n,e){"use strict";(function(t){var o=e("4ea4");Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=o(e("6d2f")),u={name:"u-loadmore",mixins:[t.$u.mpMixin,t.$u.mixin,i.default],data:function(){return{dotText:"●"}},computed:{loadTextStyle:function(){return{color:this.color,fontSize:t.$u.addUnit(this.fontSize),lineHeight:t.$u.addUnit(this.fontSize),backgroundColor:this.bgColor}},showText:function(){var t="";return t="loadmore"==this.status?this.loadmoreText:"loading"==this.status?this.loadingText:"nomore"==this.status&&this.isDot?this.dotText:this.nomoreText,t}},methods:{loadMore:function(){"loadmore"==this.status&&this.$emit("loadmore")}}};n.default=u}).call(this,e("543d")["default"])},"69eb":function(t,n,e){"use strict";e.d(n,"b",(function(){return i})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){return o}));var o={uLine:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uview-ui/components/u-line/u-line")]).then(e.bind(null,"4bfd"))},uLoadingIcon:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uview-ui/components/u-loading-icon/u-loading-icon")]).then(e.bind(null,"8e9e"))}},i=function(){var t=this,n=t.$createElement,e=(t._self._c,t.__get_style([t.$u.addStyle(t.customStyle),{backgroundColor:t.bgColor,marginBottom:t.$u.addUnit(t.marginBottom),marginTop:t.$u.addUnit(t.marginTop),height:t.$u.addUnit(t.height)}])),o=t.__get_style([t.loadTextStyle]);t.$mp.data=Object.assign({},{$root:{s0:e,s1:o}})},u=[]},7463:function(t,n,e){},"911e":function(t,n,e){"use strict";e.r(n);var o=e("69eb"),i=e("d128");for(var u in i)["default"].indexOf(u)<0&&function(t){e.d(n,t,(function(){return i[t]}))}(u);e("e997");var a=e("f0c5"),r=Object(a["a"])(i["default"],o["b"],o["c"],!1,null,"0f91d4e1",null,!1,o["a"],void 0);n["default"]=r.exports},d128:function(t,n,e){"use strict";e.r(n);var o=e("2b11"),i=e.n(o);for(var u in o)["default"].indexOf(u)<0&&function(t){e.d(n,t,(function(){return o[t]}))}(u);n["default"]=i.a},e997:function(t,n,e){"use strict";var o=e("7463"),i=e.n(o);i.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uview-ui/components/u-loadmore/u-loadmore-create-component',
    {
        'uni_modules/uview-ui/components/u-loadmore/u-loadmore-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("911e"))
        })
    },
    [['uni_modules/uview-ui/components/u-loadmore/u-loadmore-create-component']]
]);