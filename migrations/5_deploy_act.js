const ACT = artifacts.require("Act");

module.exports = function (deployer) {
    deployer.deploy(ACT, "1000000000000000000000000000");
};
