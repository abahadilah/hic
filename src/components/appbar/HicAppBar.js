import * as React from 'react';
import Canons from '../../data/Canons'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { withTranslation } from 'react-i18next';

var canon = Canons.Sūryasiddhānta
const drawerWidth = 0;
const navItems = ['Settings', 'Tables'];
/*onClick={handleDrawerToggle}*/
const drawer = (
    <Box  sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        HIC
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  //const container = window !== undefined ? () => window().document.body : undefined;

class HicAppBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          menuOptionsVisible: false,
          menuOptionsAnchorEl: null,
          menuTablesVisible: false,
          menuTablesAnchorEl: null
        }

        this.onOptionsMenuClose = this.onOptionsMenuClose.bind(this)
        this.onTablesMenuClose = this.onTablesMenuClose.bind(this)
        this.onAboutOptionsMenuItemClick = this.onAboutOptionsMenuItemClick.bind(this)
        this.onTableMenuItemClick = this.onTableMenuItemClick.bind(this)
    }

    // menu options

    onOptionsMenuClose(e) {
      this.setState(
        {
          menuOptionsVisible: false,
          menuOptionsAnchorEl: null
        }
      )
    }

    onOptionsMenuClick(e, value) {
      this.onOptionsMenuClose(e)
      this.props.preferencesOptionsHandleCallback(true)
    }

    onAboutOptionsMenuItemClick(e) {
      this.onOptionsMenuClose(e)
      this.props.aboutOptionsHandleCallback(true)
    }
    
    // menu canon

    onCanonsMenuClick(e) {
      this.props.aboutOptionsHandleCallback(true)
    }

    onCanonsMenuItemClick(e, value) {
      this.setState(
        {
          menuCanonsVisible: false,
          menuCanonsAnchorEl: e.target
        }
      )

      this.props.canonHandleCallback(value)
    }


    // tables menu

    onTablesMenuClose(e) {
      this.setState(
        {
          menuTablesVisible: false,
          menuTablesAnchorEl: null
        }
      )
    }

    onTablesMenuClick(e, value) {
      this.setState(
        {
          menuTablesVisible: true,
          menuTablesAnchorEl: e.target
        }
      )
    }

    onTableMenuItemClick(e, menu, title) {
      this.onTablesMenuClose(e)
      this.props.tableMenuHandleCallback(title, menu)
    }

    render() {
        return  <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              //onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              <div>Hindu Calendar Conversion</div>
              <div style={{fontSize: 16}}>Canon: {Canons.toString(this.props.canon.value)}</div>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block'} }}>
              
                <Button id="options-button" key="Options" sx={{ color: '#fff' }}  onClick={
                  (e)  => this.onOptionsMenuClick(e)
              }
              aria-controls={this.state.menuOptionsVisible ? 'options-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={this.state.menuOptionsVisible ? 'true' : undefined}
              >
                  Settings
                </Button>
              
                <Button id="tables-button" key="Tables" sx={{ color: '#fff' }}  onClick={
                  (e)  => this.onTablesMenuClick(e)
              } 
              aria-controls={this.state.menuOptionsVisible ? 'tables-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={this.state.menuOptionsVisible ? 'true' : undefined}
              >
                  Tables
                </Button>
                <Button id="canons-button" key="Canons" sx={{ color: '#fff' }}  onClick={
                  (e)  => this.onCanonsMenuClick(e)
              }
              aria-controls={this.state.menuOptionsVisible ? 'canons-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={this.state.menuOptionsVisible ? 'true' : undefined}
              >
                  About
                </Button>
            </Box>
          </Toolbar>        
        <Menu
            id="tables-menu"
            anchorEl={this.state.menuTablesAnchorEl}
            open={this.state.menuTablesVisible}
            onClose={this.onTablesMenuClose}
            MenuListProps={{
              'aria-labelledby': 'tables-button',
            }}
          >
            <MenuItem onClick={ (e) => this.onTableMenuItemClick(e, 0, "Tithi/Karaṇa")}>
              Tithi/Karaṇa
            </MenuItem>
            <MenuItem onClick={ (e) => this.onTableMenuItemClick(e, 1, "Nakṣatra")}>
            Nakṣatra
              </MenuItem>
            <MenuItem onClick={ (e) => this.onTableMenuItemClick(e, 2, "Yoga")}>
              Yoga
            </MenuItem>
            <MenuItem onClick={ (e) => this.onTableMenuItemClick(e, 3, "Jupiter Year")}>
              Jupiter Year
            </MenuItem>
        </Menu>
        </AppBar>        
      </Box>
    }
}

export default withTranslation()(HicAppBar);