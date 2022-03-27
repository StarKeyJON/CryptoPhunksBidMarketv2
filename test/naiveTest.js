/* eslint-disable prettier/prettier */

const { BigNumber } = require("ethers");
/* eslint-disable prettier/prettier */
const { ethers } = require("hardhat");
const { use } = require("chai");
const { solidity } = require("ethereum-waffle");
require("hardhat-gas-reporter");

use(solidity);
describe("PhunksBids Contract Unit Test", function() {
  
  it("Should interact with the PhunksBids contract.", async function() {
    before((done) => {
      setTimeout(done, 2000);
    });
    const [deployer] = await ethers.getSigners();
    console.log(deployer.address)
    const [test, test2] = await ethers.getSigners();
    console.log(test.address, test2.address)

    const TempMint = await ethers.getContractFactory("TempMint");
    const mint = await TempMint.deploy(deployer.address);
    await mint.deployed();
    const mintAddress = mint.address;
    console.log("TempMint provider Address is: ", mintAddress);

    const NFT = await ethers.getContractFactory("PhamNFTs");
    const phamNft = await NFT.deploy(deployer.address, deployer.address, mintAddress,  "https://gateway.pinata.cloud/ipfs/QmZKAYAmDfm26bQREKi7qbSxhLb972v32j6YdpwoQtJ1uo/", 125);
    await phamNft.deployed()
    const phamNftContractAddress = phamNft.address;
    console.log("PhamNFTs Contract Address: "+ phamNftContractAddress)

    const PhunksBidsv2 = await ethers.getContractFactory("CryptoPhunksMarket");
    const phunkv2 = await PhunksBidsv2.deploy(phamNftContractAddress);
    await phunkv2.deployed();
    const phunkBidsAddress = phunkv2.address;
    console.log("Phunks Bids v2 Contract Address is: ", phunkBidsAddress);

    await mint.setNftAddress(phamNftContractAddress)
  
    console.log("All contracts are now deployed and operational!!")
    
    console.log("")
    console.log("|__________Mint Price____________|")
    console.log("|                                |")
    await mint.fetchMintPrice().then(res=>{
        const wei = BigNumber.from(res);
        console.log("|            ",ethers.utils.formatEther(wei,"ether"),"               |")
    })
    console.log("|                                |")
    console.log("|____________________________|")
        console.log("")
  await mint.redeemForNft(16, [
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
      test.address,
    ])

    console.log("___________Internal Memory___________")
    await mint.fetchNFTsCreated().then(ack=>{
        ack.forEach(res=>{
            console.log({
                tokenId: res.tokenId.toNumber(),
                contractAddress: res.contractAddress,
                minter: res.minter
            })
        })
    })
    await phamNft.setApprovalForAll(phunkBidsAddress, true);
    console.log("Successfully set approval")

    //*~~~> offerPhunkForSale(uint[] calldata phunkIndex, uint[] calldata minSalePriceInWei)
    await phunkv2.offerPhunkForSale([1,2,3,4,5],[ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether")]);
    console.log("Offered 5 Phunks for sale a 1 ETH each!");

    await phunkv2.offerPhunkForSale([6,7,8,9,10],[ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether")]);
    console.log("Offered 5 more Phunks for sale a 1 ETH each!");

    //*~~~> offerPhunkForSaleToAddress(uint[] calldata phunkIndex, uint[] calldata minSalePriceInWei, address[] calldata toAddress)
    await phunkv2.offerPhunkForSaleToAddress([6,7,8], [ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether"),ethers.utils.parseUnits("1","ether")], [test2.address,test2.address,test2.address]);
    console.log("Successfully offered 3 phunks for sale to test address 2 for 1 eth each!");

    //*~~~> buyPhunk(uint[] calldata phunkIndex)
    await phunkv2.connect(test2).buyPhunk([1,2,3],{value:ethers.utils.parseUnits("3","ether")});
    console.log("Test2 account successfully purchased 3 of the listed phunks")

    //*~~~> enterBidForPhunk(uint phunkIndex)
    await phunkv2.connect(test2).enterBidForPhunk(4,{value: ethers.utils.parseUnits("2","ether")})
    console.log("Successfully entered a bid on phunk 4")
    await phunkv2.connect(test2).enterBidForPhunk(5,{value: ethers.utils.parseUnits("2","ether")})
    console.log("Successfully entered a bid on phunk 5")

    //*~~~> acceptBidForPhunk(uint[] calldata phunkIndex, uint[] calldata minPrice)
    await phunkv2.acceptBidForPhunk([4,5], [ethers.utils.parseUnits("2","ether"),ethers.utils.parseUnits("2","ether")])
    console.log("Successfully accepted 2 bids");

    //*~~~> enterBidForPhunk(uint phunkIndex)
    await phunkv2.connect(test2).enterBidForPhunk(6,{value: ethers.utils.parseUnits("2","ether")})
    console.log("Successfully entered a bid on phunk 6")
    await phunkv2.connect(test2).enterBidForPhunk(7,{value: ethers.utils.parseUnits("2","ether")})
    console.log("Successfully entered a bid on phunk 7")

    //*~~~> function withdrawBidForPhunk(uint phunkIndex)
    await phunkv2.connect(test2).withdrawBidForPhunk(6)
    console.log("Successfully withdrew bid for phunk 6")

    await phunkv2.connect(test2).withdrawBidForPhunk(7)
    console.log("Successfully withdrew bid for phunk 7")


})})
