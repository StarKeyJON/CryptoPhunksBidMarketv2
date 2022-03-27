# CryptoPhunksBidMarketv2
An adaptation of the Cryptophunks marketpalce contract found https://etherscan.io/address/0xd6c037bE7FA60587e174db7A6710f7635d2971e7#code

The current cryptophunks contract only allows for single bids at a time. 

This is an adaptation of the contract to enable multiple orders in one call.

I mainly added multi-dimensional arrays as calldata into the functions, wrapped the function bodies in an iterator of the calldata index array length, and moved the msg.value check in the buyPhunk function to outside of the iteration while adding a totalValue variable inside of that function that increments the bid value. (This will add the total bids values in the array and then check against the msg.value as a last requirement for the function to execute.)

For the testing I used a nft contract I already created along with a mint contract to mint test nfts. I then initialized the phunk bids contract with the test nfts as the phunk contract and listed 10 nfts on the marketplace.
I then proceeded to interact with each function between two test addresses.

Naive test of each function has passed.
