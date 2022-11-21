import React from 'react'
import logo from '../images/new_128x128_logo.png'
import './header.css'

function Header(props:{showModal: React.MouseEventHandler, children:React.ReactElement}) {

    return(
        <div className='header-container'>
            <div className='logo-container'>
                <img alt="Youtube Channel Blocker Logo" src={logo} className='header-logo'></img>
                <div className='title-question-container'>
                    <h1 className='header'>Channel Blocker</h1>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Header