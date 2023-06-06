import React from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Utils from '../../data/Utils'
import TithiCanvas from '../canvas/TithiCanvas'
import BaseLineCanvas from '../canvas/BaseLineCanvas'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import eclipse1 from "../../media/Eclipse1.gif"
import eclipse2 from "../../media/Eclipse2.gif"
import PlanetDialog from '../options/PlanetDialog';
import TimeDialog from '../options/TimeDialog';
import WukuDialog from '../options/WukuDialog'
import html2canvas from 'html2canvas'

import Dialog from '@mui/material/Dialog';
import Draggable from "react-draggable";
import Paper from '@mui/material/Paper';

import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

import { sprintf } from "sprintf-js";
import { withTranslation } from 'react-i18next';

const style = {};

const EpochJul = 588465.5

const SineTable = [0, 225, 449, 671, 890, 1105, 1315, 1520,
  1719, 1910, 2093, 2267, 2431, 2585, 2728, 2859,
  2978, 3084, 3177, 3256, 3331, 3372, 3409, 3431, 3438];

const SineVersTable = [0, 7, 29, 66, 117, 182, 261, 354];

const TithiName = ["pratipadā","dvitīya","tr̥tīya","caturthī",
					"pañcamī","ṣaṣṭhī",
					"saptamī","aṣṭamī","navamī","daśamī",
					"ekādaśī", "dvādaśī","trayodaśī",
					"caturdaśī", "pūrṇimā "]

const NakName1 = ["aśvinī","bharaṇī","kr̥ttikā","rohiṇī",
					"mr̥gaśiras","ārdrā","punarvasū", "puṣya","āśleṣā",
					"maghā","p.phalgunī","u.phalgunī", "hasta", "citrā",
					"svāti","viśākhā","anurādhā","jyeṣṭhā",
					"mūla","p.āṣāḍhā","u.āṣāḍhā",
					"śravaṇā","dhaniṣṭha","śatabhiṣaj","p.bhadrapadā",
					"u.bhadrapadā", "revatī"];       

const YogaName = ["viṣkamba","prīti","āyuṣmat","saubhāgya",
					"śobhana","atigaṇḍa","sukarman", "dhr̥ti","śūla",
					"gaṇḍa","vr̥ddhi","dhruva","vyāghāta","harṣaṇa",
					"vajra","siddhi","vyatipāta", "varīyas","parigha","śiva","siddha",
					"sādhya","śubha","śukla","brahman","indra","vaidhr̥ti"];

const Karana = ["Kiṁstughna","Bava","Vālava","Kaulava","Taitila","Gara",
          "Vaṇija","Viṣṭi","Śakuni","Nāga","Catuṣpada"];


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

var longDiffMsg;
var longLatfMsg;
var wukuMsg;
var typMsg;
var leftMsg;
var yearMsg;
var yearSave;
var kiranaLeftMsg;
var kiranaRightMsg;

var currentJD;
var sunrise;
var kYDay;

var trueTithiJD;
var trueNakshJD;
var trueYogaJD;

var elippseIco = -1;
var tithiCanvasParams;
var nakCanvasParams;
var yogaCanvasParams;

var curWukTarget = []

var sunrise;
var sunriseText;
var hasBija;

