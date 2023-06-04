import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import logo from "../../media/logo.png"

import { withTranslation } from 'react-i18next';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  height: "90%",
  overflow:'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

class AboutDialog extends React.Component {
    constructor(props) {
        super(props)      
        
        this.state = {
            open: this.props.open,          
        }

        this.handleClose = this.handleClose.bind(this)
    }

    componentDidMount() {
      
    }

    handleClose() {
      this.setState({
        open: false
      })
    }

    manual() {
      window.open(window.MANUAL_URL, '_blank', 'noopener,noreferrer');
    }

    render() {
      const { t } = this.props;

      return (
        <div>          
          <Modal
            style={{zIndex: 100000}}
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="Hic-Dialog-Title">                  
                    <div className="Hic-Dialog-Title-Text">{t("about")}</div>
                    <div style={{textAlign: "right"}}>
                      <IconButton aria-label="dclose" onClick={this.handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
                <div style={{marginTop: 16, textAlign: "center", fontFamily: "Noto Serif"}}><img width={82} height={82} src={logo} /></div>
                <div style={{marginTop: 10, textAlign: "center", fontFamily: "Noto Serif"}}>
                    <span style={{fontSize: "18px", fontWeight: "bold"}}>HIC</span>
                    <br />Version 3.0 Build 1
                </div>
                <div style={{marginTop: 16, marginLeft: 24, marginRight: 24, fontFamily: "Noto Serif", textAlign: "justify"}}>
                    <b>Name and purpose</b>
                    <br />HIC is an application for Hindu Calendar Conversion. It was essentially designed to meet
the needs of J. C. Eade in his research on the calendrical systems and chronology of
Southeast Asia, particularly Java. But it should be quite useful for scholars working in
other parts of Asia where Hindu calendars have been in use.
                </div>

                <div style={{marginTop: 16, marginLeft: 24, marginRight: 24, fontFamily: "Noto Serif", textAlign: "justify"}}>
                    <b>Version history and licensing</b>
                    <br />HIC was originally programmed in Java Development Kit (JDK) 1.8.0_20 by L. Gislén &amp; J. C.
Eade. The last version (copyright © 2007) curated by Gislén &amp; Eade was 2.0. This was
released as freeware via <a href="http://home.thep.lu.se/~larsg/Site/download.html">http://home.thep.lu.se/~larsg/Site/download.html</a>.
<div style={{marginTop: 8}}>The code for HIC 2.0 was translated into a web application in JavasSript by Toni Kustiana
under supervision of Arlo Griffiths. The resulting version 3.0 (copyright © 2023) or any
later version are released as free software. The source code can be downloaded from
https://github.com/arlogriffiths/hic under a fully free license, meaning that it may be
reused in any way. Nevertheless, it seems appropriate for the authorship of L. Gislén &amp; J.
C. Eade, the programming by Toni Kustiana, and the funding furnished by the EFEO
always to be duly acknowledged.</div>
                </div>
                <div style={{marginTop: 16, marginLeft: 24, marginRight: 24, fontFamily: "Noto Serif", textAlign: "justify"}}>
                    <b>Funding</b>
                    <br />The development of version 3.0 was funded by the EFEO in the framework of the project
DHARMA ‘The Domestication of “Hindu” Asceticism and the Religious Making of South
and Southeast Asia’. This project has received funding from the European Research
Council (ERC) under the European Union’s Horizon 2020 research and innovation
programme (grant agreement no 809994).
                </div>
                
                <div style={{textAlign: "center", marginBottom: 16, marginTop: 24}}>
                <Button variant="outlined" onClick={() => this.manual()} >Manual</Button>
                </div>
            </Box>
          </Modal>
        </div>
      );
    }
}

export default withTranslation()(AboutDialog);