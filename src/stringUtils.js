function capitalize(str) {
  if (str.length === 0) return str;
  return str[0].toUpperCase() + str.slice(1);
}

function reverseString(str) {
  return str.split("").reverse().join("");
}

function isPalindrome(str) {
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized === reverseString(normalized);
}

module.exports = { capitalize, reverseString, isPalindrome };
