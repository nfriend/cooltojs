# cooltojs
<img align="right" width="220" src="http://nathanfriend.io/cooltojs/img/coolToJsLogo-with-margin.png">
A [Cool](http://en.wikipedia.org/wiki/Cool_%28programming_language%29)-to-JavaScript transpiler, written in TypeScript.

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

By default, the output of your Cool program will be redirected to `console.log`.  You can specify a different output function with the `outputFunction` option:

```` JavaScript
var transpilerOutput = CoolToJS.Transpile({
    coolProgramSources: sources,
    outputFunction: function(output) {
        document.getElementById('output').innerHTML += output;
    }
});
````
