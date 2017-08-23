import React, { Component } from 'react';

//Redux Components
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

//Redux Actions
import { updateUserInfo } from '../actions/userActions'

// [Grommet Components]
import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Rest from 'grommet/utils/Rest';
import Image from 'grommet/components/Image';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';

// [Components]
import LastUpdate from './LastUpdate';
import PageHeader from './PageHeader';
import LandingAlerts from './LandingAlerts';
import LandingBackground from './LandingBackground';
import SearchBox from './SearchBox';
import { hashHistory } from 'react-router';
// [Utils]
import { FormattedMessage } from 'react-intl';
import NewsCarousel from './NewsCarousel';
import apiCommunicator from '../utils/apiCommunicator';

//dummy data
const userInitData = require('../../data/userInit.json');


const mapStateToProps = (state) => ({
  reduxState: state
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators({ updateUserInfo }, dispatch)
});

const WhatsNewHpe = () => (
  <Box>
    <Box className="order-title">
      <Header size="small" justify="between" colorIndex="neutral-3" pad={{"horizontal": "medium" , "vertical": "none"}}>
        <Heading tag="h4">{<FormattedMessage id="cpx_newscarousel_title" defaultMessage="What's New from HPE Go" />}</Heading>
      </Header>
    </Box>
    <Image src="./img/whats-new-static.png" full="horizontal" />
  </Box>
);

class LandingPage extends Component {

  render() {
    const imgList = ["whats-new-1.png", "whats-new-2.png"];
    const appTitle = (
      <FormattedMessage id="cpx_landing_line" defaultMessage="HPE Go" />
    );

    return (

      <App centered={true}>
        <PageHeader pageTitle={appTitle} showBackBtn={false} />
        <LandingBackground />
        <LastUpdate />
        <SearchBox />
        <LandingAlerts />
        {/*<NewsCarousel images={imgList} />*/}
        <WhatsNewHpe />        
      </App>

    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);