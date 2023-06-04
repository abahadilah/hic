import React from "react";
import Box from '@mui/material/Box';
import Utils from '../../data/Utils'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DayDialog from '../options/DayDialog'
import Dialog from '@mui/material/Dialog';
import Draggable from "react-draggable";
import Paper from '@mui/material/Paper';

import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

import { sprintf } from "sprintf-js";
import { withTranslation } from 'react-i18next';

var calendarDialogX;
var calendarDialogY;

const handleStop = (event, dragElement) => {
  calendarDialogX = dragElement.x
  calendarDialogY = dragElement.y    
};

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      onStop={(event, dragElement) => {
        handleStop(event, dragElement)
      }} 

    >
      <Paper {...props} />
    </Draggable>
  );
}

const style = {};

const Weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
var daySlot= []
var nak;
var yoga;
var trueTithiJD;
var trueNakshJD;
var trueYogaJD;

var wDay = 0
var wMonth = 0
var wYear = 0

var wY = []
var wM = []
var wD = []

var tith = []
var naksh = []
var yg = []

var selected = null
var startSlot;
var currentMonth;
var startDate;

class CalendarDialog extends React.Component {
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props)      
        
        this.state = {
            open: this.props.open,
            slotChosen: null,
            startSlot: null,
            currentMonth: null,
            wY: null,
            wM: null,
            wD: null,
            startDate: null,
            tith: null,
            naksh: null,
            yg: null,
            leftChild: 0
        }

        this.handleClose = this.handleClose.bind(this)
        this.onClick = this.onClick.bind(this)
        this.monthWindow = this.monthWindow.bind(this)
        this.updateKaliyugaHandleCallback = this.updateKaliyugaHandleCallback.bind(this)
        this.wukuHandleCallback = this.wukuHandleCallback.bind(this)
        this.handleTitleClick = this.handleTitleClick.bind(this)
        this.handleDialogMove = this.handleDialogMove.bind(this)
        this.handleAutoSearch = this.handleAutoSearch.bind(this)
    }

    componentDidMount() {
      
    }

    handleCookie(name, value) {
      const { cookies } = this.props;
      cookies.set(name, value, { path: "/" }); // setting the cookie
    } 

    handleTitleClick() {
      this.props.calendarBringToFrontHandleCallback()
    }

    handleDialogMove() {
    }

    updateKaliyugaHandleCallback = (data) =>{
      
    }

    wukuHandleCallback = (data) => 
    {
      this.props.wukuHandleCallback(data)
    }

    dayDialogHandleCloseCallback = () => {
      this.props.dayDialogHandleCloseCallback()  
    }

    planetCheckedCallback = () => {
      this.props.planetCheckedCallback()  
    }

    planetBringToFrontHandleCallback = () => {
      this.props.planetBringToFrontHandleCallback()  
    }

    timeBringToFrontHandleCallback = () => {
      this.props.timeBringToFrontHandleCallback()  
    }

    wukuBringToFrontHandleCallback = () => {
      this.props.wukuBringToFrontHandleCallback()  
    }
    
    dayBringToFrontHandleCallback = () => {
      this.props.dayBringToFrontHandleCallback()  
    }

    wukuCheckedCallback = () => {
      this.props.wukuCheckedCallback()  
    }

    updateKaliyugaCallback = (kaliyuga, currentJD, show, dir) => {
      this.props.updateKaliyugaCallback(kaliyuga, currentJD, show)  

      setTimeout(() => {
        var slot = parseInt(startSlot + currentJD - startDate);
        this.chooseSlot(slot, dir)
        
      }, 100)
    }

    updateCalendarIndexCallback = (index, currentJD, name, dir) => {

      this.props.updateCalendarIndexCallback(index, name)

      
      this.monthWindow(index)
      var slot = parseInt(startSlot + currentJD - startDate);

      setTimeout(this.chooseSlot(slot, dir), 100)

      /*
      currentMonth = j;
		MonthWindow(currentMonth);
		long slot = startSlot + currentJD - startDate;
		daySlotPanel[slotChosen/7][slotChosen%7].setBackground(Color.white);
		slotChosen = (int)slot;
		daySlotPanel[slotChosen/7][slotChosen%7].setBackground(Color.lightGray);
		DayWindow(slotChosen);
      */

    }

    chooseSlot(slot, dir) {
        var b = document.getElementById("date_" + slot)
        if (b != null) {
          b.click()
        }
        else {
          this.setState(
            {
                "autoSearch": true,
                "searchDir": dir
            }
          )

        }
    }

    handleAutoSearch() {
      this.setState({
        "autoSearch": false,
      })
    }

    timeCheckedCallback = () => {
      this.props.timeCheckedCallback()  
    }
    
    handleClose() {
      this.props.handleCloseCallback()
    }

    monthWindow(mm) {
      
      //double mmm,;		

      var tt;
      var tn;
      var ty;
      var slotString;

      currentMonth = mm;
      for (var k=0; k<6; k++) {
        var days = []
        for (var j=0; j<7; j++) {
          var cells = []
          for (var l=0; l<3; l++) {
            cells[l] = "\u00A0"
          }

          days[j] = cells
        }

        daySlot[k] = days
      }
  /*
      mWindow.setTitle(outName[mm]);
      dWindow.setVisible(false);
      planets.setVisible(false);
      slider.zeroSliders();
      slider.setVisible(false);
      srch.setVisible(false);
  
      mWindow.setVisible(true);
      glass.setVisible(true);
 */     

      var mmm = this.props.mean ? this.props.mtMonth[mm] : this.props.mmMonth[mm]
      startDate = parseInt(mmm) + 1;
      startSlot = (startDate + 1) % 7;
      var endSlot = startSlot;
      
      var k = 0;
      var date;
      var day = 0
      var tit = 1
      var dayTit = 0;
      var dayNk;
      var dayYg;

      this.nakYog(mm);
      var j = parseInt(nak) - 1;
      var n = parseInt(yoga) - 1;
    
      do {
        date = startDate + k;
        day = day + 1;

        do {
          this.tithiJD(mm, tit);
          tit = tit + 1;
          tt = trueTithiJD;
        }
        while (tt <= date && tit !=0);
        tit = tit - 1;
        dayTit = tit;
        
        do {
          this.nakshatraJD(mm, j);
          j = j + 1;
          tn = trueNakshJD;
        }      
        while (tn <= date && j<=60);
        j = j - 1;
        
        dayNk = j;
        while (dayNk > 27) dayNk = dayNk - 27;
        
        do {
          this.yogaJD(mm, n);
          n = n + 1;
          ty = trueYogaJD;
        }
        while (ty <= date && n <= 60);
        
        n = n - 1;
        dayYg = n;
        while (dayYg > 27) dayYg = dayYg - 27;

        
        if (tt > date && dayTit < 31) {

          this.julday2Date(date, this.props.calendar);
          var slot = parseInt(day + startSlot - 1);
          var slotI = parseInt(slot % 7);
          var slotJ = parseInt(slot / 7);

          slotString = sprintf("%1$2d", day)
          daySlot[slotJ][slotI][0] = slotString;
          
          slotString = sprintf("%1$s %2$2d", this.props.westMonth[parseInt(wMonth) - 1], wDay)        
          daySlot[slotJ][slotI][1] = slotString;

          slotString = sprintf("%1$2d %2$2d %3$2d", dayTit, dayNk, dayYg )          
          daySlot[slotJ][slotI][2] = slotString;

          endSlot = endSlot + 1;
          
          var intday = parseInt(day);
          
          wY[intday] = wYear; 
          wM[intday] = wMonth; 
          wD[intday] = wDay;

          tith[intday] = dayTit; 
          naksh[intday] = j; 
          yg[intday] = n;
        }
        k = k + 1;
      }
      while (tt >= date && k<30 && dayTit <= 30);
      endSlot = endSlot - 1;
      
    }

    onClick(e, m, selectedIndex) {
      if (m[0] != "\u00A0") {
        if (selected) {
          selected.className = "Hic-Date-Item"
        }

        if (e.target.id == "datecell") {
          e.target.parentNode.className = "Hic-Date-Item-Selected"
          selected = e.target.parentNode
        }
        else {
            e.target.className = "Hic-Date-Item-Selected"
            selected = e.target
        }
        
        this.setState(
          {            
            slotChosen: selectedIndex,
            startSlot: startSlot,
            currentMonth: currentMonth,
            wY: wY,
            wM: wM,
            wD: wD,
            startDate: startDate,
            tith: tith,
            naksh: naksh,
            yg: yg,
            leftChild: 430,
          }
        )  
        
        this.props.dayOpenHandleCallback()
      }
    }

    nakYog(mm) {
      nak = (this.props.mmMonth[mm] - this.props.solarJuldate - this.props.sodhya)*this.props.synMonth/this.props.sidYear;
      if (nak > this.props.synMonth) nak = nak - this.props.synMonth;
      nak = nak * 27/this.props.synMonth + 1;
      yoga = 2 * (this.props.mmMonth[mm] - this.props.solarJuldate - this.props.sodhya)*this.props.synMonth/this.props.sidYear;
      while (yoga > this.props.synMonth) yoga = yoga - this.props.synMonth;
      yoga = yoga * 27/this.props.synMonth + 1;
    }

    tithiJD (mm, tithi) {
      //Computes end of true/mean tithi in a given month}
        var x = tithi * this.props.tithiUnit;
        trueTithiJD = this.props.mmMonth[mm] + x;
    
        if (! this.props.mean) return;
    
        var as = this.props.aSun[mm] + x;

        as = as - parseInt(as / this.props.sidYear) * this.props.sidYear;

        var am = this.props.aMoon[mm] + x;
        if (am > this.props.anomMonth) am = am - this.props.anomMonth;
        
        var aa = 0;
        for (var i=0; i<4; i++) aa = Utils.sunAnomaly(as + aa, this.props.canon.value, this.props.degr, this.props.sidYear, this.props.synMonth) + Utils.moonAnomaly(am + aa, this.props.canon.value, this.props.anomMonth, this.props.synMonth);
        trueTithiJD = trueTithiJD + aa;
      }

    nakshatraJD (mm, naksh) {
        var nak0 = (this.props.mmMonth[mm] - this.props.solarJuldate - this.props.sodhya) * 27 / this.props.sidYear;
        while (nak0 > 27) nak0 = nak0 - 27;
        
        trueNakshJD = naksh - nak0;
        trueNakshJD = trueNakshJD * this.props.sidMonth / 27;
        
        var am = this.props.aMoon[mm] + trueNakshJD;
        trueNakshJD = this.props.mmMonth[mm] + trueNakshJD;
    
        if (! this.props.mean) return;
    
        while (am > this.props.anomMonth) {
          am = am - this.props.anomMonth;
        }
        
        var aa = 0;        
        for (var i=0; i<5; i++) {
          aa = Utils.moonAnomaly(am + aa * this.props.sidMonth / this.props.synMonth, this.props.canon.value, this.props.anomMonth, this.props.synMonth);
        }
        
        trueNakshJD = trueNakshJD + aa * this.props.sidMonth / this.props.synMonth;
      }  

    yogaJD (mm, yoga) {
      var yogaPer = 1 / (1 / this.props.sidMonth + 1 / this.props.sidYear);
      var yoga0 = 2 * (this.props.mmMonth[mm] - this.props.solarJuldate - this.props.sodhya) * 27 / this.props.sidYear;
      while (yoga0 > 27) yoga0 = yoga0 - 27;

      trueYogaJD = yoga - yoga0;
      trueYogaJD = trueYogaJD * yogaPer / 27;

      var am = this.props.aMoon[mm] + trueYogaJD;
      var as = this.props.aSun[mm] + trueYogaJD;
 
      trueYogaJD = this.props.mmMonth[mm] + trueYogaJD;
      if (! this.props.mean) return;
  
      while (am > this.props.anomMonth) am = am - this.props.anomMonth;
      as = as - parseInt(as / this.props.sidYear) * this.props.sidYear;
      
      var aa = 0;
      for (var i=0; i<3; i++) {
        aa = -Utils.sunAnomaly(as + aa * yogaPer / this.props.synMonth, this.props.canon.value, this.props.degr, this.props.sidYear, this.props.synMonth) + Utils.moonAnomaly(am + aa * yogaPer / this.props.synMonth, this.props.canon.value, this.props.anomMonth, this.props.synMonth);
      }
      trueYogaJD = trueYogaJD + aa * yogaPer / this.props.synMonth;
    }

    julday2Date(jd, styl) {  //Converts Julian day to date. From Meeus
      var z = jd;
      
      if (z < 2299161 && styl == 2) styl = 1;
      if (z >= 2299161 && styl == 2) styl = 0;
      
      var a;
      if (styl == 0){
        var alpha = parseInt((z - 1867216.25)/36524.25);
        a = z + 1 + alpha - parseInt(alpha/4);
      }else
        a = z;
      var b = parseInt(a + 1524);
      var c = parseInt((b-122.1)/365.25);
      var d = parseInt(365.25*c);
      var e = parseInt((b-d)/30.6001);
      wDay = b - d - parseInt(30.6001*e);
      wMonth = (e < 13.5) ?  e-1 : e - 13;
      wYear = (wMonth > 2.5) ? c - 4716 : c - 4715;
    }

    render() {
      if (this.props.index >= 0 && this.props.mmMonth && this.props.aMoon) {
        this.monthWindow(this.props.index)
      }
      
      return (
        <div onMouseDown={this.handleTitleClick} onMouseMove={this.handleDialogMove}>          
          <Dialog
            PaperComponent={PaperComponent}
            disableEnforceFocus
            BackdropProps={{ style: { backgroundColor: "transparent" } }}
            style={{ pointerEvents: 'none', zIndex: this.props.zIndex }}
            PaperProps={{ style: { pointerEvents: 'auto' }, sx: {width: 375, position: "fixed", 
              left: 650, top: 50} }}
            open={this.props.open}
            hideBackdrop={true}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <div className="Hic-Dialog-Title" id="draggable-dialog-title">                  
                    <div className="Hic-Dialog-Title-Text">{this.props.title}</div>
                    <div style={{textAlign: "right"}}>
                      <IconButton aria-label="dclose" onClick={this.handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
            
                  <div className="Hic-Week">
                  {Weekdays.map(
                    (m, index) => <div className="Hic-Week-Item" key={index}>{m}</div>
                  )}
                  </div>
                  <div>
                  {daySlot.map(
                    (m, index) => <div className="Hic-Day-Row" key={index}>
                      {
                        m.map(
                          (m1, index1) => <div id={sprintf("date_%1$d", index*7 + index1)} className={m1[0] != "\u00A0" ? "Hic-Date-Item" : "Hic-Date-Item-Empty"} key={index1}
                            onClick={(e) => this.onClick(e, m1, index*7 + index1)}
                          >
                            {
                              m1.map(
                                (m2, index2) => 
                                <div id="datecell" key={index2}>{m2}</div>
                              )
                            }
                            </div>
                        )
                      }
                    </div>
                  )}
                  </div>                                
            </Box>
          </Dialog>
          <DayDialog 
                  id="dayDialog"
                  zIndexTime={this.props.zIndexTime}
                  zIndexPlanet={this.props.zIndexPlanet}
                  zIndexWuku={this.props.zIndexWuku}
                  zIndex={this.props.zIndexDay}
                  planetCloseHandleCallback={this.props.planetCloseHandleCallback}
                  timeCloseHandleCallback={this.props.timeCloseHandleCallback}
                  wukuCloseHandleCallback={this.props.wukuCloseHandleCallback}
                  handleAutoSearch={this.handleAutoSearch}
                  wukuHandleCallback={this.wukuHandleCallback}
                  sidMonth={this.props.sidMonth}
                  kaliyuga={this.props.kaliyuga}
                  button={this.props.title}       
                  autoSearch={this.state.autoSearch}          
                  searchDir={this.state.searchDir}           
                  nodeRevPDay={this.props.nodeRevPDay}
                  anomMonth={this.props.anomMonth}
                  aMoon={this.props.aMoon}
                  aSun={this.props.aSun}
                  mmMonth={this.props.mmMonth}
                  tithiUnit={this.props.tithiUnit}
                  bijaBreakpoint={this.props.bijaBreakpoint}
                  gLong={this.props.gLong}
                  gLat={this.props.gLat}
                  precessionConst={this.props.precessionConst}
                  sodhya={this.props.sodhya}
                  synMonth={this.props.synMonth}
                  sidYear={this.props.sidYear}
                  canon={this.props.canon}
                  degr={this.props.degr}
                  solarJuldate={this.props.solarJuldate}
                  mean={this.props.mean}
                  addIn={this.props.addIn}
                  sexDec={this.props.sexDec}
                  timeDiff={this.props.timeDiff}
                  facSidCiv={this.props.facSidCiv}
                  westMonth={this.props.westMonth}
                  yType={this.props.yType}
                  outName={this.props.outName}
                  naksh={this.state.naksh}
                  yg={this.state.yg}
                  wD={this.state.wD}
                  wM={this.state.wM}
                  startDate={this.state.startDate}
                  wY={this.state.wY}
                  left={this.state.leftChild}
                  currentMonth={this.state.currentMonth}
                  startSlot={this.state.startSlot}
                  slotChosen={this.state.slotChosen}
                  tith={this.state.tith}
                  handleCloseCallback={this.dayDialogHandleCloseCallback}
                  planetCheckedCallback={this.planetCheckedCallback}
                  planetBringToFrontHandleCallback={this.planetBringToFrontHandleCallback}
                  timeBringToFrontHandleCallback={this.timeBringToFrontHandleCallback}
                  wukuBringToFrontHandleCallback={this.wukuBringToFrontHandleCallback}
                  dayBringToFrontHandleCallback={this.dayBringToFrontHandleCallback}
                  timeCheckedCallback={this.timeCheckedCallback}
                  wukuCheckedCallback={this.wukuCheckedCallback}
                  updateKaliyugaCallback={this.updateKaliyugaCallback}
                  updateCalendarIndexCallback={this.updateCalendarIndexCallback}
                  open={this.props.isDayDialogOpen}
                  planetSelected={this.props.planetSelected}
                  timeSelected={this.props.timeSelected}
                  wukuSelected={this.props.wukuSelected}
                  mtMonth={this.props.mtMonth}  />
        </div>
      );
    }
}

export default withCookies(withTranslation()(CalendarDialog));