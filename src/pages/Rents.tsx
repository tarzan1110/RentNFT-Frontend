import styled from 'styled-components';
import { useMemo, useState ,useEffect } from 'react';
import { useMoralis, useMoralisWeb3Api,useMoralisQuery  } from 'react-moralis';
import { useParams } from 'react-router-dom';
import moment from 'moment'
import { useSelector } from 'react-redux';

import { DefaultCard } from 'components';
import { Actions } from 'store/types';

const Rents: React.FC<any> = () => {
  const id = useParams().id || "";
  const lendData = useSelector((state: any) => state.myNFTs);
  const payBackData = useSelector((state: any) => state.rentNFTs);
  const [rents, setRents] = useState([])
  const data = id === "Lend" ? lendData : payBackData;
  const { authenticate, isAuthenticated, isInitialized, account, chainId, logout } = useMoralis();
  const Web3Api = useMoralisWeb3Api();  

  const { fetch } = useMoralisQuery(
    "lend_records",
    (query) =>
      query.equalTo("status","rent").limit(10),
    [],
    { autoFetch: false }
  );

  const refresh = async ()=>{
    setTimeout(async ()=>{
      const results = await fetch();
      if(results){
        const data = results.map((result)=>result.attributes)
        setRents([...data])
      }
    },3000)
    
  }

  useEffect(() => {

    const getRents = async () => {
      const results = await fetch();
      if(results){
        const data = results.map((result)=>result.attributes)
        setRents([...data])
      }
      
    };
    getRents()
    
  }, [account])

  return (
    <Container>
      <Content>
        {!isAuthenticated &&
          <Text>
            <span>
              Please connect to your Wallet.
            </span>
          </Text>}
        {isAuthenticated && rents.map((_data: any, index: number) => (
          <DefaultCard
            key={index}
            action={Actions.PAYBACK_NFT}
            dataIndex={index}
            data={_data}
            onFinish={()=>{refresh()}}
          />
        ))}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: block;
  padding: 20px 20px 50px 20px;
  box-sizing: border-box;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Text = styled.div`
  font-size: 20px;
  color: var(--shade-3);
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px - 100px - 70px);
`

export default Rents;