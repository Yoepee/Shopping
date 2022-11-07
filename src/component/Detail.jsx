import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Nav} from 'react-bootstrap';
import { addItem } from "../store";
import { useDispatch } from "react-redux/es/exports";

import {Context1} from "../App"

const Pt = styled.p`
color: ${props => props.cl}
`

const Detail = (props) => {
    let {재고} = useContext(Context1);
    let {id} = useParams();
    let id2 = Number(id) + 1;
    let [sail, setSail] = useState("true");
    let [text, setText] = useState(1);
    let [check, setCheck] = useState("false");
    let [tap, setTap] = useState(0);
    let [fado,setFado] = useState("");
    let dispatch = useDispatch();
    let reg = /^[0-9]+$/;
    let link = 'https://codingapple1.github.io/shop/shoes' + id2 + '.jpg'
    let navigate = useNavigate();
    useEffect(()=>{
        let a = setTimeout(()=>{setSail("false")},5000);
        let b = setTimeout(()=>{setFado("end")},100);
        if(!reg.test(text)){
            setCheck("true");
        }else{
            setCheck("false");
        }
        return () => {
            clearTimeout(a);
            clearTimeout(b);
        }
    }, [text])

    useEffect(()=>{
        let 꺼낸거 = localStorage.getItem("watched");
        꺼낸거 = JSON.parse(꺼낸거);
        꺼낸거.push(props.shoes.find(x=>x.id == id).id)
        꺼낸거 = [...new Set(꺼낸거)]
        if(꺼낸거.length > 3)
            꺼낸거.shift();
        localStorage.setItem("watched", JSON.stringify(꺼낸거));
      },[])
    return (
        <div className="container">
            {sail === "true"?
            <div className="alert alert-warning">
            5s 이내 구매시 할인
            </div>
            :null}
            <input type="text" value={text} onChange={(e)=>{setText(e.target.value)}}></input>
            {check === "true" && text !==""?
            <Pt cl="red">그러지마세유</Pt>
            :null
            }
            <div className="row">
                <div className="col-md-6">
                    <img className={"start "+ fado} src={link} width="100%" alt="사진" />
                </div>
                <div className="col-md-6">
                    <h4 className="pt-5">{props.shoes[id].title}</h4>
                    <p>{props.shoes[id].content}</p>
                    <p>{props.shoes[id].price}</p>
                    <button className="btn btn-danger" onClick={()=>{
                        let item = {id: props.shoes[id].id, name: props.shoes[id].title, count: text };
                        dispatch(addItem(item));
                        navigate("/cart")
                    }}>주문하기</button>
                </div>
            </div>

            <Nav fill variant="tabs" defaultActiveKey="link-1">
      <Nav.Item>
        <Nav.Link eventKey="link-1" onClick={()=>{setTap(0)}}>버튼1</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-2" onClick={()=>{setTap(1)}}>버튼2</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-3" onClick={()=>{setTap(2)}}>버튼3</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-4" onClick={()=>{setTap(3)}}>버튼4</Nav.Link>
      </Nav.Item>
    </Nav>
    <TapContent tap={tap} shoes ={props.shoes}/>
        </div>
    )
}

const TapContent = ({tap, shoes}) =>{
    let {재고} = useContext(Context1);
    let [fade, setFade] = useState("")
    useEffect(()=>{
        setTimeout(()=>{setFade("end")},100)
        return () => {setFade("")}
    },[tap])
    return <div className={"start "+ fade}>
            {[<div>{shoes[0].title}</div>,<div>내용2</div>,<div>내용3</div>][tap]}
        </div>

            {/* ({props.tap === 0? <div>내용1</div>:null}
            {props.tap === 1? <div>내용2</div>:null}
            {props.tap === 2? <div>내용3</div>:null}) */}

}

export default Detail;