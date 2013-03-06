// JavaScript Document
(function(){
	eval(Package("Application"));
	
	Class("Application",{
		flyer:null,
		appConfig:null,
		mainActivity:null,
		clientWidth:0,
		clientHeight:0,
		activity:null,
		activityQueue:[],
		activatedActivity:-1,
		_construct:function(flyer,appConfig){
			_this.flyer=flyer;
			_this.appConfig=appConfig;
			_this.clientWidth=window.screen.availWidth;
			_this.clientHeight=window.screen.availHeight;
		},
		Load:function(){
			_this.mainActivity=New(_this.appConfig.mainActivity);
		},
		Init:function(){
			_this.activity=_(document.body);
			_this.mainActivity.Init();
			_this.mainActivity.Load();
		},
		Start:function(){
			_this.Intend(_this.mainActivity);
		},
		Suspend:function(){
		},
		Stop:function(){
		},
		UnLoad:function(){
		},
		GetActivityCount:function(){
			return _this.activityQueue.length;
		},
		Intend:function(activity){
			if(_this.activatedActivity<_this.activityQueue.length-1){
				var da=_this.activityQueue.splice(_this.activatedActivity+1);
				for(var a in da){
					da[a].Hide();
					da[a].Remove();
				}
			}
			_this.activityQueue.push(activity);
			_this.activatedActivity=_this.activityQueue.indexOf(activity);
			activity.activityIndex=_this.activatedActivity;
			activity.Add();
			activity.Show();
		},
		Forward:function(){
			if(_this.activatedActivity < _this.activityQueue.length-1){
				_this.activityQueue[_this.activatedActivity+=1].Show();
			}
		},
		Back:function(){
			if(_this.activatedActivity >0){
				_this.activityQueue[_this.activatedActivity--].Hide();
			}
		}
	});
})();