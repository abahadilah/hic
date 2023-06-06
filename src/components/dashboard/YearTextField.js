import React from "react";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField"
import InputAdornment from '@mui/material/InputAdornment';
import Canons from '../../data/Canons'
import Calendar from '../../data/Calendar'
import Utils from '../../data/Utils'
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';


import { withTranslation } from 'react-i18next';
import { sprintf } from "sprintf-js";

const EpochJul = 588465.5

const MaxKaliyuga = 6000
const Kaliyuga = 4600
const Kaliyuga_Vikrama = 3044
const Kaliyuga_Saka = 3179

const MaxVikrama = 2956
const MaxSaka = 2821

const Sodhya0 = [2.1697222, 2.2403991, 2.1481170]

const SolMonthAdd0 = [30.9377961, 31.4220707, 31.6449276, 31.4735128, 31.0162434, 30.4387519,
  29.8910569, 29.4890013, 29.3176708, 29.4487867, 29.8228641, 30.3560740]

const SolMonthAdd1 = [30.9029702, 31.4113997, 31.6489129, 31.5274827, 31.0928122, 30.4965689,
    29.9169564, 29.4950396, 29.3142349, 29.4054673, 29.7534887, 30.2934164]

const SolMonthAdd2 = [30.9250571, 31.4009763, 31.6072445 , 31.4679050, 31.0347301, 30.4564537,
      29.9033081, 29.5086541, 29.3506011, 29.4565618, 29.8083998, 30.3387891]

const SMonthCorr = [-6.0233, -4.1131, -0.3521, 3.6690, 5.8458, 6.2909, 5.2879, 3.2345, 0.2653,
    -2.8516, -5.0328, -6.22213]

const JupYearName = ["Vijaya","Jaya","Manmatha","Durmukha","Hemalamba","Vilamba",
    "Vikarin","Śārvarin","Plava","Śubhakr̥t",
    "Śobhana","Krodhin", "Viśvāvasu","Parābhava",
    "Plavaṅga","Kīlaka","Saumya","Sādhāraṇa",
    "Virodhikr̥t","Paridhāvin","Pramādin","Ānanda",
    "Rākṣasa","Anala", "Piṅgala","Kālayukta",
    "Siddhārthin","Raudra","Durmati","Dundubhi",
    "Rudhirodgārin","Raktākṣa","Krodhana","Kṣaya",
    "Prabhava","Vibhava", "Śukla","Pramoda","Prajāpati",
    "Aṅgiras","Śrīmukha","Bhāva",
    "Yuvan","Dhātr̥","Īśvara","Bahudhānya",
    "Pramāthin", "Vikrama", "Vr̥ṣa","Citrabhānu",
    "Subhānu","Tāraṇa","Pārthiva","Viyaya",
    "Sarvajit","Sarvadhārin","Virodhin","Vikr̥ta","Khara","Nandana"];


const ApogeeRevs = [488203.0, 488219.0, 488219.0]
const NodeRevs = [232238.0, 232226.0, 232226.0]
const JupRevs = [364220, 364212]

const MahayugaDays = [1577917828.0, 1577917800.0, 1577917500.0]
const Mahayuga = 4320000.0
const MoonRevs = 57753336

var sodhya = 0.0
var sidYear = 0.0
var sidMonth = 0.0
var synMonth = 0.0
var tithiUnit = 0.0
var anomYear = 0.0
var anomMonth = 0.0
var degr = 0.0
var nodeRevPDay = 0.0
var precessionConst = 0.0
var facSidCiv = 0.0
var jupY = 0.0
var anomEpoch = 0.0
var excessAnom = 0.0
var excessMoon = 0.0
var timeDiff = 0.0
var solarJuldate = 0.0
var jd1 = 0.0;
var jd2 = 0.0;

var wDay = 0
var wMonth = 0
var wYear = 0
var jupYearIndex = 0 

var solMonthAdd = []
var sMonth = []
var smMonth = []
var aSun = []
var mmMonth = []
var aMoon = []
var mtMonth = []
var outName = []

