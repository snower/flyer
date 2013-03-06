// JavaScript Document
(function(){
	eval(Package("About"));
	eval(Import("Activity.Activity"));
	
	Class("About",{
		Init:function(){
			_base.Init();
		},
		Load:function(){
			_base.Load();
			_this.back.click(function(){
				_this.app.Back();
			});
		}
	},"Activity");
})();