import React from 'react';
import ReactDOM from 'react-dom';

// grommmet components
import Box from 'grommet/components/Box';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';

import Up from 'grommet/components/icons/base/Up';
import Down from 'grommet/components/icons/base/Down';

var CommonAccordion = React.createClass({
	getInitialState: function() {
		return {
			arrowIcon: <Up />,
			showUp: (this.props.active === 0 ? true : false)
		};
	},

	componentDidMount: function() {
		$(".order-details-accordion").find("svg.grommetux-control-icon-caret-next").first().remove();
	},

	handleClick: function() {
			this.setState({
				showUp: !this.state.showUp
			});
	},

	render: function() {
		const accordionPanelHeading = (
			<Box full="horizontal" direction="row" justify="between" align="center" responsive={false}>
				{this.props.heading}
				{this.state.showUp ? <Up /> : <Down />}
			</Box>);
		return (
			<Box colorIndex={this.props.colorIndex || "light-2"} separator={this.props.separator || "top"}>
				<Accordion onActive={this.handleClick} active={this.props.active} className="order-details-accordion" animate={false}>
					<AccordionPanel className={this.props.styling} heading={accordionPanelHeading}>
            <Box colorIndex="light-1">
							{ this.props.children }
            </Box>
					</AccordionPanel>
				</Accordion>
			</Box>
		);
	}
});

export default CommonAccordion;

// Implementation Note

// <CommonAccordion heading={your accordion heading}>
//  {things that you like to put in the accordion}
// <CommonAccordion>
