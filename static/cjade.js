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
				console.log(data);
        try {
					if(data.code){
						var tpl=eval(data.code);
					} else {
	          var tpl=eval(data);
					}
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
