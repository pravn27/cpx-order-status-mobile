/**
 * How to use this component:
 *
 * This modal is only shown when an action 'USER_DENIED_ACCESS_RIGHTS' is
 * dispatched. (you can check the '../actions/userActions.js' file)
 *
 * If a 'USER_ACKNOWLEDGE_DENIED_ACCESS_RIGHTS' action is triggered this
 * modal will be hidden. (you can check the 'modalReducer.js' file)
 */


// Grommet & React imports
import React from 'react';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Paragraph from 'grommet/components/Paragraph';
import Section from 'grommet/components/Section';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';

// Redux imports
import { connect } from 'react-redux'
import { userDeniedAccessRights, userAcknowledgeDeniedAccessRights } from '../actions/userActions';

import { addClassModalParent } from '../utils/utilities';

export const MODAL_NAME = 'DeniedAccessRights';

// Redux stuff
const
    mapStateToProps = ({ modalReducer }) => ({
        activeModal: modalReducer.activeModal,
        titleId: modalReducer.deniedAccessRightsModal.titleId,
        messageId: modalReducer.deniedAccessRightsModal.messageId
    }),

    mapDispatchToProps = (dispatch, ownProps) => ({
        onButtonClick: () => {
            if (typeof ownProps.onButtonClick === 'function') {
                ownProps.onButtonClick();
            }

            dispatch( userAcknowledgeDeniedAccessRights() );
        }
    });

// Component
const
    buttonLabelMsg = ( <FormattedMessage id="close" defaultMessage="Close" /> ),

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
            padding               : '10px 20px 30px 20px',
            transform             : 'translate(-28%, -50%)',
            minHeight             : '150px',
            maxHeight             : '400px',
            overflow              : 'hidden',
            boxShadow             : '10px 10px 80px -17px rgba(0,0,0,0.75)'
        }
    },


    DeniedAccessRights = ({activeModal, messageId = 'access_denied', onButtonClick, titleId = 'access_denied'}) => {

        let detailedMessage;

        if (messageId instanceof Error && messageId.errorBody) {

            if (messageId.errorBody.code || messageId.errorBody.faultcode) {
                detailedMessage = (
                    <div>
                        <Paragraph size="large">{messageId.errorBody.message}</Paragraph>
                        <Paragraph size="small"><b>{ messageId.errorBody.code || messageId.errorBody.faultcode }</b></Paragraph>
                    </div>
                )
            }
            else {
                detailedMessage = (<Paragraph size="large">{ messageId.errorBody.faultcode || (<FormattedMessage id={unkwown_error} defaultMessage="Unkwown Error" />) }</Paragraph>)
            }

        }
        else {
            detailedMessage = ( <Paragraph size="large"> <FormattedMessage id={messageId} defaultMessage="Access denied" /> </Paragraph> )
        }


        return (
            <Modal isOpen={MODAL_NAME === activeModal && ( messageId.errorBody ? messageId.errorBody.faultcode : null ) != 52201 } style={modalStyle} onAfterOpen={addClassModalParent}>
                <Box align="center">
                    <Header>
                        <Heading tag="h3">
                            <b><FormattedMessage id={titleId} defaultMessage="Access denied" /></b>
                        </Heading>
                    </Header>

                    <Section className="wordWrap">
                        { detailedMessage }
                    </Section>

                    <Button onClick={onButtonClick} label={buttonLabelMsg} />
                </Box>
            </Modal>
        );
    };



export default connect(mapStateToProps, mapDispatchToProps)(DeniedAccessRights);
