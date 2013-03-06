// JavaScript Document
(function(){
	eval(Package("Widget"));
	eval(Import("Widget.Widget"));
	
	Class("Action",{
		text:"",
		trigger:null,
		_construct:function(parent,id,text){
			_base._construct(parent,id);
			_this.text=text;
		},
		Load:function(){
			_base.Load();
			_this._.click(function(){
				if(_this.trigger) _this.trigger(_this);
			});
		},
		Trigger:function(fn){
			_this.trigger=fn;
		}
	},"Widget");
})();