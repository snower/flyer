// JavaScript Document
(function(){
	eval(Package("MainActivity"));
	eval(Import("Activity.Activity"));
	eval(Import("Activity.Dialog"));
	
	Class("MainActivity",{
		Init:function(){
			_base.Init();
		},
		Load:function(){
			_base.Load();
			_this.about.click(function(){
				var about=New("About.About");
				about.Init();
				about.Load();
				_this.app.Intend(about);
			});
			_this.forward.click(function(){
				_this.app.Forward();
			});
			_this.menu_home.Trigger(function(){
				var about=New("About.About");
				about.Init();
				about.Load();
				_this.app.Intend(about);
			});
			
			_this.menu_content.Trigger(function(){
				_this.child_title.Text("修改标题");
			});
			
			_this.menu_about.Trigger(function(){
				var dialog=New("Dialog");
				dialog.Open();
			});
		}
	},"Activity");
})();