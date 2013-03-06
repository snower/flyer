// JavaScript Document
(function(){
	eval(Package("Widget"));
	eval(Import("Widget.Widget"));
	
	Class("Label",{
		text:"",
		_construct:function(parent,id,text){
			_base._construct(parent,id);
			_this.text=text;
		},
		Text:function(text){
			if(arguments.length==0){
				return _this.text;
			}else{
				_this.text=text;
				_this._.text(text);
			}
		}
	},"Widget");
})();