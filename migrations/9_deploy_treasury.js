const stableCoin = '0x912aAEA32355DA6FeB20D98E73B9C81B5afd6A2e';
const Treasury = artifacts.require("Treasury");
const act = '0x9AE51260C3824ADc9DD9F02Bc4D6B9e5Eddeb406';
const percentageOfBurn = 5;
const percentageOfGoldenTicket = 10;

module.exports = async function (deployer) {
  let accounts = await web3.eth.getAccounts();
  const admin = accounts[1];
  const operator = accounts[2];
  deployer.deploy(
    Treasury,
    admin,
    operator,
    stableCoin,
    act,
    percentageOfBurn,
    percentageOfGoldenTicket
  );
};
