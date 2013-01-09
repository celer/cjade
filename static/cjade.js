cjade=function(script,onComplete){
  if(script.substr(-8)==".jade.js"){}
  else if(script.substr(-5)==".jade"){ script+=".js" }
  else { script+=".jade.js"; }

  jQuery.ajax({
    dataType: "script",
    cache: true,
    url: script,
    success:function(data){
      _data=data;
      if(data) {
        try {
          var tpl=eval(data);
          return onComplete(null,tpl);
        } catch(e){
          return onComplete(e);
        }
      } else onComplete("No template loaded");
    },error:function(xhr, errorStatus, error){
      return onComplete(error||"error");
    }
   });
}

cjade.options={
	busyImage:"/cjade/waiting.gif", 
	busy:function(element,options){ element.empty(); element.append("<table width='100%' height='100%'><tr><td valign='center' align='center'><img src='"+options.busyImage+"'/></td></tr></table>"); },
	error:function(element,options,err){ element.empty(); element.append("<span style='color:red'>Error rendering template: "+err+"</span>"); },
	render:function(element,templateFunc,err,result){ 
			element.empty();
			element.append(templateFunc(result));
	} 
}	

cjade.defaults=function(options){
	cjade.options=options;
}

cjade.load=function(selector,template,options,onComplete){
	if(typeof options=="function") {
		onComplete=options;
		options = cjade.options;
	} 

	options.busyImage=options.busyImage||cjade.options.busyImage;
	options.busy = options.busy||cjade.options.busy;
	options.error = options.error||cjade.options.error;
	options.render = options.render||cjade.options.render;

	var element = $(selector);


	options.busy(element,options);
	cjade(template,function(err,templateFunc){
		var next={
			render:function(err,result){ 
				options.render(element,templateFunc,err,result);
			}, 
			error:function(err,result){
				options.error(element,options,err);
			},
			template:templateFunc
		}
		if(err){
			options.error(element,options,err);
		}
		try {
			onComplete(err,next);	
		} catch(e){
			options.error(element,options,e.toString());
		}
	});
}

//Jade runtime for the browser
var jade=function(exports){return Array.isArray||(Array.isArray=function(arr){return"[object Array]"==Object.prototype.toString.call(arr)}),Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(key);return arr}),exports.attrs=function(obj){var buf=[],terse=obj.terse;delete obj.terse;var keys=Object.keys(obj),len=keys.length;if(len){buf.push("");for(var i=0;i<len;++i){var key=keys[i],val=obj[key];"boolean"==typeof val||null==val?val&&(terse?buf.push(key):buf.push(key+'="'+key+'"')):"class"==key&&Array.isArray(val)?buf.push(key+'="'+exports.escape(val.join(" "))+'"'):buf.push(key+'="'+exports.escape(val)+'"')}}return buf.join(" ")},exports.escape=function(html){return String(html).replace(/&(?!\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},exports.rethrow=function(err,filename,lineno){if(!filename)throw err;var context=3,str=require("fs").readFileSync(filename,"utf8"),lines=str.split("\n"),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context),context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?"  > ":"    ")+curr+"| "+line}).join("\n");throw err.path=filename,err.message=(filename||"Jade")+":"+lineno+"\n"+context+"\n\n"+err.message,err},exports}({})

