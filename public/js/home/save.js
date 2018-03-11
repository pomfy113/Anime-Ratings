console.log("Hello!")

localStorage.setItem('test', JSON.stringify({word: "Hello there"}));

console.log(localStorage.getItem('test'))
console.log(JSON.parse(localStorage.getItem('test')).word, 1)
console.log(JSON.parse(localStorage.test).word)
console.log(localStorage.test.word)
console.log(localStorage.fish)
console.log(!localStorage.fish)
