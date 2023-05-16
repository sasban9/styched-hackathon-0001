import React, {useEffect, useState} from 'react'
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
    return (
        <div>Order</div>
    )
}

export default Order;