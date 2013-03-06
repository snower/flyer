// JavaScript Document
(function(){
	eval(Package("Widget"));
	eval(Import("Senser.Senser"));
	
	Class("Widget",{
		parent:null,
		id:"",
		_construct:function(parent,id){
			_this.parent=parent;
			_this.id=id;
		},
		Init:function(){
			_base.Init();
			var index=_this.html.indexOf(">");
			_this.html=_this.html.substr(0,index)+' widget="'+_this.id+'" '+_this.html.substr(index);
		},
		Load:function(){
			_this.view=_this.parent.GetView().find("[widget='"+_this.id+"']");
			_this._=_this.view;
			_this.LoadDomId();
		}
	},"Senser");
})();