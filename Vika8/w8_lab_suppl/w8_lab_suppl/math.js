/* Write a function doDivision(a,b) that returns the result of a divided by b */

function doDivision(a, b) {
    return a / b;
}


/* Write a function stringifyDivision(a,b) that return a string describing
the division in the format "a divided by b is the result". 
This functions should make use of doDivision(a,b)*/

function stringifyDivision(a, b) {
    const result = doDivision(a, b);
    return `${a} divided by ${b} is ${result}`;
}


/* Export the functions so we can import them elsewhere */

module.exports = {
    doDivision,
    stringifyDivision
};

