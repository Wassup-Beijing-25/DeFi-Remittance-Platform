const { getAddress } = require("ethers");

const checksummed = getAddress("0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e");
console.log(checksummed);
