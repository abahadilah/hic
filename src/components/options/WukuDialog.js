import React from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import Draggable from "react-draggable";
import Paper from '@mui/material/Paper';

import { withTranslation } from 'react-i18next';

const Item6 = ["TU","HA","WU","PA","WA","MA","**"];
const Item5 = ["PA","PO","WA","KA","UM","**"];
  

const style = {};
var searching = false

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

class WukuDialog extends React.Component {
    constructor(props) {
        super(props)      
        
        this.state = {
            left: this.props.left,  
            
            selected1: 0,
            selected2: 0,
            selected3: 0,
        }

        this.handleClose = this.handleClose.bind(this)
        this.handleSelected1Change = this.handleSelected1Change.bind(this)
        this.handleSelected2Change = this.handleSelected2Change.bind(this)
        this.handleSelected3Change = this.handleSelected3Change.bind(this)
        this.handleTitleClick = this.handleTitleClick.bind(this)

        this.previous = this.previous.bind(this)
        this.next = this.next.bind(this)
      }

    componentDidMount() {
      
    }

    previous(e) {
      this.props.doStep(-1, this.state.selected1, this.state.selected2, this.state.selected3)
    }

    next(e) {
      this.props.doStep(1, this.state.selected1, this.state.selected2, this.state.selected3)      
    }

    handleClose() {
      this.props.wukuCloseHandleCallback()
    }

    handleTitleClick() {
      this.props.wukuBringToFrontHandleCallback()
    }

    handleSelected1Change(e) {
      this.setState(
        {selected1: e.target.value}
      ) 
    }

    handleSelected2Change(e) {
      this.setState(
        {selected2: e.target.value}
      ) 
    }

    handleSelected3Change(e) {
      this.setState(
        {selected3: e.target.value}
      ) 
    }

    render() {
      const { t } = this.props;
      
      if (this.props.autoSearch && ! searching) {
        searching = true
        this.props.handleAutoSearch()
        if (this.props.searchDir < 0) {
          this.previous()          
        }
        else 
        if (this.props.searchDir > 0) {
          this.next()
        }
        setTimeout(() => {
          searching = false
        }, 500)
      }

      var item7 = this.props.sevenDay
      item7[item7.length-1] = "**";

      return (
        <div  onMouseDown={this.handleTitleClick}>          
          <Dialog
            PaperComponent={PaperComponent}
            disableEnforceFocus
            BackdropProps={{ style: { backgroundColor: "transparent" } }}
            style={{ pointerEvents: 'none', zIndex: this.props.zIndex }}
            PaperProps={{ style: { pointerEvents: 'auto' }, sx: {width: 300, position: "fixed", left: 0, top: 460} }}
            open={this.props.open}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="Hic-Dialog-Title"  id="draggable-dialog-title">                  
                    <div  className="Hic-Dialog-Title-Text">Search Wuku</div>
                    <div style={{textAlign: "right"}}>
                      <IconButton aria-label="dclose" onClick={this.handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
                <div style={{marginTop: 8, marginLeft: 8, marginRight: 8, marginBottom: 8}}> 
                  <div style={{columnCount: 3}}>
                    <div>
                      <FormControl size="small" fullWidth>
                        <Select        
                         MenuProps={{
                          style: {zIndex: 10000}
                          }}          
                          value={this.state.selected1}
                          style={{fontSize: "0.75em", fontFamily: "Noto-Serif"}}
                          onChange={this.handleSelected1Change}
                        >
                          {
                            Item6.map(
                              (m, index) => <MenuItem key={index} value={index} style={{fontSize: "0.75em"}}>{m}</MenuItem>
                            )

                          }
                        </Select>
                      </FormControl>
                    </div> 
                    <div>
                      <FormControl size="small" fullWidth>
                        <Select      
                                                 MenuProps={{
                                                  style: {zIndex: 10000}
                                                  }}                
                          value={this.state.selected2}
                          style={{fontSize: "0.75em", fontFamily: "Noto-Serif"}}
                          onChange={this.handleSelected2Change}
                        >
                                                  {
                            Item5.map(
                              (m, index) => <MenuItem key={index} value={index} style={{fontSize: "0.75em"}}>{m}</MenuItem>
                            )

                          }                      
                        </Select>
                      </FormControl>
                    </div> 
                    <div>
                      <FormControl size="small" fullWidth>
                        <Select           
                                                 MenuProps={{
                                                  style: {zIndex: 10000}
                                                  }}           
                          value={this.state.selected3}
                          style={{fontSize: "0.75em", fontFamily: "Noto-Serif"}}
                          onChange={this.handleSelected3Change}
                        >
                          {
                            item7.map(
                              (m, index) => <MenuItem key={index} value={index} style={{fontSize: "0.75em"}}>{m}</MenuItem>
                            )
                          }
                        </Select>
                      </FormControl>
                    </div> 
                  </div>
                  <div style={{columnCount: 2, marginTop: 8}}>
                    <div><Button variant="outlined" size="small" fullWidth onClick={this.previous}>Previous</Button></div>
                    <div><Button variant="outlined" size="small" fullWidth onClick={this.next}>Next</Button></div>
                  </div>
                </div>
                  
                
            </Box>
          </Dialog>
        </div>
      );
    }
}

export default withTranslation()(WukuDialog);