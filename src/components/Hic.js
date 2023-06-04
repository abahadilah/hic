import * as React from 'react';

import YearTextField from './dashboard/YearTextField';
import MonthLabels from './dashboard/MonthLabels';
import DateLabels from './dashboard/DateLabels';
import TimeLabels from './dashboard/TimeLabels';
import CalendarButtons from './dashboard/CalendarButtons';
import JulianLabels from './dashboard/JulianLabels';
import JulianTimeLabels from './dashboard/JulianTimeLabels';
import JupiterInfo from './dashboard/JupiterInfo';
import HicAppBar from './appbar/HicAppBar'
import LocationDialog from './options/LocationDialog'
import PreferenceDialog from './options/PreferenceDialog'
import AboutDialog from './options/AboutDialog'
import TableDialog from './options/TableDialog'
import CalendarDialog from './options/CalendarDialog'
import Calendar from '../data/Calendar';
import Canons from '../data/Canons';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";


const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const MonthNames = ["Vaiśākha", "Jyeṣṭha", "Āṣāḍha", 
"Śravaṇa", "Bhādrapada", "Āśvina", "Kārttika", 
"Mārgaśīrṣa", "Pauṣa", "Māgha", "Phālguna", "Caitra"];

var keyYearTextField = 1
const Kaliyuga = 4600

