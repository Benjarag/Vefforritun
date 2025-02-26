var myPerson = (function(){
    var ssid = "12345";
    var getSSID = function () { 
        logSSIDReq(); 
        return ssid; 
    };
    var logSSIDReq = function () { 
        console.log("SSID returned"); 
    } ;
    return {getSSID: getSSID};
})(); 

console.log(myPerson.ssid); //undefined
myPerson.logSSIDReq(); //undefined -- type error
console.log(myPerson.getSSID()); //accessible
