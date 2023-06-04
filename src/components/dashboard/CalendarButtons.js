import * as React from 'react';
import Button from '@mui/material/Button';
import { withTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';

class CalendarButtons extends React.Component {
    calendarOnClick(data1, data2) {
      this.props.calendarDialogHandleCallback(data1.m, data2.index)
    }

    render() {
        return <div>
            <Stack spacing={0.5} direction="column">
            {this.props.data.map(
                
                (m, index) => <div key={index}><Button onClick={() => this.calendarOnClick({m},{index})} variant="outlined" style={(m === "Caitra" || m === "Adhika Caitra") ? {
                  color: "#ff0000"
                } : {
                  color: "#0000ff"
                }} size="small" sx={{width: 175, height: 25}}>{m}</Button></div>
            )}
            </Stack></div>
            
        
    }
}

export default withTranslation()(CalendarButtons);