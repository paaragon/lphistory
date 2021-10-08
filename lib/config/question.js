const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(q) {
  return new Promise((res) => {
    rl.question(q, (result) => {
      res(result);
    });
  });
}

function closeStream() {
  rl.close();
}

module.exports = {
  question,
  closeStream,
};
