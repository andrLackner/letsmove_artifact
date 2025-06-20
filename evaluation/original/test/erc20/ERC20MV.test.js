const { BN } = require("@openzeppelin/test-helpers");
const fs = require("node:fs");

const ERC20MV = artifacts.require("ERC20MV");

contract("ERC20MV", function (accounts) {
  const [initialHolder, recipient, anotherAccount] = accounts;

  const name = "My Token";
  const symbol = "MTKN";

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token = await ERC20MV.new(name, symbol, initialHolder, initialSupply);
  });

  describe("_transfer", function () {
    it("should transfer tokens", async function () {
      result = await this.token.transferInternal(
        initialHolder,
        recipient,
        initialSupply
      );

      fs.appendFileSync(
        "./results/erc20_gas.csv",
        `erc20_mv;transfer;${result.receipt.gasUsed}\n`
      );
    });
  });
});
