import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';


//Grommet Components
import Box from 'grommet/components/Box';

//Components
import FooterSearch from './FooterSearch';
import FooterWatchList from './FooterWatchList';
import FooterAlerts from './FooterAlerts';
import FooterSavedSearches from './FooterSavedSearches';

const mapStateToProps = (state) => ({
    userInit: state.userInit.data
});

var FooterMain = React.createClass({

    render: function () {

        var {userInit} = this.props;
        var alertCount = userInit.alertList == undefined ? 0 : userInit.alertList.list.filter((item) => item.isNew == true).length;

        return (
            <Box className="footer-main" justify="between" direction="column" colorIndex="light-1" responsive={false} pad={{ horizontal: "none", vertical: "small" }}>
                <Box direction="row" responsive={false} justify="between" style={{ 'height': '12vh' }}>
                    <FooterSearch Source={this.props.Source} />
                    <FooterWatchList Source={this.props.Source} />
                    <FooterAlerts Source={this.props.Source} Count={alertCount} />
                    <FooterSavedSearches Source={this.props.Source} />
                </Box>
            </Box>
        );
    }
});

export default connect(mapStateToProps)(FooterMain);
