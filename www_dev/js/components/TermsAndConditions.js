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
import GetSupportPages from './GetSupportPages';

var TermsAndConditions = React.createClass({
    getInitialState: function() {
        return {
          title: <FormattedMessage id='cpx_terms_page_title' defaultMessage="Terms and Conditions" />,
          infoText: {
            title: (<FormattedMessage id='cpx_terms_page_title' defaultMessage="Terms And Conditions" />),
            text_line_1: (<FormattedMessage id='cpx_terms_text_1' defaultMessage="CPX" />),
            text_line_2: (<FormattedMessage id='cpx_terms_text_2' defaultMessage="CPX" />)
          }
        };
    },
    render() {
        return (
          <Layer closer={false} align="left" flush={true}>
            <Box>
              <Header className="page-header" pad="none" justify="start" fixed={true} style={{ 'position': 'fixed', 'width': '100%', 'top': '0' }} colorIndex="neutral-1">
                <Box className="menu-items" direction="row" justify="start" responsive={false}>
                  <Anchor className="page-header-back-btn" icon={<IconHelper iconName="Previous" />} onClick={this.props.close}></Anchor>
                  <Anchor icon={<IconHelper iconName="Menu" />} onClick={this.props.close}></Anchor>
                </Box>
                <Title className="page-header-title-text">{this.state.title}</Title>
              </Header>
              <Box colorIndex="light-1"pad={{horizontal: "large", vertical: "large"}}>
                <Image src="img/hPELogo@3x.png" size="small"/>
                <Heading tag="h2" margin="medium" strong={true}>{this.state.infoText.title}</Heading>
                <Paragraph>{this.state.infoText.text_line_1}</Paragraph>
                <Paragraph>{this.state.infoText.text_line_2}</Paragraph>
              </Box>
            </Box>
          </Layer>
        );
    }
});

export default TermsAndConditions;
