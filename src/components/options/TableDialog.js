import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { sprintf } from "sprintf-js";
import { withTranslation } from 'react-i18next';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 250,
  height: "80%",
  bgcolor: 'background.paper',
  overflow:'scroll',
  border: '2px solid #000',
  display:'block',
  boxShadow: 24,
};

const TithiName = ["pratipadā","dvitīya","tr̥tīya","caturthī",
					"pañcamī","ṣaṣṭhī",
					"saptamī","aṣṭamī","navamī","daśamī",
					"ekādaśī", "dvādaśī","trayodaśī",
					"caturdaśī", "pūrṇimā "]

const Karana = ["Kiṁstughna","Bava","Vālava","Kaulava","Taitila","Gara",
          "Vaṇija","Viṣṭi","Śakuni","Nāga","Catuṣpada"];

const NakName = ["aśvinī","bharaṇī","kr̥ttikā","rohiṇī",
					"mr̥gaśiras","ārdrā","punarvasū", "puṣya","āśleṣā",
					"maghā","pūrvaphalgunī","uttaraphalgunī", "hasta", "citrā",
					"svāti","viśākhā","anurādhā","jyeṣṭhā",
					"mūla","purvāṣāḍhā","uttarāṣāḍhā",
					"śravaṇā","dhaniṣṭha","śatabhiṣaj","pūrvabhadrapadā",
					"uttarabhadrapadā", "revatī"]

const YogaName = ["viṣkamba","prīti","āyuṣmat","saubhāgya",
					"śobhana","atigaṇḍa","sukarman", "dhr̥ti","śūla",
					"gaṇḍa","vr̥ddhi","dhruva","vyāghāta","harṣaṇa",
					"vajra","siddhi","vyatipāta", "varīyas","parigha","śiva","siddha",
					"sādhya","śubha","śukla","brahman","indra","vaidhṛti"];

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
          "Sarvajit","Sarvadhārin","Virodhin","Vikr̥ta","Khara","Nandana"]         


class TableDialog extends React.Component {
    constructor(props) {
        super(props)      
        
        this.state = {
            open: this.props.open,          
        }

        this.handleClose = this.handleClose.bind(this)
    }

    componentDidMount() {
      
    }

    handleClose() {
      this.setState({
        open: false
      })
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

    render() {
      const { t } = this.props;

      var arr = [];
      
      if (this.props.menu == 0) {
        for(var i=0; i < 30; i++) {
          var msg;
          var msg1;

          if (i==14 || i == 29) {
            msg = "";
          }
          else { 
            msg = sprintf("%1$s", TithiName[i%15])
          }

          if (i < 14) msg1 = " śukla  ";
          if (i > 14) msg1 = " kr̥ṣṇa ";
          if (i == 14) msg1 = "pūrṇimā";
          if (i == 29) msg1 = "amāvāsya";
          msg = msg + msg1;

          var kar1 =Karana[ this.findKarana(2*i+1)];
          var kar2 = Karana[ this.findKarana(2*i+2)];
          msg = msg + " " + kar1 + "-" + kar2;
          
          arr[i] = msg
        }
      }
      else
      if (this.props.menu == 1) {
        arr = NakName
      }
      else
      if (this.props.menu == 2) {
        arr = YogaName
      }
      else
      if (this.props.menu == 3) {
        arr = JupYearName
      }

      return (
        <div>          
          <Modal
            style={{zIndex: 100000}}
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <div className="Hic-Dialog-Title">                  
                    <div className="Hic-Dialog-Title-Text">{this.props.title}</div>
                    <div style={{textAlign: "right"}}>
                      <IconButton aria-label="dclose" onClick={this.handleClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                </div>
                <div>
                {arr.map(
                (m, index) => <div className={index%2==0 ? "Hic-Table-Row-Even" : "Hic-Table-Row-Odd"}><Stack spacing={1.5} direction="row">
                    <div style={{textAlign: "right", width: 25}}>{index+1}</div>
                    <div>{m}</div>
                  </Stack></div>
            )}
                </div>
            </Box>
          </Modal>
        </div>
      );
    }
}

export default withTranslation()(TableDialog);