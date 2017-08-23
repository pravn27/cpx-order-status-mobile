// imports
import React from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux'

// components
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';
import Image from 'grommet/components/Image';
import Title from 'grommet/components/Title';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Anchor from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import ListItem from 'grommet/components/ListItem';
import Paragraph from 'grommet/components/Paragraph';

// CPX components
import IconHelper from './IconHelper';

// Texts
const infoText = {
    title: (<FormattedMessage id='cpx_simulate_title' defaultMessage="Simulate User" />),
    list_line_1: (<FormattedMessage id="cpx_simulate_page_list_1" defaultMessage="You are now simulating user" />),
    list_line_2: (<FormattedMessage id="cpx_simulate_page_list_2" defaultMessage="click the exit button when" />),
    list_line_3: (<FormattedMessage id="cpx_simulate_page_list_3" defaultMessage="you are done" />),
    cont_home: (<FormattedMessage id="cpx_continue_2_home" defaultMessage="Continue to home" />),
    exit_sml: (<FormattedMessage id="cpx_exit_simulation" defaultMessage="Exit Simulation" />)
};


const mapStateToProps = (state) => ({
    userInit: state.userInit
});

var SimulateUserPage = React.createClass({

    clickHome: function () {
        this.props.onClickSimulation();
        hashHistory.push('/LandingPage');
    },

    exitSimulation: function () {
        this.props.onExitSimulation();
        this.props.closeMenu();
        hashHistory.push('/LandingPage');
    },

    render() {
        var userInit = this.props.userInit;
        return (
            <Box>
                <Box colorIndex="light-1" responsive={true} align="start" pad={{ horizontal: "large", vertical: "large" }}>
                    <Heading tag="h2" margin="medium" >{infoText.title}</Heading>
                    <Paragraph margin="none" size="large" style={{ 'marginTop': '-0.3em','padding-bottom': '0.2em' }} >{infoText.list_line_1}</Paragraph>
                    <Paragraph margin="none" size="large" style={{'width':'100%', 'marginTop': '-0.3em','padding-bottom': '0.2em','word-wrap':'break-word','display':'inline-block' }} >{userInit.userSimulation.simulatedUser}</Paragraph>
                    <Paragraph margin="none" size="large" style={{ 'marginTop': '-0.3em','padding-bottom': '0.2em'  }} >{infoText.list_line_2}</Paragraph>
                    
                </Box>
                <Box colorIndex="light-1" responsive={true} align="center"
                    pad={{ horizontal: "large", vertical: "medium" }}>
                    <Button label={infoText.cont_home} primary={true} fill={true} onClick={() => { this.clickHome() } } />
                </Box>
                <Box colorIndex="light-1" responsive={true} align="center"
                    pad={{ horizontal: "large", vertical: "medium" }}>
                    <Button label={infoText.exit_sml} secondary={true} fill={true} onClick={() => this.exitSimulation()} />
                </Box>
            </Box>
        );
    }
});

export default connect(mapStateToProps)(SimulateUserPage);
