/**
 * How to use this component:
 * 
 * This modal is only shown when an action 'USER_HAS_NO_SERVICE' is
 * dispatched. (you can check the '../actions/userActions.js' file)
 * 
 * If a 'USER_ACKNOWLEDGE_NO_SERVICE' action is triggered this modal 
 * will be hidden. (you can check the 'modalReducer.js' file)
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
import { userAcknowledgeNoService } from '../actions/userActions';

import { addClassModalParent } from '../utils/utilities';

export const MODAL_NAME = 'ServiceErrorPopup';


// Redux stuff
const
    mapStateToProps = ({ modalReducer }) => ({
        activeModal: modalReducer.activeModal,
        titleId: modalReducer.serviceErrorPopup.titleId,
        messageId: modalReducer.serviceErrorPopup.messageId
    }),

    mapDispatchToProps = (dispatch, ownProps) => {

        return ({

            onCloseBtnClick: () => {
                if (typeof ownProps.onCloseBtnClick === 'function') {
                    ownProps.onCloseBtnClick();
                }
                
                dispatch( userAcknowledgeNoService() );
            },
            
            onContactUsBtnClick: () => {
                if (typeof ownProps.onContactUsBtnClick === 'function') {
                    ownProps.onContactUsBtnClick();
                }
            }
        });
    }

// Component
const 
    supportMail = 'mailto:support@hpe.com',
    okBtnLabelMsg = ( <FormattedMessage id="ok" defaultMessage="Ok" /> ),
    contactBtnLabelMsg = ( <FormattedMessage id="contact_us" defaultMessage="Contact Us" /> ),

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
            boxShadow             : '10px 10px 80px -17px rgba(0,0,0,0.75)',
            textDecoration        : 'none',
            height: '300px'
        }
    },


    ServiceErrorPopup = ({ activeModal, titleId = 'error', messageId = 'could_not_complete_request', onCloseBtnClick, onContactUsBtnClick }) => {

        let errorMessageDetails = null, errorMessageDefault = (<FormattedMessage id={messageId} defaultMessage="'Could not complete your request.'" />);

        if (messageId instanceof Error) {

            errorMessageDefault = ( messageId.toString() );

            if (messageId.errorBody) {

                if (messageId.errorBody.code) {
                    errorMessageDetails = (
                        <div>
                            <Paragraph size="large">{messageId.errorBody.message}</Paragraph>
                            <Paragraph size="small"><b>{ messageId.errorBody.code }</b></Paragraph>
                        </div>
                    )
                }
                else {
                    errorMessageDetails = (<Paragraph size="large">{ messageId.errorBody.faultcode || (<FormattedMessage id={unkwown_error} defaultMessage="Unkwown Error" />) }</Paragraph>)
                }

            }
            else if (messageId.serviceRequest) {
                errorMessageDetails = (<Paragraph size="small"><b>On: </b>{messageId.serviceRequest.method} {messageId.serviceRequest.url}</Paragraph>)
            }
        }


        return (
            <Modal isOpen={MODAL_NAME === activeModal} style={modalStyle} onAfterOpen={addClassModalParent}>
                <App>
                    <Box flex={true}>
                        <Header>
                            <Heading tag="h3">
                                <b><FormattedMessage id={titleId} defaultMessage="Error" /></b>
                            </Heading>
                        </Header>

                        <Box justify="start">
                            <Paragraph size="large">
                                <FormattedMessage id="service_error" defaultMessage="Service Error has ocurred." />
                                <br />
                                { errorMessageDefault }
                                { errorMessageDetails }
                            </Paragraph>
                        </Box>

                        <Box separator="top">
                            <Paragraph size="small">
                                <FormattedMessage id="if_problem_persist" defaultMessage="if_problem_persist" />
                            </Paragraph>
                        </Box>
                
                        <Box direction="row" alignSelf="center" responsive={false}>
                            <Box pad="small">
                                <Button secondary={true} onClick={onCloseBtnClick} label={okBtnLabelMsg} />
                            </Box>
                            <Box pad="small">
                                <Button id="contact_us_button" onClick={onContactUsBtnClick} href={supportMail} label={contactBtnLabelMsg} />
                            </Box>
                        </Box>
                    </Box>
                </App>
            </Modal>
        );
    };

export default connect(mapStateToProps, mapDispatchToProps)(ServiceErrorPopup);

