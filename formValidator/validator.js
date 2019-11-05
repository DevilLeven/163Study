/**
 * 表单验证
 * 验证规则
 * {
 *  name : "验证的input name值",
 *  rule : "使用内置正则验证 IDcard| email |phone | 或者自定义正则表达式"，
 *  required : "是否必填"
 *  min: 1 //最小值
 *  max: 2 //最大值
 *  message : '验证失败返回信息',
 *  event: '对单个文本框自定义验证事件'
 * }
 * 思路想仿照element-ui表单验证
 * 缺陷，如果对同一个字段组合验证，只能写两条/多条验证规则
 * [
 * {name:'age',required: true,}，
 * {name:'age',min: 0}
 * ]
 */
/**
 *  $('#signupForm').validatorForm([
 *  {
        name: 'username',
        required: true,
        event: 'change',
        message: '请填写用户名'
      }
 *  ])
 */

(function ($, window) {
  var fields = [],form, validatorObj = {}, _callback = function (errors) {};
  $.fn.validatorForm = function (rules,callback) {
    var defOpt = {
      rules: {
        IDcard: {
          Regex: /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/,
          message: '%s验证不通过'
        },
        email: {
          Regex: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          message: '%s验证不通过'
        },
        phone: {
          Regex: /^(13[0-9]|14[5|7]|15[0-9]|18[0-9])\d{8}$/,
          message: '%s验证不通过'
        },
        min:{
          validator:function ($input,other) {
            if(Number($input.val())===NaN && Number(other)===NaN){
              return false;
            }
            return Number($input.val()) >= Number(other);
          },
          message: '%s不可小于%other'
        },
        max:{
          validator:function ($input,other) {
            if(Number($input.val())===NaN && Number(other)===NaN){
              return false;
            }
            return Number($input.val()) <= Number(other);
          },
          message: '%s不可大于%other'
        },
        required:{
          validator:function ($input) {
            var inputVal = $input.val();
            return inputVal!==undefined && inputVal !== null && inputVal !== ''
          },
          message: '%s为必填字段'
        }
      }
    };
    form = this[0];
    toString.call(rules) === '[object Array]' && _initFields(defOpt,rules);
    (typeof callback === 'function') && (_callback = callback);
    validatorObj.validator = _validator;
    return validatorObj;
  };
  function _initFields(defOpt,rules) {
    var fnvat = ['required','max',"min"];
    for (var i = 0; i < rules.length ; i++) {
      var rule = rules[i];
      var $input = $(form[rule.name]);
      var Regex,message = '';
      // 允许在rule 字段中自定义正则
      if(toString.call(rule.rule) === "[object RegExp]"){
        Regex = rule.rule;
      }else if (toString.call(rule.rule) === "[object String]"){
        Regex = defOpt.rules[rule.rule] ? defOpt.rules[rule.rule].Regex : undefined
        message = defOpt.rules[rule.rule] ? defOpt.rules[rule.rule].message : undefined
      }
      var filed = {
        name: rule.name,
        input: $input,
        message: rule.message || message || '',
        Regex: Regex
      };
      for (var j = 0; j <fnvat.length ; j++) {
        var item = fnvat[j];
        if(rule[item] !==undefined && rule[item] !== null){
          filed.validator = defOpt.rules[item].validator;
          filed.otherVal = rule[item];
          !filed.message && (filed.message= defOpt.rules[item].message)
        }
      }
      fields.push(filed);
      if(rule.event){
        $input.unbind().bind(rule.event,function (){_validator(filed.name)})
      }
    }
  }
  function _validator(fildName) {
    var errorList = [];
    for (var i = 0; i < fields.length; i++) {
      var fid = fields[i];
      if(typeof fildName === 'string'&&fid.name!==fildName){
        continue;
      }
      var validator = fid.validator;
      var b=false;
      if(typeof validator === 'function'){
        b = validator(fid.input,fid.otherVal);

      } else {
        b = defvalidator(fid.input,fid.Regex)
      }
      if(!b){
        var message = fid.message?fid.message.replace('%s',fid.name): fid.name+'字段验证不通过';
        message = message.replace('%other',fid.otherVal);
        errorList.push({
          name: fid.name,
          message: message
        })
      }
    }
    _callback(errorList);
  }
  function defvalidator($input,Regex) {
    var inputVal = $input.val();
    return Regex.test(inputVal);
  }
})(jQuery, window);
