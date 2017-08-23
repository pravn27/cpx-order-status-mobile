
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

export const MODAL_NAME = 'CalendarErrorPopUp';

// Component
const 
    buttonLabelMsg = ( <FormattedMessage id="close" defaultMessage="Close" /> ),
    calendar_confirmation_label_1 = ( <FormattedMessage id="calendar_confirmation_label_1" defaultMessage="Calendar Date Range" />),
    calendar_confirmation_label_2 = ( <FormattedMessage id="calendar_confirmation_label_2" defaultMessage="Search range must not exceed 90 days prior to today's date" />),
    modalStyle = {
        overlay: {
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
    };

    var CalendarErrorPopUp = React.createClass({
            getInitialState: function() {
                return {
                    modalIsOpen: true
                }
            },

            openModal: function() {
                this.setState({modalIsOpen: true});
            },

            afterOpenModal: function() {
                // references are now sync'd and can be accessed.
                this.refs.subtitle.style.color = '#f00';
            },

            closeModal: function() {
                this.setState({modalIsOpen: false});
            },

            render: function(){
               return (
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal}
                      style={modalStyle}
                      contentLabel={this.MODAL_NAME}>
                      <Box align="center">
                                <Header>
                                    <Heading tag="h3">
                                        <b>{calendar_confirmation_label_1}</b>
                                    </Heading>
                                </Header>   

                                <Section>
                                    <Paragraph size="large">
                                        {calendar_confirmation_label_2}
                                    </Paragraph>
                                </Section>
                        
                                <Button onClick={this.props.cancel} label={buttonLabelMsg} />
                            </Box>
                    </Modal>
                );
            }
    });

export default CalendarErrorPopUp;

