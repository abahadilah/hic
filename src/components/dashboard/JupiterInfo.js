import React from "react";
import Stack from '@mui/material/Stack';
import { withTranslation } from 'react-i18next';

class JupiterInfo extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {
        var hidden = this.props.jupiterInfo2 ? "" : "hidden"
        return <div className="Hic-Jupiter">
            <div className="Hic-Jupiter-Label">{this.props.jupiterInfo1}</div>
            <div className="Hic-Jupiter-Label" style={{visibility: hidden}}>{this.props.jupiterInfo2}</div>
        </div>
    }
}

export default withTranslation()(JupiterInfo);