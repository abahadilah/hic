import React from "react";
import Stack from '@mui/material/Stack';
import { withTranslation } from 'react-i18next';

const months = ["Meṣa", "Vr̥ṣabha", "Mithuna", "Karka", 
"Siṁha", "Kanyā", "Tulā",
"Vr̥ścika", "Dhanus", "Makara", "Kumbha", "Mīna"]


class MonthLabels extends React.Component {

    render() {
        return <Stack spacing={0.5} direction="column">
            {months.map(
                (m, index) => <div key={index} id="month" className="Hic-Label" >{m}  ({index+1})</div>
            )}
        </Stack>
    }
}

export default withTranslation()(MonthLabels);