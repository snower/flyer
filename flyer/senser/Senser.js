// JavaScript Document
(function(){
	eval(Package("Senser"));
	
	Class("Senser",{
		flyer:Flyer,
		app:Application,
		html:"",
		view:null,
		style:null,
		_:null,
		x:0,
		y:0,
		width:0,
		height:0,
		widgets:null,
		Init:function(){
			_this.html=_this.flyer.GetView(_this._package+"_"+_this._name);
			_this.style=_this.flyer.GetCss(_this._package+"_"+_this._name);
			_this.InitWidget();
			_this.InitTemplete();
		},
		InitWidget:function(){
			var widgets=_this.html.match(/{{\s*?\w+?::\w+?\s*?\({0,1}.*?\){0,1}\s*}}/g);
			_this.widgets=new Object();
			for(var w in widgets){
				var widget=widgets[w];
				var widgetName=/{\s*?\w+?:/g.exec(widget)[0].replace(/[\s{:]/g,"").replace(/_/g,".");
				var name=/:\w+?\s*[\(}]/g.exec(widget)[0].replace(/[\s:\(}]/g,"");
				var params=/\(.*?\)/g.exec(widget)[0].replace(/[\s\(\)]/g,"");
				params = params ? ","+params : "";
				_this.widgets[name]=eval("New(\""+widgetName+"\",_this,name"+params+")");
				_this.widgets[name].Init();
				_this[name]=_this.widgets[name];
				_this.html=_this.html.replace(widget,_this.widgets[name].GetHtml());
			}
		},
		InitTemplete:function(){
			var tels=_this.html.match(/{\s*?\w+?\s*?}/g);
			for(var tel in tels){
				var name=tels[tel].replace(/[\s{}]/g,"");
				if(_this[name]){
					_this.html=_this.html.replace(tels[tel],_this[name]);
				}
				else{
					_this.html=_this.html.replace(tels[tel],"");
				}
			}
		},
		Load:function(){
			_this.view=_(_this.html);
			_this._=_this.view;
			_this.LoadDomId();
		},
		LoadDomId:function(){
			_this._.find("[id]").each(function(index,element){
				var eDom=_(element);
				if(!_this[element.id]){
					_this[element.id]=eDom;
				}
			});
		},
		X:function(x){
			if(arguments.length==0){
				return _this.x;
			}
			else{
				_this.x=x;
				_this._.css("left",x+"px");
			}
		},
		Y:function(y){
			if(arguments.length==0){
				return _this.y;
			}
			else{
				_this.y=y;
				_this._.css("top",y+"px");
			}
		},
		Width:function(w){
			if(arguments.length==0){
				return _this.width;
			}
			else{
				_this.width=w;
				_this._.css("width",w+"px");
			}
		},
		Height:function(h){
			if(arguments.length==0){
				return _this.height;
			}
			else{
				_this.height=h;
				_this._.css("height",h+"px");
			}
		},
		GetHtml:function(){
			return _this.html;
		},
		GetView:function(){
			return _this.view;
		},
		Show:function(){
			_this._.show();
		},
		Hide:function(){
			_this._.hide();
		},
		SetContext:function(context){
			for(var p in context){
				if(_this[p] && !(_this[p] instanceof Function)){
					_this[p]=context[p];
				}
			}
		}
	});
})();