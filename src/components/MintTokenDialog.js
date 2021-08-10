import React, { useEffect, useRef, useState } from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogForm from './DialogForm';
import { PublicKey } from '@solana/web3.js';
import { abbreviateAddress } from '../utils/utils';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useCallAsync, useSendTransaction } from '../utils/notifications';
import { swapApiRequest, useSwapApiGet } from '../utils/swap/api';
import { showSwapAddress } from '../utils/config';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  ConnectToMetamaskButton,
  getErc20Balance,
  useEthAccount,
  withdrawEth,
} from '../utils/swap/eth';
import {
    refreshWalletPublicKeys,
    useBalanceInfo,
    useWallet
  } from '../utils/wallet';
import { useConnection, useIsProdNetwork } from '../utils/connection';
import { useUpdateTokenName } from '../utils/tokens/names';
import { Account, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createAndInitializeMint } from '../utils/tokens';

export default function MintTokenDialog({open, onClose, publicKey}){

    const updateTokenName = useUpdateTokenName();
    const isProdNetwork = useIsProdNetwork();
    const [tab, setTab] = useState('spl');
    const [name, setName] = useState('name');
    const [symbol, setSymbol] = useState('symbol');
    const [amount, setAmount] = useState('amount');
    const [decimals, setDecimals] = useState('decimals');
    const [sendTransaction, sending] = useSendTransaction();

    const wallet = useWallet();

  
    const onSubmitRef = useRef();
    const ethAccount = useEthAccount();

    function mintTestToken() {
        console.log(name,symbol,amount,decimals);
        let mint = new Account();
        updateTokenName(
          mint.publicKey,
          name,
          symbol,
        );
        sendTransaction(
          createAndInitializeMint({
            connection: wallet.connection,
            owner: wallet,
            mint,
            amount: (Number(amount)*1000000),
            decimals: 6,
            initialAccount: new Account(),
          }),
          { onSuccess: (e) => {console.log('event:'+e);refreshWalletPublicKeys(wallet)} },
        );
      
    
      }


    return (
        <>
            <DialogForm
                open={open}
                onClose={onClose}
                onSubmit={() => onSubmitRef.current()}
                fullWidth
            >

                <DialogTitle>
                    MINT A TOKEN (6 Decimals)
                </DialogTitle>
                <DialogContent style={{ paddingTop: 16}}>
                <TextField
                    label='Name'
                 
                    onChange={(e) => setName(e.target.value.trim())}
                ></TextField>
                <TextField
                    label='Symbol'
                 
                    onChange={(e) => setSymbol(e.target.value.trim())}
                ></TextField>
                <TextField
                    label='Amount'
              
                    onChange={(e) => setAmount(e.target.value.trim())}
                ></TextField> 
                {/* <TextField
                    label='Decimals'
                    
                    onChange={(e) => setDecimals(e.target.value.trim())}
                ></TextField>                                                    */}
                </DialogContent>

                <DialogActions>
                    <Button onClick={mintTestToken}>Mint</Button>
                </DialogActions>


            </DialogForm>
        </>



    );





}