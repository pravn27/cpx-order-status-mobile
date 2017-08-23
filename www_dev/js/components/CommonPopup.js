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
import { hideCommonPopup } from '../actions/contactActions';

import { addClassModalParent } from '../utils/utilities';

export const MODAL_NAME = 'CommonPopup';


// Redux stuff
const
    mapStateToProps = ({ modalReducer }) => ({
        activeModal: modalReducer.activeModal,
        titleId: modalReducer.commonPopup.titleId,
        messageId: modalReducer.commonPopup.messageId
    }),

    mapDispatchToProps = (dispatch, ownProps) => {

        return ({

            onCloseBtnClick: () => {
                if (typeof ownProps.onCloseBtnClick === 'function') {
                    ownProps.onCloseBtnClick();
                }
                
                dispatch( hideCommonPopup() );
            }
        });
    }

// Component
const
    closeBtnLabelMsg = ( <FormattedMessage id="close" defaultMessage="Close" /> ),

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
            padding               : '0px',
            marginRight           : '-50%',
            transform             : 'translate(-28%, -50%)',
            boxShadow             : '10px 10px 80px -17px rgba(0,0,0,0.75)',
            textDecoration        : 'none',
            height                : '200px',
            overflow              : 'hidden'
        }
    },


    CommonPopup = ({ activeModal, titleId = 'title', messageId = 'default_popup_message', onCloseBtnClick }) => {
        return (
            <Modal isOpen={MODAL_NAME === activeModal} style={modalStyle} onAfterOpen={addClassModalParent}>
                <App>
                    <Box flex={true} pad="medium">
                        <Header>
                            <Heading tag="h3">
                                <b><FormattedMessage id={titleId} defaultMessage="Contact support" /></b>
                            </Heading>
                        </Header>

                        <Box separator={ messageId == "cpx_survey_feedback_success_msg_body" ? null : "top"}>
                            <Paragraph size="small">
                                <FormattedMessage id={messageId} defaultMessage="Please contact support for more information." />
                            </Paragraph>
                        </Box>
                
                        <Box direction="row" alignSelf="center" responsive={false}>
                            <Box>
                                <Button id="close_button" onClick={onCloseBtnClick} label={closeBtnLabelMsg} />
                            </Box>
                        </Box>
                    </Box>
                </App>
            </Modal>
        );
    };

export default connect(mapStateToProps, mapDispatchToProps)(CommonPopup);

