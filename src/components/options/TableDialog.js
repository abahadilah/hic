import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { sprintf } from "sprintf-js";
import { withTranslation } from 'react-i18next';

const TithiName = ["pratipadā","dvitīyā","tr̥tīyā","caturthī",
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
					"mūla","purvāṣāḍhā","uttarāṣāḍhā","abhijit",
					"śravaṇā","dhaniṣṭha","śatabhiṣaj","pūrvabhadrapadā",
					"uttarabhadrapadā", "revatī"]

const Devata = ["Aśvī, Aśvinī, Aśvinau, Dasra","Yama","Agni, Dahana","Prajāpati, Dhātr̥, Kamalaja",
					"Soma, Śaśin","Rudra, Śarva, Śūlabhr̥t","Aditi", "Br̥haspati, Vākpati, Jīva","Sarpāḥ, Phaṇi, Ahideva",
					"Pitaraḥ, Pitr̥deva","Bhaga, Yoni","Aryaman", "Savitr̥, Sāvitra, Ravi, Dinakr̥t", "Tvaṣṭr̥",
					"Vāyu, Māruta, Pavana, Anila","Indrāgni, Śakrāgni","Mitra","Indra, Śakra",
					"Nirr̥ti, Pitaraḥ","Āpaḥ, Toya","Viśvedevāḥ, Viśve","Brahmā",
					"Viṣṇu, Hari / Brahmā, Vidhi","Vasavaḥ, Vasu, Vasudeva, Govinda / Viṣṇu, Hari","Varuṇa","Aja Ekapād, Ekapāda, Ajacaraṇa, Ajapāda",
					"Ahirbudhnya, Ahirbudhna", "Pūṣan"]

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
          
const Rasi1 = ["Meṣa","Vr̥ṣabha","Mithuna","Karka","Siṁha",
          "Kanyā","Tulā","Vr̥ścika","Dhanus",
          "Makara","Kumbha", "Mīna"]    

const Rasi2 = ["Aries","Taurus","Gemini","Cancer","Leo",
          "Virgo","Libra","Scorpio","Sagittarius",
          "Capricornus","Aquarius", "Pisces"]    

const Muhurta = ["Raudra","Śveta","Maitra","Ārabhaṭa, Sārabhaṭa","Sāvitra","Vairāja, Vairājya",
          "Gāndharva, Viśvāvasu","Abhijit","Rauhiṇa","Bala",
          "Vijaya","Nairr̥ta", "Śākra, Vāruṇa", "Vāruṇa, Saumya", "Bhaga"]           


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
      var column1ClassName = "Hic-Table-Column1"
      var column2ClassName = "Hic-Table-Footer-None"
      var titleNaksaraDevataColumnClassName = "Hic-Table-Footer-None"
      var titleTithiKaranaColumnClassName = "Hic-Table-Footer-None"
      var width = 250
      
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
          if (i == 29) msg1 = "amāvāsyā";
          msg = msg + msg1;

          var kar1 =Karana[ this.findKarana(2*i+1)];
          var kar2 = Karana[ this.findKarana(2*i+2)];
          
          var a = []
          a[0] = msg
          a[1] = kar1 + "-" + kar2

          arr[i] = a

          titleTithiKaranaColumnClassName = "Hic-Table-Column1"
          column1ClassName = "Hic-Table-Column-Tithi"
          column2ClassName = "Hic-Table-Column1"
          width = 300
        }
      }
      else
      if (this.props.menu == 1) {
        for(var i=0; i < NakName.length; i++) {
          var a = []
          a[0] = NakName[i]
          a[1] = Devata[i]
          arr[i] = a

          titleNaksaraDevataColumnClassName = "Hic-Table-Column1"
          column1ClassName = "Hic-Table-Column-Naksatra"
          column2ClassName = "Hic-Table-Column1"
          width = 500
        }        
      }
      else
      if (this.props.menu == 5) {
        for(var i=0; i < Rasi1.length; i++) {
          var a = []
          a[0] = Rasi1[i]
          a[1] = Rasi2[i]
          arr[i] = a

          column1ClassName = "Hic-Table-Column-Rasi1"
          column2ClassName = "Hic-Table-Column1"
          width = 250
        }        
      }
      else
      if (this.props.menu == 2) {
        arr = YogaName
      }
      else
      if (this.props.menu == 3) {
        arr = JupYearName
      }
      else
      if (this.props.menu == 4) {
        arr = this.props.wukWeek
      }
      else
      if (this.props.menu == 6) {
        arr = Muhurta
        width = 350
      }


      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: width,
        height: "80%",
        bgcolor: 'background.paper',
        overflow:'scroll',
        border: '2px solid #000',
        display:'block',
        boxShadow: 24,
      };

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
                <div className={titleTithiKaranaColumnClassName}>
                <Stack spacing={1.5} direction="row">
                    <div style={{textAlign: "right", width: 25}}>&nbsp;</div>
                    <div className="Hic-Table-Column-Title-Tithi">Tithi</div>
                    <div className="Hic-Table-Column-Title-Devata">Karaṇa</div>
                    </Stack>
                </div>
                <div className={titleNaksaraDevataColumnClassName}>
                <Stack spacing={1.5} direction="row">
                    <div style={{textAlign: "right", width: 25}}>&nbsp;</div>
                    <div className="Hic-Table-Column-Title-Naksatra">Nakṣatra</div>
                    <div className="Hic-Table-Column-Title-Devata">Devatā</div>
                    </Stack>
                </div>
                <div>
                {arr.map(
                (m, index) => <div className={index%2==0 ? "Hic-Table-Row-Even" : "Hic-Table-Row-Odd"}>
                  <Stack spacing={1.5} direction="row">
                    <div style={{textAlign: "right", width: 25}}>{this.props.menu == 1 ? (index < 21 ? index+1 : (index == 21 ? "" : index)) : index+1}</div>
                    <div className={column1ClassName}>{Array.isArray(m) ? m[0] : m}</div>
                    <div className={column2ClassName}>{m[1]}</div>
                  </Stack></div>
            )}
                </div>
                <div className={this.props.menu == 1 ? "Hic-Table-Footer" : "Hic-Table-Footer-None"}>Source: Table summarized from Gomperts 2001: 101–102</div>
                <div className={this.props.menu == 6 ? "Hic-Table-Footer" : "Hic-Table-Footer-None"}>Source: Table summarized from Gomperts 2001: 111–112</div>
            </Box>
          </Modal>
        </div>
      );
    }
}

export default withTranslation()(TableDialog);