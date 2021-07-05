const Preservation = artifacts.require("Preservation");
const LibraryContract = artifacts.require("LibraryContract");

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  let timeZone1LibraryAddress, timeZone2LibraryAddress;
  _deployer
    .deploy(LibraryContract)
    .then(function (library) {
      timeZone1LibraryAddress = library.address;
      return _deployer.deploy(LibraryContract);
    })
    .then(function (library) {
      timeZone2LibraryAddress = library.address;
      return _deployer.deploy(Preservation, timeZone1LibraryAddress, timeZone2LibraryAddress);
    });
};
