import React from "react";
import Stack from '@mui/material/Stack';
import { withTranslation } from 'react-i18next';

class JulianTimeLabels extends React.Component {
    constructor(props) {
        super(props)        
    }

    render() {
        return <Stack spacing={0.5} direction="column">
            {this.props.data.map(
                (m, index) => <div key={index} id="month" className="Hic-Label">{m}</div>
            )}
        </Stack>
    }
}

export default withTranslation()(JulianTimeLabels);