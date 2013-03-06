// JavaScript Document
(function(){
	Flyer={};
	Flyer.Packages={};
	Flyer.LoadedNameSpace={};
	
	Flyer.Property=function(p){
		this.p=p;
	}
	
	Flyer.Function=function(f){
		var ipf=f.indexOf('(');
		var ipl=f.indexOf(')');
		this.fp=f.substring(ipf+1,ipl);
		var ibf=f.indexOf('{');
		var ibl=f.lastIndexOf('}');
		this.fb=f.substring(ibf+1,ibl);
	}
	
	Flyer.GetPackage=function(packageName){
		var names=packageName.split(".");
		var name=this.Packages;
		for(var n in names){
			if(name[names[n]]){
				name=name[names[n]];
			}
			else{
				return null;
			}
		}
		return name;
	}
	
	Flyer.ExtendClass=function(classCompile,classCompileList,compile){
		classCompileList.push(classCompile);
		for(var c in classCompile.compile){
			compile[c]=classCompile.compile[c];
		}
	}
	
	Flyer.CompileClass=function(packageName,className,classSource,classBase,compile){
		var cls=new Compile();
		var c=compile;
		for(var s in classSource){
			if(typeof classSource[s] == "function"){
				c[s]=new this.Function(classSource[s].toString());
			}
			else{
				c[s]=new this.Property(classSource[s]);
			}
		}
		
		cls.package=packageName;
		cls.name=className;
		cls.source=classSource;
		cls.compile=c;
		cls.extendList=classBase;
		this.GetPackage(packageName)[className]=cls;
		return cls;
	}
	
	Flyer.CreateNewClass=function(classCompile,obj,classObj,classBase){
		var c=classCompile.compile;
		var o=classObj;
		var vo=obj;
		var b=classBase;
		var f="\r\nvar _this=vo;\r\nvar _virtual_this=o;\r\n\r\nvar New=classCompile._new;\r\nvar _base=b\r\n";
		
		for(var p in c){
			if(c[p] instanceof this.Function){
				eval("o[p]=function("+c[p].fp+"){"+f+"\r\n"+c[p].fb+"}");
			}
			else if(c[p] instanceof this.Property){
				o[p]=c[p].p;
			}
		}
		o._package=classCompile.package;
		o._name=classCompile.name;
		o._base=b;
	}
	
	Flyer.NewBase=function(classCompile,obj){
		if(!classCompile) return null;
		var cls=new window.Class();
		var bcls=this.NewBase(classCompile[0]._base,obj);
		for(var i=classCompile.length-1;i>=0;i--){
			var c=classCompile[i];
			this.CreateNewClass(c,obj,cls,bcls);
		}
		return cls;
	}
	
	Flyer.NewObject=function(classCompile,classObj){
		var bcls=this.NewBase(classCompile._base,classObj);
		this.CreateNewClass(classCompile,classObj,classObj,bcls);
	}
	
	Flyer.IsLoadNameSpace=function(namespace){
		for(var ns in this.LoadedNameSpace){
			if(namespace==this.LoadedNameSpace[ns]){
				return true;
			}
		}
		return false;
	}
	
	Flyer.GetCompileClass=function(namespace){
		var names=namespace.split(".");
		var name=Flyer.Packages;
		for(var n in names){
			if(name[names[n]]){
				name=name[names[n]];
			}
			else{
				return null;
			}
		}
		return name;
	}
	
	Flyer.GetNameOfNameSpace=function(namespace){
		return namespace.replace(/^.+\./g,"");
	}
	
	Flyer.GetPackageNameOfNameSpace=function(namespace){
		return namespace.replace(/\.{0,1}\w+?$/g,"");
	}
	
	
	
	Flyer.Clone=function(obj){
		var o={};
		if(!obj) return null;
		for(var p in obj){
			o[p]=obj[p];
		}
		return o;
	}
	
	Flyer.LoadNameSpace=function(namespace){
		var name=Flyer.GetNameOfNameSpace(namespace);
		var packageName=Flyer.GetPackageNameOfNameSpace(namespace);
		if(name=="*"){
			var cls=Flyer.LoadedNameSpace[packageName];
			for(var c in cls){
				Flyer.LoadModule(cls[c])
				eval(cls[c].source);
			}
		}
		else{
			Flyer.LoadModule(Flyer.LoadedNameSpace[packageName][name])
			eval(Flyer.LoadedNameSpace[packageName][name].source);
		}
	}
	
	Flyer.Extend=function(names,cls){
		var bc=[];
		for(var n in names){
			Flyer.ExtendClass(__classes__[names[n]],bc,cls);
		}
		return names.length>0 ? bc : null;
	}
	
	Flyer.Class=function(className,classSource){
		var classBase=[];
		for(var i=2,count=arguments.length;i<count;i++){
			classBase.push(arguments[i]);
		}
		if(className!="Base" && classBase.length<=0) classBase.push("Base");
		
		var cls=new Object();
		var b=Extend(classBase,cls);
		cls=Flyer.CompileClass(__package__,className,classSource,classBase,cls);
		cls._base=b
		cls._new=New;
		__classes__[className]=cls;
		return className;
	}
	
	Flyer.New=function(name){
		if(!__classes__) return;
		var c=null;
		if(__classes__[name]){
			var c=__classes__[name];
		}
		else{
			var packageName=Flyer.GetPackageNameOfNameSpace(name);
			var n=Flyer.GetNameOfNameSpace(name);
			if(packageName){
				var package=Flyer.GetPackage(packageName);
				if(!package || !package[n]){
					Flyer.LoadNameSpace(name);
					package=Flyer.GetPackage(packageName);
				}
				if(package[n]){
					c=package[n];
				}
			}
		}
		if(!c) return null;
		var o=new window.Class();
		Flyer.NewObject(c,o);
		
		var _construct="o._construct("
		for(var i=1,count=arguments.length;i<count;i++){
			_construct+="arguments["+i+"]";
			if(i<count-1){
				_construct+=",";
			}
		}
		eval(_construct+");");
		return o;
	}
	
	Package=function(name){
		var names=name.split(".");
		var package=Flyer.Packages;
		for(var n in names){
			if(!package[names[n]]){
				package[names[n]]={};
			}
			package=package[names[n]];
		}
		return 'var __package__="'+name+'";\r\nvar __classes__={};\r\nvar New='+Flyer.New.toString()+'\r\nvar Extend='+Flyer.Extend.toString()+'\r\nvar Class='+Flyer.Class.toString()+"\r\neval(Import(\"Base.Base\"));";
	}
	
	Import=function(namespace,asname){
		var name=Flyer.GetNameOfNameSpace(namespace);
		var packageName=Flyer.GetPackageNameOfNameSpace(namespace);
		var impstr="";
		if(name == '*'){
			var package=Flyer.GetPackage(packageName);
			if(!package){
				Flyer.LoadNameSpace(namespace);
				package=Flyer.GetPackage(packageName);
			}
			for(var c in package){
				impstr+="__classes__['"+c+"']=Flyer.GetCompileClass('"+packageName+"."+c+"');\r\n";
			}
		}
		else{
			if(!Flyer.GetCompileClass(namespace)){
				Flyer.LoadNameSpace(namespace);
			}
			name=asname ? asname : name;
			impstr="__classes__['"+name+"']=Flyer.GetCompileClass('"+namespace+"');\r\n";
		}
		return impstr;
	}
	
	Compile=function(){}
	Class=function(){}
})();

