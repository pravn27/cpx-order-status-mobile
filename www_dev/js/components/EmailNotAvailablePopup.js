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
import { userAckEmailNotAvailable } from '../actions/userActions';

import { addClassModalParent } from '../utils/utilities';

export const MODAL_NAME = 'EmailNotAvailablePopup';


// Redux stuff
const
    mapStateToProps = ({ modalReducer }) => ({
        activeModal: modalReducer.activeModal,
        titleId: modalReducer.emailNotAvailablePopup.titleId,
        messageId: modalReducer.emailNotAvailablePopup.messageId
    }),

    mapDispatchToProps = (dispatch, ownProps) => {

        return ({
            onCloseBtnClick: () => {
                if (typeof ownProps.onCloseBtnClick === 'function') {
                    ownProps.onCloseBtnClick();
                }
                
                dispatch( userAckEmailNotAvailable() );
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
            marginRight           : '-50%',
            padding               : '10px 20px',
            transform             : 'translate(-28%, -50%)',
            boxShadow             : '10px 10px 80px -17px rgba(0,0,0,0.75)',
            textDecoration        : 'none'
        }
    },


    EmailNotAvailablePopup = ({ activeModal, titleId = 'email_not_available', messageId = 'email_not_available_message', onCloseBtnClick }) => {
        return (
            <Modal isOpen={MODAL_NAME === activeModal} style={modalStyle} onAfterOpen={addClassModalParent}>
                <App>
                    <Box flex={true}>
                        <Header>
                            <Heading tag="h3">
                                <b><FormattedMessage id={titleId} defaultMessage="Email Unavailable" /></b>
                            </Heading>
                        </Header>

                        <Box justify="start">
                            <Paragraph size="large">
                                <FormattedMessage id={messageId} defaultMessage="There is no email account that is configured in the default email app. Please configure an account and try again." />
                            </Paragraph>
                        </Box>
                
                        <Box direction="row" alignSelf="center" responsive={false}>
                            <Box pad="small">
                                <Button secondary={true} onClick={onCloseBtnClick} label={closeBtnLabelMsg} />
                            </Box>
                        </Box>
                    </Box>
                </App>
            </Modal>
        );
    };

export default connect(mapStateToProps, mapDispatchToProps)(EmailNotAvailablePopup);
