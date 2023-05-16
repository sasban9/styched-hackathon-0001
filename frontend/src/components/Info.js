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



    return (
        <div>Info</div>
    )
}

export default Info;