class YearTextField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          kaliyuga: {
            value: this.props.kaliyuga
          },
          vikrama: {
            value: this.props.kaliyuga-Kaliyuga_Vikrama
          },
          saka: {
            value: this.props.kaliyuga-Kaliyuga_Saka
          },
          western: {
            ad: "AD",
            value: ""
          },
          addIn: props.addIn,
          calendar: props.calendar,
          westMonth: props.westMonth,
          sexDec: props.sexDec,
          mean: props.mean
        }   

        this.updateKaliyuga = this.updateKaliyuga.bind(this)
        this.updateVikrama = this.updateVikrama.bind(this)
        this.updateSakaAndKaliyuga = this.updateSakaAndKaliyuga.bind(this)
        this.updateSakaAndVikrama = this.updateSakaAndVikrama.bind(this)

        this.drawYearWindow = this.drawYearWindow.bind(this)

        this.onCalendarChange = this.onCalendarChange.bind(this)
        this.onFormatChange = this.onFormatChange.bind(this)
        this.onMeanChange = this.onMeanChange.bind(this)

        this.calc = this.calc.bind(this)
    }

    componentDidMount() {
      this.calc()
    }

    calc() {
      this.setUpPars()
      this.yearStuff()
    }

    onKeyDown(e) {
      if ((e.key < '0' || e.key > '9') && (e.key !== 'Backspace')&& 
                  (e.key !== 'Tab') && (e.key !== 'ArrowLeft') && (e.key !== 'ArrowRight') ) {
                      e.preventDefault()
                  }
    }

    onKaliyugaYearChange(e, t) {
      var v = parseInt(e.target.value)          
      if (isNaN(v)) {
        this.updateKaliyuga(true, t("empty_input"), Kaliyuga)
      }
      else                                 
        if (v >= 0 && v <= MaxKaliyuga) {   
          this.updateKaliyuga(false, null, v)
        }
        else {
          this.updateKaliyuga(true, t("invalid_range_0_6000"), Kaliyuga)
        }    
    }

    onVikramaYearChange(e, t) {
      var v = parseInt(e.target.value)          
      if (isNaN(v)) {
        this.updateVikrama(true, t("empty_input"), this.state.kaliyuga.value-Kaliyuga_Vikrama, this.state.kaliyuga.value)
      }
      else                                 
        if (v >= 0 && v <= MaxVikrama) {        
          this.updateVikrama(false, null, v, v + Kaliyuga_Vikrama)
        }
        else {
          this.updateVikrama(true, t("invalid_range_0_2956"), this.state.kaliyuga.value-Kaliyuga_Vikrama, this.state.kaliyuga.value)
        }
    }

    onSakaYearChange(e, t) {
      var v = parseInt(e.target.value)          
      if (isNaN(v)) {
        this.updateSakaAndVikrama(true, t("empty_input"), v, this.state.kaliyuga-Kaliyuga_Saka)
      }
      else                                 
        if (v >= 0 && v <= MaxSaka) {     
          this.updateSakaAndKaliyuga(false, null, v, v + Kaliyuga_Saka)        
        }
        else {
          this.updateSakaAndVikrama(true, t("invalid_range_0_2821"), v, this.state.kaliyuga.value-Kaliyuga_Saka)
        }
    }

    onWesternChange(e, t) {
      var v = parseInt(e.target.value)          
      if (isNaN(v)) {
        //this.updateSakaAndVikrama(true, t("empty_input"), v, this.state.kaliyuga-Kaliyuga_Saka)
      }
      else                                 
        if (v >= 0 && v <= MaxSaka) {     
          //this.updateSakaAndKaliyuga(false, null, v, v + Kaliyuga_Saka)        
        }
        else {
          //this.updateSakaAndVikrama(true, t("invalid_range_0_2821"), v, this.state.kaliyuga.value-Kaliyuga_Saka)
        }
    }

    onCalendarChange(e) {
      this.props.calendarHandleCallback(e.target.value)
      this.setState(
          {
            calendar: e.target.value
          }, () => {
            setTimeout(this.yearStuff(), 250)
          }
      )
    }

    onFormatChange(e) {
      this.props.sexDecHandleCallback(e.target.value == 0)
      this.setState(
          {
            sexDec: e.target.value == 0
          }, () => {
            setTimeout(this.yearStuff(), 250)
          }
      )
    }

    onMeanChange(e) {
      this.props.meanHandleCallback(e.target.value == 1)
      
      this.setState(
          {
            mean: e.target.value == 1
          }, () => {
            setTimeout(this.yearStuff(), 250)
          }
      )
    }

    updateKaliyuga(error, helper, value) {
      if (error) {
        this.props.showSnackbar(helper)
      }

      this.props.closeCalendarDialog()

      this.setState(
        {
          kaliyuga: {
            value: value
          }
        }, () => {
          setTimeout(this.yearStuff(), 250)
        }
      )
    }

    updateVikrama(error, helper, value, kaliyuga) {
      if (error) {
        this.props.showSnackbar(helper)
      }
      this.setState(
        {
          vikrama: {
            value: value
          }
        }, () => {
          setTimeout(this.updateKaliyuga(false, null, kaliyuga), 250)
        }
      )
    }

    updateSakaAndKaliyuga(error, helper, value, kaliyuga) {
      if (error) {
        this.props.showSnackbar(helper)
      }
      this.setState(
        {
          saka: {
            value: value
          }
        }, () => {
          setTimeout(this.updateKaliyuga(false, null, kaliyuga), 250)
        }
      )
    }

    updateSakaAndVikrama(error, helper, value, vikrama) {
      if (error) {
        this.props.showSnackbar(helper)
      }
      this.setState(
        {
          saka: {
            value: value
          }
        }, () => {
          setTimeout(this.updateVikrama(false, null, vikrama, this.state.kaliyuga.value), 250)
        }
      )
    }

    yearStuff() {
      timeDiff = this.props.gLong - 75.8

      if (timeDiff > 180) timeDiff = timeDiff - 360
      if(timeDiff < -180) timeDiff = 360 + timeDiff
      timeDiff = timeDiff*240 //timeDiff in seconds

      var firstMoon = this.state.kaliyuga.value * excessMoon
		  firstMoon = firstMoon + sodhya
		  firstMoon = firstMoon - parseInt(firstMoon/synMonth)*synMonth

		  solarJuldate = EpochJul + sidYear*this.state.kaliyuga.value

		  if (this.props.canon.value == Canons.Āryasiddhānta.value) solarJuldate = solarJuldate + 0.25;
		  solarJuldate = solarJuldate - sodhya + 0.25

		  if (this.props.addIn) solarJuldate = solarJuldate + timeDiff/86400

      var moonAnom = excessAnom * this.state.kaliyuga.value
		  moonAnom = moonAnom - parseInt(moonAnom / anomMonth) * anomMonth
		  moonAnom = moonAnom + anomEpoch - sodhya
		  moonAnom = moonAnom - parseInt(moonAnom / anomMonth) * anomMonth
		  moonAnom = firstMoon + moonAnom
		  moonAnom = moonAnom - parseInt(moonAnom / anomMonth) * anomMonth
      
		  sMonth[0] = solarJuldate
		  smMonth[0] = solarJuldate + sodhya
		  aSun[0] = firstMoon
		  mmMonth[0] = firstMoon + solarJuldate

      if (! this.state.mean && mmMonth[0] < smMonth[0]) mmMonth[0] = mmMonth[0] + synMonth
      
      if (this.state.mean) {
        var mmTest = mmMonth[0] - synMonth
        var anomTest = moonAnom - synMonth

        while (anomTest < 0) anomTest = anomTest + anomMonth
        
        var aSunTest = aSun[0] - synMonth

        if (aSunTest < 0) aSunTest = aSunTest + sidYear
        
        var aa = 0;
        for (var i=0; i<3; i++) {
          aa = Utils.moonAnomaly(anomTest + aa, this.props.canon.value, anomMonth, synMonth) + Utils.sunAnomaly(aSunTest + aa, this.props.canon.value, degr, sidYear, synMonth);
        }

        var mtTest = mmTest + aa;
        if (mtTest > solarJuldate) {
          moonAnom = anomTest;
          aSun[0] = aSunTest;
          mmMonth[0] = mmTest;
        }
      }

      if (this.state.mean) {			
        var mmTest = mmMonth[0];
        var anomTest = moonAnom;
        while (anomTest < 0) anomTest = anomTest + anomMonth;
        
        var aSunTest = aSun[0];
        if (aSunTest < 0) aSunTest = aSunTest + sidYear;
        
        var aa = 0;
        for (var i=0; i<3; i++) aa = Utils.moonAnomaly(anomTest + aa, this.props.canon.value, anomMonth, synMonth ) + Utils.sunAnomaly(aSunTest + aa, this.props.canon.value, degr, sidYear, synMonth);

        var mtTest = mmTest + aa;
        if (mtTest < solarJuldate) {
          moonAnom = anomTest + synMonth;
          aSun[0] = aSunTest + synMonth;
          mmMonth[0] = mmTest + synMonth;
        }
      }

      aMoon[0] = moonAnom;
		  var aa = 0;
		  for (var i=0; i<5; i++) aa = Utils.moonAnomaly(aMoon[0] + aa, this.props.canon.value, anomMonth, synMonth) + Utils.sunAnomaly(aSun[0] + aa, this.props.canon.value, degr, sidYear, synMonth);
		  mtMonth[0] = mmMonth[0] + aa;
		
		  for (var i=0; i<12; i++) {
			  sMonth[i+1] = sMonth[i]+solMonthAdd[i];
			  smMonth[i+1] = smMonth[i] + sidYear/12;
			  mmMonth[i+1] = mmMonth[i] + synMonth;
			  aMoon[i + 1] = aMoon[i] + synMonth;
			  aMoon[i + 1] = aMoon[i + 1]- parseInt(aMoon[i + 1] / anomMonth) * anomMonth;
			  aSun[i + 1] = aSun[i] + synMonth;
			  aSun[i + 1] = aSun[i + 1] - parseInt(aSun[i + 1] / sidYear) * sidYear;
			  aa = 0;
			  for (var k=0; k<3; k++) aa = Utils.moonAnomaly(aMoon[i + 1] + aa, this.props.canon.value, anomMonth, synMonth) + Utils.sunAnomaly(aSun[i + 1] + aa, this.props.canon.value, degr, sidYear, synMonth);
			  mtMonth[i + 1] = mmMonth[i + 1] + aa;
		  }

		  sMonth[13] = sMonth[12] + solMonthAdd[0];
		  smMonth[13] = smMonth[12] + sidYear / 12;

		  mmMonth[13] = mmMonth[12] + synMonth;
		  aMoon[13] = aMoon[12] + synMonth;
		  aMoon[13] = aMoon[12] - parseInt(aMoon[13] / anomMonth) * anomMonth;
		  aSun[13] = aSun[12] + synMonth;
		  aSun[13] = aSun[12] - parseInt(aSun[13] / sidYear) * sidYear;
		  for (var k=0; k<3; k++) aa = Utils.moonAnomaly(aMoon[13] + aa, this.props.canon.value, anomMonth, synMonth) + Utils.sunAnomaly(aSun[13] + aa, this.props.canon.value, degr, sidYear, synMonth);
		  mtMonth[13] = mmMonth[13] + aa;
		
		  for (var i=0; i<14; i++) {
			  outName[i] = "";
			  for (var k=0; k<12; k++) {
				  if (this.state.mean && mtMonth[i] < sMonth[k + 1] && mtMonth[i] > sMonth[k]) {
					  outName[i] = this.props.monthNames[k];
				  } else if (!this.state.mean && mmMonth[i] <= smMonth[k + 1] && mmMonth[i] >= smMonth[k]) {
					  outName[i] = this.props.monthNames[k];
				  }
			  }
		  }
		
      for (var i=1; i<14; i++) {
        if (outName[i] == outName[i - 1] && outName[i].length != 0) {
          outName[i - 1] = "Adhika " + outName[i - 1];
          outName[i] = "Nija " + outName[i];
        }
      }

      this.drawYearWindow()
    }

    setUpPars() {
      if (this.props.canon.value == Canons.Sūryasiddhānta.value) {
        sodhya = Sodhya0[this.props.canon.value] + 2.0068e-7*this.state.kaliyuga.value
        for (var i=0; i<12; i++) {
          solMonthAdd[i] = SolMonthAdd0[i] + 0 + SMonthCorr[i]*1e-7*this.state.kaliyuga.value
        }
      }
      else if (this.props.canon.value == Canons.SūryasiddhāntaOld.value) {
        sodhya = Sodhya0[this.props.canon.value]
        for (var i=0; i<12; i++) {
          solMonthAdd[i] = SolMonthAdd1[i]
        }
      } 
      else {
        sodhya = Sodhya0[this.props.canon.value]
        for (var i=0; i<12; i++) {
          solMonthAdd[i] = SolMonthAdd2[i]
        }
      }

      sidYear = MahayugaDays[this.props.canon.value]/Mahayuga
      sidMonth = MahayugaDays[this.props.canon.value]/MoonRevs
      synMonth = MahayugaDays[this.props.canon.value]/(MoonRevs-Mahayuga)
      tithiUnit = synMonth/30

      anomYear = (this.props.canon.value == Canons.Sūryasiddhānta.value) ? MahayugaDays[this.props.canon.value]/(Mahayuga-387.0/1000) : sidYear
      anomMonth = (this.state.kaliyuga.value >= this.props.bijaBreakpoint && this.props.canon.value == Canons.Sūryasiddhānta.value) ? MahayugaDays[this.props.canon.value]/(MoonRevs-ApogeeRevs[this.props.canon.value] + 4) : MahayugaDays[this.props.canon.value]/(MoonRevs-ApogeeRevs[this.props.canon.value])

      var degr0 = 1955880000.0*387/4320000000.0;
      degr0 = (degr0 - parseInt(degr0))*360

      degr = degr0*sidYear/360+sodhya + this.state.kaliyuga.value*(anomYear-sidYear);
      if (this.props.canon.value == Canons.SūryasiddhāntaOld.value) degr = 80.0/360*sidYear + sodhya;
      if (this.props.canon.value == Canons.Āryasiddhānta.value) degr = 78.0/360*sidYear + sodhya;

      nodeRevPDay = NodeRevs[this.props.canon.value]/MahayugaDays[this.props.canon.value];
      precessionConst = 180*sidYear/MahayugaDays[this.props.canon.value];
      facSidCiv = MahayugaDays[this.props.canon.value]/(MahayugaDays[this.props.canon.value]+Mahayuga);
  
      if (this.state.kaliyuga.value < this.props.bijaBreakpoint || this.props.canon.value == Canons.SūryasiddhāntaOld.value || this.props.canon.value == Canons.Āryasiddhānta.value) {
			  jupY = MahayugaDays[this.props.canon.value]/JupRevs[0]/12;
			  if (this.props.canon.value == Canons.Āryasiddhānta.value ) {
          jupY = MahayugaDays[this.props.canon.value]/(JupRevs[0]+4)/12;
        }
		  } else {
			  jupY = MahayugaDays[this.props.canon.value]/JupRevs[1]/12;
		  }

		  anomEpoch = anomMonth/4;
		  excessAnom = sidYear - 13*anomMonth;
		  excessMoon = 13*synMonth - sidYear;
    }

    drawYearWindow() {
      this.julday2Date(parseInt(this.state.mean ? sMonth[0] : smMonth[0]), this.state.calendar);
      this.setState(
        {
          vikrama: {
            value: this.state.kaliyuga.value - Kaliyuga_Vikrama
          },
          saka: {
            value: this.state.kaliyuga.value - Kaliyuga_Saka
          },
          western: {
            ad: wYear> 0 ? "AD" : "BC",
            value: wYear > 0 ? wYear : -wYear+1
          }
        }
      )
      
      var i = 0;
      var dates = []
      var times = []
      var lunars = []
      var julians = []
      var julianTimes = []
      while (i < 13) {
        if (i < 12) {
          var sss = this.state.mean ? sMonth[i] : smMonth[i];
          var frac = sss-parseInt(sss);

          if (frac > 0.99986111) sss = sss + 0.000138889;
          
          this.julday2Date(parseInt(sss), this.state.calendar);
          
          var str = this.dec2GhatPal(sss - parseInt(sss), this.state.sexDec);

          
          dates[i] = sprintf("%1$4d %2$s %3$2d", wYear, this.state.westMonth[wMonth-1], wDay)
          times[i] = str
        }
        
        var mmm = this.state.mean ? mtMonth[i] : mmMonth[i];
        
        if (mmm - parseInt(mmm) > 0.99986111) mmm = mmm + 0.000138889;

        this.julday2Date(parseInt(mmm), this.state.calendar);

        str = this.dec2GhatPal(mmm - parseInt(mmm), this.state.sexDec);

        if (outName[i].length != 0) {
          julians[i] = sprintf("%1$s %2$2d", this.state.westMonth[wMonth -1], wDay)
          lunars[i] = outName[i]
          julianTimes[i] = str
        }
        i = i+1;
      }

      this.props.dateHandleCallback(dates)
      this.props.timeHandleCallback(times)
      this.props.lunarHandleCallback(lunars)
      this.props.julianHandleCallback(julians)
      this.props.julianTimeHandleCallback(julianTimes)


      this.jupiterYear()

      var jName = JupYearName[parseInt(jupYearIndex)-1];
      var msg1, msg2;

      if (this.props.jupYearText == "Northern") {
        msg1 = sprintf("Northern Jupiter Year:  %1$2d %2$s", jupYearIndex, jName);
        if (this.state.mean) {
          if (jd1 > sMonth[0] && jd2 < sMonth[12]) msg1 = msg1 + "/kṣaya";          
          this.julday2Date(parseInt(jd1), this.state.calendar);

          msg2 = sprintf("%1$4d %2$s %3$2d %4$5.2f-", wYear, this.state.westMonth[wMonth-1], wDay, jd1 - parseInt(jd1));

          this.julday2Date(parseInt(jd2), this.state.calendar);

          msg2 = msg2 + sprintf("%1$4d %2$s %3$2d %4$5.2f", wYear, this.state.westMonth[wMonth-1], wDay, jd2 - parseInt(jd2));

          this.props.showJupiterInfo(msg1, msg2)
        }
      } else {
        jupYearIndex = (this.state.kaliyuga.value + 13 + 34)%60;
        if (jupYearIndex == 0) jupYearIndex = 60;
        jName = JupYearName[parseInt(jupYearIndex)-1];
        jupYearIndex = jupYearIndex - 34;
        if ( jupYearIndex < 0) jupYearIndex = jupYearIndex + 60;

        msg1 = sprintf("Southern Jupiter Year:  %1$2d %2$s", jupYearIndex, jName);
        if (jupYearIndex == 37) msg1 = msg1 + "*";

        this.props.showJupiterInfo(msg1, "")
      }

      if (this.props.calendarDialogParamsHandleCallback) {
        this.props.calendarDialogParamsHandleCallback(mtMonth, mmMonth, solarJuldate, sodhya, synMonth, sidYear, tithiUnit, aSun, anomMonth, aMoon, degr, sidMonth, this.state.kaliyuga.value, outName, facSidCiv, timeDiff, precessionConst, nodeRevPDay)
      }

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

    jupiterYear() {
      var a = 0;
      //The true SurS method from Ginzel
      if (this.props.canon.value == Canons.Āryasiddhānta.value) {
        a = parseInt(((this.state.kaliyuga.value * 22 - 11) / 1875 + this.state.kaliyuga.value + 1) % 60)
      }
      else {
          a = parseInt((this.state.kaliyuga.value * 211 - 108) / 18000);
          a = (a + 27 + this.state.kaliyuga.value + 34) % 60;
      }

      var jY = parseInt(this.state.kaliyuga.value / 85 + this.state.kaliyuga.value);
      var b = jY % 60;
      if (b != a) jY = jY + 1;
      jd1 = (jY - 1) * jupY + EpochJul + 0.25;

      if (this.props.canon.value == Canons.Āryasiddhānta.value) jd1 = jd1 + 0.25;
      jd2 = jd1 + jupY;
      if( a == 0) a = 60;
      jupYearIndex = a;

      
    }
    
    render() {
        const { t } = this.props;
        
        return <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 0.5 },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField 
              id="tfKaliyuga" 
              label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Kaliyuga</Typography>} 
              type="number"
              value={this.state.kaliyuga.value}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onKeyDown={(e) => this.onKeyDown(e)}
              onChange={
                (e)  => this.onKaliyugaYearChange(e, t)    
              }
              InputProps={{
                inputProps: {
                    style: { textAlign: "center", fontSize: "1em", fontFamily: "Noto Serif" },
                }
            }}
              style = {{width: 90}}
              size="small" />
            <TextField 
              id="tfVikrama" 
              label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Vikrama</Typography>} 
              type="number"
              variant="outlined"
              error={this.state.vikrama.error}
              helperText={this.state.vikrama.helper}
              value={this.state.vikrama.value}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: {
                    style: { textAlign: "center", fontSize: "1em", fontFamily: "Noto Serif" },
                }
            }}
              style = {{width: 90}}
              size="small"
              onKeyDown={(e) => this.onKeyDown(e)} 
              onChange={
                (e)  => this.onVikramaYearChange(e, t)    
              }
              />
            <TextField 
                id="tfSaka" 
                label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Śaka</Typography>} 
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                      style: { textAlign: "center", fontSize: "1em", fontFamily: "Noto Serif" },
                  }
              }}
                style = {{width: 90}}
                size="small" 
                value={this.state.saka.value}
                onKeyDown={(e) => this.onKeyDown(e)}
                onChange={
                  (e)  => this.onSakaYearChange(e, t)    
                }
                />
              <TextField 
                id="tfWestern" 
                label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Western</Typography>} 
                variant="outlined" 
                type="number"
                InputLabelProps={{ shrink: true }}
                size="small"
                value={this.state.western.value}
                style = {{width: 110}}
                onKeyDown={(e) => this.onKeyDown(e)}
                onChange={
                  (e)  => this.onWesternChange(e, t)    
                }
                InputProps={{
                  startAdornment: <InputAdornment position="start"><div style={{fontFamily: "Noto Serif", fontSize: "12px", fontWeight: "bold", color: "#000000"}}>{this.state.western.ad}</div></InputAdornment>,
                  readOnly: true,
                  inputProps: {
                    style: { fontSize: "1em", fontFamily: "Noto Serif", fontWeight: "bold" },
                }
                }}/>

          <span className="">
          <FormControl>     
            <RadioGroup
              onChange={this.onMeanChange}
              defaultValue={this.state.mean ? 1 : 0}
              value={this.state.mean ? 1 : 0}
              name="radio-buttons-group">
              <FormControlLabel value={1} control={<Radio size="small" />} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>True</Typography>} />
              <FormControlLabel value={0} control={<Radio size="small" />} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Mean</Typography>} />
            </RadioGroup>
          </FormControl>
          </span>

            <FormControl>       
            <RadioGroup
              onChange={this.onCalendarChange}
              defaultValue={this.state.calendar ? this.state.calendar : Calendar.Julian.value}
              value={this.state.calendar ? this.state.calendar : Calendar.Julian.value}
              name="radio-buttons-group">
              <FormControlLabel value={1} control={<Radio size="small" />} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Julian</Typography>}  />
              <FormControlLabel value={0} control={<Radio size="small" />} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Gregorian</Typography>} />
            </RadioGroup>
          </FormControl>

          <FormControl>       
            <RadioGroup
              onChange={this.onFormatChange}
              defaultValue={this.state.sexDec ? 0 : 1}
              value={this.state.sexDec ? 0 : 1}
              name="radio-buttons-group">
              <FormControlLabel value={0} control={<Radio size="small" />} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Sexagesimal</Typography>}  />
              <FormControlLabel value={1} control={<Radio size="small" />} label={<Typography style={{fontFamily: "Noto Serif", fontSize: "1em"}}>Decimal</Typography>} />
            </RadioGroup>
          </FormControl>

        </div>
        </Box>;
    }
}

export default withTranslation()(YearTextField);