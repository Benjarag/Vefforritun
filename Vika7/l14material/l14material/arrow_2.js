var myVar = "A";

var myObj = {
    myVar: "B",
    logMyVar: function() {
        setTimeout(() => {
            console.log(this.myVar);
        },1000);
    }
};

myObj.logMyVar();