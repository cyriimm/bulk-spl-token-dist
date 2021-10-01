# BULK-SPL-Token-Distributor

To run:

- yarn install
- yarn start
- Login with sollet
- Select a token 
- Select Send
- Enter an Amount (This will be the amount sent per wallet) 
- Upload a csv( comma separated) file of public keys to send to 
- The process of bulk sending will begin thereafter (there is no need to click on 'Send') 
- If a transaction(tx) fails the receiver address will be logged in the error box 

# Potential Upgrades

- Sometimes a tx will show a 'timeout' error (but still have processed successfully --> In this case the receiver address will still appear in the error box <> Fix here is to account for this as not being an 'error'

- Allow for a different amount to be sent per wallet. This could be done by having another column in the csv that is parsed with an amount next to each public key wallet address

- Allow for a different token to be sent per wallet. This could be done by having another column in the csv that is parsed with the token address next to each public key wallet address. This is particularly good for when dealing with NFT launches.

- Have a CLI version that accepts a json or csv input and can be run from the terminal (with logging of error transaction receiver addresses) 

 
