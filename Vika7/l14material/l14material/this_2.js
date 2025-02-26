var myVar = "A";

var myObj = {
    myVar: "B",
    logMyVar: function() {
        setTimeout(function() {
            console.log(this.myVar);
        }, 10);
        
    }
};

myObj.logMyVar();