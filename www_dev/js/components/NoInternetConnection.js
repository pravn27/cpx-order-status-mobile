/**
 * How to use this component:
 * 
 * This modal is only shown when an action 'USER_LOST_INTERNET_CONNECTION' is
 * dispatched. (you can check the '../actions/userActions.js' file)
 * 
 * If a 'USER_RECOVERED_INTERNET_CONNECTION' action is dispatched this
 * modal will be hidden. (you can check the 'modalReducer.js' file)
 */


// Grommet & React imports
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Paragraph from 'grommet/components/Paragraph';
import Section from 'grommet/components/Section';
import { FormattedMessage } from 'react-intl';

// Redux imports
import { connect } from 'react-redux'
import { userDeniedAccessRights, userAcknowledgeDeniedAccessRights, userLostInternetConnection, userRecoveredInternetConnection } from '../actions/userActions';


export const MODAL_NAME = 'NoInternetConnection';


var countOfMountedComponents = 0;// Used to avoid mounting 2 or more of the same component 


// Redux stuff
const
    mapStateToProps = ({ modalReducer }) => ({
        activeModal: modalReducer.activeModal
    }),

    mapDispatchToProps = (dispatch, ownProps) => ({});

class NoInternetConnection extends Component {

    shouldRender() {
        return true;
    }

    componentWillUnmount () {
        countOfMountedComponents--;        
    }

    componentDidMount () {

        countOfMountedComponents++;
        if (countOfMountedComponents > 1) {
            // This prevents showing 2 or more components at the same time
            this.shouldRender = () => false;
            console.warn(`Currently are mounted ${countOfMountedComponents} '${MODAL_NAME}' components but rendering just one.`);
            return;
        }

    }

    render () {
        let { activeModal } = this.props;

        if (this.shouldRender() && MODAL_NAME === activeModal) {

            return (
                <Layer>
                    <Box>
                        <Box pad={{vertical: 'medium'}}>
                            <Image src="img/hPELogo@3x.png" size="small"/>
                        </Box>
                        <Box direction="row">
                            <Heading tag="h2" margin="small">
                                <b><FormattedMessage id="hpe_go" defaultMessage="HPE Go" /></b>
                            </Heading>
                        </Box>
                    </Box>
                    <Box flex={true} alignContent="center">
                        <Section align="center" pad={{vertical: 'medium'}}>
                            <Image src="img/connection_icon.png" size="small"/>
                            <Paragraph size="medium">
                                <b><FormattedMessage id="no_internet_connection" defaultMessage="No internet connection" /></b>
                            </Paragraph>
                        </Section>
                    </Box>
                    <Footer justify="center">
                        <Paragraph align="center">
                            <FormattedMessage id="cpx_login_screen_trademark" defaultMessage="© 2016 Hewlett Packard Enterprise Company, L.P." />
                        </Paragraph>
                    </Footer>
                </Layer>
            );
        }

        return null;
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(NoInternetConnection);

