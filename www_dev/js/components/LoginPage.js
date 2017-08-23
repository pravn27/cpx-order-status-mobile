import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import config from '../utils/config.js';
import { hashHistory } from 'react-router';

// components
import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import Image from 'grommet/components/Image';
import { FormattedMessage } from 'react-intl';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import CheckBox from 'grommet/components/CheckBox';
import FormField from 'grommet/components/FormField';
import Paragraph from 'grommet/components/Paragraph';
import Alerts from './Alerts';
import NoInternetConnection, { MODAL_NAME as NoConnModalName} from './NoInternetConnection';
import { Spinner } from '../utils/commonComponents';

// Redux actions
import { userTriesToLogin, userDeniedAccessRights } from '../actions/userActions';

// utils
import { tracking } from '../utils/utilities';

// Constants
const
  USERID = "https://hpp12.passport.hpe.com/hppcf/forgotuserid.do?hpappid=200581_UPP_PRO_HPE&lang=en_US&cc=GB&applandingpage=https://partner.hpe.com/group/upp-ww",
  PASSWORD = "https://hpp12.passport.hpe.com/hppcf/forgotpwd.do?hpappid=200581_UPP_PRO_HPE&lang=en_US&cc=GB&applandingpage=https://partner.hpe.com/group/upp-ww",
  loginText = {
    title: (<FormattedMessage id="cpx_login_screen_title" defaultMessage="HPE Go" />),
    subtitle_1: (<FormattedMessage id="cpx_login_screen_subtitle_1" defaultMessage="Sign in with your Partner Ready Portal ID" />),
    subtitle_2: (<FormattedMessage id="cpx_login_screen_subtitle_2" defaultMessage="and password" />),
    password_forgot: (<FormattedMessage id="cpx_login_screen_forgot" defaultMessage="Forgot" />),
    password_id: (<FormattedMessage id="cpx_login_screen_forgot_id" defaultMessage="User ID" />),
    password_or: (<FormattedMessage id="cpx_login_screen_forgot_or_password" defaultMessage="or" />),
    password: (<FormattedMessage id="cpx_login_screen_forgot_password" defaultMessage="Password" />),
    form_email: (<FormattedMessage id="cpx_login_screen_form_email" defaultMessage="User ID or Email" />),
    form_remember: (<FormattedMessage id="cpx_login_screen_form_remember" defaultMessage="Remember me" />),
    form_sign: (<FormattedMessage id="cpx_login_screen_form_sign" defaultMessage="Sign In" />),
    bottom: (<FormattedMessage id="cpx_login_screen_bottom" defaultMessage="New users? Visit the HPE Partner Ready Portal" />),
    trademark: (<FormattedMessage id="cpx_login_screen_trademark" defaultMessage="© 2017 Hewlett Packard Enterprise Company, L.P." />)
  };


// Redux stuff
const
  mapStateToProps = ({ modalReducer, userInit }) => ({
    activeModal: modalReducer.activeModal,
    isUserAuthenticating: userInit.isUserAuthenticating,
  }),
  mapDispatchToProps = (dispatch, ownProps) => ({
    _doSubmit: (userId, password, checked) => {
      dispatch(userTriesToLogin(userId, password, checked));
	},
	_doAccessDenied: (msg, title) => {
	  dispatch(userDeniedAccessRights(msg, title));
	}
  });

class LoginPage extends Component {
  constructor(props) {
	super(props);
	this._handleRememberMe = this._handleRememberMe.bind(this);
	this._onSubmit = this._onSubmit.bind(this);
    this.state = {
      rememberOn: false,
    };
  }

  componentWillMount() {
    hashHistory.push('/'); // to prevent the user to go back to the pref page when they relogin
  }

  componentDidMount() {
	  var rememberMe = (window.localStorage.getItem('remember_me') === null || window.localStorage.getItem('remember_me') === "null")  ? false : JSON.parse(window.localStorage.getItem('remember_me'));
	  this.setState({rememberOn: rememberMe }); 
    tracking('LoginPage', null); // track all login page visits
  }
  
  _open(url) {
    var ref = window.open(url, "_system");
  }
  
