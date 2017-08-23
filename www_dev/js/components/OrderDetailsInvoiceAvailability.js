import React from 'react';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import { FormattedMessage } from 'react-intl';
import IconHelper from './IconHelper';

var OrderDetailsInvoiceAvailability = React.createClass({
    displayContent : function(){
        return (
            <Box pad="medium" direction="row" align="center" 
                justify="between" tag="aside" responsive={false} 
                colorIndex="accent-2-t">
                <Title responsive={false}>
                    <IconHelper iconName="Notes" />
                    <Heading margin="none" tag="h4"><FormattedMessage id='Order_Details_Invoice_Availability_text' defaultMessage="Invoice(s) Available from OSS" /></Heading>
                </Title>
                <IconHelper iconName="Checkmark" />    
            </Box>
        );
    },
	render() { return  this.props.hasInvoices ? this.displayContent() : null; }
});
export default OrderDetailsInvoiceAvailability;