(function(){
	Flyer.Views={};
	Flyer.LoadedView={};
	
	Flyer.GetHtmlSource=function(namespace){
		if(!this.LoadedView[namespace]) return "";
		if(!this.LoadedView[namespace].loaded){
			this.LoadModule(this.LoadedView[namespace].module);
		}
		return this.LoadedView[namespace].htmlSource;
	}
	
	Flyer.ExtendTag=function(pTagObj,tagObj){
		var indexTag=0;
		if(tagObj.children().length<=0){
			if(/^[\r\n\s]*$/.test(tagObj.html())) tagObj.html(pTagObj.html());
			return;
		}
		var p=pTagObj.children();
		var plen=p.length;
		tagObj.children().each(function(index, element) {
          	for(var i=indexTag;i<plen;i++){
			   	var pelement=p[i];
				indexTag++;
				if(element.id && element.id==pelement.id){
					Flyer.ExtendTag(_(pelement),_(element));
					element.className=pelement.className+" "+element.className;
					break;
				}
				else if(element.className && element.className==pelement.className){
					Flyer.ExtendTag(_(pelement),_(element));
					break;
				}
				else{
					_(element).before(pelement);
				}
			}
        });
		for(var i=indexTag;i<plen;i++){
			tagObj.append(p[i]);
		}
	}
	
	Flyer.OverLoadTag=function(pTagObj,tagObj){
		tagObj.find("[overload]").each(function(index, element){
			pTagObj.find(_(element).attr("overload")).replaceWith(element);
		});
		tagObj.find("[overload]").remove();
	}
	
	Flyer.ExtendView=function(Obj,extendName){
		var extendObj=_(this.GetView(extendName));
		var htmlObj=_(Obj[0]);
		var extendHtmlObj=_(extendObj[0]);
		this.OverLoadTag(extendHtmlObj,htmlObj);
		this.ExtendTag(extendHtmlObj,htmlObj);
		htmlObj.attr("class",extendHtmlObj.attr("class")+" "+htmlObj.attr("class"));
	}
	
	Flyer.CompileHtml=function(namespace){
		var htmlObj=_(this.GetHtmlSource(namespace));
		var extendName=htmlObj.attr("extend");
		if(extendName){
			this.ExtendView(htmlObj,extendName);
		}
		this.Views[namespace]=htmlObj[0].outerHTML;
	}
	
	Flyer.GetView=function(namespace){
		if(this.Views[namespace]) return this.Views[namespace];
		this.CompileHtml(namespace);
		return this.Views[namespace];
	}
})();

