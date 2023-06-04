import React from "react";
import Stack from '@mui/material/Stack';
import { withTranslation } from 'react-i18next';

const months = ["Meṣa (0)", "Vr̥ṣabha (1)", "Mithuna (2)", "Karka (3)", 
"Siṁha (4)", "Kanyā (5)", "Tulā (6)",
"Vr̥ścika (7)", "Dhanus (8)", "Makara (9)", "Kumbha (10)", "Mīna (11)"]


class MonthLabels extends React.Component {

    render() {
        return <Stack spacing={0.5} direction="column">
            {months.map(
                (m, index) => <div key={index} id="month" className="Hic-Label" >{m}</div>
            )}
        </Stack>
    }
}

export default withTranslation()(MonthLabels);