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



//Jade runtime for the browser
var jade=function(exports){return Array.isArray||(Array.isArray=function(arr){return"[object Array]"==Object.prototype.toString.call(arr)}),Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(key);return arr}),exports.attrs=function(obj){var buf=[],terse=obj.terse;delete obj.terse;var keys=Object.keys(obj),len=keys.length;if(len){buf.push("");for(var i=0;i<len;++i){var key=keys[i],val=obj[key];"boolean"==typeof val||null==val?val&&(terse?buf.push(key):buf.push(key+'="'+key+'"')):"class"==key&&Array.isArray(val)?buf.push(key+'="'+exports.escape(val.join(" "))+'"'):buf.push(key+'="'+exports.escape(val)+'"')}}return buf.join(" ")},exports.escape=function(html){return String(html).replace(/&(?!\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},exports.rethrow=function(err,filename,lineno){if(!filename)throw err;var context=3,str=require("fs").readFileSync(filename,"utf8"),lines=str.split("\n"),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context),context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?"  > ":"    ")+curr+"| "+line}).join("\n");throw err.path=filename,err.message=(filename||"Jade")+":"+lineno+"\n"+context+"\n\n"+err.message,err},exports}({})

