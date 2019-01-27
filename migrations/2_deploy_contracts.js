var EmploymentVerification = artifacts.require("./EmploymentVerification.sol");

module.exports = function(deployer) {
  deployer.deploy(EmploymentVerification,"0x53Ff00E0A7c06b5a827c6c04a3a3E66c91DFaD4c","0xD7Ec20ff0E16fC7B20e79Ae788CDdB159761F8B2");
};
