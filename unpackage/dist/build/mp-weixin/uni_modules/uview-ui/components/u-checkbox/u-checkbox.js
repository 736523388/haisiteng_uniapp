(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/uview-ui/components/u-checkbox/u-checkbox"],{"183f":function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}));var a={uIcon:function(){return Promise.all([i.e("common/vendor"),i.e("uni_modules/uview-ui/components/u-icon/u-icon")]).then(i.bind(null,"4a55"))}},n=function(){var t=this.$createElement,e=(this._self._c,this.__get_style([this.checkboxStyle])),i=this.__get_style([this.iconWrapStyle]);this.$mp.data=Object.assign({},{$root:{s0:e,s1:i}})},o=[]},"1f01":function(t,e,i){"use strict";i.r(e);var a=i("183f"),n=i("7be0");for(var o in n)["default"].indexOf(o)<0&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("e6c0");var s=i("f0c5"),r=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"66679f78",null,!1,a["a"],void 0);e["default"]=r.exports},"24f5":function(t,e,i){"use strict";(function(t){var a=i("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=a(i("d8b4")),o={name:"u-checkbox",mixins:[t.$u.mpMixin,t.$u.mixin,n.default],data:function(){return{isChecked:!1,parentData:{iconSize:12,labelDisabled:null,disabled:null,shape:"square",activeColor:null,inactiveColor:null,size:18,value:null,iconColor:null,placement:"row",borderBottom:!1,iconPlacement:"left"}}},computed:{elDisabled:function(){return""!==this.disabled?this.disabled:null!==this.parentData.disabled&&this.parentData.disabled},elLabelDisabled:function(){return""!==this.labelDisabled?this.labelDisabled:null!==this.parentData.labelDisabled&&this.parentData.labelDisabled},elSize:function(){return this.size?this.size:this.parentData.size?this.parentData.size:21},elIconSize:function(){return this.iconSize?this.iconSize:this.parentData.iconSize?this.parentData.iconSize:12},elActiveColor:function(){return this.activeColor?this.activeColor:this.parentData.activeColor?this.parentData.activeColor:"#2979ff"},elInactiveColor:function(){return this.inactiveColor?this.inactiveColor:this.parentData.inactiveColor?this.parentData.inactiveColor:"#c8c9cc"},elLabelColor:function(){return this.labelColor?this.labelColor:this.parentData.labelColor?this.parentData.labelColor:"#606266"},elShape:function(){return this.shape?this.shape:this.parentData.shape?this.parentData.shape:"circle"},elLabelSize:function(){return t.$u.addUnit(this.labelSize?this.labelSize:this.parentData.labelSize?this.parentData.labelSize:"15")},elIconColor:function(){var t=this.iconColor?this.iconColor:this.parentData.iconColor?this.parentData.iconColor:"#ffffff";return this.elDisabled?this.isChecked?this.elInactiveColor:"transparent":this.isChecked?t:"transparent"},iconClasses:function(){var t=[];return t.push("u-checkbox__icon-wrap--"+this.elShape),this.elDisabled&&t.push("u-checkbox__icon-wrap--disabled"),this.isChecked&&this.elDisabled&&t.push("u-checkbox__icon-wrap--disabled--checked"),t},iconWrapStyle:function(){var e={};return e.backgroundColor=this.isChecked&&!this.elDisabled?this.elActiveColor:"#ffffff",e.borderColor=this.isChecked&&!this.elDisabled?this.elActiveColor:this.elInactiveColor,e.width=t.$u.addUnit(this.elSize),e.height=t.$u.addUnit(this.elSize),"right"===this.parentData.iconPlacement&&(e.marginRight=0),e},checkboxStyle:function(){var e={};return this.parentData.borderBottom&&"row"===this.parentData.placement&&t.$u.error("检测到您将borderBottom设置为true，需要同时将u-checkbox-group的placement设置为column才有效"),this.parentData.borderBottom&&"column"===this.parentData.placement&&(e.paddingBottom="8px"),t.$u.deepMerge(e,t.$u.addStyle(this.customStyle))}},mounted:function(){this.init()},methods:{init:function(){var e=this;this.updateParentData(),this.parent||t.$u.error("u-checkbox必须搭配u-checkbox-group组件使用"),this.checked?this.isChecked=!0:t.$u.test.array(this.parentData.value)&&(this.isChecked=this.parentData.value.some((function(t){return t===e.name})))},updateParentData:function(){this.getParentData("u-checkbox-group")},wrapperClickHandler:function(t){"right"===this.parentData.iconPlacement&&this.iconClickHandler(t)},iconClickHandler:function(t){this.preventEvent(t),this.elDisabled||this.setRadioCheckedStatus()},labelClickHandler:function(t){this.preventEvent(t),this.elLabelDisabled||this.elDisabled||this.setRadioCheckedStatus()},emitEvent:function(){var e=this;this.$emit("change",this.isChecked),this.$nextTick((function(){t.$u.formValidate(e,"change")}))},setRadioCheckedStatus:function(){this.isChecked=!this.isChecked,this.emitEvent(),"function"===typeof this.parent.unCheckedOther&&this.parent.unCheckedOther(this)}},watch:{checked:function(){this.isChecked=this.checked}}};e.default=o}).call(this,i("543d")["default"])},"53c9":function(t,e,i){},"7be0":function(t,e,i){"use strict";i.r(e);var a=i("24f5"),n=i.n(a);for(var o in a)["default"].indexOf(o)<0&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a},e6c0:function(t,e,i){"use strict";var a=i("53c9"),n=i.n(a);n.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uview-ui/components/u-checkbox/u-checkbox-create-component',
    {
        'uni_modules/uview-ui/components/u-checkbox/u-checkbox-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("1f01"))
        })
    },
    [['uni_modules/uview-ui/components/u-checkbox/u-checkbox-create-component']]
]);
