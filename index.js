const bitcoin = require("bitgo-utxo-lib");
const elliptic = require("elliptic");
const fixtures = require("./fixtures.json");

function calculate(fixture) {
  const {
    data,
    tests: {
      sha256: validSha256,
      ripemd160: validRipemd160,
      multiply: validMultiply,
      signing: validSigning
    }
  } = fixture;
  const sha256 = bitcoin.crypto.sha256(data).toString("hex");
  const ripemd160 = bitcoin.crypto.ripemd160(data).toString("hex");
  const keyPair = secp256k1.keyFromPrivate(sha256, "hex");
  const multiply = keyPair.getPublic().encode("hex");
  const signing = Buffer.from(
    keyPair.sign("Satoshi Nakamoto").toDER()
  ).toString("hex");
  const display = `
Given: ${data}

==== SHA256
Valid : ${validSha256}
Result: ${sha256}

==== RIPEMD160
Valid : ${validRipemd160}
Result: ${ripemd160}

==== ECDSA multiplication
Valid : ${validMultiply}
Result: ${multiply}

==== Signing
Valid : ${validSigning}
Result: ${signing}
`.trim();
  document.getElementById("output").innerHTML = display;
}

function showFixture() {
  calculate(fixtures[Math.random() * fixtures.length]);
}

const onload = function(func) {
  if (window.attachEvent) {
    window.attachEvent("onload", func);
  } else if (window.onload) {
    let curronload = window.onload;
    let newonload = function(evt) {
      curronload(evt);
      func(evt);
    };
    window.onload = newonload;
  } else {
    window.onload = func;
  }
};
onload(() => {
  setTimeout(showFixture, 0);
  document.getElementById("testanother").addEventListener("click", showFixture);
});
