import styled from 'styled-components';

export const Select: React.FC<any> = (props) => {
  return (
    <Container>
      <Title $isError={props.color}>
        {props.title}
      </Title>
      <Content>
        <InputStyle name="cars" defaultValue={"4"} onChange={props.onChange} id="cars">
            <option value={1}>WETH</option>
            <option value={2}>DAI</option>
            <option value={3}>USDC</option>
            <option value={4}>USDT</option>
            <option value={5}>TUSD</option>
        </InputStyle>
      </Content>
    </Container>
  );
}

const Container = styled.div`
	display: flex;
  justify-content: space-between;
  align-items: center;  
`
const Content = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 50%;
`

const InputStyle = styled.select`
	box-sizing: border-box;
	border: 1px solid var(--shade-4);
	border-radius: var(--border-radius);
	font-weight: 400;
	font-size: 14px;
	width: 80%;
	padding: 5px 10px;
	text-align: right;
`;

export const Title = styled.div<{ $isError?: any }>`
	font-weight: 400;
  font-size: 14px;
  color: var(--shade-4);
  color: black;
`;

const Unit = styled.div`
	font-weight: 400;
	font-size: 14px;
	color: var(--shade-4);
`;