(function(){
	Flyer.Csses={};
	Flyer.LoadedCss={};
	
	Flyer.GetCssSource=function(namespace){
		if(!this.LoadedCss[namespace]) return "";
		if(!this.LoadedCss[namespace].loaded){
			this.LoadModule(this.LoadedCss[namespace].module);
		}
		return this.LoadedCss[namespace].cssSource;
	}
	
	Flyer.GetCssMeta=function(source){
		var meta=source.match(/@(package|name|extend)\s+?"\w+?";/g);
		var metaObj={};
		for(var m in meta){
			meta[m]=meta[m].replace(/[@"";]/g,"").split(" ");
			metaObj[meta[m][0]]=meta[m][1];
		}
		return metaObj;
	}
	
	Flyer.ExtendCss=function(namespace){
		return this.GetCss(namespace);
	}
	
	Flyer.CompileCss=function(namespace){
		var cssSource=this.GetCssSource(namespace);
		var css=this.GetCssMeta(cssSource);
		var pcss=null;
		if(css.extend){
			pcss=Flyer.ExtendCss(css.extend);
		}
		css.dom=_('<style id="css_'+namespace+'" type=text/css>'+cssSource+'</style>')
		if(pcss){
			_(pcss.dom).after(css.dom);
		}
		else{
			_(document.head).append(css.dom);
		}
		css.dom=css.dom[0];
		this.Csses[namespace]=css;
	}
	
	Flyer.GetCss=function(namespace){
		if(this.Csses[namespace]) return this.Csses[namespace];
		this.CompileCss(namespace);
		return this.Csses[namespace];
	}
})();

