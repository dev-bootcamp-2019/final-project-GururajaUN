const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'rare garlic capable sand sun place select great chronic front text caution';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/2cbf2d6f722140e79bc606385fe1f9db")
      },
      network_id: 4,
      gas: 4700000
    },  
  },
  compilers: {
    solc: {
      version: "0.4.24",
    },
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts")
};

