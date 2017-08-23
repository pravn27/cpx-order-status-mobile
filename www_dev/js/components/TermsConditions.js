import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { Router, Route, hashHistory} from 'react-router';


// Redux
import { connect } from 'react-redux';
import { userDeclindedTermsConditions, userAcceptsTermsConditions } from '../actions/userActions';


// components
import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Tile from 'grommet/components/Tile';
import Tiles from 'grommet/components/Tiles';
import Image from 'grommet/components/Image';
import { FormattedMessage } from 'react-intl';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

// custom components
import Alerts from './Alerts';
import LoginPage from './LoginPage';
import SearchBox from './SearchBox';
import LandingPage from './LandingPage';
import SearchResult from './SearchResult';
import WatchListPage from './WatchListPage';
import OrderDetailsPage from './OrderDetailsPage';


// Texts
const infoText = {
  title: (<FormattedMessage id="cpx_terms_page_title" defaultMessage="Terms and Conditions" />),
  accept: (<FormattedMessage id="cpx_terms_page_accept" defaultMessage="Accept" />),
  decline: (<FormattedMessage id="cpx_terms_page_decline" defaultMessage="Decline" />),
  text_line_1: (<FormattedMessage id="cpx_terms_page_text_1" defaultMessage="cpx_terms_page_text_1" />),
  text_line_2: (<FormattedMessage id="cpx_terms_page_text_2" defaultMessage="cpx_terms_page_text_2" />),
  text_line_3: (<FormattedMessage id="cpx_terms_page_text_3" defaultMessage="cpx_terms_page_text_3" />),
  text_line_3_link: "https://www.hpe.com/us/en/legal/privacy.html",
  list_line_1: (<FormattedMessage id="cpx_terms_page_list_1" defaultMessage="Limited mobile browsing activity  HPE web pages visited only" />),
  list_line_2: (<FormattedMessage id="cpx_terms_page_list_2" defaultMessage="In-App searches for data relating to HPE Order Status" />),
  list_line_3: (<FormattedMessage id="cpx_terms_page_list_3" defaultMessage="Use of various functionalities in the app such as adding orders added to Watch List or setting Alert preferences" />),
  list_line_4: (<FormattedMessage id="cpx_terms_page_list_4" defaultMessage="Information about your mobile device type, operating system, and settings" />),
  list_line_5: (<FormattedMessage id="cpx_terms_page_list_5" defaultMessage="IP address, location information from your mobile device" />)
};


const
    mapStateToProps = ({ userInit }) => ({
        userHasAcceptedTermsAndConditions: userInit.userHasAcceptedTermsAndConditions
    }),

    mapDispatchToProps = (dispatch) => {
        return ({
            _onAccept: () => {
                dispatch( userAcceptsTermsConditions() );
            },
            
            _onDecline: () => {
                dispatch( userDeclindedTermsConditions() );
            }
        });
    }


class TermsConditions extends Component {
	render () {

    return (
      <App>
        <Box colorIndex="light-1" responsive={true} align="start" full="vertical" pad={{horizontal: "large", vertical: "large"}}>

          <Image src="img/hPELogo@3x.png" size="small"/>
          <Heading tag="h2" margin="medium" strong={true}>{infoText.title}</Heading>

          <Paragraph>
            {infoText.text_line_1}
          </Paragraph>

          <Paragraph>
            <ul>
              <li>{infoText.list_line_1}</li>
              <li>{infoText.list_line_2}</li>
              <li>{infoText.list_line_3}</li>
              <li>{infoText.list_line_4}</li>
              <li>{infoText.list_line_5}</li>
            </ul>
            {infoText.text_line_2} <a onClick={() => window.open(infoText.text_line_3_link, "_system")}>{infoText.text_line_3}</a>
          </Paragraph>


          <Box direction="row" alignSelf="center" responsive={false} full="horizontal">
              <Box flex={true} pad="small">
                <Button fill={true} secondary={true} onClick={this.props._onDecline} label={infoText.decline} />
              </Box>
              <Box flex={true} pad="small">
                <Button fill={true} onClick={this.props._onAccept} label={infoText.accept} />
              </Box>
          </Box>

        </Box>
      </App>
    );
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(TermsConditions);