(function(){
	Flyer.LoadedUrl={};
	Flyer.LoadSource=function(src,succed){
		var xhr=new XMLHttpRequest();
		if(succed){
			xhr.open("GET",src,true);
			xhr.onreadystatechange=(function(xhr){
				return function(){
					if(xhr.readyState==4)  
					{                              
						if(xhr.status==200)  
						{
							Flyer.LoadedUrl[src]=xhr.responseText;
							succed(xhr.responseText);
						}
					}
				}
			})(xhr);
			xhr.send(null);
		}
		else{
			xhr.open("GET",src,false);
			xhr.onreadystatechange=(function(xhr){
				return function(){
					
				}
			})(xhr);
			xhr.send(null);
			if(xhr.readyState==4)  
			{                              
				if(xhr.status==200)  
				{
					Flyer.LoadedUrl[src]=xhr.responseText;
					return xhr.responseText;
				}
			}
		}
	}
	
	Flyer.UnZipSource=function(url,package){
	}
	
	Flyer.GetUrl=function(url,succed,from){
		if(from){
			var package=LoadSource(from);
			if(package){
				this.UnZipSource(from,package);
			}
		}
		if(this.LoadedUrl[url]){
			if(succed){
				succed(this.LoadedUrl[url]);
				return;
			}
			return this.LoadedUrl[url];
		}
		return this.LoadSource(url,succed);
	}
	
	Flyer.AddModule=function(appConfig,modules){
		if(!appConfig.module) appConfig.module={};
		for(var m in modules){
			appConfig.module[modules[m].name]=modules[m];
		}
	}
	
	Flyer.SetDependModules=function(appConfig,module){
		var dependList=module.dependList;
		for(var md in dependList){
			var m=appConfig.module[dependList[md]];
			appConfig.loadModule[module.loadLevel][dependList[md]]=m;
			m.loadLevel=module.loadLevel;
			this.SetDependModules(appConfig,m);
		}
	}
	
	Flyer.SetLoadModule=function(appConfig,modules){
		if(!appConfig.loadModule) appConfig.loadModule={};
		for(var ll in modules){
			if(!appConfig.loadModule[ll]) appConfig.loadModule[ll]={};
			for(var m in modules[ll]){
				var module=appConfig.module[modules[ll][m]];
				appConfig.loadModule[ll][modules[ll][m]]=module;
				module.loadLevel=ll;
				this.SetDependModules(appConfig,module);
			}
		}
	}
	
	Flyer.SetMainTools=function(appConfig,mainTools){
		appConfig.mainTools=mainTools;
	}
	
	Flyer.SetMainApplication=function(appConfig,mainApplication){
		appConfig.mainApplication=mainApplication;
	}
	
	Flyer.AddSenser=function(appConfig,senser){
		if(!appConfig.senser) appConfig.senser={};
		for(var s in senser){
			appConfig.senser[senser[s].name]=senser[s];
			var m={
				name:senser[s].name,
				url:senser[s].jsUrl,
				packageList:{},
				dependList:senser[s].dependList,
				senser:senser[s]
			};
			m.packageList[senser[s].packageName]=[senser[s].name];
			appConfig.module[m.name]=m;
			senser[s].module=m;
		}
	}
	
	Flyer.SetLoadSenser=function(appConfig,modules){
		for(var ll in modules){
			if(!appConfig.loadModule[ll]) appConfig.loadModule[ll]={};
			for(var m in modules[ll]){
				var module=appConfig.module[modules[ll][m]];
				appConfig.loadModule[ll][modules[ll][m]]=module;
				module.loadLevel=ll;
				this.SetDependModules(appConfig,module);
			}
		}
	}
	
	Flyer.SetMainActivity=function(appConfig,mainActivity){
		appConfig.mainActivity=mainActivity;
	}
	
	Flyer.ReadyLoadedModules=function(appconfig,loadModules){
		for(var ll in loadModules){
			for(var m in loadModules[ll]){
				var module=loadModules[ll][m];
				module.loaded=false;
				for(var ns in module.packageList){
					if(!this.LoadedNameSpace[ns]) this.LoadedNameSpace[ns]={};
					for(var nsc in module.packageList[ns]){
						this.LoadedNameSpace[ns][module.packageList[ns][nsc]]=module;
					}
				}
				if(module.senser) this.ReadyLoadedSenser(module.senser);
			}
		}
	}
	
	Flyer.ReadyLoadedSenser=function(senser){
		senser.loaded=false;
		this.LoadedView[senser.packageName+"_"+senser.name]=senser;
		this.LoadedCss[senser.packageName+"_"+senser.name]=senser;
	}
	
	Flyer.LoadModules=function(appConfig,complete,loadLevel){
		if(!appConfig.loadModule) return;
		var waitModule=[];
		var modules=appConfig.loadModule[loadLevel];
		for(var m in modules){
			this.LoadModule(modules[m],function(module){
				waitModule.splice(waitModule.indexOf(module),1);
				if(waitModule.length<=0){
					if(complete) complete();
				}
			});
			waitModule.push(modules[m]);
		}
	}
	
	Flyer.LoadModule=function(module,complete){
		if(!module) return;
		if(module.loaded) return;
		if(!module.senser){
			if(complete){
				this.GetUrl(module.url,function(source){
					module.source=source;
					module.loaded=true;
					complete(module);
				});
			}
			else{
				var source=this.GetUrl(module.url);
				SetResult(source);
				module.source=source;
				module.loaded=true;
			}
		}
		else{
			if(complete){
				this.LoadSenser(module.senser,function(senser){
					module.source=senser.jsSource;
					module.loaded=true;
					complete(module);
				});
			}
			else{
				this.LoadSenser(module.senser);
				module.source=module.senser.jsSource;
				module.loaded=true;
			}
		}
	}
	
	Flyer.LoadSenser=function(senser,complete){
		if(senser.loaded) return;
		if(complete){
			var handleLoad=function(senser){
				if(senser.htmlLoaded && senser.jsLoaded && senser.cssLoaded){
					senser.loaded=true;
					complete(senser);
				}
			}
			
			Flyer.GetUrl(senser.htmlUrl,function(source){
				senser.htmlSource=source;
				senser.htmlLoaded=true;
				handleLoad(senser);
			});
			Flyer.GetUrl(senser.jsUrl,function(source){
				senser.jsSource=source;
				senser.jsLoaded=true;
				handleLoad(senser);
			});
			Flyer.GetUrl(senser.cssUrl,function(source){
				senser.cssSource=source;
				senser.cssLoaded=true;
				handleLoad(senser);
			});
		}
		else{
			var source=Flyer.GetUrl(senser.htmlUrl);
			senser.htmlSource=source;
			senser.htmlLoaded=true;
			
			source=Flyer.GetUrl(senser.jsUrl)
			senser.jsSource=source;
			senser.jsLoaded=true;
			
			source=Flyer.GetUrl(senser.cssUrl);
			senser.cssSource=source;
			senser.cssLoaded=true;
			
			senser.loaded=true;
		}
	}
	
	Flyer.InitConfig=function(complete){
		var appConfig=AppConfig;
		this.ReadyLoadedModules(appConfig,appConfig.loadModule);
		this.LoadModules(appConfig,function(){
			complete();
		},"advance");
	}
	
	SetConfig=function(config){
		if(!window.AppConfig) window.AppConfig={};
		var appConfig=window.AppConfig;
		if(config.module) Flyer.AddModule(appConfig,config.module);
		if(config.loadModule) Flyer.SetLoadModule(appConfig,config.loadModule);
		if(config.mainTools) Flyer.SetMainTools(appConfig,config.mainTools);
		if(config.mainApplication) Flyer.SetMainApplication(appConfig,config.mainApplication);
		if(config.senser) Flyer.AddSenser(appConfig,config.senser);
		if(config.loadSenser) Flyer.SetLoadSenser(appConfig,config.loadSenser);
		if(config.mainActivity) Flyer.SetMainActivity(appConfig,config.mainActivity);
	}
	
	Include=function(url){
		eval(Flyer.GetUrl(url));
	}
	
	window.onload=function(){
		if(!AppConfig) return;
		Flyer.InitConfig(function(){
			if(AppConfig.mainApplication){
				(function(){
					eval(Package("Main"));
					Tools=New(AppConfig.mainTools);
					_=Tools.CreateTools();
					Application=New(AppConfig.mainApplication,Flyer,AppConfig);
				})();
				Application.Load();
				Application.Init();
				Application.Start();
				
				Flyer.LoadModules(AppConfig,function(){
				},"idle");
			}
		});
	}
	
	window.onunload=function(){
		if(Application){
			Application.Stop();
			Application.UnLoad();
		}
	}
})();

(function(){
	var Package=function(name){
		var names=name.split(".");
		var package=Flyer.Packages;
		for(var n in names){
			if(!package[names[n]]){
				package[names[n]]={};
			}
			package=package[names[n]];
		}
		return 'var __package__="'+name+'";\r\nvar __classes__={};\r\nvar New='+Flyer.New.toString()+'\r\nvar Extend='+Flyer.Extend.toString()+'\r\nvar Class='+Flyer.Class.toString();
	}
	
	eval(Package("Base"));
	
	Class("Base",{
		_name:"Base",
		_descript:"",
		
		_construct:function(){
		},
		
		_toString:function(){
			return _this._name;
		},
		
		_isClass:function(name){
			return false;
		}
	});
})();