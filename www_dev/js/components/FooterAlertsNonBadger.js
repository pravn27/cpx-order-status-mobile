import React from 'react';
import ReactDOM from 'react-dom';

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
            <div>
                { this.props.Source == "Alerts" ? <div className="input-group-btn"><img src={filled} height="23" width="24" /></div> : <div className="input-group-btn"><img src={grey} height="23" width="24" /></div> }
            </div>
        );
    }
});

export default Alerts;