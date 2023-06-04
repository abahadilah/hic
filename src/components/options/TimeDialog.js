import React from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

import Dialog from '@mui/material/Dialog';
import Draggable from "react-draggable";
import Paper from '@mui/material/Paper';
import Utils from '../../data/Utils'
import Slider from '@mui/material/Slider';

import html2canvas from 'html2canvas'

import { withTranslation } from 'react-i18next';
import { sprintf } from "sprintf-js";

const style = {};

var oblTab = [];
var tinPraman = [];

var s1, l1, s2, l2;

var sunMsg;
var moonMsg;
var lagnaMsg;

var tithiMsg;
var naksatraMsg;
var yogaMsg;

var slider1Value = 0
var slider2Value = 0

const CustomSliderStyles = {
  '& .MuiSlider-rail': {
   
  },
  '& .MuiSlider-markLabel': {
    fontFamily: "#Noto Serif",
    fontSize: "10px",
    marginTop: 0
  }
};


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

class TimeDialog extends React.Component {
    constructor(props) {
        super(props)      
        
        this.state = {
            left: this.props.left,

            fromsunrise: "From sunrise hour:min 0:00",
            moonMsg: null,
            sunMsg: null,
            lagnaMsg: null,
            tithiMsg: null,
            naksatraMsg: null,
            yogaMsg: null,
            sunriseText: this.props.sunriseText,
        }

        this.handleClose = this.handleClose.bind(this)

        this.onSlider1OnChanged = this.onSlider1OnChanged.bind(this)
        this.onSlider2OnChanged = this.onSlider2OnChanged.bind(this)
        this.handleTitleClick = this.handleTitleClick.bind(this)
      }

    componentDidMount() {
      
    }

    onSlider1OnChanged(e) {
      slider1Value = e.target.value
      this.doSliderChanged()
    }

    onSlider2OnChanged(e) {
      slider2Value =  e.target.value
      this.doSliderChanged()
    }

    doSliderChanged() {
      var time = slider1Value+slider2Value/60.0;
      var s = s1 + (s2-s1)*time/60;
      var l = l1 + (l2-l1)*time/60;
      if (s > 360) s = s - 360;
      if (l > 360) l = l - 360;
      
      time = (time*24.0/60);
      var lagna = this.computeLagna(time, s);

      var tithi = l - s;
      if (tithi < 0) tithi = tithi + 360;

      var yoga = l + s; 
      if (yoga >= 360) yoga = yoga - 360;

      time = time + 0.5/60;

      var msg = sprintf("From sunrise hour:min %1$2d:",parseInt(time))
      time = (time - parseInt(time))*60;
      if (time >= 10) msg = msg + sprintf("%1$2d    ",parseInt(time));
      else msg = msg + "0" +sprintf("%1$1d    ", parseInt(time));

      var sr = parseInt(360 - this.props.sunrise*1400+0.5);

      this.setState({
        sunMsg: "Sun: " + Utils.sdm(s),
        moonMsg: "Moon: " + Utils.sdm(l),
        lagnaMsg: "Lagna: " + Utils.sdm(lagna),
        tithiMsg: "Tithi: " + this.hm(tithi, 30),
        naksatraMsg: "Nakṣatra: " + this.hm(l, 27),
        yogaMsg: "Yoga: " + this.hm(yoga, 27),
        fromsunrise: msg,
        sunriseText: sprintf("Sunrise at %1$2d:%2$2d", sr/60, sr%60),
      })
    }


    handleClose() {
      this.props.timeCloseHandleCallback()
    }

