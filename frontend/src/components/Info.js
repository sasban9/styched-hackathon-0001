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
    }, [])

    // Mark process order as completed 
    const markAsCompleteHandler = (processOrder) => {
        axios.post('http://localhost:8000/markAsCompleteOrder', { username: tailorUsername, order: processOrder })
            .then(res => {
                window.location.reload();
            })
    }

    return (
        <div>
            <div className='Info-title'>Details of tailor {tailor.name}</div>
            <div className='Info-payment'>Your earn ₹{Math.floor(tailor.payment / 30)*5} so far </div>
            <div className='Info-order'>
                <div className='Info-process-orders'>
                    <div className='Info-process-title'>Process Order</div>
                    <div className='Info-complete-details'>
                        <h4>Order#</h4>
                        <h4>SKU & Size</h4>
                        <h4>Commission</h4>
                    </div>
                    {tailor.processOrders?.map((processOrder, index) => {
                        return (
                            <div className='Info-process-details'>
                                <div className='Info-process-index'><b>#{processOrder._id.substring(16).toUpperCase()}</b><br/>{processOrder.createdAt}<br/>
                                <button className='Info-markAsComplete-button' onClick={() => markAsCompleteHandler(processOrder)}>Mark as Complete</button>
                                </div>
                                <div className='Info-process-order'>
                                    {processOrder.sku?.map((skuUnit) => {
                                        return (
                                            <div className='Info-process-detail'>
                                                <div>{skuUnit.name}</div>
                                                <div>Size: {skuUnit.size}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div>INR {Math.floor(processOrder.price/30)*5}</div>

                            </div>
                        )
                    })}
                </div>
                <div className='Info-complete-orders'>
                    <div className='Info-complete-title' style={{background:'black', color:'white',padding:10}}>Completed</div>
                    <div style={{padding:10}}><div className='Info-complete-details'>
                        <h4>Order#</h4>
                        <h4>SKU & Size</h4>
                        <h4>Commission</h4>
                    </div>
                    {tailor.completeOrders?.map((completeOrder, index) => {
                        return (
                            <div className='Info-complete-details'>
                                <div className='Info-complete-index'><b>#{completeOrder._id.substring(16).toUpperCase()}</b><br/>{completeOrder.createdAt}<br/></div>
                                <div className='Info-complete-order'>
                                    {completeOrder.sku?.map((skuUnit) => {
                                        return (
                                            <div className='Info-complete-detail'>
                                                <div>{skuUnit.name}</div>
                                                <div>Size: {skuUnit.size}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div>INR {Math.floor(completeOrder.price/30)*5}</div>
                            </div>
                        )
                    })}</div>
                </div>
            </div>
        </div>
    )
}

export default Info;