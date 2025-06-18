require("hardhat-move");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-truffle5");

module.exports = {
  gasReporter: {
    enabled: true,
    outputJSONFile: "./results/aptos/irm.json",
    outputJSON: true,
  },
  solidity: {
    version: "0.8.26",
    settings: {
      evmVersion: "cancun",
    },
  },
};
