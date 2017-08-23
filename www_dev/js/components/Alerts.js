import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { getAlerts, discardAlert, readAlert, discardAlertAction } from '../actions/alertActions'

//Redux Components
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Title from 'grommet/components/Title';
import App from 'grommet/components/App';
import Anchor from 'grommet/components/Anchor';
import Menu from 'grommet/components/Menu';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';

import AlertListItem from './AlertListItem';
import RateThisAppListItem from './RateThisAppListItem';
import LandingSidebar from './LandingSidebar';
import OrderList from './OrderList';
import IconHelper from './IconHelper';
import FooterMain from './FooterMain';
import FooterPadding from './FooterPadding';
import PageHeader from './PageHeader';
import { Spinner } from '../utils/commonComponents';
import NoInternetConnection from './NoInternetConnection';
import config from '../utils/config';

// utils
import { tracking } from '../utils/utilities';

const alertTitle = (<FormattedMessage id="cpx_alerts_title" defaultMessage="Alerts" />);
const alertResult = (<FormattedMessage id="cpx_alerts_result" defaultMessage="Results" />);
const noAlerts = (<FormattedMessage id="cpx_alerts_noalerts" defaultMessage="No alerts found" />);

// const TERMS = "https://mobilitycat.itcs.hpe.com/catalog";
const TERMS = config.ALERTS_RATE_APP_TERMS;

const mapStateToProps = (state) => ({
    reduxState: state
});

const mapDispatchToProps = (dispatch) => ({
    alertActions: bindActionCreators({ getAlerts, discardAlert, discardAlertAction }, dispatch)
});

const Alerts = React.createClass({
    getInitialState: function () {

        return (
            {
                alertData: null
            }
        );
    },

    componentDidMount() {
        var alertData = this.getData();
        this.setState({ alertData: alertData });

    },

    componentWillReceiveProps: function (nextProps) {

        var { userAlerts } = nextProps.reduxState;
        this.setState({ alertData: userAlerts.data });

    },

    getData: function () {
        let { alertActions } = this.props;
        let { alertList } = this.props.reduxState.userInit.data;
        alertActions.getAlerts(alertList.list);
        return this.props.reduxState.userAlerts.data;

    },

    goBack: function () {
        hashHistory.goBack();

    },

    goToOrderDetails: function (alertId, objectId) {

        hashHistory.push('/orderdetails/' + objectId);
        //        this.purgeAlerts(alertId);

    },

    goToFeedbackPage: function (alertId, objectId) {
        //TODO
        var ref = window.open(TERMS, "_system");
    },

    purgeAlerts: function (alertId) {

        let alertData = this.props.reduxState.userInit.data.alertList.list;
        let { alertActions } = this.props;

        var index = alertData.findIndex(x => x.id == alertId);
        alertData.splice(index, 1);
        this.setState({ alertData: alertData });

        alertActions.discardAlert(alertId);

    },

    render: function () {
        const IsLoading = this.props.reduxState.userAlerts.IsLoading;
        const isSimulationMode = this.props.reduxState.userInit.userSimulation.simulationMode;
        var alertsHeader, alertsContent, alertsRateContent;

        if (IsLoading) {
            alertsHeader = null;
            alertsContent = <Spinner />;
        }

        else {


            const alertData = this.state.alertData ? this.state.alertData.filter((item) => item.isNew == true) : null;

            if (alertData == null || !alertData.length || alertData.length == 0) {
                alertsHeader = null;
                alertsContent = <Box pad="medium" ><Heading tag="h3" align="start" style={pStyle}>{noAlerts}</Heading></Box>;
            }
            else {
                var alertCount = alertData.length;
                var renderAlerts;
                var pStyle = {
                    color: '#000000'
                };

                alertsHeader = <Box direction="column" colorIndex="light-1" pad="medium" separator="horizontal" justify="between" responsive={false}>
                    <Title responsive={false} justify="between">
                        <Heading className="alerts-header" margin="none" strong={true} align="start">{alertCount} {alertResult}</Heading>
                    </Title>
                </Box>;

                alertData.sort(function (a, b) {
                    return new Date(b.creationDate) - new Date(a.creationDate);
                });
                
                alertsContent = alertData.map((item, i) => {
                    if (item.objectId != "") {
                        return (
                            <AlertListItem key={item.id}
                            alertTitle={item.title}
                            alertSubTitle={item.subTitle}
                            alertMessage={item.message}
                            alertDateTimeStamp={item.creationDate}
                            onClear={() => isSimulationMode ? null: this.purgeAlerts(item.id)}
                            onAlertClick={() => {
                                tracking('AlertClicked', this.props.reduxState.userInit.data.profile.analytics);
                                this.goToOrderDetails(item.id, item.objectId);
                            }}
                            {...item}/>
                        )
                    }
                });

                alertsRateContent = alertData.map((item,i) => {
                    if(item.objectId == "") {
                        return (<RateThisAppListItem key={item.id}
                            alertTitle={item.title}
                            alertMessage={item.message}
                            onAlertClick={() => {
                                tracking('AlertClicked', this.props.reduxState.userInit.data.profile.analytics);
                                this.goToFeedbackPage(item.id, item.objectId);
                            }}
                            {...item}/>);
                    } else {
                        return null;
                    }
                });
            }
        }

        return (

            <App centered={true}>
                <NoInternetConnection />
                <PageHeader pageTitle={alertTitle} showBackBtn={true} />
                <Section pad='none'>
                    {alertsHeader} {alertsRateContent} {alertsContent}
                </Section>
                <FooterPadding />
                <FooterMain Source={alertTitle.props.defaultMessage} Count={alertCount} />
            </App >
            
        );

    }

});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
