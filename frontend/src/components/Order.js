import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Order.css';

function Order() {

    const { tailorUsername } = useParams();
    const [orders, setOrders] = useState([]);

    useEffect(() => {

        // Verify tailor exist or not
        axios.post('http://localhost:8000/getTailor', { username: tailorUsername })
            .then(res => {
                console.log(res)
                if (res.data === '') {
                    window.alert('No tailor exits with this username, Click here to redirect home page');
                    window.location.href = '/'
                } else {
                    // Maintain the per day order  
                    axios.post('http://localhost:8000/maintainPerDayOrder', { username: tailorUsername })

                    // Fetch all order data
                    axios.get('http://localhost:8000/getOrders')
                        .then(res => {
                            setOrders(res.data)
                        })
                }
            })
    }, [])


    const goToInfo = () => {
        window.location.href = '/' + tailorUsername + '/info';
    }

    const orderTakingHandler = (order) => {
        const result = window.confirm('Do you want to take this order ?');
        if (result) {
            axios.post('http://localhost:8000/takeThisOrder', { username: tailorUsername, order: order })
                .then(res => {
                    if (res.data.code === 1) {
                        window.alert(res.data.msg);
                    } else {
                        window.location.href = '/' + tailorUsername + '/info';
                    }
                })
        }
    }

    return (
        <div className='Orders' style={{textAlign:'center'}}>
            <button className='tailor-info-button' onClick={() => goToInfo()}>My Jobs >></button>
            <div className='order-title'>Current Open Orders</div>
            <div className='orders'>
                <table>
                    {orders.map((order, i) => {
                        const skuUnits = order.sku;
                        return (

                            <>{
                                skuUnits.map((skuUnit, index) => {
                                    return (
                                        <div className='order' key={i + index + '0'} onClick={() => orderTakingHandler(order)}>
                                            <table>
                                                <tr style={{color:'white',fontSize:20,lineHeight:3}}>
                                                    <td style={{background:'blue'}}>
                                            <h3>Commission ₹{Math.floor(skuUnit.price/30)*5}</h3>ACCEPT
                                                    </td>
                                                </tr>
                                            </table>
                                            <h3>#{i} :: {order._id.substring(16).toUpperCase()} ::  {skuUnits.length} </h3>
                                            <img src={`https://picsum.photos/id/${skuUnit.name.substring(4)%1084}/360/540`} /><br/>
                                        {/* <td className='order-skuUnit'> */}
                                            <b className='order-skuUnit-name' >{skuUnit.name} ({skuUnit.size})</b> <br/>
                                            {/* <i className='order-skuUnit-price' >Price: ₹{skuUnit.price}</i> */}
                                            {order.createdAt && <p className='order-skuUnits-'>ordered on {order.createdAt.substring(0,10)} {order.createdAt.substring(11,16)}</p>}

                                        {/* </td> */}
                                        <table>
                                                <tr style={{color:'white',fontSize:20,lineHeight:3}}>
                                                    <td style={{background:'salmon'}}>REJECT</td>
                                                </tr>
                                            </table>
                                        </div>
                                    )
                                })
                            }</>

                        )
                    })}
                </table>
            </div>
        </div>
    )
}

export default Order;