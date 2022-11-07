import './App.css';
import { Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
import { useState, createContext, useEffect, lazy, Suspense } from "react";
import data from "./data.js";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom"
// import Detail from './component/Detail';
// import Cart from './component/Cart'
import styled from "styled-components";
import axios from "axios";
import { useQuery } from '@tanstack/react-query'

const Detail = lazy( () => import('./component/Detail.jsx') )
const Cart = lazy( () => import('./component/Cart.jsx') )

let Abcsort = styled.button`
  padding: 10px;
  color:black;
  background-color: orange;
`
let Listsort = styled.button`
  padding: 10px;
  color: ${props => props.bg === "black"? "white":"black"};
  background-color: ${props=> props.bg};
`

export let Context1 = createContext();

function App() {

  // let obj = {name:"kim"};
  // localStorage.setItem("data", JSON.stringify(obj));
  let 꺼낸거 = localStorage.getItem("watched")
  // console.log(JSON.parse(꺼낸거).name);


  let [재고] = useState([10,11,12]);
  let [count,setCount] = useState(0);
  let [shoes,setShoes] = useState(data);
  let [loading, setLoading] = useState("false");
  let navigate = useNavigate();
  const sort = data => {
    data.sort((a,b) => {
      if(a.title > b.title) return 1;
      if(a.title < b.title) return -1;
      else return 0;
    });
  }
  const sort2 = data => {
    data.sort((a,b) => {
      if(a.id > b.id) return 1;
      if(a.id < b.id) return -1;
      else return 0;
    });
  }
  
  let result = useQuery(['작명'], () => 
    axios.get('https://codingapple1.github.io/userdata.json')
    .then((a)=>{
      console.log("요청됨")
      return a.data }),
      {staleTime : 2000}
  )
  // result.data
  // result.isLoading
  // result.error
  console.log(result.data)

  useEffect(()=>{
    if(localStorage.getItem("watched") === null)
      localStorage.setItem("watched", JSON.stringify([]))
  },[])

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Shop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={()=>{navigate("/")}}>Home</Nav.Link>
            <Nav.Link onClick={()=>{navigate("/cart")}}>cart</Nav.Link>
            <Nav.Link onClick={()=>{localStorage.removeItem("watched")}}>최근상품 제거</Nav.Link>
          </Nav>
          <Nav className="ms-auto" style={{color:"white"}}>
            {result.isLoading && "로딩중"}
            {result.error && "에러남"}
            {result.data && result.data.name}
          </Nav>
        </Container>
      </Navbar>
      <div className='main-bg'/>
      {localStorage.getItem("watched") !== null?
        <div className='floatdiv'>
          <ul>
            <h4>최근 본 상품</h4>
          </ul>
          {shoes.map((shoe)=>{
              return (
                localStorage.getItem("watched").includes((shoe.id).toString())?
                <NewCard shoe={shoe} key={shoe.id}/>:null
              )
            })}
        </div>
        :null}
      <Routes>
        <Route path="/" element={
          <>
            <div>메인페이지</div>
            {loading === "true"?
              <Loading/>:null
            }
            <Abcsort onClick={()=>{let data2 = [...shoes]; sort(data2); setShoes(data2);}}>가나다순 정렬</Abcsort>
            <Listsort bg={"black"} onClick={()=>{let data2 = [...shoes]; sort2(data2); setShoes(data2);}}>최신순 정렬</Listsort>
            <Container>
              <Row>
                {shoes.map((shoe, i) => {
                  return (
                    <>
                    {i<3?
                      <Card key={shoe.id} shoe={shoe}/>
                      :null
                    }
                    </>
                  )
                })}
              </Row>
              <Row>
                {shoes.map((shoe, i) => {
                  return (
                    <>
                    {i>=3 && i<6?
                      <Card key={shoe.id} shoe={shoe}/>
                      :null
                    }
                    </>
                  )
                })}
              </Row>
              <Row>
                {shoes.map((shoe, i) => {
                  return (
                    <>
                    {i>=6?
                      <Card key={shoe.id} shoe={shoe}/>
                      :null
                    }
                    </>
                  )
                })}
              </Row>
              <button onClick={()=>{
              setLoading("true");
              if(count === 0){
              axios.get('https://codingapple1.github.io/shop/data2.json')
              .then((info)=>{
                let copy = [...shoes, ...info.data]
                setShoes(copy);
                setCount(count+1);
                setLoading("false");
              })
              .catch(()=>{
                setLoading("false");
              })}else if(count ===1){
                axios.get('https://codingapple1.github.io/shop/data3.json')
              .then((info)=>{
                let copy = [...shoes, ...info.data]
                setShoes(copy);
                setCount(count+1);
                setLoading("false");
              })
              .catch(()=>{
                setLoading("false");
              })
              }else{
                alert("더이상 받아올 자료가 없습니다.")
              }
            }}>더보기</button>
            </Container>
          </>
        } />
        <Route path="/detail/:id" element={
          <Suspense fallback={<div>로딩중입니다.</div>}>
          <Context1.Provider value ={{재고}}>
            <div>상세페이지</div>
            <Detail shoes = {shoes}/>
          </Context1.Provider>
          </Suspense>
        } />
        <Route path="/cart" element={
          <Suspense fallback={<div>로딩중입니다.</div>}>
          <Cart/></Suspense>}/>
        <Route path="/about" element={<About/>}>
          <Route path="about" element={<div>정보임</div>}/>
          <Route path="member" element={<div>멤버임</div>}/>
        </Route>
        <Route path="event" element={<Event/>}> 
          <Route path="one" element={<div>첫 주문시 양배추즙 서비스</div>}/>
          <Route path="two" element={<div>생일기념</div>}/>
        </Route>
        <Route path="*" element={<div>없는 페이지입니다.</div>}/>
      </Routes>
      
    </div>
  );
}

const Card = (props) => {
  let id = props.shoe.id + 1;
  let link = 'https://codingapple1.github.io/shop/shoes' + id + '.jpg'
  let navigate = useNavigate();
  return (
    <>
      <Col onClick={()=>{
        navigate("/detail/"+props.shoe.id);
         }} style={{cursor:"pointer"}}>
        <img src={link} width="80%" alt="사진" />
        <h4>{props.shoe.title}</h4>
        <p>{props.shoe.content}</p>
        <p>{props.shoe.price}</p>
      </Col>
      
    </>
  )
}
const NewCard = (props) => {
  let id = props.shoe.id + 1;
  let link = 'https://codingapple1.github.io/shop/shoes' + id + '.jpg'
  let navigate = useNavigate();
  return (
      <ul onClick={()=>{
        navigate("/detail/"+props.shoe.id);}} style={{cursor:"pointer"}}>
        <img src={link} width="80%" alt="사진" />
        <p>{props.shoe.title}</p>
      </ul>
  )
}

const About = () =>{
  return (
    <div>
      <h4>회사정보임</h4>
      <Outlet></Outlet>
    </div>
  )
}

const Event = () =>{
  return (
    <div>
      <h4>오늘의 이벤트</h4>
      <Outlet></Outlet>
    </div>
  )
}

const Loading = () => {
  return (
    <div>로딩중입니다....</div>
  )
}
export default App;
