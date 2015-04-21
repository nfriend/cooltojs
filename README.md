# cooltojs
<img width="250" src="http://nathanfriend.io/cooltojs/img/coolToJsLogo-with-margin.png">
A [Cool](http://en.wikipedia.org/wiki/Cool_%28programming_language%29)-to-JavaScript transpiler, written in TypeScript.

<br />

Example usage:
```` HTML
<script type="text/cool" src="HelloWorld.cl"></script>
<script src="cooltojs-0.0.1.js"></script>
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

Similarly, you can provide input to your Cool program by providing `in_string` and `in_int` functions.  These functions should accept a callback as a parameter.  This callback should be invoked with the input once it has been entered by the user.  For example:

```` JavaScript
var transpilerOutput = CoolToJS.Transpile({
    coolProgramSources: sources,
    in_string: function (callback) {
        var input = prompt('Please enter a string:');
        callback(input);
    },
    in_int: function (callback) {
        var input = prompt('Please enter an integer:');
        // input should be validated here to 
        // ensure it only contains numbers
        callback(input);
    }
});
````
By default, the `in_string` and `in_int` functions are mapped to empty functions, so you won't be able to send input to your Cool program without providing these functions.
