//A regular object. All the contents can be accessed
var myPerson = {
    ssid: "12345", 
    getSSID: function () { 
        this.logSSIDReq(); 
        return this.ssid; 
    }, 
    logSSIDReq: function () { 
        console.log("SSID returned"); 
    } 
}; 

console.log(myPerson.ssid); //Accessible
myPerson.logSSIDReq(); //Accessible
console.log(myPerson.getSSID()); //Accessible
