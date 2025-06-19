require("hardhat-move");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");

module.exports = {
  gasReporter: {
    enabled: true,
    outputJSONFile: "./results/gas.json",
    outputJSON: true,
  },
  solidity: {
    version: "0.8.26",
    settings: {
      evmVersion: "cancun",
    },
  },
};
