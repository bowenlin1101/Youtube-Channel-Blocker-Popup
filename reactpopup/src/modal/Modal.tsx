import React, { MouseEventHandler } from 'react';
import './modal.css';

function Modal(props:{show:boolean,children:any,handleClose:MouseEventHandler}) {
    const showHideClassName = props.show ? "modal display-block" : "modal display-none"
    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {props.children}
                <button type="button" onClick={props.handleClose}>
                Close
                </button>
            </section>
        </div>
    )
}

export default Modal