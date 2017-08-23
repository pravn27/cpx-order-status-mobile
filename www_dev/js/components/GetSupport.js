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

// CPX components
import IconHelper from './IconHelper';
import GetSupportPages from './GetSupportPages';
import ContactSupport from './ContactSupport';
var GetSupport = React.createClass({
    getInitialState: function() {
        return {
          showSupportMenu: true,
          showGeneral: false,
          showSearch: false,
          showWatchlist: false,
          showGlossary: false,
          showContactSupport: false,
          title: 'cpx_support_title',
          help: [
            {id:1, text:'cpx_support_general', click: this.clickGeneral, default: 'General App Questions'},
            {id:2, text:'cpx_support_search', click: this.clickSearch, default: 'Search and Order Details Questions'},
            {id:3, text:'cpx_support_watchlist', click: this.clickWatchlist, default: 'Watch List and Alerts Questions'},
            {id:4, text:'cpx_support_glossary', click: this.clickGlossary, default: 'Glossary and Icons'},
            {id:5, text:'cpx_support_tutorial', click: this.routeToTutorial, default: 'Tutorial'}
          ],
          general: {
            title: 'cpx_support_general',
            info: [
              {id:1, title:'cpx_support_general_1', text: 'cpx_support_general_text1'},
              {id:2, title:'cpx_support_general_2', text: 'cpx_support_general_text2'}
            ]
          },
          search_and_order: {
            title: 'cpx_support_search',
            info: [
              {id:1, title:'cpx_support_search_and_order_1', text: 'cpx_support_search_and_order_text1'},
              {id:2, title:'cpx_support_search_and_order_2', text: 'cpx_support_search_and_order_text2'},
              {id:3, title:'cpx_support_search_and_order_3', text: 'cpx_support_search_and_order_text3'},
              {id:4, title:'cpx_support_search_and_order_4', text: 'cpx_support_search_and_order_text4'},
              {id:5, title:'cpx_support_search_and_order_5', text: 'cpx_support_search_and_order_text5'},
              {id:6, title:'cpx_support_search_and_order_6', text: 'cpx_support_search_and_order_text6'},
              {id:7, title:'cpx_support_search_and_order_7', text: 'cpx_support_search_and_order_text7'},
              {id:8, title:'cpx_support_search_and_order_8', text: 'cpx_support_search_and_order_text8'}
            ]
          },
          watchlist: {
            title: 'cpx_support_watchlist',
            info: [
              {id:1, title:'cpx_support_watchlist_1', text: 'cpx_support_watchlist_text1'},
              {id:2, title:'cpx_support_watchlist_2', text: 'cpx_support_watchlist_text2'},
              {id:3, title:'cpx_support_watchlist_3', text: 'cpx_support_watchlist_text3'},
              {id:4, title:'cpx_support_watchlist_4', text: 'cpx_support_watchlist_text4'},
              {id:5, title:'cpx_support_watchlist_5', text: 'cpx_support_watchlist_text5'},
              {id:6, title:'cpx_support_watchlist_6', text: 'cpx_support_watchlist_text6'},
              {id:7, title:'cpx_support_watchlist_7', text: 'cpx_support_watchlist_text7'},
              {id:8, title:'cpx_support_watchlist_8', text: 'cpx_support_watchlist_text8'}
            ]
          },
          glossary: {
            title: 'cpx_support_glossary',
            info: [
              {id:1, title:'cpx_support_glossary_1', text: 'cpx_support_glossary_text1'},
              {id:2, title:'cpx_support_glossary_2', text: 'cpx_support_glossary_text2'},
              {id:3, title:'cpx_support_glossary_3', text: 'cpx_support_glossary_text3'},
              {id:4, title:'cpx_support_glossary_4', text: 'cpx_support_glossary_text4'},
              {id:5, title:'cpx_support_glossary_5', text: 'cpx_support_glossary_text5'},
              {id:6, title:'cpx_support_glossary_6', text: 'cpx_support_glossary_text6'},
              {id:7, title:'cpx_support_glossary_7', text: 'cpx_support_glossary_text7'},
              {id:8, title:'cpx_support_glossary_8', text: 'cpx_support_glossary_text8'},
              {id:9, title:'cpx_support_glossary_9', text: 'cpx_support_glossary_text9', iconName: 'Mail'},
              {id:10, title:'cpx_support_glossary_10', text: 'cpx_support_glossary_text10', iconName: 'Flag'},
              {id:11, title:'cpx_support_glossary_11', text: 'cpx_support_glossary_text11', iconName: 'SearchAdvanced'},
              {id:12, title:'cpx_support_glossary_12', text: 'cpx_support_glossary_text12', iconName: 'Microphone'}
            ]
          },
          more_help: {
            title: 'cpx_support_more_help_title',
            titleDefault: 'Still need help?',
            text: 'cpx_support_more_help_text',
            textDefault: 'Contact Us'
          }
        };
    },
    routeToTutorial: function () {
      hashHistory.push('/Tutorial');
    },
    clickHome: function(){
        this.props.close();
    },

    closeAll: function(){
      this.setState({showSupportMenu: true});
      this.setState({showGeneral: false});
      this.setState({showSearch: false});
      this.setState({showWatchlist: false});
      this.setState({showGlossary: false}); 
      this.setState({showContactSupport: false}); 
    },

    clickGeneral: function(){
      if(this.state.showGeneral)
      {
        this.closeAll();
      }else{
        this.setState({showSupportMenu: false});
        this.setState({showGeneral: true});
        this.setState({showSearch: false});
        this.setState({showWatchlist: false});
        this.setState({showGlossary: false});
        this.setState({showContactSupport: false}); 
      }
    },

    clickSearch: function(){
      if(this.state.showSearch)
      {
        this.closeAll();
      }else{
        this.setState({showSupportMenu: false});
        this.setState({showSearch: true});
        this.setState({showGeneral: false});
        this.setState({showWatchlist: false});
        this.setState({showGlossary: false});
        this.setState({showContactSupport: false}); 
      }
    },

    clickWatchlist: function(){
      if(this.state.showWatchlist)
      {
        this.closeAll();
      }else{
        this.setState({showSupportMenu: false});
        this.setState({showWatchlist: true});
        this.setState({showGeneral: false});
        this.setState({showSearch: false});
        this.setState({showGlossary: false});
        this.setState({showContactSupport: false}); 
      }
    },

    clickGlossary: function(){
      if(this.state.showGlossary)
      {
        this.closeAll();
      }else{
        this.setState({showSupportMenu: false});
        this.setState({showGlossary: true});
        this.setState({showGeneral: false});
        this.setState({showSearch: false});
        this.setState({showWatchlist: false});
        this.setState({showContactSupport: false}); 
      }
    },

    clickContactSupport: function(){
      // hashHistory.push('ContactSupport');
      // this.props.hideMenu();
       if(this.state.showContactSupport)
      {
        this.closeAll();
      }else{
        this.setState({showSupportMenu: false});
        this.setState({showGlossary: false});
        this.setState({showGeneral: false});
        this.setState({showSearch: false});
        this.setState({showWatchlist: false});
        this.setState({showContactSupport: true}); 
      }
    },
    
    render() {
        var itemHelp = this.state.help.map(function(item) {
          return (
            <ListItem key={item.id} onClick={item.click}>
                <Box pad="small" direction="row" align="center" justify="between" tag="aside" responsive={false}>
                    <Title responsive={false}>
                        <Heading margin="none" tag="h5"><FormattedMessage id={item.text} defaultMessage={item.default} /></Heading>
                    </Title>
                    <IconHelper iconName="Next" />
                </Box>
            </ListItem>
          );
        });
        var SupportBody = (
          <Box>
            <Header className="page-header" pad="none" justify="start" fixed={true} style={{ 'position': 'fixed', 'width': '100%', 'top': '0' }} colorIndex="neutral-1">
              <Box className="menu-items" direction="row" justify="start" responsive={false}>
                <Anchor className="page-header-back-btn" icon={<IconHelper iconName="Previous" />} onClick={this.props.close}></Anchor>
                <Anchor icon={<IconHelper iconName="Menu" />} onClick={this.props.close}></Anchor>
              </Box>
              <Title className="page-header-title-text"><FormattedMessage id='cpx_support_menu' defaultMessage="Get Support" /></Title>
            </Header>
            <Header size="medium" justify="between" colorIndex="accent-2">
              <Box direction="row" colorIndex="accent-2" pad={{horizontal: "medium", vertical: "large"}} justify="between" responsive={true}>
                <Title responsive={false}>
                  <Heading tag="h2" margin="none">
                    <FormattedMessage id={this.state.title} defaultMessage="How can we help?" />
                  </Heading>
                </Title>
              </Box>
            </Header>
            <List>{itemHelp}</List>
            <Box direction="row" colorIndex="light-2" pad={{horizontal: "medium", vertical: "medium"}} justify="between" responsive={true}>
              <strong><FormattedMessage id={this.state.more_help.title} defaultMessage={this.state.more_help.titleDefault} /></strong>
            </Box>
            <ListItem onClick={this.clickContactSupport}>
              <Box pad="small" direction="row" align="center" justify="between" tag="aside" responsive={false}>
                <Title responsive={false}>
                  <Heading margin="none" tag="h5"><FormattedMessage id={this.state.more_help.text} defaultMessage={this.state.more_help.textDefault} /></Heading>
                </Title>
                <IconHelper iconName="Next" />
              </Box>
            </ListItem>
          </Box>
        );
        return (
          <Layer closer={false} align="left" flush={true}>
            {this.state.showSupportMenu ? SupportBody : null }

            {this.state.showGeneral ? <GetSupportPages close={this.clickGeneral} menu={this.props.close} data={this.state.general}/> : null }
            {this.state.showSearch ? <GetSupportPages close={this.clickSearch} menu={this.props.close} data={this.state.search_and_order}/> : null }
            {this.state.showWatchlist ? <GetSupportPages close={this.clickWatchlist} menu={this.props.close} data={this.state.watchlist}/> : null }
            {this.state.showGlossary ? <GetSupportPages close={this.clickGlossary} menu={this.props.close} data={this.state.glossary}/> : null }
            {this.state.showContactSupport ? <ContactSupport close={this.clickContactSupport } menu={this.props.close}/> : null }
          </Layer>
        );
    }
});

export default GetSupport;
