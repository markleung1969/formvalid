/**
 *  表单验证
 *  表单html格式 依赖zepto或者jquery
 *
 *  每一个formControl为一个对象
 *
 *  <form id="vaildForm">
 *      <div class="form-group">
 *          <label class="form-label">姓名</label> 
 *          <div class="form-controls">
 *              <div class="form-text-control" data-valid="textRequired">
 *                  <input class="form-text-input" /> 
 *              </div>
 *          </div>
 *      </div>
 *      <div class="form-group">
 *          <label class="form-label">地区</label> 
 *          <div class="form-controls">
 *              <div class="form-select-control" data-valid="selectRequired">
 *                  <select>
 *                      <option>请选择</option>
 *                  </select>
 *              </div>
 *              <div class="form-textarea-control" data-valid="textareaRequired">
 *                  <textarea></textarea>
 *              </div>
 *          </div>
 *      </div>
 *  </form>
 */
$(function() {
    $.fn.valid = function() {

        var FormControl = function(element){
            this.$self = $(element);
            console.log(this.$self);

            var validRawInfo = this.$self.data('valid');
            this.validRules = validRawInfo.split(' ');
        }

        FormControl.prototype = {

            init : function(){
                var self = this;
                var $self = this.$self;
                this.$self.find('input').on('blur', function(){
                    self.valid();
                });
            },

            valid : function(){
                var $self = this.$self;
                console.log(this);
                this._removeErrorMes();
                for(var i=0; i<this.validRules.length; i++) {

                    //单个inputgroup验证单个规则
                    tmp = this._validSingleRule(this.validRules[i]);
                    return tmp;
                }
            },

            //清除错误提示
            _removeErrorMes : function(){
                this.$self.find('.error-text').remove();
            },

            //添加inputgroup所有错误提示
            _addErrorMes : function(message){
                this.$self.append('<p class="error-text">'+ message +'</p>');
            },

            _validSingleRule(type){
                switch(type) {
                    case 'textRequired' : 
                        var errorMes = '* 这里不能为空';
                        var $input = this.$self.find('input'); 
                        if($input.val()) {
                            return true;
                        }
                        else {
                            this._addErrorMes(errorMes);
                            return false;
                        }

                    case 'length' : 
                        var length = this.$self.data('length');
                        var $input = this.$self.find('input'); 
                        var errorMes = '* 请输入' + length + '位数字';
                        if($input.val().length == length) {
                            return true;
                        }
                        else {
                            this._addErrorMes(errorMes);
                            return false;
                        }

                    default :
                        var errorMes = '没有这个表单验证规则';
                        this._addErrorMes(errorMes);
                        return false;
                }
            }
        }

        //保证一个input-group只有一个验证判断
        //可以是fieldset,也可以是整一个form, 也可以是单个input-group
        $self = $(this);
        console.log($self);

        //当是form或者filedset等有多个input的时候
        if($self.is('[data-valid]')) {
            $formControls = $self;
        }
        else {
            $formControls = $self.find('[data-valid]');
            console.log($formControls);
        }

        var validForm = {};
        validForm.flag = 1;
        validForm.formControls = [];

        //单个inputgroup验证
        $.each($formControls, function(){
            //对象的构建 传入formControl的dom
            var formControl = new FormControl(this);
            formControl.init();
            validForm.formControls.push(formControl);
            if(!formControl.valid()) {
                validForm.flag = 0;
            };
        });

        return validForm.flag;
    } 
});

$(document).ready(function(){
    //$('#singleFormControl').valid();

    $('#submitBtn').on('click', function(){
        $('#validForm').valid();
        console.log($('#validForm'));
        return false;
    });
    
    $('#submitBtn2').on('click', function(){

        console.log('valid form 2');
        $('#validForm2').valid();
        return false;
    });
});


