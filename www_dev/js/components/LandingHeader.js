import React from 'react';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor  from 'grommet/components/Anchor';
import Layer  from 'grommet/components/Layer';
import Section  from 'grommet/components/Section';
import LandingSidebar from './LandingSidebar';
import { FormattedMessage } from 'react-intl';

var IconMenu = require('grommet/components/icons/base/Menu');
var LandingHeader = React.createClass({
    getInitialState: function() {
        return {showMenu: false};
    },
    onClick : function(){
        if(this.state.showMenu)
        {
            this.setState({showMenu: false});
        }else{
            this.setState({showMenu: true});
        }
    },
    render() {
        const appTitle = (
			<FormattedMessage id="cpx_landing_line" defaultMessage="HPE Go" />	
		);
        return (
            <Section pad='none'>
                <div className="Landing-title">
                     <Header justify="between" colorIndex="neutral-1" className>
                         <Anchor icon={<IconMenu />} onClick={this.onClick}></Anchor>
                         <Title>{appTitle}</Title>
                         <Title></Title>
                     </Header>
                 </div>
                 {this.state.showMenu ? <LandingSidebar close={this.onClick} /> : null } 
            </Section>
        );
    } 
});

export default LandingHeader;