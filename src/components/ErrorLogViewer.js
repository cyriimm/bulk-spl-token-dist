import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TextareaAutosize, Paper } from '@material-ui/core';
import EventEmitter from "reactjs-eventemitter";

export default function ErrorLogViewer(){
    const spacing = 24;
    const [errorAddresses, setErrorAddress] = useState([]);
    const [errorAddressString, setErrorAddressString] = useState('');
    const [lastOkAddress, setLastOkAddress] = useState('');
    const [totalSuccess, setTotalSuccess] = useState(0);
    const [totalErrors, setTotalErrors] = useState(0);


    useEffect( ()=>{



        EventEmitter.subscribe('ERROR_ADDRESS', errorAddress => {

            console.log('ERROR ADDRESS', errorAddress);
            if(errorAddress!=null && errorAddress!==''){

                setErrorAddressString((prevState) =>{
                    let addressStr =prevState;
                    addressStr += errorAddress;
                    return addressStr += "\n";
                });
              
                setTotalErrors((prevState)=> {

                    return prevState + 1;
                });
    
            }else{}      
            
        
        });
    
        EventEmitter.subscribe('SUCCESS_ADDRESS', okAddress => {
    
            setLastOkAddress(okAddress);
           
            setTotalSuccess((prevState) => {

                return prevState + 1;
            });     
            
        
        })




    }, [])






    // Emitter.on('ERROR_ADDRESS', (errorAddress) => {
    //     console.log('ERROR ADDRESS', errorAddress);
    //     if(errorAddress!=null && errorAddress!=''){

    //         let addressStr = errorAddressString;

    //         addressStr += errorAddress +',';
    
    //         setErrorAddressString(addressStr);
    //         let totalError = totalErrors + 1;
    //         setTotalErrors(totalError);

    //     }else{}

    // });
    
    // Emitter.on('SUCCESS_ADDRESS', (okAddress) => {

    //     setLastOkAddress(okAddress);
    //     let totalSuccessVal = totalSuccess+1;
        
    //     setTotalSuccess(totalSuccessVal);


    // });

    // useEffect(()=> {



    // }, [])

    function updateErrorLogViewer(address){

        console.log('error here...', address);
    }

    return (

        <div style={{ display: 'flex', width: "100%" }}>
                {/* Last Successful Airdrop Address:  {lastOkAddress}
                <p></p>
                Successfully Completed Airdrops:  {totalSuccess}
                <p></p>
                Unsuccessful Airdrops:  {totalErrors} */}

            <Paper  style={{ width: "100%"}}  >
                Last Successful Airdrop Address:  {lastOkAddress}
                Last Successful Airdrop Address:  {lastOkAddress}
                <p></p>
                Successfully Completed Airdrops:  {totalSuccess}
                <p></p>
                Unsuccessful Airdrops:  {totalErrors}
                <p></p>
                <TextareaAutosize aria-label="empty textarea" defaultValue={errorAddressString} placeholder="Unprocessed addresses will appear here." style={{ width: "100%", height:"500px" }} /> 
             </Paper>   
                   
        
        </div>


    );



}