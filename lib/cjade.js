var jade = require('jade')
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

var uglify=null;
var myPath = path.dirname(module.filename);

var uglificate=function(str){
  if(uglify===false)
    return str;
  else if(uglify===null){
    try {
      uglify=require('uglify-js');
    } catch(e){
      uglify=false;
      return str;
    }
  } 
	if(uglify.parser && uglify.parser.parse){
		var ast = uglify.parser.parse(str);
		ast = uglify.uglify.ast_mangle(ast);
		ast = uglify.uglify.ast_squeeze(ast);
		str = uglify.uglify.gen_code(ast);
	} else if(uglify.minify){
		str = uglify.minify(str,{fromString:true});
		if(str.code)
			return str.code;
	}
  return str;

}


//FIXME make use of http tags to enforce caching
//FIXME make use of uglify/w compiling templates
var cjade=function(srcDir,compileDir,baseDir){

	fs.mkdir(path.resolve(__dirname,"../temp"));
  
  var staticDir=srcDir||"static/";
  var compileDir=compileDir||null;
	var baseDir=baseDir||"";

	var jadeDir="";
	
	for(var id in module.children){
		var name = module.children[id].id;
		if(/jade\/index.js$/.test(name)){
			jadeDir=path.dirname(name);
		}
	}

	var cjadeJS = path.resolve(__dirname,"../static/cjade.js");
	var runtimeJS = path.resolve(jadeDir,"runtime.js");
	var cjadeMinJS = path.resolve(__dirname,"../temp/_cjade.min.js");

  return function(req,res,next){
    if(req.url==baseDir+"/cjade/cjade.js"){
			fs.exists(cjadeMinJS,function(exists){
				if(exists){
	      	res.sendfile(cjadeMinJS);
				} else {
					fs.readFile(cjadeJS,function(err,cjadeJS){
						if(err) res.send("Error reading cjade.js",500); 
						fs.readFile(runtimeJS,function(err,runtimeJS){
							if(!err){
								var min = uglificate(runtimeJS.toString()+cjadeJS.toString());	
								fs.writeFile(cjadeMinJS,min,function(err){
									if(!err){
										res.sendfile(cjadeMinJS);
									} else {
										res.send("Error creating cjade.js"+err,500);
									}
								});
							}	else { res.send("Error reading runtime.js",500); }
						});
					});
				}
			});
    } else if(req.url==baseDir+"/cjade/waiting.gif"){
      var cpath = path.resolve(path.join(myPath, "../static/waiting.gif"));
      res.sendfile(cpath);
    } else if(req.url.substr(-8)==".jade.js"){
      var templateFileName = path.join(staticDir,req.url.substr(0,req.url.length-3));
      if(compileDir){
        var fileNameHash = crypto.createHash('sha1');
        fileNameHash.update(req.url);
        var cfileName = path.join(compileDir,fileNameHash.digest('hex')+'_'+path.basename(req.url,'.jade.js')+'.cjade'); 
      } 
      var compileAndSend=function(stats){
        fs.readFile(templateFileName,"utf8",function(err,data){
          if(err){
            res.send("File not found",404);
          } else {
            try {
              var tpl = jade.compile(data,{ compileDebug: false, client: true, filename: req.url });
              res.contentType("application/javascript");
              res.header('Content-Type','application/javascript');

              tpl=uglificate(tpl.toString());
              
							var template = ("(function(){ \n"+tpl.toString()+";\n return (anonymous); })()");

              res.header('Content-Type','application/javascript');
              res.header('Date',new Date());
              res.header('Cache-Control','public, max-age=0');
              res.header('Last-Modified',stats.mtime);
              res.header('Etag','"'+stats.size+'-'+stats.mtime.getTime()+'"');
              res.send(template);
              if(compileDir){
                fs.writeFile(cfileName,template,"utf8",function(){});
              }
            } catch(e){
              res.send("Error parsing template",500);
              console.error(e);
            }
          } 
        });    
      }


      if(compileDir){
        fs.stat(cfileName,function(cerr,cstat){
          fs.stat(templateFileName,function(terr,tstat){
            
            var ifModifiedSince = req.header("If-Modified-Since");
            var ifNoneMatch=req.header("If-None-Match");

            if(tstat){
              var modified = tstat.mtime;
              var etag = '"'+tstat.size+'-'+tstat.mtime.getTime()+'"';

              if(ifNoneMatch){
                if(ifNoneMatch==etag)
                  return res.send("Not modified",304);
              }
              if(ifModifiedSince){
                if((new Date(ifModifiedSince)).toString() == tstat.mtime.toString()){
                  return res.send("Not modified",304);
                }
              }
            }

            if(cerr){
              compileAndSend(tstat);
            } else if(!cerr && !terr){
              if(tstat.mtime.getTime()>cstat.mtime.getTime()){
                compileAndSend(tstat);
              } else {
                fs.readFile(cfileName,function(err,data){
                  if(!err){
                    res.contentType("application/javascript");
                    res.header('Content-Type','application/javascript');
                    res.header('Date',new Date());
                    res.header('Cache-Control','public, max-age=0');
                    if(modified && etag){
                      res.header('Last-Modified',modified);
                      res.header('Etag',etag);
                    }
                    res.send(data);
                  } else {
                    res.send("File not found",404);
                  }
                });
              }
            }
          });
        });
      } else {
        fs.stat(templateFileName,function(terr,tstat){
          var ifModifiedSince = req.header("If-Modified-Since");
          var ifNoneMatch=req.header("If-None-Match");

          var modified = tstat.mtime;
          var etag = '"'+tstat.size+'-'+tstat.mtime.getTime()+'"';

          if(ifNoneMatch){
            if(ifNoneMatch==etag)
              return res.send("Not modified",304);
          }
          if(ifModifiedSince){
            if((new Date(ifModifiedSince)).toString() == tstat.mtime.toString()){
              return res.send("Not modified",304);
            }
          }
          compileAndSend();
        });
      }
    } else {
      next();
    } 
  }
}

module.exports=cjade;
