const Treasury = artifacts.require("Treasury");
const Tusd = artifacts.require("TUSD");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("Treasury", (accounts) => {
  let token;
  let treasury;
  const admin = accounts[1];
  const operator = accounts[2];
  const percentageOfBurn = 10;
  const percentageOfGoldenTicket = 10;

  beforeEach("Should setup the instance of contract", async () => {
    token = await Tusd.new(1000);
    treasury = await Treasury.new(
      admin,
      operator,
      token.address,
      percentageOfBurn,
      percentageOfGoldenTicket
    );
  });

  describe("Contructor", function () {
    it("Should set proper variables", async () => {
      const adminFromTest = await treasury.getAdmin();
      const operatorFromTest = await treasury.getOperator();
      const tokenAddressFromTest = await treasury.getTokenAddress();
      const percentageOfBurnFromTest = await treasury.getPercentageOfBurn();
      const percentageOfGoldenTicketFromTest =
        await treasury.getPercentageOfGoldenTicket();
      assert.equal(adminFromTest, admin);
      assert.equal(operatorFromTest, operator);
      assert.equal(tokenAddressFromTest, token.address);
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

      //TODO need to fix it
      it("Should not set new operator if address is empty", async () => {
        await truffleAssert.fails(
          treasury.setOperator(0x00, { from: admin }),
          truffleAssert.ErrorType.REVERT,
          "invalid address"
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
      //TODO need to complete
      it("Should not set if address is zero", async () => {});
    });
  });
});
