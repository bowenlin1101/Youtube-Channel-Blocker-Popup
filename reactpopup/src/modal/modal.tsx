import { MouseEventHandler } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './modal.css';
import Image0 from "../images/Tutorial_Image_0.png"
import Image1 from "../images/Tutorial_Image_1.png"
import Image2 from "../images/Tutorial_Image_2.png"
import Image3 from "../images/Tutorial_Image_3.png"
import Image4 from "../images/Tutorial_Image_4.png"
import Image5 from "../images/Tutorial_Image_5.png"


function Tutorial(props:{show:boolean,handleClose:() => void, handleShow:MouseEventHandler}) {
    return (
        <>
            <svg className="modal_button" onClick={props.handleShow} width="24" height="24" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path fill="#edf2f9" d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0M 500 25C 762 25 975 238 975 500C 975 762 762 975 500 975C 238 975 25 762 25 500C 25 238 238 25 500 25C 500 25 500 25 500 25 M 501 191C 626 191 690 275 690 375C 690 475 639 483 595 513C 573 525 558 553 559 575C 559 591 554 602 541 601C 541 601 460 601 460 601C 446 601 436 581 436 570C 436 503 441 488 476 454C 512 421 566 408 567 373C 566 344 549 308 495 306C 463 303 445 314 411 361C 400 373 384 382 372 373C 372 373 318 333 318 333C 309 323 303 307 312 293C 362 218 401 191 501 191C 501 191 501 191 501 191M 500 625C 541 625 575 659 575 700C 576 742 540 776 500 775C 457 775 426 739 425 700C 425 659 459 625 500 625C 500 625 500 625 500 625"/></svg>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Tutorial</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Here are some basics to the extension and some steps to get started</p>
                    <p>First, set a password by clicking on the “Set Password” button</p>
                    <p>Enter your password to unlock the popup. Whenever the lockbox is unlocked, you are free to alter the block list and change any settings.</p>
                    <img alt="Image of unlocked lock icon" src={Image1}></img>
                    <br/>
                    <br/>
                    <p>When the lockbox is locked the block list and settings cannot be altered.</p>
                    <img alt="Image of locked lock icon" src={Image0}></img>
                    <br/>
                    <br/>
                    <p>The lockbox can be locked manually by clicking the lock icon, or it can be locked automatically if the “Auto-Lock” setting in the “Settings” tab is selected.</p>
                    <img alt="Image of auto-lock setting" src={Image5}></img>
                    <br/>
                    <br/>
                    <p>There are some other settings you can play around with in the “Settings” tab with short info bubbles about what they do</p>
                    <br/>
                    <p>You can add channels to your list by typing their channel id or their channel handle into the box. (Press Enter to Submit) 
                        <br/>
                        <br/>
                        Channel ids have 24 digits the format "UC...". For example, the channel id for MrBeast is: <strong>UCX6OQ3DkcsbYNE6H8uQQuVA</strong>
                        <br/>
                        <br/>
                        Channel handles are the characters with "@". For example, if a channel had the handle: "<strong>@Ssundee</strong>", you would type: "<strong>Ssundee</strong>", into the box.
                        <br/>
                        <br/>
                        Alternatively you can go to the youtube channel page and click the “<strong>Add Channel to Block List</strong>” button directly. Note, that the popup must be unlocked for this to work.
                    </p>
                    <img className='button-image' alt="Image of 'Add Channel to Block List' Button" src={Image2}></img>
                    <p>Once added, the channels should appear in the block list</p>
                    <img alt="Image of filled blocklist" src={Image3}></img>
                    <br/>
                    <br/>
                    <p>Alternatively, you can upload a previously exported block list in the “Additional” tab. These files can be sent to and received by anyone, as long as they have not been tampered with.</p>
                    <img alt="Image of 'Additionals' tab" src={Image4}></img>
                    <br/>
                    <br/>
                    <p>Now that you have a list of channels, you can pick one of two modes: blacklist or whitelist.</p>
                    <p>Blacklist will block content from any channels on the list</p>
                    <p>Whitelist will block content from any channels that are not on the list</p>
                    <p>With that you're all set!</p>
                    <p>Any feedback is appreciated. Please leave a review or send me an email for any suggestions or bugs. My email can be found in the chrome webstore Developer section.</p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
      </>
    )
}

export default Tutorial