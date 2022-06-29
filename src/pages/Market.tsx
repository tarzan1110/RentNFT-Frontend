import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Filter, MarketCard } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Actions } from 'store/types';
import { useMoralis, useMoralisWeb3Api,useMoralisQuery  } from 'react-moralis';


const Market: React.FC<any> = () => {
  const data = useSelector((state: any) => state.marketNFTs);
  const tokenAddressParam = useParams().id || "";
  
  // console.log("tokenAddressParam--xxxxxxxxxx-->", tokenAddressParam)
  const [searchData, setSearchData] = useState(data);
  const [filterData, setFilterData] = useState(searchData);
  const [lends, setLends] = useState([])
  const Web3Api = useMoralisWeb3Api();  
  const { authenticate, isAuthenticated, isInitialized, account, chainId, logout } = useMoralis();
  
  const { fetch } = useMoralisQuery(
    "lend_records",
    (query) =>{
      if(tokenAddressParam.length>0){
        return query.equalTo("status","lend").limit(10).equalTo("token_address",tokenAddressParam)
      }else{
        return query.equalTo("status","lend").limit(10)
      }
    },
    [],
    { autoFetch: false }
  );



  const refresh = async ()=>{

    setTimeout(async () => {
      const results = await fetch();
      if(results){
        const data = results.map((result)=>result.attributes)
        setLends([...data])
      }  
    }, 2000);
    
    
  }


  useEffect(() => {
    const getLendRecords = async () => {
      const results = await fetch();
      if(results){
        const data = results.map((result)=>result.attributes)
        setLends([...data])
      }
      
    };
    getLendRecords()
    
  }, [account])


  const renderData = useMemo(() => {
    if (tokenAddressParam === "") return filterData;
    else {
      let tempArr = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].author === tokenAddressParam) tempArr.push(data[i]);
      }
      return tempArr;
    }
  }, [tokenAddressParam, data, filterData])

  return (
    <Container>
      <Content>
        {lends.map((_data: any, index: number) => (
          <MarketCard
            key={index}
            action={Actions.BUY_NFT}
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
  padding: var(--padding);
  padding-bottom: 50px;
  box-sizing: border-box;
`

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default Market;