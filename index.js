const {poseidon4, poseidon10} = require("poseidon-lite");

console.log(poseidon4([BigInt('0x9BA65D244654610689E04446ac8f5565d13211cD'), BigInt('0x9BA65D244654610689E04446ac8f5565d13211cD'), BigInt(0), BigInt(0)]))
console.log(poseidon10([BigInt(1),BigInt(1),BigInt(1),BigInt(1),BigInt(1),BigInt(1),BigInt(1),BigInt(1),BigInt(1),BigInt(1)]))