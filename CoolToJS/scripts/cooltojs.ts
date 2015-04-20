module CoolToJS {

    // finds all Cool program sources referenced in 
    // <script type="text/cool"> elements and returns 
    // them asynchonously via the completedCallback
    export function GetReferencedCoolSources(completedCallback: (sources: string[]) => any): void {

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

                    // if all ajax calls have returned, execute the callback with the Cool source 
                    if (coolPrograms.length == coolProgramReferences.length) {
                        completedCallback(coolPrograms.map(x => { return x.program }));
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
    }
}