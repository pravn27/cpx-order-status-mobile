// imports
import React from 'react';
import { hashHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';

// components
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import Menu  from 'grommet/components/Menu';
import Title from 'grommet/components/Title';
import Layer  from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Anchor  from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import ListItem from 'grommet/components/ListItem';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';

// CPX components
import IconHelper from './IconHelper';
import CommonAccordion from './CommonAccordion';

const
  answerTextStyle = {
    fontSize: '1.2rem'
  },
  iconStyle = {
    width: "30%",
    paddingLeft: '0px',
    maxWidth: '45px'
  }; 

var GetSupportPages = React.createClass({
    render() {
        var itemNodes = this.props.data.info.map(function(item) {
          var nodeTitle = (
            <Heading margin="none" tag="h3" strong={true} align="start">
              <Box pad="medium"><FormattedMessage id={item.title} defaultMessage="CPX" /></Box>
            </Heading>
          );

          return (
            <CommonAccordion heading={nodeTitle} key={item.title}>
            { 
              item.iconName ?
                <Box pad="large" direction='row' responsive={false}>
                  <Box direction='row' responsive={false} justify="start" pad={{horizontal: 'medium'}} style={iconStyle}>
                    <IconHelper iconName={item.iconName} />
                  </Box>

                  <Box direction='row' responsive={false} justify="start" style={answerTextStyle}>
                    <FormattedMessage id={item.text} defaultMessage="CPX" />
                  </Box>
                </Box>
              :
                <Box pad="large" style={answerTextStyle}>
                  <FormattedMessage id={item.text} defaultMessage="CPX" />
                </Box>
            }
            </CommonAccordion>
          );
        });

        return (
          <Box>
            <Header className="page-header" pad="none" justify="start" fixed={true} style={{ 'position': 'fixed', 'width': '100%', 'top': '0' }} colorIndex="neutral-1">
              <Box className="menu-items" direction="row" justify="start" responsive={false}>
                <Anchor className="page-header-back-btn" icon={<IconHelper iconName="Previous" />} onClick={this.props.close}></Anchor>
                <Anchor icon={<IconHelper iconName="Menu" />} onClick={this.props.menu}></Anchor>
              </Box>
              <Title className="page-header-title-text"><FormattedMessage id='cpx_support_menu' defaultMessage="Get Support" /></Title>
            </Header>
            <Header size="medium" justify="between" colorIndex="accent-2">
              <Box direction="row" colorIndex="accent-2" pad={{horizontal: "medium", vertical: "none"}} justify="between" responsive={true}>
                <Title responsive={false}>
                  <Heading tag="h3" margin="none">
                    <FormattedMessage id={this.props.data.title} defaultMessage="CPX" />
                  </Heading>
                </Title>
              </Box>
            </Header>
            {itemNodes}
          </Box>
        );
    }
});

export default GetSupportPages;
