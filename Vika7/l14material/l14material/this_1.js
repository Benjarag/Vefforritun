var myVar = "A";

function logMyVar() {
    var myVar = "B";
    console.log(this.myVar);
}

logMyVar();

var myObj = {
    myVar: "C"
}

logMyVar.call(myObj);