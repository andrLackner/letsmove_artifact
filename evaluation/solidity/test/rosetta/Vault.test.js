const { toNumber } = require("web3-utils");
const { ethers } = require("hardhat");
const { time } = require("@openzeppelin/test-helpers");

const Vault = artifacts.require("Vault");

contract("Vault", async function (accounts) {
  const [deployer, user1, receiver, recovery] = accounts;

  describe("Finalize execution", async function () {
    before(async function () {
      let waitTime = 100;
      let payableValue = 1000;
      this.vault = await Vault.new(recovery, waitTime, {
        from: deployer,
        value: payableValue,
      });
    });
    describe("After deployment", async function () {
      it("Owner could withdraw", async function () {
        let result = await this.vault.withdraw(receiver, 100, {
          from: deployer,
        });
        console.log("Withdraw cost: ", result.receipt.gasUsed);
      });
      it("Owner could finalize", async function () {
        // increase the block number to simulate the passage of time
        let now = await time.latestBlock();
        await time.advanceBlockTo(toNumber(now) + 100);
        let result = await this.vault.finalize({
          from: deployer,
        });
        console.log("Finalize cost: ", result.receipt.gasUsed);
      });
    });
  });
  describe("Cancel execution", async function () {
    before(async function () {
      let waitTime = 1000;
      let payableValue = 1000;
      this.vault = await Vault.new(recovery, waitTime, {
        from: deployer,
        value: payableValue,
      });
    });
    describe("After deployment", async function () {
      it("Owner could deposit", async function () {
        let [deployer] = await ethers.getSigners();
        let result = await (
          await deployer.sendTransaction({
            to: this.vault.address,
            value: 1000,
          })
        ).wait();
        console.log("Deposit cost: ", result.gasUsed);
      });
      it("Owner could withdraw", async function () {
        let result = await this.vault.withdraw(receiver, 100, {
          from: deployer,
        });
        console.log("Withdraw cost: ", result.receipt.gasUsed);
      });
      it("Recovery could cancel", async function () {
        let result = await this.vault.cancel({
          from: recovery,
        });
        console.log("Cancel cost: ", result.receipt.gasUsed);
      });
    });
  });
});
