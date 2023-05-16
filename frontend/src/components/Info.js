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

    const markAsCompleteHandler = () => {
    }

    return (
        <div>
            <div className='Info-title'>Details of tailor {tailor.name}</div>
            <div className='Info-payment'>Your earn ₹{parseInt(tailor.payment / 6)} so far </div>
            <div className='Info-order'>
                <div className='Info-process-orders'>
                    <div className='Info-process-title'>Process Order</div>
                    {tailor.processOrders?.map((processOrder, index) => {
                        return (
                            <div className='Info-process-details'>
                                <div className='Info-process-index'>Order No: {index + 1}</div>
                                <div className='Info-process-order'>
                                    {processOrder.sku?.map((skuUnit) => {
                                        return (
                                            <div className='Info-process-detail'>
                                                <div>Design Name: {skuUnit.name}</div>
                                                <div>Size: {skuUnit.size}</div>
                                            </div>
                                        )
                                    })}
                                    <button className='Info-markAsComplete-button' onClick={() => markAsCompleteHandler(processOrder)}>Mark as Complete</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='Info-complete-orders'>
                    <div className='Info-complete-title'>Completed Order</div>
                    {tailor.completeOrders?.map((completeOrder, index) => {
                        return (
                            <div className='Info-complete-details'>
                                <div className='Info-complete-index'>Order No: {index + 1}</div>
                                <div className='Info-complete-order'>
                                    {completeOrder.sku?.map((skuUnit) => {
                                        return (
                                            <div className='Info-complete-detail'>
                                                <div>Design Name: {skuUnit.name}</div>
                                                <div>Size: {skuUnit.size}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Info;