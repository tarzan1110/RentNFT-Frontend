import styled from "styled-components";
import {useEffect, useState} from 'react'
import moment from 'moment'
import { useNavigate } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api ,useNewMoralisObject ,useMoralisQuery } from 'react-moralis';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Icon30x30 } from '../Icon';
import { Button, Input , Select} from "components";
import { unpackPrice ,packPrice} from "@renft/sdk";
import { mobile } from 'utils'
import { Actions } from "store/types";
import defaultNftImg from '../../assets/empty_image.jpg'
import { ABI, NFT_ABI, CONTRACT_ADDRESS, ERC721ABI, initWeb3, Networks, SYSTEM_ADDR, SYSTEM_PK, TOKENS_BY_NETWORK, WETH_CONTRACT } from "config/init"
import USDT_CONFIG from 'config/USDT.json'

type CAHIN_TYPE = "eth" | "0x1" | "ropsten" | "0x3" | "rinkeby" | "0x4" | "goerli" | "0x5" | "kovan" | "0x2a" | "polygon" | "0x89" | "mumbai" | "0x13881" | "bsc" | "0x38" | "bsc testnet" | "0x61" | "avalanche" | "0xa86a" | "avalanche testnet" | "0xa869" | "fantom" | "0xfa" | undefined

const NFTDetail: React.FC<any> = (props) => {
  const { setShowModal, data, setConfirm, action,metaData } = props;
  const navigate = useNavigate();
  const { Moralis, account } = useMoralis();
  const Web3Api = useMoralisWeb3Api();  
  const [lendMaxDays, setLendMaxDays] = useState(0)
  const [rentDuration, setRentDuration] = useState(0)
  const [lendDailyPrice, setLendDailyPrice] = useState(0)
  const [collateral, setCollateral] = useState(0)
  const [paymentToken, setPaymentToken] = useState("4")
  const [imageUri, setImageUri] = useState(null)
  
  const { save } = useNewMoralisObject("lend_records");

  const { fetch:fetchLendRecord } = useMoralisQuery(
    "lend_records",
    (query) =>
      query.equalTo("token_id",data.token_id),
    [],
    { autoFetch: false }
  );

  const { fetch } = useMoralisQuery(
    "lend_records_sync",
    (query) =>
      query.equalTo("tokenId",data.token_id),
    [],
    { autoFetch: false }
  );

  const updateLendRecordForRent = async () => {
    try{
      const lendRecords =await fetchLendRecord()
      const selectedLendRecord = lendRecords[0]
      selectedLendRecord.set("status","rent")
      selectedLendRecord.set("rent_date",(new Date()))
      selectedLendRecord.save()
    } catch(error){
      console.log("update rent record failure.")
    }
 } 

 const updateLendRecordForStop = async () => {
  try{
    const lendRecords =await fetchLendRecord()
    const selectedLendRecord = lendRecords[0]
    selectedLendRecord.destroy()


    const results = await fetch();
    const targetSyncRecord = results[0]
    targetSyncRecord.destroy()
    // const lendingId = results[0].attributes.lendingId

    // selectedLendRecord.set("status","rent")
    // selectedLendRecord.set("rent_date",(new Date()))
    // selectedLendRecord.save()
  } catch(error){
    console.log("remove record failure.")
  }
} 

 const updateLendRecordForPayback= async () => {
  try{
    const lendRecords =await fetchLendRecord()
    const selectedLendRecord = lendRecords[0]
    selectedLendRecord.set("status","lend")
    selectedLendRecord.set("payback_date",(new Date()))
    selectedLendRecord.save()
    
  } catch(error){
    console.log("update payback record failure.")
  }
  
} 


  useEffect(()=>{
    const fetchTokenIdMetadata = async () => {
      const options = {
        address: data.token_address,
        token_id: data.token_id,
        chain: "rinkeby" as CAHIN_TYPE,
      };
      const tokenIdMetadata = await Web3Api.token.getTokenIdMetadata(options);
      setImageUri(tokenIdMetadata.token_uri)
    };
    fetchTokenIdMetadata()
  },[data])

  const rentNFT=async ()=>{
    try {      
      const results = await fetch();
      const lendingId = results[0].attributes.lendingId
      if(lendingId){
        const finalParams = {
          _nfts: [data.token_address],
          _tokenIds:  [data.token_id],
          _lendingIds: [lendingId],
          _rentDurations: [Number(rentDuration)]
         }
        let options = {
          contractAddress: "0x103c497e799C099F915EF39CDf0A3E99E5b47216",
          functionName: "rent",
          abi: ABI,
          params: finalParams
         };
        await approvePayment()
        console.log("Payment is approved!")
        const message = await Moralis.executeFunction(options);
        await updateLendRecordForRent()
        NotificationManager.success("RENT Success!")
      }
    } catch (error) {
      console.log("error on rentNFT--->,error",error.message)
      // NotificationManager.error("RENT Failure")
      return error
    }
  }

  const paybackNFT=async ()=>{
    try {      
      const results = await fetch();
      const lendingId = results[0].attributes.lendingId
      if(lendingId){
        const finalParams = {
          _nfts: [data.token_address],
          _tokenIds:  [data.token_id],
          _lendingIds: [lendingId],
        }
        let options = {
          contractAddress: "0x103c497e799C099F915EF39CDf0A3E99E5b47216",
          functionName: "returnIt",
          abi: ABI,
          params: finalParams
         };
        await approveNFT()
        console.log("NFT payback is approved!")
        const message = await Moralis.executeFunction(options);
        await updateLendRecordForPayback()
        NotificationManager.success("Payback Success!")
      }
    } catch (error) {
      // console.log("error on rentNFT--->,error",error)
      // NotificationManager.success("Payback failure!")
      return error
    }
  }

  const stopLendingNft=async ()=>{
    try {      
      const results = await fetch();
      const lendingId = results[0].attributes.lendingId
      if(lendingId){
        const finalParams = {
          _nfts: [data.token_address],
          _tokenIds:  [data.token_id],
          _lendingIds: [lendingId],
        }
        let options = {
          contractAddress: "0x103c497e799C099F915EF39CDf0A3E99E5b47216",
          functionName: "stopLending",
          abi: ABI,
          params: finalParams
         };
        // await approveNFT()
        console.log("NFT stopLending is approved!")
        const message = await Moralis.executeFunction(options);
        await updateLendRecordForStop()
        NotificationManager.success("Stop Lending Success!")
      }
    } catch (error) {
      // console.log("error on rentNFT--->,error",error)
      // NotificationManager.success("Payback failure!")
      return error
    }
  }

  const claimNFT=async ()=>{
    try {      
      const results = await fetch();
      const lendingId = results[0].attributes.lendingId
      if(lendingId){
        const finalParams = {
          _nfts: [data.token_address],
          _tokenIds:  [data.token_id],
          _lendingIds: [lendingId],
        }
        let options = {
          contractAddress: "0x103c497e799C099F915EF39CDf0A3E99E5b47216",
          functionName: "claimCollateral",
          abi: ABI,
          params: finalParams
         };
        const message = await Moralis.executeFunction(options);
        NotificationManager.success("Claim Success!")
        // await updateLendRecordForPayback()
      }
    } catch (error) {
      // console.log("error on claim-xxxxxxxxxxxxxxxxx-->,error",error.message)
      // toast("Wow so easy!");
      NotificationManager.error("ReNFT::return date not passed")
      // return error
    }
  }

  const onConfirm =async ()=>{
    if (action==="LEND_NFT"){
     await lendNft()
    
    }
    if (action==="BUY_NFT"){
      await rentNFT()
    }
    if (action === Actions.PAYBACK_NFT){
      await paybackNFT()
    }
    if (action === Actions.CLAIM_NFT){
      await claimNFT()
    }
    if (action === Actions.STOP_LENDING){
      await stopLendingNft()
    }
  }
  const saveToDb = async ()=>{
    console.log("saveToDb is started.......")
    const LendRecord = Moralis.Object.extend("lend_records");
    const lendRecord = new LendRecord();
    console.log('data---on save toDB--->', data)
    lendRecord
      .save({
        lender:account,
        token_id: data.token_id,
        token_address: data.token_address,
        daily_price: lendDailyPrice,
        max_days: lendMaxDays,
        collateral: collateral,
        image_url: metaData?.extractedUrl,
        paymentToken:paymentToken,
        status:"lend"
      })
      .then(
        (record) => {
          console.log("saved record--------->",record)
          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      );
  }

  const lendNft =async ()=>{
    await approveNFT()
    const resultPrice = packPrice(lendDailyPrice)
    
    console.log("data from nft---->",data)
    if(lendDailyPrice>0 && lendMaxDays>0 && collateral>0){
      console.log("contract success....")
      try {
        const finalParams = {
          _nfts: [data.token_address],
          _tokenIds: [data.token_id],
          _lendAmounts: [1],
          _maxRentDurations: [Number(lendMaxDays)],
          _dailyRentPrices: [packPrice(lendDailyPrice)],
          _nftPrices: [packPrice(collateral)],
          _paymentTokens: [Number(paymentToken)]
         }
        
        let options = {
          contractAddress: "0x103c497e799C099F915EF39CDf0A3E99E5b47216",
          functionName: "lend",
          abi: ABI,
          params: finalParams
         };
         console.log("options.params----->",options.params)
         const message = await Moralis.executeFunction(options);
         saveToDb()
         NotificationManager.success("Listing Success!")
      } catch (error) {
        console.log("error on fire--->,error",error)
        return error
      }
    }
    
  }
  const onChangePaymentToken = (e)=>{
     console.log("type of payment-- ",typeof e.target.value)
     setPaymentToken(e.target.value)
  }
  const approveNFT = async () =>{
    console.log("approveNFT data.token_address------------>", data.token_address)
    const approve_request = {
      chain: "rinkeby",
      contractAddress: data.token_address,
      functionName: "setApprovalForAll",
      abi: ERC721ABI,
      // abi: mint721ABI.abi,
      params: {
        to:"0x103c497e799C099F915EF39CDf0A3E99E5b47216",
        approved: true
      },
    }
    console.log('approve_request', approve_request);
    try {
      const result = await Moralis.executeFunction(approve_request)
      // setIsFullLoading(false);
    } catch(e) {
      console.log('eeeeeeeeeeeee', e)
      // setIsFullLoading(false);
      return false;
    }
  }

  const approvePayment = async () =>{
    
    const approve_request = {
      chain: "rinkeby",
      contractAddress: USDT_CONFIG.address,
      functionName: "approve",
      abi: USDT_CONFIG.abi,
      // abi: mint721ABI.abi,
      params: {
        spender:"0x103c497e799C099F915EF39CDf0A3E99E5b47216",
        amount: 99999999999
      },
    }
    console.log('approve_request', approve_request);
    try {
      const result = await Moralis.executeFunction(approve_request)
      // setIsFullLoading(false);
    } catch(e) {
      console.log('eeeeeeeeeeeee', e)
      // setIsFullLoading(false);
      return false;
    }
  }

  // const approvePayback = async () =>{
    
  //   const approve_request = {
  //     chain: "rinkeby",
  //     contractAddress: USDT_CONFIG.address,
  //     functionName: "approve",
  //     abi: USDT_CONFIG.abi,
  //     // abi: mint721ABI.abi,
  //     params: {
  //       spender:"0x103c497e799C099F915EF39CDf0A3E99E5b47216",
  //       amount: 99999999999
  //     },
  //   }
  //   console.log('approve_request', approve_request);
  //   try {
  //     const result = await Moralis.executeFunction(approve_request)
  //     // setIsFullLoading(false);
  //   } catch(e) {
  //     console.log('eeeeeeeeeeeee', e)
  //     // setIsFullLoading(false);
  //     return false;
  //   }
  // }

  const getTitle = ()=>{
    console.log("action in get Title ---->",action)
    if (action==="LEND_NFT"){
      return "LEND NFT"
    }
    if (action==="BUY_NFT"){
      return "RENT NFT"
    }
    if (action=== Actions.PAYBACK_NFT){
      return "PAYBACK NFT"
    }
    if (action=== Actions.CLAIM_NFT){
      return "CLAIM NFT"
    }
    if (action=== Actions.STOP_LENDING){
      return "STOP NFT LENDING"
    }
    
  }

  return (
    <Container>
      <Title>
        <Icon30x30 src="icons/logo.svg" />
        <Span>{getTitle()}</Span>
        <Icon30x30
          src="icons/close.svg"
          onClick={() => setShowModal(false)}
        />
      </Title>
      <Content>
        <Section>
          {
            action === Actions.LEND_NFT ?
            <Img src={metaData.extractedUrl || defaultNftImg} />:
            <Img src={data.image_url || defaultNftImg} />             
          }
        </Section>
        <Section>
          <Block>
            <Lender>
              <Text>{data.lenderAdd ? "Lender" : ""}</Text>
              <A
                href={data.lenderAdd ? "https://etherscan.io/address/" + data.lenderAdd : ""}
                target="_blank"
              >
                {data.lenderAdd ? data.lenderAdd.slice(0, 5) + "..." + data.lenderAdd.slice(data.lenderAdd.length - 3) : ""}
              </A>
            </Lender>
            <TextClick
              onClick={() => {
                if (action === Actions.BUY_NFT) {
                  navigate("/Collections/" + data.author)
                  setShowModal(false)
                }
              }}
            >
              {data.author}
            </TextClick>
            <TextBlack>{data.title}</TextBlack>
            {/* <A
              href={data.contractAdd ? "https://etherscan.io/address/" + data.contractAdd : ""}
              target="_blank"
            >
              {data.contractAdd ? data.contractAdd.slice(0, 5) + "..." + data.contractAdd.slice(data.contractAdd.length - 3) : ""}
            </A> */}
          </Block>
          {action === Actions.BUY_NFT && <Block>
            <Input
              title="Rent Duration"
              unit="Days"
              value={rentDuration}
              onChange={(e)=>{setRentDuration(e.target.value)}}
            />
            <Line>
              <Text>Max Duration </Text>
              <Text>{data.max_days} Days</Text>
            </Line>
            <Line>
              <Text>Daily price</Text>
              <Text>{data.daily_price} {data.priceUnit}</Text>
            </Line>
            <Line>
              <Text>Collateral</Text>
              <Text>{data.collateral} {data.priceUnit}</Text>
            </Line>
          </Block>}
          {action === Actions.LEND_NFT && <Block>
            <Input
              title="Max Duration"
              unit="Days"
              value={lendMaxDays}
              onChange={(e)=>{setLendMaxDays(e.target.value)}}
            />
            <Input
              title="Daily price"
              // unit="ETH"
              value={lendDailyPrice}
              onChange={(e)=>{setLendDailyPrice(e.target.value)}}
            />
            <Input
              title="Collateral"
              // unit="ETH"
              value={collateral}
              onChange={(e)=>{setCollateral(e.target.value)}}
            />
            <Select title="Payment Token" onChange={onChangePaymentToken}/>
          </Block>}
          {action === Actions.PAYBACK_NFT && <Block>
            <Line>
              <Text>Rent Date</Text>
              <Text>{moment(data.rent_date).format("YYYY-MM-DD")}</Text>
            </Line>
            <Line>
              <Text>Max Duration</Text>
              <Text>{data.max_days} Days</Text>
            </Line>
            <Line>
              <Text>Daily Price</Text>
              <Text>{data.daily_price} {data.priceUnit}</Text>
            </Line>
            <Line>
              <Text>Collateral Price</Text>
              <Text>{data.collateral} {data.priceUnit}</Text>
            </Line>
            <Line>
              <Text>Total Amount</Text>
              <Text>{Number(data.max_days) * Number(data.daily_price)} {data.priceUnit}</Text>
            </Line>
          </Block>}
          {action === Actions.CLAIM_NFT && <Block>
            <Line>
              <Text>Rent Date</Text>
              <Text>{moment(data.rent_date).format("YYYY-MM-DD")}</Text>
            </Line>
            <Line>
              <Text>Max Duration</Text>
              <Text>{data.max_days} Days</Text>
            </Line>
            <Line>
              <Text>Daily Price</Text>
              <Text>{data.daily_price} {data.priceUnit}</Text>
            </Line>
            <Line>
              <Text>Collateral Price</Text>
              <Text>{data.collateral} {data.priceUnit}</Text>
            </Line>
            {/* <Line>
              <Text>Total Amount</Text>
              <Text>{Number(data.max_days) * Number(data.daily_price)} {data.priceUnit}</Text>
            </Line> */}
          </Block>}
          {action === Actions.STOP_LENDING && <Block>
            <Line>
              <Text>Max Duration</Text>
              <Text>{data.max_days} Days</Text>
            </Line>
            <Line>
              <Text>Daily Price</Text>
              <Text>{data.daily_price} {data.priceUnit}</Text>
            </Line>
            <Line>
              <Text>Collateral Price</Text>
              <Text>{data.collateral} {data.priceUnit}</Text>
            </Line>
          </Block>}
          <Button
            text= {getTitle()}
            disabled={data.state === "Rented"}
            onClick={async () => {
              await onConfirm()
              setShowModal(false);
            }}
          />
        </Section>
      </Content>
    </Container>
  )
}

export default NFTDetail;

const Container = styled.div`
  width: 90%;
  max-height: 90%;
  display: block;
  box-shadow: 0 8px 36px #e4e4e4;
  background: var(--shade-8);
  overflow: auto;
`;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--blue);
  height: 60px;
  box-sizing: border-box;
  padding: 0 20px;
`;
const Content = styled.div`
  display: flex;  
  ${mobile} {
    flex-direction: column;
  }
  box-sizing: border-box;
  background: var(--shade-8);
`;
const Span = styled.span`
  font-weight: 400;
  font-size: 24px;
  color: var(--shade-8);
`;
const Section = styled.div`
  width: 50%;
  ${mobile} {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 50px;
  box-sizing: border-box;
`;
const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 500px;
`;
export const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Img = styled.img`
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  box-sizing: border-box;
  object-fit: contain;
`;

const Lender = styled.div`
  display: flex;
  gap: 20px;
`

export const Text = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: black;
  // color: var(--shade-4);
`;
export const TextBlack = styled.div`
  color: var(--shade-0);
  font-size: 24px;
  font-weight: 600;
`
export const TextClick = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: var(--shade-2);
  cursor: pointer;
`;
const A = styled.a`
  font-weight: 400;
  font-size: 14px;
  color: var(--shade-2);
  cursor: pointer;
  text-decoration: none;
`;