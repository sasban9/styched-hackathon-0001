import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Tailor.css';

function Tailor() {

    const [tailors, setTailors] = useState([])
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')

    useEffect(() => {

        // Extract all tailor data
        axios.get('http://localhost:8000/getTailors')
            .then(res => {
                console.log(res.data)
                setTailors(res.data)
            })
    }, [])

    // Redirected to Order page
    const goToTailor = (username) => {
        window.location.href = username + '/allOpenOrders';
    }

    // Function to call backend api for adding new tailor
    const addUser = () => {

        // Condition to check is name and username doesn't blank
        if (name === '' || username === '') {
            window.alert('Name and Username must have value');
        } else {
            axios.post('http://localhost:8000/addTailor', { name: name, username: username })
                .then(res => {
                    if (res.data.code === 1) {
                        window.alert(res.data.msg)
                    } else {
                        window.location.reload();
                    }
                })
        }
    }

    // Function to call backend api for deleting paticular tailor
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
            <div className='tailor-add-form'>
                <input className='tailor-input-name' value={name} placeholder='Enter name' onChange={(e) => setName(e.target.value)}></input>
                <input className='tailor-input-username' value={username} placeholder='Enter username' onChange={(e) => setUsername(e.target.value)}></input>
                <button className='tailor-input-button' onClick={() => addUser()}>ADD USER</button>
            </div>
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