import styled from 'styled-components';
import { useMemo, useState ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMoralis, useMoralisWeb3Api  } from 'react-moralis';
import { Filter, DefaultCard } from 'components';

const Collections: React.FC<any> = () => {
  const data = useSelector((state: any) => state.marketNFTs);
  const { authenticate, isAuthenticated, isInitialized, account, chainId, logout } = useMoralis();
  const [nfts, setNFts] = useState([])
  const navigate = useNavigate();
  const Web3Api = useMoralisWeb3Api();  
  const collectionData = useMemo(() => {
    let newsArr = [];
    newsArr.push(data[0])
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < newsArr.length; j++) {
        if (newsArr[j].author === data[i].author) break;
        if (j === newsArr.length - 1) newsArr.push(data[i]);
      }
    }
    return newsArr;
  }, [data])
  const [searchData, setSearchData] = useState(data);
  const [filterData, setFilterData] = useState(collectionData);

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

  return (
    <Container>
      <Filter
        data={collectionData}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilterData={setFilterData}
        isMarket={false}
      />
      <Content>
        {/* {filterData.map((_data, index) => (
          <DefaultCard
            key={index}
            data={_data}
            action="collections"
            onClick={() => navigate("/Collections/" + _data.author)}
          />
        ))} */}
        {nfts.map((_data: any, index: number) => (
          <DefaultCard
            key={index}
            action={"collections"}
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
export default Collections;