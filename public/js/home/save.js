console.log("Hello!")

localStorage.setItem(15513, JSON.stringify({word: "Hello there"}));

console.log(localStorage.getItem(15513))
console.log(JSON.parse(localStorage.getItem(15513)).word, 1)
console.log(JSON.parse(localStorage[15513]).word)
