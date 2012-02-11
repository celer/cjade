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

    var cjade = require('cjade')
    ...
    // templates - where to find the template files
    // c_templates - where to cache compiled templates to
    app.use(cjade("templates","c_templates"))

Browser

    <script src="jquery.js">
    <script src="/cjade/cjade.js">

    ..

    cjade("test.jade.js",function(err,template){
      $("#output").append(template({ a:1, b:2 }))
    }



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
