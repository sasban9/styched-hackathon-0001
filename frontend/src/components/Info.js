import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Info.css';

function Info() {

    const { tailorUsername } = useParams()
    const [tailor, setTailor] = useState({});

    useEffect(() => {
        axios.post('http://localhost:8000/getTailor', { username: tailorUsername })
            .then(res => {
                if (res.data === '') {
                    window.alert('No tailor exits with this username, Click here to redirect to home page');
                    window.location.href = '/'
                } else {
                    setTailor(res.data)
                }
            })
    }, [tailorUsername])

    // Mark process order as completed 
    const markAsCompleteHandler = (processOrder) => {
        axios.post('http://localhost:8000/markAsCompleteOrder', { username: tailorUsername, order: processOrder })
            .then(res => {
                window.location.reload();
            })
    }

    const goToOrders = () => {
        window.location.href = '/' + tailorUsername + '/allOpenOrders';
    }
    const goToHome = () => {
        window.location.href = '/';
    }
    // Mark process order as cancel 
    const markAsCancelHandler = (processOrder) => {
        axios.post('http://localhost:8000/markAsCancelOrder', { username: tailorUsername, order: processOrder })
            .then(res => {
                window.location.reload();
            })
    }

    return (
        <div>
            <div style={{textAlign:'center'}}><button className='all-orders-button' onClick={() => goToHome()}>🏠</button>
            <button className='all-orders-button' onClick={() => goToOrders()}>OPEN ORDERS &raquo;</button></div>

            <div className='Info-title' style={{textAlign:'center'}}> 🙏 नमस्ते {tailor.name} जी</div>
            <div className='Info-payment' style={{textAlign:'center'}}>Your commission is ₹{Math.floor(tailor.payment / 30)*5} this week 👍<br/>and ₹{Math.floor(tailor.processOrders?.reduce((total,order) => {return total+order.price},0) / 30)*5} due on next submission...<br/>{tailor.negativeCommision && `Your negative commission is ₹${Math.floor(tailor.negativeCommision / 30)*5} so far`} </div>

            <div className='Info-order'>
                <div className='Info-process-orders'>
                    <div className='Info-complete-title'>Process Order</div>
                    <div style={{padding:'0 30px 10px'}}>
                    <table style={{minWidth:540}}><tbody>
                    <tr className='Info-process-details'>
                        <th></th>
                        <th>Order#</th>
                        <th>SKU & Size</th>
                        <th>Commission</th>
                        <th></th>
                    </tr>
                    {tailor.processOrders?.map((processOrder, index) => {
                        return (

                            <tr className='Info-process-details'>
                                <td>
                                <button className='Info-markAsComplete-button' onClick={() => markAsCompleteHandler(processOrder)}>✔️ Complete</button>
                                </td>
                                <td className='Info-process-index'><b>#{processOrder._id.substring(16).toUpperCase()}</b><br/>
                                {processOrder.createdAt?.substring(0,10)} {processOrder.createdAt?.substring(11,16)}<br/></td>
                                <td className='Info-process-order'>
                                    {processOrder.sku?.map((skuUnit,i) => {

                                        return (
                                            <div className='Info-process-detail' key={i}>
                                                <div>{skuUnit.name}</div>
                                                <div>Size: {skuUnit.size}</div>
                                            </div>
                                        )
                                    })}
                                </td>
                                <td className='inr'>INR {Math.round(processOrder.price/30)*5} <br/>
                                {/* <button className='Info-markAsComplete-button' onClick={() => markAsCompleteHandler(processOrder)}>✔️ Complete</button> */}
                                </td>
                                <td>
                                <button className='Info-markAsCancel-button' onClick={() => markAsCancelHandler(processOrder)}>❌ Cancel</button>

                                </td>
                            </tr>
                        )
                    })}
                </tbody></table></div></div>
                <div className='Info-complete-orders'>
                    <div className='Info-complete-title'>Completed</div>
                    <div style={{padding:'0 30px 10px'}}>
                        <table><tbody>
                        <tr className='Info-complete-details'>
                            <th>Order#</th>
                            <th>SKU & Size</th>
                            <th>Commission</th>
                        </tr>
                    {tailor.completeOrders?.map((completeOrder, index) => {
                        return (
                            <tr className='Info-complete-details' key={index}>
                                <td className='Info-complete-index'><b>#{completeOrder._id.substring(16).toUpperCase()}</b><br/>
                                {completeOrder.createdAt?.substring(0,10)} {completeOrder.createdAt?.substring(11,16)}<br/></td>
                                <td className='Info-complete-order'>
                                    {completeOrder.sku?.map((skuUnit,i) => {
                                        return (
                                            <div className='Info-complete-detail' key={i}>
                                                <div>{skuUnit.name}</div>
                                                <div>Size: {skuUnit.size}</div>
                                            </div>
                                        )
                                    })}
                                </td>
                                <td className='inr'>INR {Math.round(completeOrder.price/30)*5}</td>
                            </tr>
                        )
                    })}
                    </tbody></table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info;