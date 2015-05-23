# cooltojs
A [Cool](http://en.wikipedia.org/wiki/Cool_%28programming_language%29)-to-JavaScript transpiler, written in TypeScript.
<br />
<br />
<img height="256" src="http://nathanfriend.io/cooltojs/img/coolToJsLogo.png" />

#### Example usage
```` HTML
<script type="text/cool" src="HelloWorld.cl"></script>
<script src="cooltojs-1.0.0.js"></script>
<script>

    // automatically fetch any Cool source referenced 
    // by a <script type="text/cool"> element
    CoolToJS.GetReferencedCoolSources(function(sources) {

        // transpile the source
        var transpilerOutput = CoolToJS.Transpile({
            coolProgramSources: sources
        });
        
        if (transpilerOutput.success) {
            
            // do what you want with the output
            eval(transpilerOutput.generatedJavaScript);
        }
    });
</script>
````

#### Setup
By default, the output of your Cool program will be redirected to `console.log`.  You can specify a different output function with the `out_string` and `out_int` options:

```` JavaScript
var transpilerOutput = CoolToJS.Transpile({
    coolProgramSources: sources,
    out_string: function(output) {
        document.getElementById('output').innerHTML += output;
    },
    out_int: function (output) {
        document.getElementById('output').innerHTML += output;
    }
});
````

Similarly, you can provide input to your Cool program by providing `in_string` and `in_int` functions.  These functions should accept a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) as a parameter.  Once input has been entered by the user, the generator's `next()` method should be invoked with the user's input.  For example:

```` JavaScript
var myInputField = document.getElementById('my-input-field'),
    onlyNumbers = false,
    generator;

myInputField.onkeydown = function(e) {
    if (e.which === 13 /* Enter */) {
        // if onlyNumbers === true, input should be validated 
        // to ensure a valid number was entered
    
        generator.next(myInputField.value)
        myInputField.value = '';
    }
}

var transpilerOutput = CoolToJS.Transpile({
    coolProgramSources: sources,
    in_string: function (newGenerator) {
        onlyNumbers = false;
        generator = newGenerator;
    },
    in_int: function (newGenerator) {
        onlyNumbers = true;
        generator = newGenerator;
    }
});
````
By default, the `in_string` and `in_int` functions are mapped to empty functions, so you won't be able to send input to your Cool program without providing these functions.

#### Output
The output of the CoolToJS transpiler is valid ES6 JavaScript.  Note that support for ES6 is [still fairly limited](https://kangax.github.io/compat-table/es6/), so it's advisable to use a ES6 to ES5 compiler like [Babel](http://babeljs.io/) to generate code that can target current browsers.  An example of this transformation using Babel:

```` HTML
<script type="text/cool" src="HelloWorld.cl"></script>
<script src="lib/babel/browser-polyfill.js"></script>
<script src="lib/babel/browser.js"></script>
<script src="cooltojs-1.0.0.js"></script>
<script>

    // automatically fetch any Cool source referenced 
    // by a <script type="text/cool"> element
    CoolToJS.GetReferencedCoolSources(function(sources) {
        
        // transpile the source
        var transpilerOutput = CoolToJS.Transpile({
            coolProgramSources: sources
        });
        
        if (transpilerOutput.success) {
            
            // transform the generated ES6 code to ES5 code
            var es5Code = babel.transform(transpilerOutput.generatedJavaScript, {
                stage: 0
            }).code;
            
            // do what you want with the ES5 code
            eval(es5Code);
        }
    });
</script>
````
See the live version of this example at http://nathanfriend.io/cooltojs/example/.