    init() {
      var d = this.props.kYDay - this.props.sunrise
      this.setUpTables(this.props.gLat);
      if (this.props.mean) {
        s1 = Utils.trueLong(0, this.props.canon.value, d, this.props.hasBija);
        l1 = Utils.trueLong(6, this.props.canon.value, d, this.props.hasBija);
        s2 = Utils.trueLong(0, this.props.canon.value, d + 1, this.props.hasBija);
        if (s2 < s1) s2 = s2 + 360;
        l2 = Utils.trueLong(6, this.props.canon.value, d + 1, this.props.hasBija);
        if (l2 < l1) l2 = l2 + 360;
      } else {
        s1 = Utils.meanLong(0, this.props.canon.value, d, this.props.hasBija);
        l1 = Utils.meanLong(6, this.props.canon.value, d, this.props.hasBija);
        s2 = Utils.meanLong(0, this.props.canon.value, d + 1, this.props.hasBija);
        if (s2 < s1) s2 = s2 + 360;
        l2 = Utils.meanLong(6, this.props.canon.value, d + 1, this.props.hasBija);
        if (l2 < l1) l2 = l2 + 360;
      }

      sunMsg = "Sun: " + Utils.sdm(s1)
      moonMsg = "Moon: " + Utils.sdm(l1)

      var lagna = this.computeLagna(0, s1);
      lagnaMsg = "Lagna: " + Utils.sdm(lagna)

		  var tithi = l1 - s1;
      if (tithi < 0) tithi = tithi + 360;

      tithiMsg = "Tithi: " + this.hm(tithi, 30)
      naksatraMsg = "Nakṣatra: " + this.hm(l1, 27)

      var yoga = l1 + s1; 
      if (yoga >= 360) yoga = yoga - 360;

      yogaMsg = "Yoga: " + this.hm(yoga, 27)
    }

    setUpTables(fi0) {
      var deg2rad = Math.PI/180;;
      var fi = fi0*deg2rad;
      var eps = 24*deg2rad;
    
      for (var i=0; i<13; i++) {
        var lam = i*30.0;
        var decl = Math.sin(eps)*Math.sin(lam*deg2rad);
        decl = Math.atan(decl/Math.sqrt(1-decl*decl));
        var ascDiff = Math.tan(fi)*Math.tan(decl);
        ascDiff = Math.atan(ascDiff/Math.sqrt(1-ascDiff*ascDiff));
        var day = Math.PI + 2*ascDiff;
        tinPraman[i] = day/(2*Math.PI)*3600;
        var RA = Math.sin(lam*deg2rad)*Math.cos(eps)/Math.cos(decl);
        RA = Math.atan(RA/Math.sqrt(1-RA*RA));
        if (lam <= 90) RA = RA;
        else if (lam <=270) RA = Math.PI-RA;
        else RA = RA + 2*Math.PI;
        var obl = RA - ascDiff;
        oblTab[i] = obl/deg2rad*10;
      }	
    }

    computeLagna(time, lam) {

      var i = parseInt(lam/30.0);
      var tinP = tinPraman[i]+(tinPraman[i+1]-tinPraman[i])*(lam - 30*i)/30.0;
      var obl = oblTab[i]+(oblTab[i+1]-oblTab[i])*(lam - 30*i)/30;
      time = time * 150; //Convert to vinadis
      obl = obl + time;
      if (obl >= 3600) obl = obl - 3600;
      if (obl < 0) obl = obl + 3600;
      i = 0;
      while (obl>oblTab[i] && i<12)  i= i+1;
      i= i-1;
      var lag = i+(obl-oblTab[i])/(oblTab[i+1]-oblTab[i]);
      return lag*30+0.5/60; //Lagna in degrees
    }

    hm(x, div){
      x = x*div/360 + 0.5/3600;
      if (x > div) x = x - div;
      var i = parseInt(x);
      var sStr = sprintf("%1$2d:",i);
      x = (x-i)*60;
      i = parseInt(x);
      if (i < 10) sStr = sStr + "0"+ sprintf("%1$1d:",i);
      else sStr = sStr + sprintf("%1$2d:",i);
      x = (x-i)*60;
      i = parseInt(x);
      if (i < 10) sStr = sStr + "0"+ sprintf("%1$1d",i);
      else sStr = sStr + sprintf("%1$2d",i);
      return sStr;
    }

    handleTitleClick() {
      this.props.timeBringToFrontHandleCallback()
    }

