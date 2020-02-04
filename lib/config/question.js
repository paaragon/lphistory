const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(question) {
  return new Promise((res, rej) => {
    rl.question(question, (result) => {
      res(result);
    });
  });
}

function closeStream() {
  rl.close();
}

module.exports = {
  question,
  closeStream
}