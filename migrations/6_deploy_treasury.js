const token = artifacts.require("TUSD");
const Treasury = artifacts.require("Treasury");
const percentageOfBurn = 10;
const percentageOfGoldenTicket = 20;

module.exports = async function (deployer) {
  let accounts = await web3.eth.getAccounts();
  const admin = accounts[1];
  const operator = accounts[2];
  deployer.deploy(
    Treasury,
    admin,
    operator,
    token.address,
    percentageOfBurn,
    percentageOfGoldenTicket
  );
};