class Hic extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };
  
    constructor(props) {
        super(props)

        var canon = this.props.cookies.get("canon") ? this.props.cookies.get("canon") : Canons.Sūryasiddhānta.value
        var addIn = this.props.cookies.get("addIn")
        var ns = this.props.cookies.get("ns")

        this.state = {
          date: ['','','','','','','','','','','',''],
          time: ['','','','','','','','','','','',''],
          lunar: ['','','','','','','','','','','',''],
          julian:['','','','','','','','','','','',''],
          julianTime:['','','','','','','','','','','',''],
          canon: new Canons(canon),
          addIn: addIn ? addIn == "true" : true,
          yType: this.props.cookies.get("yType") ? this.props.cookies.get("yType") : 0,
          bijaBreakpoint: this.props.cookies.get("bijaBreakpoint") ? this.props.cookies.get("bijaBreakpoint") : 4500,        
          jupYearText: ns == 1 ? "Southern" : "Northern",
          calendar: Calendar.Julian.value,
          errorMessage: null,
          jupiterInfo1: null,
          jupiterInfo2: null,
          keyYearTextField: "YearTextField",
          keyLocationDialog: "keyLocationDialog",
          keyPreferencesDialog: "keyPreferencesDialog",
          keyAboutDialog: "keyAboutDialog",
          keyTableDialog: "keyTableDialog",
          keyAppBar: "keyAppBar",
          keyCalendarDialog: "keyCalendarDialog",
          mean: true,
          sexDec: true,
          gLong: 75.8,
          gLat: 23.2,
          ns: "S",
          ew: "E",
          isLocationOptionsShow: false,
          isPreferencesOptionsShow: false,
          isAboutOptionsShow: false,
          isTableDialogShow: false,
          tableTitle: null,
          tableMenu: null,
          isCalendarDialogShow: false,
          calendarTitle: null,
          calendarIndex: null,
          mtMonth: null,
          mmMonth: null,
          solarJuldate: null,
          sodhya: null,
          synMonth: null,
          sidYear: null,
          tithiUnit: null,
          aSun: null,
          anomMonth: null,
          zIndex: 4000,
          zIndexPlanet: 4000,
          zIndexTime: 4000,
          zIndexWuku: 4000,
          zIndexDay: 4000,
          zIndexCalendar: 4000,
          aMoon: null,
          degr: null,
          sidMonth: null,
          kaliyuga: Kaliyuga,
          outName: null,
          facSidCiv: null,
          timeDiff: null,
          precessionConst: null,
          nodeRevPDay: null,
          calendarDialogX: this.props.cookies.get("calendarDialogX"),
          calendarDialogY: this.props.cookies.get("calendarDialogY"),

            wukuSelected: false,     
            isDayDialogOpen: false

        }

        this.canonHandleCallback = this.canonHandleCallback.bind(this)
        this.locationOptionsHandleCallback = this.locationOptionsHandleCallback.bind(this)
        this.preferencesOptionsHandleCallback = this.preferencesOptionsHandleCallback.bind(this)
        this.aboutOptionsHandleCallback = this.aboutOptionsHandleCallback.bind(this)
        this.tableMenuHandleCallback = this.tableMenuHandleCallback.bind(this)
        this.meanHandleCallback = this.meanHandleCallback.bind(this)
        this.sexDecHandleCallback = this.sexDecHandleCallback.bind(this)
        this.calendarHandleCallback = this.calendarHandleCallback.bind(this)
        this.dateHandleCallback = this.dateHandleCallback.bind(this)
        this.timeHandleCallback = this.timeHandleCallback.bind(this)
        this.lunarHandleCallback = this.lunarHandleCallback.bind(this)
        this.julianHandleCallback = this.julianHandleCallback.bind(this)
        this.julianTimeHandleCallback = this.julianTimeHandleCallback.bind(this)
        this.showSnackbar = this.showSnackbar.bind(this)
        this.showJupiterInfo = this.showJupiterInfo.bind(this)
        this.locationOptionsNs = this.locationOptionsNs.bind(this)
        this.locationOptionsEw = this.locationOptionsEw.bind(this)
        this.gLongHandleCallback = this.gLongHandleCallback.bind(this)
        this.prefHandleCallback = this.prefHandleCallback.bind(this)
        this.calendarDialogHandleCallback = this.calendarDialogHandleCallback.bind(this)
        this.calendarDialogParamsHandleCallback = this.calendarDialogParamsHandleCallback.bind(this)
        this.closeCalendarDialog = this.closeCalendarDialog.bind(this)
        this.updateKaliyugaCallback = this.updateKaliyugaCallback.bind(this)
        this.updateCalendarIndexCallback = this.updateCalendarIndexCallback.bind(this)
    }

    handleCookie(name, value) {
        const { cookies } = this.props;
        cookies.set(name, value, { path: "/" }); // setting the cookie
      } 
  

    prefHandleCallback = (canon, addIn, yType, ns, bijaBreakpoint, 
        locationNS, locationEW, latitude, longitude) => {
        this.setState({
            canon: canon,
            addIn: addIn,
            yType: yType,
            jupYearText: ns == 1 ? "Southern" : "Northern",
            bijaBreakpoint: bijaBreakpoint,
            ns: locationNS,
            ew: locationEW
        }, () => {
            setTimeout(this.reload1(), 500)
          })
    }

    canonHandleCallback = (canon) =>{
        this.setState({
            canon: canon
        }, () => {
            setTimeout(this.reload(), 500)
          })
    }

    reload1() {
        keyYearTextField++
        this.setState(
            {
                keyYearTextField: "YearTextField" + keyYearTextField,
                keyAppBar: "keyAppBar" + keyYearTextField
            }
        )
    }

    reload() {
        keyYearTextField++
        this.setState(
            {
                keyYearTextField: "YearTextField" + keyYearTextField
            }
        )
    }

    dateHandleCallback = (data) =>{
        this.setState({
            date: data
        })
    }

    meanHandleCallback = (data) =>{
        this.setState({
            mean: data,
            isCalendarDialogShow: false,
            isDayDialogOpen: false,
            planetSelected: false,
            timeSelected: false,
            wukuSelected: false      
        })
    }

    onPreferencesSetCallback = (data) =>{
        this.setState({
            isCalendarDialogShow: false,
            isDayDialogOpen: false,
            planetSelected: false,
            timeSelected: false,
            wukuSelected: false      
        })
    }
    

    calendarDialogParamsHandleCallback = (mtMonth, mmMonth, solarJuldate, sodhya, synMonth, sidYear, tithiUnit, aSun, anomMonth, aMoon, degr, sidMonth, kaliyuga, outName, facSidCiv, timeDiff, precessionConst, nodeRevPDay) => {
        this.setState({
            mtMonth: mtMonth,
            mmMonth: mmMonth,
            solarJuldate: solarJuldate,
            sodhya: sodhya,
            synMonth: synMonth,
            sidYear: sidYear,
            tithiUnit: tithiUnit,
            aSun: aSun,
            anomMonth: anomMonth,
            aMoon: aMoon,
            degr: degr,
            sidMonth: sidMonth,
            kaliyuga: kaliyuga,
            outName: outName,
            facSidCiv: facSidCiv,
            timeDiff: timeDiff,
            precessionConst: precessionConst,
            nodeRevPDay: nodeRevPDay
        })
    }

    sexDecHandleCallback = (data) =>{
        this.setState({
            sexDec: data
        }, () => {
            setTimeout(this.reload(), 250)
          })
    }
    

    calendarHandleCallback = (data) =>{
        this.setState({
            calendar: data,
            isCalendarDialogShow: false,
            isDayDialogOpen: false,
            planetSelected: false, 
            timeSelected: false,   
            wukuSelected: false  
        })
    }

    closeCalendarDialog = (data) =>{
        this.setState({
            isCalendarDialogShow: false,
            isDayDialogOpen: false,
        })

        keyYearTextField++
    }    

    timeHandleCallback = (data) =>{
        this.setState({
            time: data
        })
    }

    gLongHandleCallback = (data) =>{
        this.setState({
            gLong: data
        }, () => {
            setTimeout(this.reload(), 250)
          })
    }

    lunarHandleCallback = (data) =>{
        this.setState({
            lunar: data
        })
    }

    locationOptionsNs = (data) =>{
        this.setState({
            ns: data
        })
    }    

    locationOptionsEw = (data) =>{
        this.setState({
            ew: data
        })
    }   

    locationOptionsHandleCallback = (data) => {
        this.setState(
            {
                isLocationOptionsShow: true
            }
        )

        keyYearTextField++
        this.setState(
            {keyLocationDialog: "keyLocationDialog" + keyYearTextField}
        )
    }

    preferencesOptionsHandleCallback = (data) => {
        this.setState(
            {
                isPreferencesOptionsShow: true
            }
        )

        keyYearTextField++
        this.setState(
            {keyPreferencesDialog: "keyPreferencesDialog" + keyYearTextField}
        )
    }


    aboutOptionsHandleCallback = (data) => {
        this.setState(
            {
                isAboutOptionsShow: true
            }
        )

        keyYearTextField++
        this.setState(
            {keyAboutDialog: "keyAboutDialog" + keyYearTextField}
        )
    }

    calendarDialogHandleCallback = (title, index) => {
        this.setState(
            {

                isCalendarDialogShow: true,
                calendarTitle: title,
                calendarIndex: index,
                isDayDialogOpen: false,
                planetSelected: false,
                timeSelected: false,
                wukuSelected: false  
            }
        )
    }

    calendarDialogHandleCloseCallback = () => {
        this.setState(
            {

                isCalendarDialogShow: false,
                isDayDialogOpen: false,
                planetSelected: false,
                timeSelected: false,
                wukuSelected: false  
            }
        )
    }

    dayOpenHandleCallback = () => {
        this.setState(
            {
                isDayDialogOpen: true,
                planetSelected: this.props.cookies.get("planeChecked") ? this.props.cookies.get("planeChecked") == "true" : false,
                timeSelected: this.props.cookies.get("timeChecked") ? this.props.cookies.get("timeChecked") == "true" : false,
                wukuSelected: this.props.cookies.get("wukuChecked") ? this.props.cookies.get("wukuChecked") == "true" : false,
                zIndexDay: this.state.zIndex+1
            }
        )
    }

    planetCheckedCallback = () => {
        this.setState(
            {
                planetSelected: this.props.cookies.get("planeChecked") ? this.props.cookies.get("planeChecked") == "true" : false,
                zIndexPlanet: this.state.zIndex+1,

            }
        )
    }

    planetBringToFrontHandleCallback = () => {
        this.setState(
            {
                zIndexPlanet: this.state.zIndex+1,
                zIndex: this.state.zIndex+1
            }
        )
    }

    timeBringToFrontHandleCallback = () => {
        this.setState(
            {
                zIndexTime: this.state.zIndex+1,
                zIndex: this.state.zIndex+1
            }
        )
    }


    wukuBringToFrontHandleCallback = () => {
        this.setState(
            {
                zIndexWuku: this.state.zIndex+1,
                zIndex: this.state.zIndex+1
            }
        )
    }

    dayBringToFrontHandleCallback = () => {
        this.setState(
            {
                zIndexDay: this.state.zIndex+1,
                zIndex: this.state.zIndex+1
            }
        )
    }

    calendarBringToFrontHandleCallback = () => {
        this.setState(
            {
                zIndexCalendar: this.state.zIndex+1,
                zIndex: this.state.zIndex+1
            }
        )
    }

    
    wukuCloseHandleCallback = () => {
        this.setState(
            {
                wukuSelected: this.props.cookies.get("wukuChecked") ? this.props.cookies.get("wukuChecked") == "true" : false
            }
        )
    }
    
    wukuCheckedCallback = () => {
        this.setState(
            {
                wukuSelected: this.props.cookies.get("wukuChecked") ? this.props.cookies.get("wukuChecked") == "true" : false,
                zIndexWuku: this.state.zIndex+1,
            }
        )
    }

    updateKaliyugaCallback = (kaliyuga, currentJD, show) => {
        keyYearTextField++

        if (show) {
            this.setState( {
                keyYearTextField: "YearTextField" + keyYearTextField,
                kaliyuga: kaliyuga
            }, () => {
                setTimeout(this.afterUpdateKaliyuga(currentJD), 1000)
              })
        }
        else {
            this.setState( {
                keyYearTextField: "YearTextField" + keyYearTextField,
                kaliyuga: kaliyuga,
                isCalendarDialogShow: false,
                isDayDialogOpen: false,
                planetSelected: false,
                timeSelected: false,
                wukuSelected: false   
            })
        }
   
    }

    afterUpdateKaliyuga(currentJD) {
        var numMonths = 0;//Recalculate # of months
        
        while (this.state.outName[numMonths] != "") numMonths = numMonths + 1;
        var j = -1;//Assume not found a month
        for (var i = 0; i < numMonths-1; i++) {
            var mmm = this.state.mean ? parseInt(this.state.mtMonth[i]) + 1 : parseInt(this.state.mmMonth[i]) + 1
            var mmm1 = this.state.mean ? parseInt(this.state.mtMonth[i+1]) + 1 : parseInt(this.state.mmMonth[i+1]) + 1
    
            if (mmm <= currentJD && mmm1 > currentJD) j = i;//Found a month
        }
  
        if (j == -1) return; //Shouldn't happen

        this.setState( {
            calendarTitle: this.state.outName[j],
            calendarIndex: j
        })
    }

    updateCalendarIndexCallback = (index, name) => {
        this.setState( {
            calendarTitle: name,
            calendarIndex: index
        })
    }
    

    timeCheckedCallback = () => {
        this.setState(
            {
                timeSelected: this.props.cookies.get("timeChecked") ? this.props.cookies.get("timeChecked") == "true" : false,
                zIndexTime: this.state.zIndex+1,
            }
        )
    }

    dayDialogHandleCloseCallback = () => {
        this.setState(
            {

                isDayDialogOpen: false,
                planetSelected: false,
                timeSelected: false,
                wukuSelected: false                
            }
        )
    }

    planetCloseHandleCallback = () => {
        this.setState(
            {
                planetSelected: false                
            }
        )
    }

    timeCloseHandleCallback = () => {
        this.setState(
            {
                timeSelected: false                
            }
        )
    }
    

    tableMenuHandleCallback = (title, menu) => {
        this.setState(
            {
                isTableDialogShow: true,
                tableTitle: title,
                tableMenu: menu
            }
        )

        keyYearTextField++
        this.setState(
            {keyTableDialog: "keyTableDialog" + keyYearTextField}
        )
    }
    

    julianHandleCallback = (data) =>{
        this.setState({
            julian: data
        })
    }


    julianTimeHandleCallback = (data) =>{
        this.setState({
            julianTime: data,
        })
    }

    showSnackbar = (data) =>{
        this.setState({
            errorMessage: data,
        })
    }

    showJupiterInfo = (info1, info2) =>{
        this.setState({
            jupiterInfo1: info1,
            jupiterInfo2: info2
        })
    }

    render() {
        var gLat = this.props.cookies.get("latitude") ? this.props.cookies.get("latitude") : 23.2
        var gLong = this.props.cookies.get("longitude") ? this.props.cookies.get("longitude") : 75.8    

        var locationNS = this.props.cookies.get("locationNS") ? this.props.cookies.get("locationNS") : 1
        var locationEW = this.props.cookies.get("locationEW") ? this.props.cookies.get("locationEW") : 1

        if (locationNS != 1) {
            gLat = -gLat
        }

        if (locationEW != 1) {
            gLong = -gLong
        }

        return <div>
            <HicAppBar 
                key={this.state.keyAppBar}
                canonHandleCallback={this.canonHandleCallback}
                locationOptionsHandleCallback={this.locationOptionsHandleCallback}
                preferencesOptionsHandleCallback={this.preferencesOptionsHandleCallback}
                aboutOptionsHandleCallback={this.aboutOptionsHandleCallback}
                tableMenuHandleCallback={this.tableMenuHandleCallback}
                canon={this.state.canon} />
            <div className='Hic-Dashboard'>
                <YearTextField 
                    monthNames={MonthNames}
                    kaliyuga={this.state.kaliyuga}
                    key={this.state.keyYearTextField}
                    canon={this.state.canon} 
                    mean={this.state.mean}
                    bijaBreakpoint={this.state.bijaBreakpoint} 
                    gLat={gLat}
                    gLong={gLong}    
                    addIn={this.state.addIn}
                    calendar={this.state.calendar}
                    westMonth={Months} 
                    jupYearText={this.state.jupYearText}
                    closeCalendarDialog={this.closeCalendarDialog}
                    dateHandleCallback={this.dateHandleCallback}
                    timeHandleCallback={this.timeHandleCallback}
                    lunarHandleCallback={this.lunarHandleCallback}
                    julianHandleCallback={this.julianHandleCallback}
                    julianTimeHandleCallback={this.julianTimeHandleCallback}
                    calendarHandleCallback={this.calendarHandleCallback}
                    meanHandleCallback={this.meanHandleCallback}
                    sexDecHandleCallback={this.sexDecHandleCallback}
                    calendarDialogParamsHandleCallback={this.calendarDialogParamsHandleCallback}
                    sexDec={this.state.sexDec}
                    showSnackbar={this.showSnackbar}
                    showJupiterInfo={this.showJupiterInfo} />
                    <Stack spacing={0} direction="row">
                        <div className='Hic-Column-1'><MonthLabels /></div>
                        <div className='Hic-Column-2'><DateLabels data={this.state.date} /></div>
                        <div className='Hic-Column-3'><TimeLabels data={this.state.time} /></div>
                        <div className='Hic-Column-4'>
                            <CalendarButtons 
                                data={this.state.lunar} 
                                calendarDialogHandleCallback={this.calendarDialogHandleCallback} />
                            </div>
                        <div className='Hic-Column-5'><JulianLabels data={this.state.julian} /></div>
                        <div className='Hic-Column-6'><JulianTimeLabels data={this.state.julianTime} /></div>
                </Stack>
                <JupiterInfo
                    jupiterInfo1={this.state.jupiterInfo1}
                    jupiterInfo2={this.state.jupiterInfo2} />
            </div>
            <LocationDialog 
                key={this.state.keyLocationDialog}
                open={this.state.isLocationOptionsShow}
                gLat={gLat}
                gLong={gLong}    
                ns={this.state.ns}
                ew={this.state.ew}
                showSnackbar={this.showSnackbar}
                locationOptionsNs={this.locationOptionsNs}
                locationOptionsEw={this.locationOptionsEw} 
                gLongHandleCallback={this.gLongHandleCallback} />
            <PreferenceDialog 
                onPreferencesSetCallback={this.onPreferencesSetCallback}
                key={this.state.keyPreferencesDialog}
                showSnackbar={this.showSnackbar}
                open={this.state.isPreferencesOptionsShow}
                prefHandleCallback={this.prefHandleCallback}
                canonHandleCallback={this.canonHandleCallback} />
            <AboutDialog 
                key={this.state.keyAboutDialog}
                open={this.state.isAboutOptionsShow} />
            <TableDialog 
                key={this.state.keyTableDialog}
                open={this.state.isTableDialogShow}
                title={this.state.tableTitle}
                menu={this.state.tableMenu} />
            <CalendarDialog 
                left={this.state.calendarDialogX}
                top={this.state.calendarDialogY}
                planetBringToFrontHandleCallback={this.planetBringToFrontHandleCallback}
                timeBringToFrontHandleCallback={this.timeBringToFrontHandleCallback}
                wukuBringToFrontHandleCallback={this.wukuBringToFrontHandleCallback}
                calendarBringToFrontHandleCallback={this.calendarBringToFrontHandleCallback}
                dayBringToFrontHandleCallback={this.dayBringToFrontHandleCallback}
                planetCloseHandleCallback={this.planetCloseHandleCallback}
                timeCloseHandleCallback={this.timeCloseHandleCallback}
                handleCloseCallback={this.calendarDialogHandleCloseCallback}
                dayOpenHandleCallback={this.dayOpenHandleCallback}
                dayDialogHandleCloseCallback={this.dayDialogHandleCloseCallback}
                planetCheckedCallback={this.planetCheckedCallback}
                timeCheckedCallback={this.timeCheckedCallback}
                wukuCloseHandleCallback={this.wukuCloseHandleCallback}
                wukuCheckedCallback={this.wukuCheckedCallback}
                updateKaliyugaCallback={this.updateKaliyugaCallback}
                updateCalendarIndexCallback={this.updateCalendarIndexCallback}
                planetSelected={this.state.planetSelected}
                zIndexPlanet={this.state.zIndexPlanet}
                zIndexTime={this.state.zIndexTime}
                zIndexWuku={this.state.zIndexWuku}
                zIndexDay={this.state.zIndexDay}
                zIndex={this.state.zIndexCalendar}
                timeSelected={this.state.timeSelected}
                isDayDialogOpen={this.state.isDayDialogOpen}
                wukuSelected={this.state.wukuSelected}
                wukuHandleCallback={this.wukuHandleCallback}
                open={this.state.isCalendarDialogShow}
                title={this.state.calendarTitle}
                index={this.state.calendarIndex}
                mean={this.state.mean}
                mtMonth={this.state.mtMonth}
                mmMonth={this.state.mmMonth}
                solarJuldate={this.state.solarJuldate}
                sodhya={this.state.sodhya}
                synMonth={this.state.synMonth}
                sidYear={this.state.sidYear}
                tithiUnit={this.state.tithiUnit}
                aSun={this.state.aSun}
                anomMonth={this.state.anomMonth}
                aMoon={this.state.aMoon}
                canon={this.state.canon}
                degr={this.state.degr}
                sidMonth={this.state.sidMonth}
                calendar={this.state.calendar}
                westMonth={Months} 
                kaliyuga={this.state.kaliyuga}
                yType={this.state.yType}
                outName={this.state.outName}
                facSidCiv={this.state.facSidCiv}
                timeDiff={this.state.timeDiff}
                sexDec={this.state.sexDec}
                addIn={this.state.addIn}
                precessionConst={this.state.precessionConst}
                gLat={gLat}
                gLong={gLong}    
                bijaBreakpoint={this.state.bijaBreakpoint}
                nodeRevPDay={this.state.nodeRevPDay}
                 />
            <Snackbar
                sx={{ height: "100%" }}
                anchorOrigin={{
                    vertical: 'top', 
                    horizontal: 'center'
                }}
                severity="error"
                open={this.state.errorMessage != null}
                autoHideDuration={3000}
                message={this.state.errorMessage}
                onClose={() => this.setState({errorMessage: null})}
                />
        </div>;
    }
}

export default withCookies(Hic);