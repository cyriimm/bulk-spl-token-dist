import React, { useContext, useState, useEffect } from 'react';

//imports

import { Connection, PublicKey } from '@solana/web3.js';
import { ConnectionContext, useConnection } from '../utils/connection';
import { parseMintData, parseTokenAccountData } from '../utils/tokens/data';
import { TOKEN_PROGRAM_ID } from '../utils/tokens/instructions';
import _ from 'lodash';
import Queue from '../utils/Queue';
import { getTokenInfo, useTokenInfos } from '../utils/tokens/names';
import { WalletGiftcard } from 'mdi-material-ui';
import { resolve } from 'path';
import { findAssociatedTokenAddress, transferTokens } from '../utils/tokens';
import { useWallet } from '../utils/wallet';
import { useSendTransaction } from '../utils/notifications';
import CSVReader from 'react-csv-reader';

function MultiTokenSender() {
  const [sendTransaction, sending] = useSendTransaction();
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [successResult, sets] = useState([]);

  // const [items, setItems] = useState([
  //   {
  //     name: 'usdc',
  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdt',

  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: '6AdCQrMEbqoucMeBj64BNE78FmZoocHipJr2eaP8MwWV',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdc',
  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdt',

  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: '6AdCQrMEbqoucMeBj64BNE78FmZoocHipJr2eaP8MwWV',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdc',
  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdt',

  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: '6AdCQrMEbqoucMeBj64BNE78FmZoocHipJr2eaP8MwWV',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdc',
  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdc',
  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdc',
  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //     amountToSend: '1',
  //   },
  //   {
  //     name: 'usdc',
  //     toAddress: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //     spl_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  //     amountToSend: '1',
  //   },
  //   // {
  //   //   name: 'serum',
  //   //   to: 'GHGixvqXFDqDVDZ4tkZk4sL3g4U93dAKuFcRKan2F76N',
  //   //   spl_address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
  //   //   amountToSend: '40',
  //   // }
  // ]);

  const [queue, setQueue] = useState('');
  let context = useContext(ConnectionContext);
  const tokenInfos = useTokenInfos();

  const wallet = useWallet();
  const { endpoint, setEndpoint, connection } = context;

  useEffect(() => {
    if (data) {
      loadToQueue();
    }
    return () => {};
  }, [data]);

  const mapDataToState = (data) => {
    const mappedData = data.map((item) => ({
      id: item[0],

      toAddress: item[1],
      spl_address: item[2],
      amountToSend: item[3],
    }));

    setData(mappedData);
  };

  const loadToQueue = () => {
    const queue = new Queue();
    data.map((item) => {
      const send = () => {
        return async () => {
          try {
            const mint = new PublicKey(item.spl_address);
            const sourcePublicKey = await findAssociatedTokenAddress(
              wallet.publicKey,
              mint,
            );

            const accountInfo = await connection.getAccountInfo(
              sourcePublicKey,
            );
            const mintInfo = await connection.getAccountInfo(mint);
            // const infos = getTokenInfo(mint, endpoint, tokenInfos);
            let { decimals } = parseMintData(mintInfo.data);
            const amountToSend = (item.amount = Math.round(
              parseFloat(item.amountToSend) * 10 ** decimals,
            ));
            let { owner, amount } = accountInfo?.owner.equals(TOKEN_PROGRAM_ID)
              ? parseTokenAccountData(accountInfo.data)
              : {};

            const transaction = {
              wallet,
              amountToSend,
              mint,
              decimals,
              override: true,
              destinationPublicKey: new PublicKey(item.toAddress),
            };

            const tx = {
              connection,
              owner: wallet,
              sourcePublicKey: sourcePublicKey,
              destinationPublicKey: transaction.destinationPublicKey,
              amount: amountToSend,
              memo: '',
              mint: mint,
              decimals: decimals,
              overrideDestinationCheck: true,
            };

            const result = await sendTransaction(transferTokens(tx));
          } catch (error) {
            console.log(error);
          }
        };
      };

      queue.populateData([send(), item]);
      console.log(queue);
    });
    setQueue(queue);
    //   });
  };

  const beginSend = () => {
    queue.subscribe(setLogs);
    console.log(queue);
    setInterval(() => {
      queue.run();
    }, 3000);
  };

  return (
    <>
      <h3 style={{ display: 'flex', padding: '1rem', fontWeight: 'bold' }}>
        Multi Token Sender
      </h3>
      <div style={{ display: 'flex', padding: '1rem' }}>
        <CSVReader
          onFileLoaded={(data, fileInfo) => {
            console.dir(data);
            mapDataToState(data);
          }}
          style={{ marginTop: '1.5rem' }}
        ></CSVReader>

        <button disabled={!data} onClick={beginSend}>
          Send
        </button>
      </div>
    </>
  );
}

export default MultiTokenSender;