  _onSubmit(event) {
    event.preventDefault();

    var
      userId = document.getElementById('username').value,
      password = document.getElementById('password').value;		

    if (config.getIsDebug()) {// for debugging purposes
      userId = config.userId;
      password = config.password;
    }
	  
	if(userId.includes("hpe.com") && document.getElementById('remember').checked === true ) {
      this.props._doAccessDenied('internal_user_no_remember_me_msg', 'internal_user_no_remember_me_title');
	  this.setState({rememberOn: false}, () => {
	  window.localStorage.setItem('remember_me', false)});
	} else {
	    this.props._doSubmit(userId, password, document.getElementById('remember').checked);
    }
  }
  
  _handleRememberMe() {
	var rememberMe = document.getElementById('remember').checked;
	this.setState({rememberOn: rememberMe}, () => {
	  window.localStorage.setItem('remember_me', this.state.rememberOn)});
  }

  render() {
    
    if (NoConnModalName === this.props.activeModal) {
      return ( <NoInternetConnection /> )
    }

   const formStyle = { 'marginLeft': '-1px', 'marginRight': '-1px', 'marginTop': '0em', 'marginBottom': '0em', 'marginColor': '#000000' },
          inputStyle = { 'marginTop': '-0.5em','marginBottom': '-0.3em' };

    return (
      <App>
        <Box className="horizontalNoScroll" colorIndex="light-1" responsive={true} align="start" full={false} margin="none" pad="none" direction="column" >
        <Box colorIndex="light-1" margin="none" pad={{vertical: 'small'}} direction="row"></Box>
          <Box margin="none" pad={{ horizontal: "medium", vertical: "small" }} style={{ 'marginBottom': '0.7em','paddingLeft':'24px'}} >
            <img src="img/hPELogo@3x.png" width="160px" height="60px" style={{ 'marginTop': '1em' }} />
            <Heading tag="h2" margin="small" strong={true}>{loginText.title}</Heading>
            <Paragraph margin="none" style={{ 'marginTop': '-0.3em' }}>{loginText.subtitle_1}</Paragraph>
            <Paragraph margin="none">{loginText.subtitle_2}</Paragraph>
          </Box>
          <Box colorIndex="light-1" responsive={true} align="start" margin="none" pad={{ horizontal: "none", vertical: "none" }} direction="row" style={{ 'width' : '100%' }} >
            <Form onSubmit={this._onSubmit} style={{ 'width' : '100%' }}>
              <FormField label={loginText.form_email} htmlFor="username" style={formStyle}>
                <input id="username" type="email" placeholder="First.Last@Company.com" style={inputStyle} />
              </FormField>
              <FormField label={loginText.password} htmlFor="password" style={formStyle}>
                <input id="password" type="password" placeholder="Enter password" style={inputStyle} />
              </FormField>
              <FormField htmlFor="remember" style={formStyle}>
                <CheckBox id="remember" checked={this.state.rememberOn} toggle={true} reverse={true} label={loginText.form_remember} onChange={this._handleRememberMe} />
              </FormField>
              <Box colorIndex="light-1" responsive={true} align="center"
                pad={{ horizontal: "large", vertical: "large" }}>
                <Button label={loginText.form_sign} id="submitLogin" primary={true} fill={true} type="submit" onClick={() => { } } />
              </Box>
            </Form>
          </Box>
          <Box pad={{ horizontal: "large", vertical: "small" }} style={{ 'width' : '100%', 'alignItems': 'center' }}>
            <Paragraph margin="none" align="center">
              <strong>{loginText.password_forgot} <a onClick={this._open.bind(this, USERID)}>{loginText.password_id}</a> {loginText.password_or} <a onClick={this._open.bind(this, PASSWORD)}>{loginText.password}</a></strong>
            </Paragraph>
            <Paragraph margin="none" align="center"><strong>{loginText.bottom}</strong></Paragraph>
            <Paragraph margin="medium" align="center" size="small" >{loginText.trademark}</Paragraph>
          </Box>
        </Box>
       { this.props.isUserAuthenticating ? <Spinner/> : null }
      </App>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);