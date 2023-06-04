import React from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Utils from '../../data/Utils'
import PlanetCanvas from '../canvas/PlanetCanvas'
import SaveIcon from '@mui/icons-material/Save';

import Dialog from '@mui/material/Dialog';
import Draggable from "react-draggable";
import Paper from '@mui/material/Paper';
import html2canvas from 'html2canvas'

import { sprintf } from "sprintf-js";
import { withTranslation } from 'react-i18next';

const style = {};
const InverseMap = [0, 6, 3, 1, 4, 2, 5];
const Name = ["Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn ", "Moon"];

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

var data = []
var remapTl = []

class PlanetDialog extends React.Component {
    constructor(props) {
        super(props)      
        
        this.state = {
            open: this.props.open
        }

        this.handleClose = this.handleClose.bind(this)
        this.handleTitleClick = this.handleTitleClick.bind(this)
    }

    componentDidMount() {
      
    }

    handleClose() {
      this.props.planetCloseHandleCallback()
    }

    handleTitleClick() {
      this.props.planetBringToFrontHandleCallback()
    }

    init() {
      for (var i=0; i<7; i++) {
        var tl = Utils.trueLong(InverseMap[i], this.props.canon.value, this.props.kYDay, this.props.hasBija);
        remapTl[i] = parseInt(tl/30);

        var arr = [Name[InverseMap[i]], sprintf("(%1$1d)",i+1), Utils.sdm(tl)]

        data[i] = arr
      }    
    }

    handleSave() {
      var d = document.getElementById("imagePlanets")
      html2canvas(d).then(canvas => {
        var imageData = canvas.toDataURL("image/png");
        var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream");

        var date = new Date()

        var dd = date.getDate()
        var month = date.getMonth()
        var year = date.getFullYear()
        var hh = date.getHours()
        var mm = date.getMinutes()
        
        var filename = sprintf("planets_%1$4d_%2$02d_%3$02d__%4$02d_%5$02d.jpeg", year, month, dd, hh, mm)


        var aDownload = document.getElementById("aDownload")
        aDownload.download = filename
        aDownload.href = newData
        aDownload.click()      
      }
      )
    }

    render() {
      const { t } = this.props;
      
      this.init()

      return (
        <div  onMouseDown={this.handleTitleClick}>          
          <Dialog
            PaperComponent={PaperComponent}
            disableEnforceFocus
            BackdropProps={{ style: { backgroundColor: "transparent" } }}
            style={{ pointerEvents: 'none', zIndex: this.props.zIndex }}
            PaperProps={{ style: { pointerEvents: 'auto' }, sx: {width: 153, position: "fixed", left: 340, top: 300} }}
            open={this.props.open}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <a id="aDownload" style={{display: "none"}}></a>
              <div className="Hic-Dialog-Title"  id="draggable-dialog-title">                  
                    <div  className="Hic-Dialog-Title-Text">Planets</div>
                    <div style={{textAlign: "right"}}>
                    <IconButton style={{width: 16, height: 16}} onClick={this.handleSave}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={this.handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
                <div id="imagePlanets" style={{marginTop: 8}}>  
                    <PlanetCanvas 
                      angle={remapTl}/>                
                    {data.map(
                        
                        (m, index) => 
                        <div key={index} style={{marginLeft: 8, marginRight: 8}}>
                            {
                              m.map(
                                (m1, index1) => <div key={index1} className={index1 == 0 ? "Hic-Planet-Column1" : (index1 == 1 ? "Hic-Planet-Column2" : "Hic-Planet-Column3")}>{m1}</div>
                              )
                            }
                          </div>
                    )}
                    <div style={{height: 16}}></div>
                </div>
                  
                
            </Box>
          </Dialog>
        </div>
      );
    }
}

export default withTranslation()(PlanetDialog);