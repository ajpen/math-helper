var queryNameLength = 17; 

function extractEquationFromURL(){
    var queryString = window.location.search;
    var equation = queryString.substr(queryNameLength).replace(/\+/g, '%20');
    return decodeURIComponent(equation);
}

function findAllUnknowns(equationString){

    var unknowns = "";

    for (var i=0; i<equationString.length; i++){
        var charCode = equationString.charCodeAt(i);

        if ((charCode > 64 && charCode < 91) ||
            (charCode > 96 && charCode < 123)){
            
            // Only add unknown once if it appears multiple times in the equation
            if (unknowns.indexOf(equationString[i]) === -1){
                unknowns += equationString[i];
            }
        }
    }

    return unknowns;
}


function writeSolutionMessage(message){
    var equationDiv = document.getElementById('equationPlaceholder');
    equationDiv.setAttribute('style', 'color:#4BC2DB;');
    equationDiv.innerHTML = message;
}


function renderSolutions(solutions){
    // Solutions are assumed to be an array of unknown and answer pairs.
    // for example ["x", "24"]

    var solutionDiv = document.getElementById('solutionPlaceholder');
    
    for (var i=0; i<solutions.length; i++){

        var element = document.createElement('div');
        element.className = "solution" + i;
        solutionDiv.appendChild(element);

        katex.render(solutions[i][0] + " = " + algebra.toTex(solutions[i][1]), element);
    }
}


function solveAndRender(){
    var equation = extractEquationFromURL();

    if (equation.length <= 0){
        writeSolutionMessage("Please enter a valid Equation below.");
        return;
    }

    try {
        var eq = algebra.parse(equation);        
    }
    catch(e){
        console.log("Thrown when parsing given equation: \n" + e.message);    
        writeSolutionMessage("Invalid/Unsupported Equation Given. Please enter a valid and supported equation.");
        return;        
    }
    var unknowns = findAllUnknowns(equation);
    var answers = [];

    for (var i=0; i<unknowns.length; i++){
        try{
            var answer = eq.solveFor(unknowns[i]);
            answers.push([unknowns[i], answer]);
        }
        catch(e){
            console.log("Thrown when solving for unknowns: \n" + e.message);
            writeSolutionMessage("Invalid/Unsupported Equation Given. Please enter a valid and supported equation.");
            return;
        }
    }

    katex.render(algebra.toTex(eq), equationPlaceholder);
    renderSolutions(answers);
    
}

solveAndRender();