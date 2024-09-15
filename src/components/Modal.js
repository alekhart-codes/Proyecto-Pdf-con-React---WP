import React, { useEffect } from 'react';
import './Modal.css'; 

const Modal = ({ isOpen, onClose, children }) => {

    useEffect(() => {
        if (isOpen){
            document.body.style.overflow = 'hidden';
        } 
        return () => {
            document.body.style.overflow = 'auto';
        };

    }, [isOpen]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
