# first-pr-demo

A tiny collection of string utility functions, used as a playground for practicing
Git and GitHub pull request workflows.

## Functions

- `capitalize(str)` — uppercases the first letter of a string.
- `reverseString(str)` — reverses a string.
- `isPalindrome(str)` — checks whether a string reads the same forwards and backwards.

## Usage

```js
const { capitalize, reverseString, isPalindrome } = require("./src/stringUtils");

capitalize("hello");     // "Hello"
reverseString("hello");  // "olleh"
isPalindrome("racecar"); // true
```

## Tests

```
npm test
```
