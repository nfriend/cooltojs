module CoolToJS {

    // finds all Cool program references, transpiles the source to JavaScript, 
    // and runs the final product in the page
    export function Run() {

        // get all <script> elements of type "text/cool" and get the script's source as a string
        var coolProgramReferences = document.querySelectorAll('script[type="text/cool"]');
        var coolPrograms: Array<{ filename: string; program: string }> = [];
        for (var i = 0; i < coolProgramReferences.length; i++) {
            var filename: string = coolProgramReferences[i].attributes['src'].value;
            // call a separate function here to avoid closure problem
            getCoolProgramText(i, filename);
        }

        function getCoolProgramText(index: number, filename: string) {
            makeAjaxRequest(filename,
                (responseText: string) => {
                    coolPrograms[index] = ({ filename: filename, program: responseText });
                    if (coolPrograms.length == coolProgramReferences.length) {
                        allCoolProgramsFetchedSuccessfully();
                    }
                });
        }

        // generic function to make AJAX call
        function makeAjaxRequest(url: string, successCallback: (responseText: string) => void, errorCallback?: () => void) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        successCallback(xmlhttp.responseText);
                    }
                    else {
                        if (errorCallback) {
                            errorCallback();
                        }
                    }
                }
            }
            xmlhttp.open('GET', url, true);
            xmlhttp.send();
        }

        // displays the source of all referenced Cool programs on the screen
        function allCoolProgramsFetchedSuccessfully() {
            CoolToJS.Transpile({
                coolProgramSources: coolPrograms.map(x => { return x.program }),
                outputFunction: (output: string) => {
                    document.getElementById('output').innerHTML += output;
                }
            });
        }
    }
}