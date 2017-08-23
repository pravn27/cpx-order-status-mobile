// imports
import React from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';

// components
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import Menu  from 'grommet/components/Menu';
import Image from 'grommet/components/Image';
import Title from 'grommet/components/Title';
import Layer  from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Anchor  from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import ListItem from 'grommet/components/ListItem';
import Paragraph from 'grommet/components/Paragraph';

// CPX components
import IconHelper from './IconHelper';

// Texts
const infoText = {
  title: (<FormattedMessage id='cpx_privacy_title' defaultMessage="Privacy Statement" />),
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

var PrivacyStatement = React.createClass({
    render() {
        return (
          <Layer closer={false} align="left" flush={true}>
            <Header className="page-header" pad="none" justify="start" fixed={true} style={{ 'position': 'fixed', 'width': '100%', 'top': '0' }} colorIndex="neutral-1">
              <Box className="menu-items" direction="row" justify="start" responsive={false}>
                <Anchor className="page-header-back-btn" icon={<IconHelper iconName="Previous" />} onClick={this.props.close}></Anchor>
                <Anchor icon={<IconHelper iconName="Menu" />} onClick={this.props.close}></Anchor>
              </Box>
              <Title className="page-header-title-text">{infoText.title}</Title>
            </Header>
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

            </Box>
          </Layer>
        );
    }
});

export default PrivacyStatement;
