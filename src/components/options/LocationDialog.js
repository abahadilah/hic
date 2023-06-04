import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { sprintf } from "sprintf-js";
import { withTranslation } from 'react-i18next';

var isLatEmpty = false
var isLatInvalid = false

var isLngEmpty = false
var isLngInvalid = false

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24
};

class LocationDialog extends React.Component {
    constructor(props) {
        super(props)      
        
        this.state = {
            open: this.props.open,
            ujjain: "0.0",
            ns: this.props.ns,
            ew: this.props.ew,
            gLat: this.props.gLat,
            gLong: this.props.gLong
        }

        this.handleClose = this.handleClose.bind(this)
        this.onNSChange = this.onNSChange.bind(this)
        this.onEWChange = this.onEWChange.bind(this)
        this.onLongitudeChange = this.onLongitudeChange.bind(this)
        this.onLatitudeChange = this.onLatitudeChange.bind(this)
        this.onCancelClick = this.onCancelClick.bind(this)
        this.onOkClick = this.onOkClick.bind(this)
    }

    componentDidMount() {
      this.calcUjjain()
    }

    calcUjjain() {
      var diff = (this.state.ew === "E") ? this.state.gLong - 75.8+0.0001 : this.state.gLong + 75.8+0.0001;

      var ujjLong;

		  if (diff > 0 && diff < 180) {
        ujjLong = sprintf("E   %1$4.1f", diff)
      }
		  else if (diff > 180) {
        ujjLong = sprintf("W   %1$4.1f", 360-diff)
      }
		  else if (diff < -180) {
        ujjLong = sprintf("E   %1$4.1f", 360+diff)
      }
		  else { 
        ujjLong = sprintf("W   %1$4.1f", -diff)
      }

      this.setState({
        ujjain: ujjLong
      })
    }

    handleClose() {
      this.setState({
        open: false
      })
    }

    onNSChange(e) {
      this.props.locationOptionsNs(e.target.value)
      
      this.setState(
          {
            ns: e.target.value
          }
      )
    }

    onEWChange(e) {
      this.props.locationOptionsEw(e.target.value)
      
      this.setState(
          {
            ew: e.target.value
          }, () => {
            setTimeout(this.calcUjjain(), 250)
          }
      )
    }
    
    onLongitudeChange(e) {
        var n = parseFloat(e.target.value)
        var n1 = isNaN(n) ? 75.8 : n;

        if (isNaN(n)) {
          isLngEmpty = e.target.value.trim().length == 0
          if (! isLngEmpty) {
            isLngInvalid = true
          }
        }
        else {
          isLngEmpty = false
          isLngInvalid = false
        }

        this.setState(
            {
              gLong: n1
            }, () => {
              setTimeout(this.calcUjjain(), 250)
            }
        )
      }

      onLatitudeChange(e) {
        var n = parseFloat(e.target.value)
        var n1 = isNaN(n) ? 23.2 : n;

        if (isNaN(n)) {        
          isLatEmpty = e.target.value.trim().length === 0
          if (! isLatInvalid) {
            isLatInvalid = true
          }
        }
        else {
          isLatEmpty = false
          isLatInvalid = false
        }
        
        this.setState(
            {
              gLat: n1
            }
        )
      }

      onCancelClick(e) {
        this.setState(
          {
            open: false
          }
        )
      }

      onOkClick(e) {
        const { t } = this.props;

        if (isLatEmpty || isLngEmpty) {
          this.props.showSnackbar(t("empty_input"))
        }
        else 
        if (isLatInvalid || isLngInvalid) {
          this.props.showSnackbar(t("invalid_input"))
        }
        else {
          this.setState(
            {
              open: false
            }
          )
          this.props.gLongHandleCallback(this.state.gLong)
        }
      }

    render() {
      const { t } = this.props;

      return (
        <div>          
          <Modal
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
                <div className="Hic-Dialog-Title">                  
                    <div style={{marginLeft: 24}}><h3>{t("set_location")}</h3></div>
                    <div style={{textAlign: "right",  marginRight: 8, marginTop: 10}}>
                      <IconButton aria-label="dclose" style={{marginTop: 10}} onClick={this.handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
                <div className="Hic-Location" style={{margin: 16}}>
                  <div className="Hic-Location">
                    <div>
                      <div>
                          <FormControl>
                              <RadioGroup
                                onChange={this.onNSChange}
                                aria-labelledby="radio-buttons-ns-label"
                                defaultValue={this.state.ns}
                                value={this.state.ns}
                                name="radio-buttons-ns"
                              >
                                <FormControlLabel value="N" control={<Radio />} label="N" />
                                <FormControlLabel value="S" control={<Radio />} label="S" />
                              </RadioGroup>  
                            </FormControl>                     
                        </div>
                        <div>
                          <TextField id="tf-latitude" 
                          label={t("latitude")} 
                          variant="standard"                     
                          defaultValue={(this.state.gLat < 0) ? -this.state.gLat : this.state.gLat} 
                          onChange={
                            (e)  => this.onLatitudeChange(e)    
                          }/>
                        </div>
                    </div>
                  </div>
                  <div className="Hic-Location" >
                      <div>
                            <FormControl>
                            <RadioGroup
                              onChange={this.onEWChange}
                              aria-labelledby="radio-buttons-ew-label"
                              defaultValue={this.state.ew}
                              value={this.state.ew}
                              name="radio-buttons-ew"
                            >
                              <FormControlLabel value="E" control={<Radio />} label="E" />
                              <FormControlLabel value="W" control={<Radio />} label="W" />
                            </RadioGroup>                  
                          </FormControl>
                        </div> 
                        <div>
                        <TextField 
                        id="tf-longitude" 
                        label={t("longitude_greenwich")}
                        variant="standard"                         
                        defaultValue={(this.state.gLong < 0) ? -this.state.gLat : this.state.gLong}
                        onChange={
                          (e)  => this.onLongitudeChange(e)    
                        } />
                        </div>
                  </div>
                  
                </div>                
                <div style={{textAlign: "center"}}>
                  {t("longitude")} {t("ujjain")}
                </div>
                <div style={{textAlign: "center"}}>
                  {this.state.ujjain}
                </div>

                <div className="Hic-Location" style={{margin: 16}}>
                  <div>
                    <Button variant="contained" 
                    onClick={this.onOkClick}
                    fullWidth>{t("ok")} </Button>
                  </div>
                  <div>
                  <Button variant="outlined" 
                  onClick={this.onCancelClick}
                  fullWidth>{t("cancel")} </Button>
                  </div>
                </div>
            </Box>
          </Modal>
        </div>
      );
    }
}

export default withTranslation()(LocationDialog);