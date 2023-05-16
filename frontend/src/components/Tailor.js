import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Tailor.css';

function Tailor() {

    const [tailors, setTailors] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8000/getTailors')
            .then(res => {
                console.log(res.data)
                setTailors(res.data)
            })
    }, [])

    const goToTailor = () => {
    }

    const deteteTailor = (username) => {
        axios.post('http://localhost:8000/deleteTailor', { username: username })
            .then(res => {
                if (res.data.code === 1) {
                    window.alert(res.data.msg)
                } else {
                    window.location.reload()
                }
            })
    }

    return (
        <div className='Tailors'>
            <div className='tailors-title'>Select Tailor Below</div>
            <div className='tailor'>
                {tailors.map((tailor) => {
                    return (
                        <div key={tailor.username} className='tailor-info' onClick={() => goToTailor(tailor.username)}>
                            <div className='tailor-name'>Name: {tailor.name}</div>
                            <div className='tailor-username'>Username: {tailor.username}</div>
                            <button className='tailor-delete' onClick={() => deteteTailor(tailor.username)}>Delete</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Tailor;