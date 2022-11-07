import {Table} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux/';
import { changeName, changeCount, changeAge, removeItem } from '../store';


const Cart = () => {

    let a = useSelector((state)=>{return state.cart});
    let b = useSelector((state)=>{return state});
    let dispatch = useDispatch();
    console.log(b);

    return (
        <div>
            <button onClick={()=>{dispatch(changeAge())}}>버튼</button>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>변경하기</th>
                    </tr>
                </thead>
                <tbody>
                    {a.map((cart,i)=>{
                        return (
                            <tr key={cart.id}>
                                <td>{i+1}</td>
                                <td>{cart.name}</td>
                                <td>{cart.count}</td>
                                <td><button onClick={()=>{
                                    dispatch(changeCount(cart.id));
                                }}>추가하기</button>
                                <button onClick={()=>{
                                    dispatch(removeItem(cart.id));
                                }}>삭제하기</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default Cart;