class DayDialog extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

    constructor(props) {
        super(props)      
        
        this.state = {
            wukuSelected: this.props.cookies.get("wukuChecked") ? this.props.cookies.get("wukuChecked") == "true" : false,
            zIndex: 1500

          }

        this.handleClose = this.handleClose.bind(this)
        this.handleTitleClick = this.handleTitleClick.bind(this)
        this.handleAutoSearch = this.handleAutoSearch.bind(this)
        
        this.onPlanet = this.onPlanet.bind(this)        
        this.planetCloseHandleCallback = this.planetCloseHandleCallback.bind(this)
        this.planetBringToFrontHandleCallback = this.planetBringToFrontHandleCallback.bind(this)

        this.onWuku = this.onWuku.bind(this)        
        this.wukuCloseHandleCallback = this.wukuCloseHandleCallback.bind(this)
        this.wukuBringToFrontHandleCallback = this.wukuBringToFrontHandleCallback.bind(this)

        this.onTime = this.onTime.bind(this)        
        this.timeCloseHandleCallback = this.timeCloseHandleCallback.bind(this)
        this.timeBringToFrontHandleCallback = this.timeBringToFrontHandleCallback.bind(this)

        this.doStep = this.doStep.bind(this)
        this.handleAutoSearch = this.handleAutoSearch.bind(this)

    }

    componentDidMount() {
    }

    handleClose() {

      this.props.handleCloseCallback()

    }

    handleSave() {
      var d = document.getElementById("image")
      html2canvas(d).then(canvas => {
        var imageData = canvas.toDataURL("image/png");
        var newData = imageData.replace(/^data:image\/png/, "data:application/octet-stream");

        var date = new Date()

        var dd = date.getDate()
        var month = date.getMonth()
        var year = date.getFullYear()
        var hh = date.getHours()
        var mm = date.getMinutes()
        
        var filename = sprintf("hic-day_%1$s.jpg", yearSave)


        var aDownload = document.getElementById("aDownload")
        aDownload.download = filename
        aDownload.href = newData
        aDownload.click()      
      }
      )
    }

    dayWindow(slot) {
      var wkDy = "";
      var msg1, tit0, tit1, tit2, tit3, tit4;
      var tt, x; //double
      var frac0, frac1, frac2, frac3, frac4; // long
            
      switch (slot % 7) {
        case 1: wkDy = "Mo"; break;
        case 2: wkDy = "Tu"; break;
        case 3: wkDy = "We"; break;
        case 4: wkDy = "Th"; break;
        case 5: wkDy = "Fr"; break;
        case 6: wkDy = "Sa"; break;
        case 0: wkDy = "Su"; break;
      }

      var day = parseInt(slot -this.props.startSlot + 1);
      var ky = this.props.kaliyuga;

      if (this.props.button === "Caitra" || this.props.button === "Adhika Caitra") ky = ky + 1;
      
      typMsg = "";
      
      switch (parseInt(this.props.yType)) {
        case 0: typMsg = sprintf("|KY %1$4d", ky); break;        
        case 1: typMsg = sprintf("|Vikrama %1$5d", ky-3044); break;
        case 2: typMsg = sprintf("|Śaka %1$5d", ky-3179); break;        
      }

      
      typMsg = sprintf("%1$s %2$s #%3$2d|", typMsg, this.props.outName[this.props.currentMonth], day)

      
      //String[] cs = {" [SurS]", " [SurS(Old)]", " [Aryabh]"};
      //msg = msg + cs[calendar];
      //Color myRed = new Color(255,100,100);
      //dDateH.setForeground(myRed);

      var msgW;
      var y1 = this.props.wY[day]; // long
      if (y1 <= 0) {
        y1 = -y1 + 1;
        msgW = "BC";
      } else {
        msgW = "AD";
      }

      msgW = sprintf("%1$s %2$4d %3$s %4$2d %5$s", msgW, y1, this.props.westMonth[parseInt(this.props.wM[day])-1], 
        this.props.wD[day],  wkDy)

        yearSave = sprintf("%1$4d_%2$2d_%3$2d", y1, parseInt(this.props.wM[day]), 
        this.props.wD[day])
      
      
      var temp = this.props.facSidCiv * this.props.timeDiff / 86400;
      var sign = 1;
      if (temp < 0) sign = -1;

      temp = Math.abs(temp);
      longDiffMsg = this.dec2GhatPal(temp, this.props.sexDec);
      if (sign < 0) longDiffMsg = "Long. diff -" + longDiffMsg;
      else longDiffMsg = "Long. diff +" + longDiffMsg;

      if (this.props.addIn) {
        longDiffMsg ="Long. diff. included";
      }
      
      currentJD = this.props.startDate + day - 1;

      temp = -this.bb(this.props.gLat*60, currentJD);
      sunrise = temp;

      var sr =  parseInt(360 - sunrise*1400+0.5);

      sunriseText = sprintf("Sunrise at %1$2d:%2$2d", sr/60, sr%60);

      if (this.props.gLat >= 0) longLatfMsg = sprintf("%1$4.1f N ", this.props.gLat)
      else  longLatfMsg = sprintf("%1$4.1f S ", -this.props.gLat)

      if (this.props.gLong >= 0) longLatfMsg = longLatfMsg + sprintf("%1$5.1f E ", this.props.gLong)
      else  longLatfMsg = longLatfMsg + sprintf("%1$5.1f W ", -this.props.gLong);
      
      // Wuku periods
      wukuMsg = this.wuku(currentJD);
      
      kYDay = currentJD - 588466 - (this.props.gLong - 75.8)/360;


      hasBija = (this.props.canon.value == 0) && (this.props.kaliyuga >= this.props.bijaBreakpoint);
      var bb = 0;
      if (hasBija) bb = 1;
      var kyDayString = sprintf("%1$10.1f %2$2d %3$2d", kYDay, this.props.canon.value, bb);

      /* abah
      StringSelection selection = new StringSelection(kyDayString);
      
       Toolkit.getDefaultToolkit().getSystemClipboard().setContents(selection, selection);  
       */  
      
      leftMsg = sprintf("%1$7d", currentJD - 588466);

      //Place for Long.diff & sunrise 
      this.tithiJD(this.props.currentMonth, this.props.tith[day] - 1);//Start of tithi
      tt = trueTithiJD;
      x = tt - currentJD;
      var lolim1 = x;
      var lData = tt;
      frac1 = parseInt(x*80+0.5) + 1;
      tit1 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);

      this.tithiJD(this.props.currentMonth, this.props.tith[day] + 1); //End of 2nd tithi
      tt = trueTithiJD;
      x = tt - currentJD;
      frac3 = parseInt(x*80+0.5) + 1;
      tit3 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
      
      this.tithiJD(this.props.currentMonth, this.props.tith[day]); //End of tithi
      tt = trueTithiJD;
      x = tt - currentJD;
      var hilim2 = x;
      var rData = tt;
      elippseIco = 0
      var ecl = 0;  
      if (this.props.tith[day] == 1 || this.props.tith[day] == 16) this.eclipse(lData, parseInt(this.props.tith[day]));
      if (this.props.tith[day] == 15 || this.props.tith[day] == 30) this.eclipse(rData, parseInt(this.props.tith[day]));
      //if (ecl == 1) msgW = msgW + "  o?";
      //if (ecl == 2) msgW = msgW + "  o";
      yearMsg =  msgW
      frac2 = parseInt(x*80+0.5) + 1;
      tit2 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);

      this.tithiJD(this.props.currentMonth, this.props.tith[day] - 0.5); //Middle of tithi
      tt = trueTithiJD;
      x = tt - currentJD;
      var hilim1 = x;
      var lolim2 = x;
      frac0 = parseInt(x*80+0.5) + 1;
      tit0 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
  
      this.tithiJD(this.props.currentMonth, this.props.tith[day] + 0.5);//Middle of 2nd tithi
      tt = trueTithiJD;
      x = tt - currentJD;
      frac4 = parseInt(x*80+0.5) + 1;
      tit4 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
      var slott = this.props.tith[day] - 1;
      
      var msg = TithiName[parseInt(slott)%15];
      if (slott < 14) msg = msg + " śukla";
      if (slott > 14) msg = msg + " kr̥ṣṇa";
      if (slott == 29) msg = "amāvāsya";
      if (slott == 14) msg = "pūrṇimā";
      
      msg = sprintf("%1$2d: ", this.props.tith[day]) + msg;
      
      tithiCanvasParams = {
        frac0: frac0,
        frac1: frac1,
        frac2: frac2,
        frac3: frac3,
        frac4: frac4,
        tit0: tit0,
        tit1: tit1,
        tit2: tit2,
        tit3: tit3,
        tit4: tit4,
        message: msg,
        message1: ""
      }

      this.nakshatraJD(this.props.currentMonth, this.props.naksh[day] - 1);//Start of nak
      tt = trueNakshJD;

      x = tt - currentJD;
      if (x > lolim1) lolim1 = x;
      if (x > lolim2) lolim2 = x;
      frac1 = parseInt(x*80+0.5) + 1;
      tit1 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
      
      this.nakshatraJD(this.props.currentMonth, this.props.naksh[day]); //End of nak
      tt = trueNakshJD;
      x = tt - currentJD;
      if (x < hilim1) hilim1 = x;
      if (x < hilim2) hilim2 = x;
      frac2 = parseInt(x*80+0.5) + 1;
      tit2 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
  
      this.nakshatraJD(this.props.currentMonth, this.props.naksh[day] + 1); //End of 2nd nak
      tt = trueNakshJD;
      x = tt - currentJD;
      frac3 = parseInt(x*80+0.5) + 1;
      tit3 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
      slott = this.props.naksh[day];
      while (slott > 27) slott = slott - 27;
      msg = sprintf("%1$2d: ", slott) + NakName1[parseInt(slott)-1];
      slott = slott + 1;
      while (slott > 27) slott = slott - 27;
      msg1 = sprintf("%1$2d: ", slott) + NakName1[parseInt(slott)-1];

      
      nakCanvasParams = {
        frac0: -500,
        frac1: frac1,
        frac2: frac2,
        frac3: frac3,
        frac4: 0,
        tit0: "",
        tit1: tit1,
        tit2: tit2,
        tit3: tit3,
        tit4: "",
        message: msg,
        message1: msg1
      }

      this.yogaJD(this.props.currentMonth, this.props.yg[day] - 1);//Start of nak
      tt = trueYogaJD;
      x = tt - currentJD;
      if (x > lolim1) lolim1 = x;
      if (x > lolim2) lolim2 = x;
      frac1 = parseInt(x*80+0.5) + 1;
      tit1 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
      
      this.yogaJD(this.props.currentMonth, this.props.yg[day]); //End of nak
      tt = trueYogaJD;
      x = tt - currentJD;
      if (x < hilim1) hilim1 = x;
      if (x < hilim2) hilim2 = x;
      frac2 = parseInt(x*80+0.5) + 1;
      tit2 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
  
      this.yogaJD(this.props.currentMonth, this.props.yg[day] + 1); //End of 2nd nak
      tt = trueYogaJD;
      x = tt - currentJD;
      frac3 = parseInt(x*80+0.5) + 1;
      tit3 = this.dec2GhatPal(tt-parseInt(tt), this.props.sexDec);
      slott = this.props.yg[day];
      while (slott > 27) slott = slott - 27;
      msg = sprintf("%1$2d: ", slott) + YogaName[parseInt(slott)-1];
      slott = slott + 1;
      while (slott > 27) slott = slott - 27;
      msg1 = sprintf("%1$2d: ", slott) + YogaName[parseInt(slott)-1];

      yogaCanvasParams = {
        frac0: -500,
        frac1: frac1,
        frac2: frac2,
        frac3: frac3,
        frac4: 0,
        tit0: "",
        tit1: tit1,
        tit2: tit2,
        tit3: tit3,
        tit4: "",
        message: msg,
        message1: msg1
      }
      
      var karanaString = Karana[this.findKarana(2*parseInt(this.props.tith[day])-1)];
      if (hilim1 > lolim1) {
        x = lolim1-parseInt(lolim1);
        if (x < 0) x = x + 1;
        kiranaLeftMsg = karanaString + " "+ this.dec2GhatPal(x, this.props.sexDec) + "-";
        x = hilim1 - parseInt(hilim1);
        if (x < 0) x = x + 1;
        kiranaLeftMsg = kiranaLeftMsg + this.dec2GhatPal(x, this.props.sexDec);
      } else kiranaLeftMsg = karanaString + " no overlap";

      
      karanaString = Karana[this.findKarana(2*parseInt(this.props.tith[day]))];
      if (hilim2 > lolim2) {
        x = lolim2-parseInt(lolim2);
        if (x < 0) x = x + 1;
        kiranaRightMsg = karanaString + " " + this.dec2GhatPal(x, this.props.sexDec) + "-";
        x = hilim2 - parseInt(hilim2);
        if (x < 0) x = x + 1;
        kiranaRightMsg = kiranaRightMsg + this.dec2GhatPal(x, this.props.sexDec);
      } else kiranaRightMsg = karanaString + " no overlap";
      
    }

    dec2GhatPal (dec, sexDec) {//Converts decimal to ghatika/pala
      var slask;
      var txt;
      if (sexDec) {
        slask = dec * 60;
        var m = parseInt(Math.round((slask - parseInt(slask)) * 60));
        if (m == 60) {
          m = 0;
          slask = slask + 1;
        }
        if (slask == 60) slask = 0;
        txt = sprintf("%1$2d'",parseInt(slask));
        if  (m < 10) return txt + "0" + sprintf("%1$d''",m);
        else return txt + sprintf("%1$2d''",m);
      } else {
        return sprintf("%1$5.3f",dec);
      }
    }

    bb(fi, t) {	//b in van Wijk p.6 HC:V
      var tl = this.tropicalLong(t);
      tl = tl / this.props.sidYear * 360 * 60;
      var sinT = -this.hinduSine(tl);
      var decl = Math.sin(tl*3.14159/180/60)*Math.sin(24*3.1416/180);
      decl = Math.atan(decl/Math.sqrt(1-decl*decl))*180/3.1416;
      var sinb = 1397 * this.tanFi(fi) / (3438 - this.sVers(decl)) * sinT;//Denominator=cos(decl)>0
      //double sV = InverseSine(Math.abs(sinB)) / 21600 * facSidCiv;
      var sV = -this.tanFi(fi)*Math.sin(decl*3.1416/180)/Math.cos(decl*3.1416/180);
      return Math.atan(sV/Math.sqrt(1-sV*sV))*180/3.1416/360;
    }

    tropicalLong(t) {
      var trop = this.trueLongitude(t) + this.precession(t);
      if (trop >= this.props.sidYear) trop = trop - this.props.sidYear;
      if (trop < 0) trop = trop + this.props.sidYear;
      return trop;
    }

    trueLongitude (t) {	//True longitude of sun
      t = t - this.props.solarJuldate;
      var gSA = this.props.mean ? Utils.sunAnomaly(t, this.props.canon.value, this.props.degr, this.props.sidYear, this.props.synMonth)* this.props.sidYear / this.props.synMonth
      : 0;
  
      t = t + gSA - this.props.sodhya;
      if (t < 0) t = t + this.props.sidYear;
      if (t > this.props.sidYear) t = t - this.props.sidYear;
      return t;//Sid Days
    }

    hinduSine (x) {
      var a2;
      while (x < 0) x = x + 360.0 * 60;
      while (x >= 360.0*60) x = x - 360.0 * 60;
      var quadrant = parseInt(x / 60 / 90) + 1;		//Get the quadrant

      if (x >= 180.0 * 60) x = 360.0 * 60 - x;		//Scale to first quadrant
      if (x >= 90.0 * 60) x = 180.0 * 60 - x;
        
      var bigN = parseInt(x / 225);						//Get index for table
      var delta = x - bigN * 225;					//Offset from index
      var a1 = SineTable[bigN];
      if (bigN == 24) a2 = a1; 
      else a2 = SineTable[bigN + 1];	 
      var c = (a2 - a1) / 225;
      var s = a1 + c * delta;						//Linear interpolation
  
      switch (parseInt(quadrant)) {
        case 3:
        case 4: 
          s = -s;
          break;									//Fix sign for quadrant
        default:
          break;
      }
  
      return s;
    }

    tanFi(x) {
      var s = this.hinduSine(x);
      return s / Math.sqrt(3438.0*3438.0-s*s);
    }

    sVers(x) { //Sine Vers
      var a2;
      while (x < 0) x = x + 360.0 * 60;
      while (x >= 360.0 * 60) x = 360.0 * 60 - x;

      var quadrant = parseInt(x / 60 / 90) + 1;
  
      if (x >= 180.0 * 60) x = 360.0 * 60 - x;
      if (x >= 90.0 * 60) x = 360.0 * 60 - x;
  
      var bigN = parseInt(x / 225);
      var delta = x - bigN * 225.0;
      var a1 = SineVersTable[bigN];
      if (bigN == 24) a2 = a1; 
      else a2 = SineVersTable[bigN + 1];
      var c = (a2 - a1) / 225;
      var s = a1 + c * delta;
  
      switch (quadrant) {
        case 3:
        case 4: s = -s; break;
      }
      return s;
    }

    precession (julday) {
      var epoch1 = EpochJul + 1800 * this.props.sidYear;				//Break points for zig-zag function
      var epoch2 = EpochJul + 5400 * this.props.sidYear;
      var slask = -(julday - EpochJul) * this.props.precessionConst;
      if (julday > epoch1) slask = slask + 2 * (julday - epoch1) * this.props.precessionConst;
      if (julday > epoch2) slask = slask - 2 * (julday - epoch2) * this.props.precessionConst;
      return slask;
    }

    wuku (jd) {
      const sixDay = ["TU", "HA", "WU", "PA", "WA", "MA"];
      const fiveDay = ["PA", "PO", "WA", "KA", "UM"];
        
      var jdInt = parseInt((jd + 65) % 210);
      var wk = parseInt(((jd + 64) % 210) / 7 + 1);

      curWukTarget[0] = jdInt % 6;			//Save current wuku in globals
      curWukTarget[1] = jdInt % 5;
      curWukTarget[2] = jdInt % 7;
      if (curWukTarget[0] == 0) curWukTarget[0] = 6;
      if (curWukTarget[1] == 0) curWukTarget[1] = 5;
      if (curWukTarget[2] == 0) curWukTarget[2] = 7;
      
      var str = sixDay[curWukTarget[0]-1]; //Compose wuku string}
      var str1 = fiveDay[curWukTarget[1]-1];
      str = str + " " + str1;
      str1 = this.props.sevenDay[curWukTarget[2]-1];
      str = str + " " + str1;
      str1 = this.props.wukWeek[wk-1];
      str = str + " " + str1; 
      return str;
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

    eclipse (t,  i) {
      var slask = this.props.nodeRevPDay * (t - EpochJul - 0.25);
      if (this.props.canon.value == 2) slask = slask - 0.25 *  this.props.nodeRevPDay;
      slask = slask - parseInt(slask);
      slask = 1 - slask;					//Node travels backwards
      var e = parseInt(Math.abs(slask - this.trueLongitude(t) / this.props.sidYear) * 2000+0.5); 
      //e is distance from node in units of 1000
      if (e > 1000) e = e - 1000;
      var s = 0;
  
      if (i == 1 || i == 30) {//Eclipse limits here are from Jacobi via Ginzel
        if (e <= 90 || e >= 910) s = 2;
        else if (e <= 105 || e >= 895) s = 1;
      }
      if (i == 15 || i == 16) {
        if (e <= 58 || e >= 942) s = 2;
        else if (e <= 77 || e >= 923) s = 1;
      }
  
      if (s == 1) elippseIco = 1;	//Insert eclipse symbol
      if (s == 2) elippseIco = 2;
      
      //return s;
      //System.out.println(s);
      //if (ic1 == null) System.out.println("null");
    }

    nakshatraJD (mm, naksh) {
      var nak0 = (this.props.mmMonth[mm] - this.props.solarJuldate - this.props.sodhya) * 27 / this.props.sidYear;
      while (nak0 > 27) nak0 = nak0 - 27;

      trueNakshJD = naksh - nak0;
      trueNakshJD = trueNakshJD * this.props.sidMonth / 27;

      var am = this.props.aMoon[mm] + trueNakshJD;
      trueNakshJD = this.props.mmMonth[mm] + trueNakshJD;

      if (! this.props.mean) return;
  
      while (am > this.props.anomMonth) am = am - this.props.anomMonth;
      
      var aa = 0;
      for (var i=0; i<5; i++) aa = Utils.moonAnomaly(am + aa * this.props.sidMonth / this.props.synMonth, this.props.canon.value, this.props.anomMonth, this.props.synMonth);
      
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

    findKarana(k) {
      switch (k) {
        case 1: return 0; 
        case 58: return 8; 
        case 59: return 9; 
        case 60: return 10; 
        default:
          var n = (k - 1) % 7;
          if (n == 0) n = 7;
          return n; 
      }
    }

    handleCookie(name, value) {
      const { cookies } = this.props;
      cookies.set(name, value, { path: "/" }); // setting the cookie
    } 

    onPlanet(e) {
      this.handleCookie("planeChecked", e.target.checked)
      this.props.planetCheckedCallback(e.target.checked)
    }

    onWuku(e) {
      this.handleCookie("wukuChecked", e.target.checked)
      this.props.wukuCheckedCallback(e.target.checked)
    }

    doStep(dir, selected1, selected2, selected3) {

      var offset = 1000, mmm, mmm1;
      var delta = 0;
      var hit0, hit1, hit2;
      var str;
      if (selected1 < 6) {
        delta = 6;
        offset = (selected1-(curWukTarget[0]-1) + 6)%6;
      }
      if (selected2 < 5) {
        delta = 5;
        offset = (selected2-(curWukTarget[1]-1) + 5)%5;
      }
      if (selected3 < 7) {
        delta = 7;
        offset = (selected3-(curWukTarget[2]-1) + 7)%7;
      }
      if (offset == 1000) return;//All wildcards
      
      if (dir < 0 & offset != 0) offset = delta - offset;
      currentJD = currentJD + offset*dir;
      if (offset == 0) currentJD = currentJD + delta*dir;
  
      var count = 0;
      do {
        str = this.wuku(currentJD);
        hit0 = false;
        if (selected1 == 6 || selected1 == curWukTarget[0]-1) hit0 = true;
        hit1 = false;
        if (selected2 == 5 || selected2 == curWukTarget[1]-1) hit1 = true;
        hit2 = false;
        if (selected3 == 7 || selected3 == curWukTarget[2]-1) hit2 = true;
        currentJD = currentJD + delta*dir;
        count = count + 1;
      } while ((!hit0 || !hit1 || !hit2) && count <= 40);
      if (count == 40) {
        return; //Safeguard
      }
      
      currentJD = currentJD - delta*dir;
      //Get number of months
      var numMonths = 0;

      while (this.props.outName[numMonths] != "") numMonths = numMonths + 1;
      //Get start of first month
      
      mmm = this.props.mean ? parseInt(this.props.mtMonth[0]) + 1 : this.props.mmMonth[0] + 1


      var kaliyuga = this.props.kaliyuga

      if (currentJD < mmm) {//currentJD in previous year, step back
          kaliyuga = kaliyuga -1 
          if (kaliyuga < 0) {            
              kaliyuga = 0
              return
          }
      }
          
      //Get first month of next year
      mmm = this.props.mean ? parseInt(this.props.mtMonth[numMonths]) + 1 : this.props.mmMonth[numMonths] + 1
      if (currentJD >= mmm) {//Need to step up
          kaliyuga = kaliyuga + 1             
  
          if (kaliyuga >6000) {
            this.props.updateKaliyugaCallback(6000, 0, false, dir)
            return;
          } 
      }

      if (kaliyuga != this.props.kaliyuga) {
        this.props.updateKaliyugaCallback(kaliyuga, currentJD, true, dir)
      }
      else {
        numMonths = 0;//Recalculate # of months
        while (this.props.outName[numMonths] != "") numMonths = numMonths + 1;
        var j = -1;//Assume not found a month
        for (var i = 0; i < numMonths-1; i++) {
                mmm = this.props.mean ? parseInt(this.props.mtMonth[i]) + 1 : parseInt(this.props.mmMonth[i]) + 1
                mmm1 = this.props.mean ? parseInt(this.props.mtMonth[i+1]) + 1 : parseInt(this.props.mmMonth[i+1]) + 1
    
          if (mmm <= currentJD && mmm1 > currentJD) j = i;//Found a month
        }

        if (j == -1) {
          this.doStep(dir, selected1, selected2, selected3)
          return; //Shouldn't happen
        }

        this.props.updateCalendarIndexCallback(j, currentJD, this.props.outName[j], dir)
      }
      
  
    }

    wukuCloseHandleCallback() {
      this.handleCookie("wukuChecked", false)

      this.setState(
        {
          wukuSelected: false
        }
      )

      this.props.wukuHandleCallback(false)
    }

    onTime(e) {
      this.handleCookie("timeChecked", e.target.checked)
      this.props.timeCheckedCallback(e.target.checked)
    }

    planetCloseHandleCallback() {
      this.handleCookie("planeChecked", false)
      this.props.planetCloseHandleCallback()
    }

    planetBringToFrontHandleCallback() {
      this.props.planetBringToFrontHandleCallback()
    }

    timeBringToFrontHandleCallback() {
      this.props.timeBringToFrontHandleCallback()
    }

    wukuBringToFrontHandleCallback() {
      this.props.wukuBringToFrontHandleCallback()
    }

    wukuCloseHandleCallback() {
      this.handleCookie("wukuChecked", false)
      this.props.wukuCloseHandleCallback()
    }

    timeCloseHandleCallback() {
      this.handleCookie("timeChecked", false)
      this.props.timeCloseHandleCallback()
    }

    handleTitleClick() {
      this.props.dayBringToFrontHandleCallback()
    }
    
    handleAutoSearch() {
      this.props.handleAutoSearch()
    }

    render() {
      const { t } = this.props;
      
      if (typeof this.props.startSlot !== 'undefined' && this.props.startSlot != null && 
        typeof this.props.kaliyuga !== 'undefined' && this.props.kaliyuga != null) {
        this.dayWindow(this.props.slotChosen)
      }

      return (
        <div onMouseDown={this.handleTitleClick}>          
          <Dialog
            PaperComponent={PaperComponent}
            disableEnforceFocus
            BackdropProps={{ style: { backgroundColor: "transparent" } }}
            style={{ pointerEvents: 'none', zIndex: this.props.zIndex }}
            PaperProps={{ style: { pointerEvents: 'auto' }, sx: {width: 325, position: "fixed", top: 120, left: 0} }}
            open={this.props.open}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <a id="aDownload" style={{display: "none"}}></a>
              <div className="Hic-Dialog-Title"  id="draggable-dialog-title">                  
                    <div className="Hic-Dialog-Title-Text">Day</div>
                    <div style={{textAlign: "right"}}>
                    <IconButton aria-label="dclose" onClick={this.handleSave}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton aria-label="dclose" onClick={this.handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
                <div id="image" style={{fontFamily: "Noto Serif", fontSize: "0.75em", marginTop: 8}}>
                  <div>
                      <div className="Hic-Location">
                        <div style={{textAlign: "left", marginLeft: 8}}>{kiranaLeftMsg}</div>
                        <div style={{textAlign: "right", marginRight: 8}}>{kiranaRightMsg}</div>
                      </div>
                      <div style={{marginTop: 8}}>
                        <div style={{height: 28}}>
                          <TithiCanvas 
                          data={yogaCanvasParams} />
                        </div>
                        <div style={{height: 28}}>
                          <TithiCanvas 
                          data={nakCanvasParams} />
                        </div>
                        <div style={{height: 28}}>
                      <TithiCanvas 
                          data={tithiCanvasParams} />
                        </div>
                        <div style={{height: 28}}>
                      <BaseLineCanvas />
                        </div>
                      </div>
                  </div>
                  <div style={{textAlign: "center", marginTop: 4}}>
                    {typMsg}
                  </div>
                  <div style={{textAlign: "center", marginTop: 8}}>
                    <img src={elippseIco == 1 ? eclipse2 : elippseIco == 2 ? eclipse1 : null} /><span style={{marginLeft: 10}}>{yearMsg}</span>
                  </div>
                  <div className="Hic-Location" style={{marginTop: 8}}>
                    <div style={{textAlign: "center", fontSize: "11px"}}>{leftMsg}</div>
                    <div style={{textAlign: "center", fontSize: "11px"}}>{wukuMsg}</div>                
                  </div>
                  <div className="Hic-Location" style={{marginTop: 8}}>
                    <div style={{textAlign: "center", fontSize: "11px"}}>{longDiffMsg}</div>
                    <div style={{textAlign: "center", fontSize: "11px"}}>{longLatfMsg}</div>                
                  </div>
                </div>
                <div style={{marginTop: 8, marginBottom: 4, marginLeft: 4}}>
                  <div className="Hic-Day-Checkbox"><FormControlLabel onChange={this.onWuku} control={<Checkbox size="small" checked={this.props.wukuSelected ? this.props.wukuSelected: false}/>} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "0.75em"}}>Search Wuku</Typography>} /></div>
                  <div className="Hic-Day-Checkbox"><FormControlLabel onChange={this.onPlanet} control={<Checkbox size="small" checked={this.props.planetSelected ? this.props.planetSelected: false} />} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "0.75em"}}>Planets</Typography>} /></div>
                  <div className="Hic-Day-Checkbox"><FormControlLabel onChange={this.onTime} control={<Checkbox size="small" checked={this.props.timeSelected ? this.props.timeSelected: false} />} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "0.75em"}}>Time</Typography>} /></div>
                </div>
                
            </Box>
          </Dialog>
          <div>
            <PlanetDialog     
                zIndex={this.props.zIndexPlanet}
                open={this.props.planetSelected} 
                hasBija={this.props.kaliyuga >= this.props.bijaBreakpoint}
                planetBringToFrontHandleCallback={this.planetBringToFrontHandleCallback}
                planetCloseHandleCallback={this.planetCloseHandleCallback}
                kYDay={kYDay}
                canon={this.props.canon}
                />
          </div>
          <div>
            <TimeDialog     
            zIndex={this.props.zIndexTime}
            sunriseText={sunriseText}
            mean={this.props.mean}
            b={hasBija}
            sunrise={sunrise}
            gLat={this.props.gLat}
            canon={this.props.canon}
            kYDay={kYDay}
            timeCloseHandleCallback={this.timeCloseHandleCallback}
            timeBringToFrontHandleCallback={this.timeBringToFrontHandleCallback}
            open={this.props.timeSelected} 
            />
          </div>    
          <WukuDialog     
                  sevenDay={this.props.sevenDay}
                  wukWeek={this.props.wukWeek}
                  autoSearch={this.props.autoSearch}
                  searchDir={this.props.searchDir}
                  open={this.props.wukuSelected} 
                  zIndex={this.props.zIndexWuku}
                  doStep={this.doStep}
                  curWukTarget={curWukTarget}
                  wukuCloseHandleCallback={this.wukuCloseHandleCallback}
                  handleAutoSearch={this.handleAutoSearch}
                  wukuBringToFrontHandleCallback={this.wukuBringToFrontHandleCallback}
                />        
        </div>
      );
    }
}

export default withCookies(withTranslation()(DayDialog));