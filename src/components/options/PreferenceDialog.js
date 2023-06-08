import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Canons from '../../data/Canons'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Typography from '@mui/material/Typography';


import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";

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
  width: 750,
  bgcolor: 'background.paper',
  overflow:'scroll',
  border: '2px solid #000',
  display:'block',
  boxShadow: 24,
};

class PreferenceDialog extends React.Component {
    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props)
        
        var addIn = this.props.cookies.get("addIn")
        
        this.state = {
            open: this.props.open,
            canon: this.props.cookies.get("canon") ? this.props.cookies.get("canon") : Canons.Sūryasiddhānta.value,
            addIn: addIn ? addIn === "true" : true,
            yType: this.props.cookies.get("yType") ? this.props.cookies.get("yType") : 0,
            ns: this.props.cookies.get("ns") ? this.props.cookies.get("ns") : 0,
            bijaBreakpoint: this.props.cookies.get("bijaBreakpoint") ? this.props.cookies.get("bijaBreakpoint") : 4500,
            locationNS: this.props.cookies.get("locationNS") ? this.props.cookies.get("locationNS") : 1,
            locationEW: this.props.cookies.get("locationEW") ? this.props.cookies.get("locationEW") : 1,
            latitude: this.props.cookies.get("latitude") ? this.props.cookies.get("latitude") : 23.2,
            longitude: this.props.cookies.get("longitude") ? this.props.cookies.get("longitude") : 75.8,
        }

        this.onCanonChange = this.onCanonChange.bind(this)
        this.onNSChange = this.onNSChange.bind(this)
        this.onCalendarChange = this.onCalendarChange.bind(this)
        this.onCancelClick = this.onCancelClick.bind(this)
        this.onSetClick = this.onSetClick.bind(this)
        this.onLongDiffChange = this.onLongDiffChange.bind(this)
        this.onbijaBreakpointChange = this.onbijaBreakpointChange.bind(this)
        this.onRestoreClick = this.onRestoreClick.bind(this)
        this.onLocationNSChange = this.onLocationNSChange.bind(this)
        this.onLocationEWChange = this.onLocationEWChange.bind(this)
        this.onLatitudeChange = this.onLatitudeChange.bind(this)
        this.onLongitudeChange = this.onLongitudeChange.bind(this)
        
    }

    onRestoreClick(e) {
      var canon = Canons.Sūryasiddhānta.value
      var addIn = true
      var yType = 0
      var ns = 0
      var bijaBreakpoint = 4500
      var locationNS = 1
      var locationEW = 1
      var latitude = 23.2
      var longitude = 75.8

      this.handleCookie("canon", canon)
      this.handleCookie("addIn", addIn)
      this.handleCookie("yType", yType)
      this.handleCookie("ns", ns)
      this.handleCookie("locationNS", locationNS)
      this.handleCookie("locationEW", locationEW)

      this.handleCookie("bijaBreakpoint", bijaBreakpoint)
      this.handleCookie("latitude", latitude)
      this.handleCookie("longitude", longitude)

      this.props.prefHandleCallback(new Canons(canon), addIn, yType, ns, bijaBreakpoint, locationNS, locationEW, 
        latitude, longitude)
        this.props.onPreferencesSetCallback()
      this.onCancelClick(e)
    }

    handleCookie(name, value) {
      const { cookies } = this.props;
      cookies.set(name, value, { path: "/" }); // setting the cookie
      this.setState({ user: cookies.get("user") });
    };

    componentDidMount() {
    }

    onCanonChange(e) {
      this.setState(
        {canon: e.target.value}
      )
    }

    onLongDiffChange(e) {
      this.setState(
        {addIn: e.target.value == 1}
      )
    }

    onCalendarChange(e) {
      this.setState(
        {yType: e.target.value}
      )
    }

    onNSChange(e) {
      this.setState(
        {ns: e.target.value}
      )
    }

    onLocationNSChange(e) {
      this.setState(
        {locationNS: e.target.value}
      )
    }
    
    onLocationEWChange(e) {
      this.setState(
        {locationEW: e.target.value}
      )
    }

    onbijaBreakpointChange(e) {
      this.setState(
        {bijaBreakpoint: e.target.value}
      )
    }

    onLatitudeChange(e) {
      this.setState(
        {latitude: e.target.value}
      )
    }
    
    onLongitudeChange(e) {
      this.setState(
        {longitude: e.target.value}
      )
    }

    onCancelClick(e) {
        this.setState(
          {
            open: false
          }
        )
      }

      onSetClick(e) {
        const { t } = this.props;

        var bijaBreakpoint = parseInt(this.state.bijaBreakpoint)

        var latitude = parseFloat(this.state.latitude)
        var longitude = parseFloat(this.state.longitude)

        var sBijaBreakpoint = this.state.bijaBreakpoint + " "
        var sLatitude = this.state.latitude + " "
        var sLongitude = this.state.longitude + " "

        if (sBijaBreakpoint.trim().length == 0 || 
        sLatitude.trim().length == 0 ||
        sLongitude.trim().length == 0) {
          this.props.showSnackbar(t("empty_input"))
        }
        else
        if (isNaN(bijaBreakpoint) || isNaN(latitude) || isNaN(longitude)) {
          this.props.showSnackbar(t("invalid_input"))
        }
        else
        if (bijaBreakpoint < 3000 || bijaBreakpoint > 6000) {
            this.props.showSnackbar(t("bija_not_in_range"))
        }
        else {
          this.handleCookie("canon", this.state.canon)
          this.handleCookie("addIn", this.state.addIn)
          this.handleCookie("yType", this.state.yType)
          this.handleCookie("ns", this.state.ns)
          this.handleCookie("locationNS", this.state.locationNS)
          this.handleCookie("locationEW", this.state.locationEW)

          this.handleCookie("bijaBreakpoint", bijaBreakpoint)
          this.handleCookie("latitude", latitude)
          this.handleCookie("longitude", longitude)

          this.props.prefHandleCallback(new Canons(this.state.canon), this.state.addIn, 
            this.state.yType, this.state.ns, bijaBreakpoint, this.state.locationNS, this.state.locationEW, 
            latitude, longitude)
            this.props.onPreferencesSetCallback()
          this.onCancelClick(e)
        }
      }

    render() {
      const { t } = this.props;

      return (
        <div>          
          <Modal
            style={{zIndex: 100000}}
            open={this.state.open}
            onClose={this.onCancelClick}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="Hic-Dialog-Title">                  
                    <div className="Hic-Dialog-Title-Text">{t("preferences")}</div>
                    <div style={{textAlign: "right"}}>
                      <IconButton aria-label="dclose" onClick={this.onCancelClick}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
                <div style={{marginTop: 8}}>
                    <div className="Hic-Preference-Title">{t("canon")}</div>
                    <div>
                        <FormControl>
                            <RadioGroup
                              row
                              onChange={this.onCanonChange}
                              aria-labelledby="radio-buttons-ns-label"
                              defaultValue={this.state.canon}
                              value={this.state.canon}
                              name="radio-buttons-ns">
                              <FormControlLabel value={Canons.SūryasiddhāntaOld.value} control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                              {Canons.toString(Canons.SūryasiddhāntaOld.value)}
        </Typography>} />
                              <FormControlLabel value={Canons.Sūryasiddhānta.value} control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                              {Canons.toString(Canons.Sūryasiddhānta.value)}
        </Typography>}/>
                              <FormControlLabel value={Canons.Āryasiddhānta.value} control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                              {Canons.toString(Canons.Āryasiddhānta.value)}
        </Typography>} />
                            </RadioGroup>                       
                        </FormControl>
                    </div>
                </div>
                <div>
                  <div className="Hic-Preference-Title">{t("include_longitude_difference")}</div>
                  <div>
                  <RadioGroup
                              row
                              onChange={this.onLongDiffChange}
                              aria-labelledby="radio-buttons-ns-label"
                              defaultValue={this.state.addIn ? 1 : 0}
                              value={this.state.addIn ? 1 : 0}
                              name="radio-buttons-ns">
                              <FormControlLabel value="1" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                              Yes
        </Typography>} />
                              <FormControlLabel value="0" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                              No
        </Typography>}/>                            
                            </RadioGroup>                  
                  </div>
                </div>
                <div>
                <div className="Hic-Preference-Title">Era</div>
                <FormControl>
                    <RadioGroup
                        row
                        onChange={this.onCalendarChange}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue={this.state.yType}
                        value={this.state.yType}
                    >
                        <FormControlLabel value="0" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                        Kaliyuga
    </Typography>} />
                        <FormControlLabel value="1" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                        Vikrama
    </Typography>} />
                        <FormControlLabel value="2" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                        Śaka
    </Typography>} />                    
                    </RadioGroup>
                        </FormControl>
                </div>
                <div style={{marginTop: 8}}>
                  <div className="Hic-Preference-Title">Apply <i>bīja</i> from KY</div>
                  <div>
                <TextField         
                size="small"
                onChange={this.onbijaBreakpointChange} 
          id="outlined-required"          
          style = {{width: 110}}
          value={this.state.bijaBreakpoint}
          defaultValue={this.state.bijaBreakpoint}
        /></div>
                </div>
                <div style={{marginTop: 12}}>
                  <div className="Hic-Preference-Title">{t("jupiter_year")}</div>
                  <div>
                    <FormControl>
                        <RadioGroup
                            row
                          onChange={this.onNSChange}
                          aria-labelledby="radio-buttons-ns-label"
                          defaultValue={this.state.ns}
                          value={this.state.ns}
                          name="radio-buttons-ns">
                          <FormControlLabel value="0" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                          {t("nothern")}
    </Typography>} />
                          <FormControlLabel value="1" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                          {t("Southern")}
    </Typography>} />
                        </RadioGroup>                       
                    </FormControl>
                    </div>
                </div>
               
                <div className="Hic-Preference-Title-1">
                    {t("location")}
                </div>
                <div>
                  <div className="Hic-Preference-Title-2">
                    {t("latitude")}
                  </div>
                  <div style={{float: "left"}}>
                  <FormControl>
                        <RadioGroup
                          row
                          onChange={this.onLocationNSChange}
                          aria-labelledby="radio-buttons-ns-label"
                          defaultValue={this.state.locationNS}
                          value={this.state.locationNS}
                          name="radio-buttons-ns"
                        >
                          <FormControlLabel value="1" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                        N
    </Typography>} />
                          <FormControlLabel value="0" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                        S
    </Typography>} />
                        </RadioGroup>                       
                      </FormControl>
                  </div>
                  <div>
                  <TextField         
                onChange={this.onLatitudeChange} 
                size="small"
                style = {{width: 90}}
          id="outlined-required"
          value={this.state.latitude}
          defaultValue={this.state.latitude}
        /> 
                  </div>
                </div>
                <div style={{marginTop: 4}}>
                  <div className="Hic-Preference-Title-2">
                    {t("longitude")}
                  </div>
                  <div style={{float: "left"}}>
                            <FormControl>
                            <RadioGroup
                            row
                              onChange={this.onLocationEWChange}
                              aria-labelledby="radio-buttons-ew-label"
                              defaultValue={this.state.locationEW}
                              value={this.state.locationEW}
                              name="radio-buttons-ew"
                            >
                              <FormControlLabel value="1" control={<Radio size="small"/>} label={ <Typography sx={{ fontSize: "0.8em" }}>
                        E
    </Typography>} />
                              <FormControlLabel value="0" control={<Radio size="small" />} label={ <Typography sx={{ fontSize: "0.8em" }}>
                        W
    </Typography>} />
                            </RadioGroup>                  
                          </FormControl>
                        </div>
                        <div>
                        <TextField         
                        size="small"
                onChange={this.onLongitudeChange} 
          id="outlined-required"
          size="small"
          style = {{width: 90}}
          value={this.state.longitude}
          defaultValue={this.state.longitude}
        />  
                        </div>   

                  </div>              
                  
                <div className="Hic-Preference-Button" style={{margin: 12}}>
                  <div>
                    <Button variant="outlined" 
                    size="small"
                    fullWidth
                    onClick={this.onRestoreClick}
                    >{t("restore_default")} </Button>
                  </div>
                  <div style={{display: "none"}}>
                  <Button variant="outlined" 
                  size="small"
                  fullWidth
                  onClick={this.onCancelClick}
                  >{t("cancel")} </Button>
                  </div>
                  <div>
                  <Button variant="contained" 
                  size="small"
                  fullWidth
                  onClick={this.onSetClick}
                  >{t("set")} </Button>
                  </div>
                </div>
            </Box>
          </Modal>
        </div>
      );
    }
}

export default withCookies(withTranslation()(PreferenceDialog));