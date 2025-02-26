var myPerson = (function(){
    var ssid = "12345";
    var getSSID = function () { 
        logSSIDReq(); 
        return ssid; 
    };
    var logSSIDReq = function () { 
        console.log("SSID returned"); 
    } ;
})(); 

console.log(myPerson.ssid); //undefined
myPerson.logSSIDReq(); //undefined
console.log(myPerson.getSSID()); //undefined
