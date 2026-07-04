const assert = require("assert");
const { capitalize, reverseString } = require("../src/stringUtils");

assert.strictEqual(capitalize("hello"), "Hello");
assert.strictEqual(capitalize(""), "");

assert.strictEqual(reverseString("hello"), "olleh");
assert.strictEqual(reverseString(""), "");

console.log("All tests passed.");
