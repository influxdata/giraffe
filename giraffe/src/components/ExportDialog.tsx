import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function FormDialog({ buttonText, onClose }) {
    const [open, setOpen] = useState(false);
    const [filename, setFilename] = useState("mygraph");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        let adjustedName = "mygraph";
        console.log("current filename:", filename);
        if (filename) {
            adjustedName = filename.trim();
            if (!adjustedName || !adjustedName.length) {
                adjustedName = "mygraph";
            }
        }
        onClose(adjustedName);
    };

    const handleNameChange = (event) => {
        setFilename(event.target.value);
    };

    const saveIfReturn = (event) => {
        if (event.keyCode === 13) {
            handleClose();
        }
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                {buttonText}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Export Graph as Image</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To export this graph as an image, please enter the filename below;
                        to accept the default just press 'Export'.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="File Name"
                        type="string"
                        fullWidth
                        value={filename}
                        onChange={handleNameChange}
                        onKeyUp={saveIfReturn}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Export
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}