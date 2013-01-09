# cjade

A simple request handler for express which compiles jade templates and
makes them avilable for client side use. 

# Requirements
 
 * Express.js
 * jQuery

# Features

 * If a cache directory is specified templates will be compiled and cached
 * Ugilfy will be run on compiled templates
 * Proper HTTP caching will occur of templates

# Usage

NodeJS

```javascript
    var cjade = require('cjade')
    ...
    // templates - where to find the template files
    // c_templates - where to cache compiled templates to
    app.use(cjade("templates","c_templates"))
```

Browser

```javascript
    <script src="jquery.js">
    <script src="/cjade/cjade.js">

    ..

		/**
			Basic utilty function to load the specified client side template
		*/
    cjade("test.jade.js",function(err,template){
      $("#output").append(template({ a:1, b:2 }))
    });
		

		/**
			cjade.defaults can be used to set default values for the options specified above
		*/
		cjade.defaults({
			busyImage:"/images/busy.gif"
		});

		/**
			cjade.load is a utility function which:
				- provides a busy image functionality to be displayed while the template is loaded and business logic is executed
				- provides default error handling

			@param {string} selector
				jQuery selector
			@param {string} template to load
				this template will be loaded and eventually rendered into the specified selector
			@param {object} options 
				optional arguments
				@param {string} busyImage	
					an image to be loaded while waiting for the utility function to finish
				@param {function} render(element,templateFunc,err,templateData)
					this function is called when the render function defined below is called to populate the templateData using the templateFunc into the specified jQuery element
				@param {function} busy(element,options)
					this function is called with the specified element prior to fetching the template and executing business logic
				@param {function} error(element,options,err)
					this function is called when an error occurs
			@param {function} onComplete(err,next)
				this function should contain business logic and is called after the template is loaded
				@param {string} err
					an error message
				@param {object} next
					an object which can be used to either render the template or specify an error
					@param {function} render(templateData)
						calling this function will render the template into the specified jQuery selector utilizing the templateData
					@param {function} error(err) 
						calling this function will call the error function specified in the options
		*/
		cjade.load("#userView","userView.jade.js", function(err,next){
			if(!err){
				UserService.load({ id: user.id},function(err,user){
					if(err){
						next.error(err);
					} else next.render(user);
				});	
			} else {
				return next.error(err);
			}
		});
	
		
```

See examples/test.js for more examples

## License 

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
