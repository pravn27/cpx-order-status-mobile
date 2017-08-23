// imports
import React from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

// components
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import Menu from 'grommet/components/Menu';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Button from 'grommet/components/Button';
import Image from 'grommet/components/Image';
import Title from 'grommet/components/Title';
import Layer from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Anchor from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import ListItem from 'grommet/components/ListItem';
import Paragraph from 'grommet/components/Paragraph';
import SimulateUserPage from './SimulateUserPage';

// CPX components
import IconHelper from './IconHelper';

//userActions
import { simulateUser, exitSimulation } from '../actions/userActions';

// Texts
const infoText = {
  title: (<FormattedMessage id='cpx_simulate_title' defaultMessage="Simulate User" />),
  list_line_1: (<FormattedMessage id="cpx_simulate_user_text_1" defaultMessage="Enter the email address of the user you wish to simulate" />),
  sml_email: (<FormattedMessage id="cpx_simulate_email" defaultMessage="Email" />),
  simulate: (<FormattedMessage id="cpx_simulate" defaultMessage="Simulate" />),
  blankEmail: (<FormattedMessage id="cpx_simulate_blank_email" defaultMessage="Email cannot be blank" />)
};

const mapStateToProps = (state) => ({
  userSimulation: state.userInit.userSimulation
});

const mapDispatchToProps = (dispatch) => ({

  _simulateUser: (simulateUserId) => {
    dispatch ( simulateUser(simulateUserId) );
  },

  _exitSimulation: () => {
    dispatch( exitSimulation() );
      }
});

var SimulateUser = React.createClass({

  getInitialState: function () {
    return {
      simulate: false,
      errorEmail: ""
    };
  },
  
  _onClickSimulation: function(){
    this.props.click();

  },

  simulateUser: function(){
    var simulateUserId = document.getElementById('username').value;

    if(simulateUserId == '')
    {
      this.setState({errorEmail: infoText.blankEmail});
      return;
    }
    else
      this.props._simulateUser(simulateUserId);

  },

  onSelectEmail: function(){
     this.setState({errorEmail: ''});
  },

  render() {
    var { _simulateUser, userSimulation, _exitSimulation } = this.props;

    const formStyle = { 'marginLeft': '-1px', 'marginRight': '-1px', 'marginTop': '-0.5em', 'marginBottom': '-0.5em', 'marginColor': '#000' };
    const simulateUserContent =
          <Box>
            <Box colorIndex="light-1" responsive={true} align="start" pad={{ horizontal: "large", vertical: "large" }}>
              <Heading tag="h3" margin="small" >{infoText.title}</Heading>
              <Paragraph margin="none" size="large" style={{ 'marginTop': '-0.3em', 'font-size' : 'large' }}>{infoText.list_line_1} </Paragraph>
          </Box>
            <Form>
              <FormField label={infoText.sml_email} htmlFor="username" style={formStyle} error={this.state.errorEmail}>
                 <Paragraph margin="none" size="large" style={{ 'marginTop': '-0.3em' }}>{userSimulation.simulationError}</Paragraph>
                <input id="username" type="email" placeholder="demo.user@hpe.com" style={{ 'marginTop': '-0.5em', 'marginBottom': '-0.3em' }} onSelect={this.onSelectEmail} />
              </FormField>
              <Box colorIndex="light-1" responsive={true} align="center" pad={{ horizontal: "large", vertical: "large" }}>
                <Button label={infoText.simulate} id="submitLogin" primary={true} fill={true} onClick={this.simulateUser} />
              </Box>
            </Form>
          </Box>
    const onSimulationContent = <SimulateUserPage onExitSimulation={_exitSimulation} onClickSimulation={this.props.click} closeMenu = {this.props.click}  />

    return (
      <Box pad="none" direction="column" justify="between" tag="aside" responsive={false}>
        <Layer closer={false} align="left" flush={true}>
          <Header className="page-header" pad="none" justify="start" fixed={true} style={{ 'position': 'fixed', 'width': '100%', 'top': '0' }} colorIndex="neutral-1">
            <Box className="menu-items" direction="row" justify="start" responsive={false}>
              <Anchor className="page-header-back-btn" icon={<IconHelper iconName="Previous" />} onClick={this.props.close}></Anchor>
              <Anchor icon={<IconHelper iconName="Menu" />} onClick={this.props.close}></Anchor>
            </Box>
            <Title className="page-header-title-text">{infoText.title}</Title>
          </Header>
          {userSimulation.simulationMode ? onSimulationContent : simulateUserContent}

        </Layer>

      </Box>



    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SimulateUser);
