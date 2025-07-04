const { BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const fs = require("node:fs");

const ERC20Mock = artifacts.require("ERC20Mock");

contract("ERC20Mock", function (accounts) {
  const [initialHolder, recipient, anotherAccount] = accounts;

  const name = "My Token";
  const symbol = "MTKN";

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token = await ERC20Mock.new(
      name,
      symbol,
      initialHolder,
      initialSupply
    );
  });

  describe("_transfer", function () {
    it("should transfer tokens", async function () {
      let result = await this.token.transferInternal(
        initialHolder,
        recipient,
        initialSupply
      );

      fs.appendFileSync(
        "./results/erc20_gas.csv",
        `erc20;transfer;${result.receipt.gasUsed}\n`
      );
    });
  });
});
