const math = require('../math');

describe("doDivision(a,b)", () => {
    // Test 1.a: Correct division with positive numbers to 2 decimal places
    test("returns correct division result with two positive numbers", () => {
        // Using 5 and 2 as examples, which gives 2.5
        // Format to 2 decimal places (becomes "2.50")
        // Convert back to number for comparison
        const result = math.doDivision(5, 2);
        expect(Number(result)).toBe(2.50);
    });

    // Test 1.b: Division by zero
    test("failiure case: division by zero", () => {
        // Division by zero should return Infinity
        const result = math.doDivision(5, 0);
        expect(result).toBe(Infinity);
    }
    );

    // Test 1.b: Division by infinity
    test("failiure case: division by infinity", () => {
        // Division by infinity should return 0
        const result = math.doDivision(5, Infinity);
        expect(result).toBe(0);
    });
});

// Test 2.a: Correct string output with positive numbers
describe("stringifyDivision(a,b)", () => {
    test("returns correct string with two positive numbers", () => {
        // Using 5 and 2 as examples, which gives 2.5
        const result = math.stringifyDivision(5, 2);
        expect(result).toBe("5 divided by 2 is 2.5");
    });
});
