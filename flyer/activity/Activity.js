// JavaScript Document
(function(){
	eval(Package("Activity"));
	eval(Import("Senser.Senser"));
	
	Class("Activity",{
		Init:function(){
			_base.Init();
		},
		Load:function(){
			_base.Load();
			for(var w in _this.widgets){
				_this.widgets[w].Load();
			}
			_this.Hide();
		},
		Add:function(){
			_this.app.activity.append(_this.view);
		},
		Remove:function(){
			_this._.remove();
		}
	},"Senser");
})();