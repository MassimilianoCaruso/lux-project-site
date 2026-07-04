const assert = require("assert");
const { capitalize, reverseString, isPalindrome } = require("../src/stringUtils");

assert.strictEqual(capitalize("hello"), "Hello");
assert.strictEqual(capitalize(""), "");

assert.strictEqual(reverseString("hello"), "olleh");
assert.strictEqual(reverseString(""), "");

assert.strictEqual(isPalindrome("racecar"), true);
assert.strictEqual(isPalindrome("A man, a plan, a canal, Panama"), true);
assert.strictEqual(isPalindrome("hello"), false);

console.log("All tests passed.");
