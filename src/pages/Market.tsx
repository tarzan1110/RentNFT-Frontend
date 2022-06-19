import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Filter, DefaultCard } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Actions } from 'store/types';
import { useMoralis, useMoralisWeb3Api  } from 'react-moralis';


const Market: React.FC<any> = () => {
  const data = useSelector((state: any) => state.marketNFTs);
  const id = useParams().id || "";
  const [searchData, setSearchData] = useState(data);
  const [filterData, setFilterData] = useState(searchData);
  const [nfts, setNFts] = useState([])
  const { authenticate, isAuthenticated, isInitialized, account, chainId, logout } = useMoralis();
  console.log('account---->',account)
  const Web3Api = useMoralisWeb3Api();  

  useEffect(() => {
    const fetchData = async () => {
      console.log("account---->",account)
      const userEthNFTs = await Web3Api.account.getNFTs({chain:"rinkeby",address:account}) 
      // const userEthNFTs = []
      console.log("userEthNFTs---------",userEthNFTs)
      setNFts([...userEthNFTs.result])
      return userEthNFTs;
    }
    if(account){
      const result = fetchData()
    }
  }, [account])


  const renderData = useMemo(() => {
    if (id === "") return filterData;
    else {
      let tempArr = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].author === id) tempArr.push(data[i]);
      }
      return tempArr;
    }
  }, [id, data, filterData])

  return (
    <Container>
      <Filter
        data={data}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilterData={setFilterData}
        isMarket={true}
      />
      <Content>
        {nfts.map((_data: any, index: number) => (
          <DefaultCard
            key={index}
            action={Actions.BUY_NFT}
            data={_data}
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