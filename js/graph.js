
function extractFunctionFromURL(){
    var queryNameLength = 16; 

    var queryString = window.location.search;
    var expressions = queryString.substr(queryNameLength).replace(/\+/g, '%20');
    return decodeURIComponent(expressions);
}

function writeErrorMessage(message){
    var equationDiv = document.getElementById('plot');
    equationDiv.setAttribute('style', 'color:#4BC2DB;');
    equationDiv.innerHTML = message;
}

function parseFunctions(functionString){
    return functionString.split(',');
}

function evaluateFunction(functionStr){
    var exp = math.compile(functionStr);

    var xValues = math.range(-10, 10, 0.5).toArray();
    var yValues = xValues.map(function(x){
        return exp.eval({x: x})
    })
    return {
        x: xValues,
        y: yValues,
        type: 'scatter',
        name: functionStr
    }
}

function evaluateAndPlot(){
    var functionString = extractFunctionFromURL();

    if (functionString <= 0){
        var functionForm = document.getElementById('graph');
        functionForm.style.display = "block";
        return;
    }

    var functionExpressions = parseFunctions(functionString);

    if (functionExpressions.length <= 0){
            writeErrorMessage(
                "Invalid/Unsupported expression entered. Please Enter a valid expression");
        return;
    }

    var plots = [];
    
    for (var i=0; i<functionExpressions.length; i++){
        try{
            plots.push(evaluateFunction(functionExpressions[i]));
        }
        catch(e){
            console.log("Error caught when evaluating function expressions:\n" + e.message);
            writeErrorMessage(
                "Invalid/Unsupported expression entered. Please Enter a valid expression");
            return;
        }
    }

    try{
        var layout = {
            title:'Graph of functions: ' + functionExpressions.join("; ")
        };

        Plotly.newPlot('plot', plots, layout);
        var functionForm = document.getElementById('plotPlaceholder');
        functionForm.style.display = "";
    }
    catch(e){
        console.log("Error caught when attempting to plot expressions:\n" + e.message);
        writeErrorMessage(
            "Invalid/Unsupported expression entered. Please Enter a valid expression");
        return; 
    }
}

evaluateAndPlot();