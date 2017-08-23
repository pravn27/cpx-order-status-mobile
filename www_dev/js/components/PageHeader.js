import React from 'react';
import { hashHistory } from 'react-router';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import Layer from 'grommet/components/Layer';
import Section from 'grommet/components/Section';
import Menu from 'grommet/components/Menu';
import Box from 'grommet/components/Box';
import LandingSidebar from './LandingSidebar';
import GetSupport from './GetSupport';
import PrivacyStatement from './PrivacyStatement';
import SimulateUser from './SimulateUser';
import TermsAndConditions from './TermsAndConditions';
import Preferences from './Preferences';
import { FormattedMessage } from 'react-intl';
import IconHelper from './IconHelper';
import { backAction } from '../actions/backAction';
import { connect } from 'react-redux';
import SimulationBanner from './SimulationBanner';
var IconMenu = require('grommet/components/icons/base/Menu');

const TERMS = "http://www.hpe.com/termsofuse";

/**
 * Call this component as follow:
 * <PageHeader pageTitle="MyTitle" showBackBtn={false} />
 */
const mapStateToProps = (state) => ({
    reduxState: state
});

var PageHeader = React.createClass({
    getInitialState: function () {
        //console.log("yujietest:location:"+JSON.stringify(this.props.location));
        //a new page is creating, then unlock
        let { dispatch } = this.props;
        dispatch(backAction(false));

        return {
            showMenu: false,
            showHelp: false,
            showPrivacy: false,
            showPreferences: false,
            showSimulateUser: false,
        };
    },
    onClick: function () {
        if (this.state.showMenu) {
            this.setState({ showMenu: false });
        } else {
            this.setState({ showMenu: true });
            this.setState({ showPreferences: false });
            this.setState({ showHelp: false });
            this.setState({ showSimulateUser: false });
        }
    },
    onClickPreferences: function () {
        if (this.state.showPreferences) {
            this.setState({ showMenu: true });
            this.setState({ showPreferences: false });
        }
        else {
            this.setState({ showPreferences: true });
            this.setState({ showMenu: false });
        }
    },
    onCloseHelp: function () {
        if (this.state.showHelp) {
            this.setState({ showMenu: true });
            this.setState({ showHelp: false });
        } else {
            this.setState({ showHelp: true });
            this.setState({ showMenu: false });
        }
    },
    onClosePrivacy: function () {
        if (this.state.showPrivacy) {
            this.setState({ showMenu: true });
            this.setState({ showPrivacy: false });
        } else {
            this.setState({ showPrivacy: true });
            this.setState({ showMenu: false });
        }
    },
    onCloseConditions: function () {
        var ref = window.open(TERMS, "_system");
    },
    onClickHelpHide: function () {
        if (this.state.showHelp) {
            this.setState({ showHelp: false });
        } else {
            this.setState({ showHelp: true });
        }
    },
    onCloseSimulateUser: function () {
        if (this.state.showSimulateUser) {
            this.setState({ showMenu: true });
            this.setState({ showSimulateUser: false });
        } else {
            this.setState({ showMenu: false });
            this.setState({ showSimulateUser: true });
        }
    },
    onClickSimulateUser: function () {
        this.setState({ showMenu: false });
        this.setState({ showSimulateUser: false });
    },
    goBack: function () {
        //console.log("yujietest:location:"+JSON.stringify(this.props.location));
        var isbacking = this.props.reduxState.backReducer;
        if (isbacking == true) {
            //waiting
            //not trigger twice at the same time
        } else {
            let { dispatch } = this.props;
            dispatch(backAction(true));
            hashHistory.goBack();
        }
    },
    render() {
        const {pageTitle, showBackBtn, reduxState} = this.props;
        var isSimulationMode = reduxState.userInit.userSimulation.simulationMode;
        const hideMenuBtn = this.props.hideMenuBtn;
        return (
            <Box>
                <Header className="page-header" pad="none" justify="end" fixed={true} colorIndex="neutral-1" style={{ 'position':'absolute', "min-height": "0px!important" }}>
                    <Box className="menu-items" direction="row" justify="end" responsive={false}>
                        {(() => {
                            if (showBackBtn) {
                                return <Anchor className="page-header-back-btn" icon={<IconHelper iconName="Previous" />} onClick={this.goBack}></Anchor>
                            }
                        })()}
                        {(() => {
                            if (!hideMenuBtn) {
                                return <Anchor icon={<IconMenu />} onClick={this.onClick}></Anchor>
                            }
                        })()}
                    </Box>
                    {hideMenuBtn ?
                        <Title className="page-header-title-text " style={{ 'padding-right': '0px' }}>{pageTitle}</Title>
                        :
                        showBackBtn ?
                            <Title className="page-header-title-text page-header-title-has-back-btn">{pageTitle}</Title>
                            :
                            <Title className="page-header-title-text page-header-title-no-back-btn">{pageTitle}</Title>
                    }
                    {this.state.showMenu ? <LandingSidebar close={this.onClick} privacy={this.onClosePrivacy} conditions={this.onCloseConditions} support={this.onCloseHelp} preferences={this.onClickPreferences} simulateUser={this.onCloseSimulateUser} /> : null}
                    {this.state.showPreferences ? <Preferences close={this.onClickPreferences} /> : null}
                    {this.state.showHelp ? <GetSupport close={this.onCloseHelp} /> : null}
                    {this.state.showPrivacy ? <PrivacyStatement close={this.onClosePrivacy} /> : null}
                    {this.state.showSimulateUser ? <SimulateUser close={this.onCloseSimulateUser} click={this.onClickSimulateUser} /> : null}
                </Header>
                {isSimulationMode ? <SimulationBanner /> : null}
            </Box>

        );
    }
});

export default connect(mapStateToProps)(PageHeader);
