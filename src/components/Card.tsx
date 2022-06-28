import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch } from 'react-redux';

import { Icon15x15 } from './Icon';
import Modal from './Modals';
import { tablet, mobile, mobileSmall } from 'utils'
import NFTDetail from './Modals/NFTDetail';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ConfirmWindow from 'components/Modals/ConfirmWindow'
import { Actions } from 'store/types';
import defaultNftImg from '../assets/empty_image.jpg'

export const DefaultCard: React.FC<any> = (props: any) => {
  const { action, data, dataIndex, onClick, onFinish } = props;
  let [showModal, setShowModal] = useState(false);
  let [confirm, setConfirm] = useState(false);
  const [metaData, setMetaData] = useState(null)
  const { isAuthenticated } = useMoralis();
  const dispatch = useDispatch();
  const text = action === Actions.BUY_NFT ?
    (isAuthenticated ? "Rented Sucessfully!" : "Please connect to your Wallet.") :
    (action === Actions.LEND_NFT ? "Lended Sucessfully!" : "Returned Sucessfully!")

  useEffect(()=>{
    if(data.metadata){
      const metaObj = JSON.parse(data.metadata)
      const tempArray = metaObj.image.split("//")
      let extractedUrl = ""
      if(tempArray.length>1){
        extractedUrl = tempArray[1]
        
        if(extractedUrl.indexOf("ipfs/")>-1){
          extractedUrl = extractedUrl.replace("ipfs/","")
          // console.log("extractedURl----xxx--------->", extractedUrl)
        }
      }
      metaObj.extractedUrl = "https://ipfs.moralis.io:2053/ipfs/" + extractedUrl 
      setMetaData(metaObj)
    }
  },[data.metadata])
  console.log('data on default card------->',data)
  // const clickOk = () => {
  //   switch (action) {
  //     case Actions.BUY_NFT: {
  //       if (isAuthenticated)
  //         dispatch({ type: Actions.BUY_NFT, title: data.title });
  //       break;
  //     }
  //     case Actions.LEND_NFT: {
  //       dispatch({ type: Actions.LEND_NFT, dataIndex: dataIndex });
  //       break;
  //     }
  //     case Actions.PAYBACK_NFT: {
  //       dispatch({ type: Actions.PAYBACK_NFT, dataIndex: dataIndex });
  //       break;
  //     }
  //   }
  //   setConfirm(false);
  // }

  const clickOk = () => {
    switch (action) {
      case Actions.BUY_NFT: {
        if (isAuthenticated)
          dispatch({ type: Actions.BUY_NFT, title: data.title });
        break;
      }
      case Actions.LEND_NFT: {
        // dispatch({ type: Actions.LEND_NFT, dataIndex: dataIndex });
        break;
      }
      case Actions.PAYBACK_NFT: {
        dispatch({ type: Actions.PAYBACK_NFT, dataIndex: dataIndex });
        break;
      }
    }
    setConfirm(false);
  }
  console.log('metaData?.image------->',metaData)
 
  return (
    <Container>
      <CardBody>
        { action === Actions.PAYBACK_NFT && 
          <Img
            style={{height:'100%',backgroundColor:"green"}}
            src={data.image_url===""?defaultNftImg:  data.image_url}
            onClick={() => {
              if (action !== "collections") setShowModal(true);
              // else onClick();
            }}
          />
        }
         { action === Actions.STOP_LENDING && 
          <Img
            style={{height:'100%',backgroundColor:"green"}}
            src={data.image_url===""?defaultNftImg:  data.image_url}
            onClick={() => {
               setShowModal(true);
            }}
          />
        }
         { action === Actions.LEND_NFT && 
          <Img
            style={{height:'100%',backgroundColor:"green"}}
            src={metaData?.extractedUrl}
            // src = {defaultNftImg}
            onClick={() => {
              if (action !== "collections") setShowModal(true);
              // else onClick();
            }}
          />
        }
         { action === Actions.CLAIM_NFT && 
          <Img
            style={{height:'100%',backgroundColor:"green"}}
            src={data.image_url===""?defaultNftImg:  data.image_url}
            // src = {data.image}
            onClick={() => {
              if (action !== "collections") {
                setShowModal(true)
              } else{
                onClick();
              };
            }}
          />
        }
        {action === Actions.BUY_NFT && 
          <Img
          style={{height:'100%',backgroundColor:"green"}}
          src={data.metadata===null?defaultNftImg:  data.image}
          // src = {data.image}
          onClick={() => {
            if (action !== "collections") setShowModal(true);
            // else onClick();
          }}
        />
        }
        {action === "collections" && 
          <Img
            style={{height:'100%',backgroundColor:"green"}}
            src={data.image_url===""?defaultNftImg:  data.image_url}
            // src = {data.image}
            onClick={() => {
              onClick();
            }}
        />
        }
        <Content>
          <Title>{action === "collections" ? data.author : data.title}</Title>
          {
            action === Actions.BUY_NFT && 
              <Detail>
                <Line>{data.author}</Line>
                <Line>
                  Daily Price
                  <div>
                    {data.dailyPrice}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  Collateral
                  <div>
                    {data.collateralPrice}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  {data.state}
                </Line>
              </Detail>
          }
          {
            action === Actions.PAYBACK_NFT && 
              <Detail>
                <Line>{data.author}</Line>
                <Line>
                  Daily Price
                  <div>
                    {data.daily_price}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  Collateral
                  <div>
                    {data.collateral}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  {data.state}
                </Line>
              </Detail>
          }
            {
            action === Actions.STOP_LENDING && 
              <Detail>
                <Line>{data.author}</Line>
                <Line>
                  Daily Price
                  <div>
                    {data.daily_price}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  Collateral
                  <div>
                    {data.collateral}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  {data.state}
                </Line>
              </Detail>
          }
          {
            action === Actions.CLAIM_NFT && 
              <Detail>
                <Line>{data.author}</Line>
                <Line>
                  Daily Price
                  <div>
                    {data.daily_price}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  Collateral
                  <div>
                    {data.collateral}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  {data.state}
                </Line>
              </Detail>
          }
            {
            action === Actions.LEND_NFT && 
              <div style={{textAlign:'center'}}>
                {metaData?.name}
              </div>
          }
          {
            action === "collections" && 
              <Detail>
                <Line>{data.author}</Line>
                <Line>
                  Daily Price
                  <div>
                    {data.daily_price}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  Collateral
                  <div>
                    {data.collateral}
                    {data.priceUnit}
                  </div>
                </Line>
                <Line>
                  {data.state}
                </Line>
              </Detail>
          }
          {/* {action === "collections" && <Opensea
            href={"https://opensea.io/collection/" + data.author.toLowerCase()}
            target="_blank"
          >
            <Icon15x15 src="icons/opensea.svg" />
            <Line>View on OpenSea</Line>
          </Opensea>} */}
        </Content>
      </CardBody>
      <Modal
        showModal={showModal}
        content={
          <NFTDetail
            setShowModal={(val)=>{
                setShowModal(val); 
                console.log('onfinish fired')
                if(onFinish){onFinish()}
            }}
            metaData = {metaData}
            data={data}
            setConfirm={setConfirm}
            action={action}
          />
        }
      />
      <Modal
        showModal={confirm}
        content={
          <ConfirmWindow
            text={text}
            onClick={clickOk}
          />
        }
      />
    </Container >
  );
}

const Container = styled.div`
  box-sizing: border-box;
  padding: 20px 10px;
  width: 25%;
  ${tablet} {
    width: 33.3333%;
  }
  ${mobile} {
    width: 50%;
  }
  ${mobileSmall} {
    width: 100%;
  }
`
const CardBody = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 36px #e4e4e4;
  border-radius: var(--border-radius);  
`
const Img = styled.img`
  width: 100%;
  max-width: none;
  aspect-ratio: 1;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  cursor: pointer;
  object-fit:cover;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px 20px 20px;
  box-sizing: border-box;
`
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: var(--shade-0);
  display: flex;
  align-items: center;
  justify-content: center;
`
const Line = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: var(--shade-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`
const Opensea = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  gap: 5px;
  user-select: none;
`
const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`


