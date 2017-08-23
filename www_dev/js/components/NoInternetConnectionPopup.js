/**
 * How to use this component:
 * 
 * This modal is only shown when an action 'USER_LOST_INTERNET_CONNECTION' is
 * dispatched. (you can check the '../actions/userActions.js' file)
 * 
 * If a 'USER_RECOVERED_INTERNET_CONNECTION' or 'USER_ACKNOWLEDGE_LOST_INTERNET_CONNECTION' 
 * action is triggered this modal will be hidden. (you can check the 'modalReducer.js' file)
 */


// Grommet & React imports
import React from 'react';
import App from 'grommet/components/App';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Columns from 'grommet/components/Columns';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Paragraph from 'grommet/components/Paragraph';
import Section from 'grommet/components/Section';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';

// Redux imports
import { connect } from 'react-redux'
import { userLostInternetConnection, userRecoveredInternetConnection, userAcknowledgeLostInternetConnection } from '../actions/userActions';


// Takes the same name as the 'NoInternetConnection' component because both are triggered by the same action
import { MODAL_NAME as NoInternetConnectionName } from '../components/NoInternetConnection'
export const MODAL_NAME = NoInternetConnectionName;


// Redux stuff
const
    mapStateToProps = ({ modalReducer }) => ({
        activeModal: modalReducer.activeModal,
        titleId: modalReducer.noInternetConnPopUp.titleId,
        messageId: modalReducer.noInternetConnPopUp.messageId
    }),

    mapDispatchToProps = (dispatch, ownProps) => ({
        onCloseBtnClick: () => {
            if (typeof ownProps.onCloseBtnClick === 'function') {
                ownProps.onCloseBtnClick();
            }
            
            dispatch( userAcknowledgeLostInternetConnection() );
        },
        
        onRetryBtnClick: () => {
            if (typeof ownProps.onRetryBtnClick === 'function') {
                ownProps.onRetryBtnClick();
            }

            // Still needs to add the real retry logic
            dispatch( userAcknowledgeLostInternetConnection() );            
        }
    })

// Component
const 
    closeBtnLabelMsg = ( <FormattedMessage id="close" defaultMessage="Close" /> ),
    retryBtnLabelMsg = ( <FormattedMessage id="retry" defaultMessage="Retry" /> ),

    modalStyle = {
        overlay: {
            zIndex            : 200,
            backgroundColor   : 'rgba(62, 62, 62, 0.75)'
        },
        content: {
            top                   : '50%',
            left                  : '30%',
            right                 : '30%',
            bottom                : 'auto',
            marginRight           : '-50%',
            padding               : '10px 20px',
            transform             : 'translate(-28%, -50%)',
            boxShadow             : '10px 10px 80px -17px rgba(0,0,0,0.75)'
        }
    },


    NoInternetConnPopup = ({ activeModal, titleId = 'connectivity', messageId = 'you_lost_internet_connection', onCloseBtnClick, onRetryBtnClick }) => {
            return (
                <Modal isOpen={MODAL_NAME === activeModal} style={modalStyle}>
                        <Box align="center" flex={true}>
                            <Header>
                                <Heading tag="h3">
                                    <b><FormattedMessage id={titleId} defaultMessage="Connectivity" /></b>
                                </Heading>
                            </Header>

                            <Section>
                                <Paragraph size="large">
                                    <FormattedMessage id={messageId} defaultMessage="You have lost internet connection" />
                                </Paragraph>
                            </Section>
                    
                            <Box direction="row" responsive={false}>
                                <Box pad="small">
                                    <Button secondary={true} onClick={onCloseBtnClick} label={closeBtnLabelMsg} />
                                </Box>
                                <Box pad="small">
                                    <Button onClick={onRetryBtnClick} label={retryBtnLabelMsg} />
                                </Box>
                            </Box>
                        </Box>
                </Modal>
            );
    };
    

export default connect(mapStateToProps, mapDispatchToProps)(NoInternetConnPopup);

