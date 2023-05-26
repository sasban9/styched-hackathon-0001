import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Order.css';

function Order() {

    const { tailorUsername } = useParams();
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(100);
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
                    axios.get('http://localhost:8000/totalPageCount')
                    .then(res => {
                        console.log(res.data)
                        setTotalPage(res.data.totalPage)
                    })
                }
            })
    }, [])

    useEffect(() => {
        // Fetch all order data
        console.log(page)
        axios.post('http://localhost:8000/getOrders', {page: page})
        .then(res => {
            console.log(res)
            setOrders(res.data)
        })
    }, [page])


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

    const getSkuData = (event, skuName) => {
        event.stopPropagation();
        axios.post('http://localhost:8000/getSkuData', {skuName: skuName})
        .then(res => {
            console.log(res)
        })
    }

    const saveToLocal = (skuName, status) => {
        localStorage.setItem(skuName, status)
    }

    return (
        <div className='Orders' style={{ textAlign: 'center' }}>
            <button className='tailor-info-button' onClick={() => goToInfo()}>Click here for User Details</button>
            <div className='order-title'>All Open Orders</div>
            <div className='orders'>
                <button className='forw-prev-btn' onClick={() => setPage(oldPage => Math.max(0, oldPage - 1))}>Previous</button>
                <table>
                    {orders.map((order, i) => {
                        const skuUnits = order.sku;
                        const skuUnit = order.sku[0];
                        if (localStorage.getItem(skuUnit.name) != null) {
                            setPage(Math.floor(Math.random() * (totalPage + 1)));
                        }
                        return (
                            <>
                                <div className='order' key={i + 1 + '0'} onClick={() => orderTakingHandler(order)}>
                                    <table>
                                        <tr style={{ color: 'white', fontSize: 20, lineHeight: 3 }}>
                                            <td style={{ background: 'green' }} onClick={() => saveToLocal(skuUnit.name, 'accept')}>ACCEPT</td>
                                            <td style={{ background: 'red' }} onClick={() => saveToLocal(skuUnit.name, 'reject')}>REJECT</td>
                                        </tr>
                                    </table>
                                    <button className='sku-detail' onClick={(event)=>getSkuData(event, skuUnit.name)}>Get SKU details</button>
                                    <h1 rowspan={skuUnits.length}>Commission ₹{Math.floor(skuUnit.price / 30) * 5}</h1>
                                    <h3 rowspan={skuUnits.length}>{i} :: {order._id.substring(16).toUpperCase()} ::  {skuUnits.length} </h3>
                                    <img src={`https://picsum.photos/id/${i % 1084}/360/540`} /><br />
                                    <td className='order-skuUnit'>
                                        <b className='order-skuUnit-name' >{skuUnit.name} ({skuUnit.size})</b> <br />
                                        <i className='order-skuUnit-price' >Price: ₹{skuUnit.price}</i>
                                        {order.createdAt && <p className='order-skuUnits-'>ordered on {order.createdAt.substring(0, 10)} {order.createdAt.substring(11, 16)}</p>}
                                    </td>
                                </div>
                            </>
                        )
                    })}
                </table>
                <button className='forw-prev-btn' onClick={() => setPage(oldPage => Math.min(oldPage + 1, totalPage -1))}>forward</button>
            </div>
        </div>
    )
}

export default Order;