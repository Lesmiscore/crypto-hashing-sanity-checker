const bitcoin = require("bitgo-utxo-lib");
const elliptic = require("elliptic");
const random = require("randombytes");

const secp256k1 = new elliptic.ec("secp256k1");

const result = [];
for (let i = 0; i < 10; i++) {
  const data = random(30);
  const sha256 = bitcoin.crypto.sha256(data).toString("hex");
  const ripemd160 = bitcoin.crypto.ripemd160(data).toString("hex");
  const keyPair = secp256k1.keyFromPrivate(sha256, "hex");
  const multiply = keyPair.getPublic().encode("hex");
  const signing = Buffer.from(
    keyPair.sign("Satoshi Nakamoto").toDER()
  ).toString("hex");
  const entry = {
    data: data.toString("hex"),
    tests: {
      sha256,
      ripemd160,
      multiply,
      signing
    }
  };
  result.push(entry);
}
console.log(JSON.stringify(result, null, "    "));
