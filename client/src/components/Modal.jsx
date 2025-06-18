import React from "react";
import Button from "../components/Button";

const Modal = ({ title, closeEvent, children }) => {
  return (
    <>
      <div className="modal">
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <Button
                className={"sm action-2"}
                link="# "
                text="X"
                event={closeEvent}
              />
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
