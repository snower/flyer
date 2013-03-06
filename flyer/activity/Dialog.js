// JavaScript Document
(function(){
	eval(Package("Activity"));
	eval(Import("Activity.Activity"));
	
	Class("Dialog",{
		_construct:function(){
			_base._construct();
		},
		Init:function(){
			_base.Init();
		},
		Load:function(){
			_base.Load();
			_this.Height(_this.app.clientHeight);
			
			_this.close.click(function(){
				_this.Close();
			});
		},
		Open:function(){
			_this.Init();
			_this.Load();
			_this.app.Intend(_this);
		},
		Close:function(){
			_this.app.Back();
		}
	},"Activity");
})();