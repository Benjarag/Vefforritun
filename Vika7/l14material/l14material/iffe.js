var result = (function () {
    var x = 2;
    return x*x; 
})();

console.log("result is " + result);

(function () {
    console.log("This code is never called again!");
})();