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
                        window.location.reload();
                    }
                })
        }
    }

    return (
        <div className='Orders'>
            <button className='tailor-info-button' onClick={() => goToInfo()}>Click here for User Details</button>
            <div className='order-title'>All Open Orders</div>
            <div className='orders'>
                <table>
                    {orders.map((order, i) => {
                        const skuUnits = order.sku;
                        return (

                            <>{
                                skuUnits.map((skuUnit, index) => {
                                    return (
                                        <tr className='order' key={i + index + '0'} onClick={() => orderTakingHandler(order)}>
                                            <td className='order-skuUnits-'>{order.createdAt}</td>
                                            <td>#{order._id.substring(16).toUpperCase()} </td>
                                            <td>TOV ₹{order.price}</td>
                                            <td> {skuUnits.length} units</td>
                                        {/* <td className='order-skuUnit'> */}
                                                    <td className='order-skuUnit-name' key={index}>Design: {skuUnit.name} ({skuUnit.size})</td>
                                                    <td className='order-skuUnit-price' key={index}>Price: ₹{skuUnit.price}</td>

                                        {/* </td> */}
                                            <td className='order-skuUnits-price'></td>
                                        </tr>
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