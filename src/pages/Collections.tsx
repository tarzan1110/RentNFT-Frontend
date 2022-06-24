import styled from 'styled-components';
import { useMemo, useState ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMoralis, useMoralisWeb3Api,useMoralisQuery  } from 'react-moralis';
import { Filter, DefaultCard } from 'components';



const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
  const value = obj[key];
  objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
  return objectsByKeyValue;
}, {});
const groupByTokenAddress = groupBy("token_address")


const Collections: React.FC<any> = () => {
  const data = useSelector((state: any) => state.marketNFTs);
  const { authenticate, isAuthenticated, isInitialized,Moralis, account, chainId, logout } = useMoralis();
  const [nfts, setNFts] = useState([])
  const navigate = useNavigate();
  const Web3Api = useMoralisWeb3Api();  
  const [collections, setCollections] = useState({})

  const pipeline = [{ group: { objectId: "$token_address" } }];

  // const query = new Moralis.Query("lend_records");
  // query
  // .aggregate(pipeline)
  // .then(function (results) {
  //   console.log("results in collections.--->", results)
  //   // results contains sum of score field and stores it in results[0].total
  // })
  // .catch(function (error) {
  //   // There was an error.
  // });

  const { fetch } = useMoralisQuery(
    "lend_records",
    (query) =>
      query.equalTo("status","lend").limit(10),
    [],
    { autoFetch: false }
  );

  useEffect(() => {
    const getLendRecords = async () => {
      const results = await fetch();
      if(results){
        const data = results.map((result)=>result.attributes)
        const groupedData = groupByTokenAddress(data)
        setCollections(groupedData)
      }
      
    };
    getLendRecords()
    
  }, [account])


  useEffect(()=>{
    if(account){
      console.log("pipeline is started...........")
      const pipeline = [{ group: { objectId: "$token_address" } }];
      const query = new Moralis.Query("token_records");  
      query.equalTo("status","lend")
        // .aggregate(pipeline)
        // .then(function (results) {
        //   console.log("results in pipeline----->",results)
        //   // results contains unique score values
        // })
        // .catch(function (error) {
        //   console.log("error on pipeline issue---->",error)
        //   // There was an error.
        // });
    }  
  },[account])

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
  console.log("Object.keys(collections)--------->",Object.keys(collections))
  return (
    <Container>
      {/* <Filter
        data={collectionData}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilterData={setFilterData}
        isMarket={false}
      /> */}
      <Content>
        {(Object.keys(collections)).map((objectKey, index) => (
            <DefaultCard
              key={index}
              action={"collections"}
              data={collections[objectKey][0]}
              onClick={()=>{
                navigate("/Market/" + objectKey)
              }}
            />
          ))
        }
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: block;
  padding: var(--padding);
  padding-bottom: 50px;
  box-sizing: border-box;
  padding-top:40px;
`

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`
export default Collections;