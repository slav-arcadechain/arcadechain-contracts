const Treasury = artifacts.require("Treasury");
const Tusd = artifacts.require("TUSD");
const Act = artifacts.require("Act");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

contract("Treasury", (accounts) => {
  let token;
  let act;
  let treasury;
  const admin = accounts[1];
  const operator = accounts[2];
  const user1 = accounts[3];
  const user2 = accounts[4];
  const goldenTicketWinner = accounts[5];
  const percentageOfBurn = 10;
  const percentageOfGoldenTicket = 10;

  beforeEach("Should setup the instance of contract", async () => {
    token = await Tusd.new(30000000000000, { from: admin });
    act = await Act.new(1000000000, { from: admin });
    treasury = await Treasury.new(
      admin,
      operator,
      token.address,
      act.address,
      percentageOfBurn,
      percentageOfGoldenTicket
    );
  });

  describe("Contructor", function () {
    //TODO upgrade with our act token
    it("Should set proper variables", async () => {
      const adminFromTest = await treasury.getAdmin();
      const actFromContract = await treasury.getActAddress();
      const operatorFromTest = await treasury.getOperator();
      const tokenAddressFromTest = await treasury.getTokenAddress();
      const percentageOfBurnFromTest = await treasury.getPercentageOfBurn();
      const percentageOfGoldenTicketFromTest =
        await treasury.getPercentageOfGoldenTicket();
      assert.equal(adminFromTest, admin);
      assert.equal(operatorFromTest, operator);
      assert.equal(tokenAddressFromTest, token.address);
      assert.equal(actFromContract, act.address);
      assert.equal(percentageOfBurnFromTest, percentageOfBurn);
      assert.equal(percentageOfGoldenTicketFromTest, percentageOfGoldenTicket);
    });
  });
  describe("Set Functions", function () {
    describe("Set new Operator", function () {
      it("Should proper set new operator", async () => {
        const newOperator = accounts[3];
        await treasury.setOperator(newOperator, { from: admin });
        const getOperator = await treasury.getOperator();
        assert.equal(newOperator, getOperator);
      });
      it("Should not set new operator,if called not from admin", async () => {
        const newOperator = accounts[3];
        await truffleAssert.reverts(
          treasury.setOperator(newOperator, { from: operator }),
          null,
          "Treasury__NotAdmin"
        );
      });
    });
    describe("Set new Token", function () {
      it("Should properly set new token", async () => {
        token1 = await Tusd.new(1000000);
        const adr = token1.address;
        await treasury.setToken(token1.address, { from: admin });
        const newToken = await treasury.getTokenAddress();
        assert.equal(adr.toString(), newToken.toString());
      });
      it("Should not set if not admin or operator", async () => {
        const newOperator = accounts[3];
        //Just random address
        const tokenAddress = "0x1b008295c07511c85f90522e1f7bd0bc04a1ce35";
        await truffleAssert.reverts(
          treasury.setToken(tokenAddress, { from: newOperator }),
          null,
          "Treasury__NotAdminOrOperator"
        );
      });
    });
    describe("Set Percentage Of Burn", function () {
      it("Should proper set percentage", async () => {
        const newPercentage = 15;
        await treasury.setPercentageOfBurn(newPercentage, { from: admin });
        const newPercentageFromContract = await treasury.getPercentageOfBurn();
        assert.equal(
          newPercentage.toString(),
          newPercentageFromContract.toString()
        );
      });
      it("Should not set if not admin", async () => {
        await truffleAssert.reverts(
          treasury.setPercentageOfBurn(5, { from: operator }),
          null,
          "Treasury__NotAdmin"
        );
      });
      it("Shouldd not set if not proper percentage", async () => {
        await truffleAssert.reverts(
          treasury.setPercentageOfBurn(105, { from: admin }),
          null,
          "Treasury__PercentageCantBeMoreThanZero"
        );
      });
    });
    describe("Set Percentage Of Golden Ticket", function () {
      it("Should proper set percentage", async () => {
        const newPercentage = 15;
        await treasury.setPercentageOfGoldenTicket(newPercentage, {
          from: admin,
        });
        const newPercentageFromContract =
          await treasury.getPercentageOfGoldenTicket();
        assert.equal(newPercentage.toString(), newPercentageFromContract.toString());
      });
      it("Should not set if not admin", async () => {
        await truffleAssert.reverts(
          treasury.setPercentageOfGoldenTicket(5, { from: operator }),
          null,
          "Treasury__NotAdmin"
        );
      });
      it("Should not set if nor proper percentage", async () => {
        await truffleAssert.reverts(
          treasury.setPercentageOfGoldenTicket(105, { from: admin }),
          null,
          "Treasury__PercentageCantBeMoreThanZero"
        );
      });
    });
  });
  describe("Get functions", function () {
    it("Base getters", async () => {
      const tokenToTransfer = 100;
      const user = accounts[5];
      await token.transfer(treasury.address, tokenToTransfer, { from: admin });
      const adminFromContract = await treasury.getAdmin();
      const operatorFromContract = await treasury.getOperator();
      const tokenAddressFromContract = await treasury.getTokenAddress();
      const percentageOfBurnFromContract = await treasury.getPercentageOfBurn();
      const percentageOfGoldenTicketFromContract =
        await treasury.getPercentageOfGoldenTicket();
      const amountOfTokensFromContract =
        await treasury.getCurrentAmountOfTokens();
      assert.equal(admin, adminFromContract);
      assert.equal(operator, operatorFromContract);
      assert.equal(token.address, tokenAddressFromContract);
      assert.equal(percentageOfBurnFromContract, percentageOfBurn);
      assert.equal(percentageOfGoldenTicketFromContract, percentageOfGoldenTicket);
      assert.equal(tokenToTransfer, amountOfTokensFromContract);
    });
    it("Should proper return amount to burn", async () => {
      await token.transfer(treasury.address, 100, { from: admin });
      const currentBalanceCalculated = await token.balanceOf(treasury.address);
      const calculatedAmountToBurn = (currentBalanceCalculated * percentageOfBurn) / 100;
      const amountToBurn = await treasury.getAmountToBurn();
      assert.equal(calculatedAmountToBurn.toString(), amountToBurn.toString());
    });
    it("Should proper get amount of golden ticket", async () => {
      await token.transfer(treasury.address, 100, { from: admin });
      const currentBalanceCalculated = await token.balanceOf(treasury.address);
      const calculatedAmountOfGoldenTicket = (currentBalanceCalculated * percentageOfGoldenTicket) / 100;
      const amountOfGoldenTicket = await treasury.getAmountOfGoldenTicket();
      assert.equal(calculatedAmountOfGoldenTicket.toString(), amountOfGoldenTicket.toString()
      );
    });
  });
  describe("Weekly calculations", function () {
    //TODO need to calculate later with hardhat using
    // it("Should properly calculate rewards for user", async () => {
    //   await token.transfer(treasury.address, 300000000000, { from: admin });
    //   const currentBalanceCalculated = await token.balanceOf(treasury.address);
    //   console.log(currentBalanceCalculated.toString());
    //   const _userWallets = [user1, user2];
    //   const weights = [10, 15];
    //   let calculatedUserTokensToWithdraw = [];
    //   for (let i = 0; i < _userWallets.length; i++) {
    //     calculatedUserTokensToWithdraw[i] =
    //       (currentBalanceCalculated * weights[i]) / 10000;
    //   }
    //   const trxResponse = await treasury.weeklyCalculation(
    //     _userWallets,
    //     weights,
    //     { from: admin }
    //   );

    //   console.log(trxResponse);
    //   const balanceOfUser1 = await token.balanceOf(user1);
    //   const balanceOfUser2 = await token.balanceOf(user2);
    //   assert.equal(
    //     calculatedUserTokensToWithdraw[0].toString(),
    //     balanceOfUser1.toString()
    //   );
    //   assert.equal(
    //     calculatedUserTokensToWithdraw[1].toString(),
    //     balanceOfUser2.toString()
    //   );
    // });
    it("Should get revert if lengths not equal", async () => {
      const _userWallets = [user1, user2];
      const weights = [10, 15, 20];
      await truffleAssert.reverts(
        treasury.weeklyCalculation(goldenTicketWinner, _userWallets, weights, { from: admin }),
        null,
        "Treasury__MustBeEqualLength"
      );
    });
    it("Should revert if percentage>100", async () => {});
  });
  //TODO need to transfer project to hardhat
  // describe("Iswap Router", function () {
  //   it("Should properly swap", async () => {
  //     await hre.network.provider.request({
  //       method: "hardhat_impersonateAccount",
  //       params: [TUSD_HOLDER],
  //     });
  //     const impersonateSigner = await ethers.getSigner(TUSD_HOLDER);
  //     console.log(impersonateSigner.address);
  //   });
  // });
});