    handleSave() {
      var d = document.getElementById("imageTime")
      html2canvas(d).then(canvas => {
        var imageData = canvas.toDataURL("image/png");
        var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream");

        var date = new Date()

        var dd = date.getDate()
        var month = date.getMonth()
        var year = date.getFullYear()
        var hh = date.getHours()
        var mm = date.getMinutes()
        
        var filename = sprintf("time_%1$4d_%2$02d_%3$02d__%4$02d_%5$02d.jpeg", year, month, dd, hh, mm)

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
      var marks = []
      var j = 0;
      for(var i=0; i <= 60; i+=5) {
        marks[j++] = {value: i, label: i}
      }
      
      return (
        <div onMouseDown={this.handleTitleClick}>          
          <Dialog
            PaperComponent={PaperComponent}
            disableEnforceFocus
            BackdropProps={{ style: { backgroundColor: "transparent" } }}
            style={{ pointerEvents: 'none', zIndex: this.props.zIndex  }}
            PaperProps={{ style: { pointerEvents: 'auto'}, sx: {width: 500, position: "fixed", left: 510, top: 360} }}
            open={this.props.open}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <a id="aDownload" style={{display: "none"}}></a>
              <div className="Hic-Dialog-Title"  id="draggable-dialog-title">                  
                    <div  className="Hic-Dialog-Title-Text">Time</div>
                    <div style={{textAlign: "right"}}>
                    <IconButton aria-label="dclose" onClick={this.handleSave}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton aria-label="dclose" onClick={this.handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
                <div id="imageTime" style={{marginTop: 16, marginLeft: 8, marginRight: 8, marginBottom: 8, fontSize: "0.75em", fontFamily: "Noto Serif"}}> 
                  <div style={{columnCount: 3}}>
                    <div style={{textAlign: "center"}}>{this.state.sunMsg ? this.state.sunMsg : sunMsg}</div>
                    <div style={{textAlign: "center"}}>{this.state.moonMsg ? this.state.moonMsg : moonMsg}</div>
                    <div style={{textAlign: "center"}}>{this.state.lagnaMsg ? this.state.lagnaMsg : lagnaMsg}</div>
                  </div>
                  <div style={{columnCount: 3, marginTop: 16}}>
                    <div style={{textAlign: "center"}}>{this.state.tithiMsg ? this.state.tithiMsg : tithiMsg}</div>
                    <div style={{textAlign: "center"}}>{this.state.naksatraMsg ? this.state.naksatraMsg : naksatraMsg}</div>
                    <div style={{textAlign: "center"}}>{this.state.yogaMsg ? this.state.yogaMsg : yogaMsg}</div>
                  </div>
                  <div style={{marginTop: 16, marginLeft: 8, marginRight: 8}}>
                    <div style={{float: "left", width: 190}}>Ghaṭikās</div>
                    <div style={{float: "left", width: 100}}>{this.state.sunriseText}</div>
                    <div style={{textAlign: "right"}}>{this.state.fromsunrise}</div>
                  </div>
                  <div style={{marginLeft: 8, marginRight: 8}}>
                    <Slider 
                    sx={CustomSliderStyles}
                    onChange={this.onSlider1OnChanged}
                      aria-label="Volume" 
                      size="small" 
                      min={0} 
                      max={60} 
                      step={1}                       
                      marks={marks}                      
                      valueLabelDisplay="auto" />
                  </div>
                  <div>Palas</div>
                  <div style={{marginLeft: 8, marginRight: 8}}>
                    <Slider 
                    sx={CustomSliderStyles}
                    onChange={this.onSlider2OnChanged}
                      aria-label="Volume" 
                      size="small" 
                      min={0} 
                      max={60} 
                      step={1}   
                      marks={marks}                    
                      valueLabelDisplay="off" />
                  </div>
                </div>
                  
                
            </Box>
          </Dialog>
        </div>
      );
    }
}

export default withTranslation()(TimeDialog);