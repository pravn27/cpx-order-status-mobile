import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { hashHistory } from 'react-router';

//Grommet Components
import Box from 'grommet/components/Box';
import Flag from 'grommet/components/icons/base/Flag';

//Text
const SectionTitles = {
    watch_list: (<FormattedMessage id="footer_watch_lists" defaultMessage="Watch List" />),
};

var Watchlist = React.createClass({
   
    watchlistredirect: function () {
        hashHistory.push('/WatchListPage');
    },

    render: function () {

        var filled = "img/icons/flag_green.png";
        var grey = "img/icons/flag.png"

        return (
            <Box pad="none" align="center" justify="center" onClick={this.watchlistredirect} basis="small">
                <Box direction = "column" justify="center">
                    { this.props.Source == "Watch List" ? <div className="input-group-btn"><img src={filled} height="23" width="24" /></div> : <div className="input-group-btn"><img src={grey} height="23" width="24" /></div> }
                </Box>
                {this.props.Source == "Watch List" ? <div className="brand-color">{SectionTitles.watch_list}</div> : <div className="footer-normal">{SectionTitles.watch_list}</div>}
            </Box>
        );
    }
});

export default Watchlist;