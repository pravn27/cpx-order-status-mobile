import React from 'react';
import ReactDOM from 'react-dom';

//Badge Components
import Badge from './FooterBadge';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//Grommet Components
import Alert from 'grommet/components/icons/base/Alert';

//View

var Alerts = React.createClass({

    watchlistredirect: function () {
        hashHistory.push('/Alerts');
    },

    render: function () {

        
        var filled = "img/icons/alert_green.png";
        var grey = "img/icons/alert_grey.png"

        return (
            <MuiThemeProvider>
                <div>
                    <Badge badgeContent={this.props.Count} secondary={true} badgeStyle={{ top: -5, right: -18, width: 20, height: 20 }}>
                        { this.props.Source == "Alerts" ? <div className="input-group-btn"><img src={filled} height="23" width="24" /></div> : <div className="input-group-btn"><img src={grey} height="23" width="24" /></div> }
                    </Badge>
                </div>
            </MuiThemeProvider>
        );
    }
});

export default Alerts;