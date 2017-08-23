import React from 'react';
import { FormattedMessage } from 'react-intl';

// Grommet components
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import Table from 'grommet/components/Table';
import Anchor from 'grommet/components/Anchor';
import CommonAccordion from './CommonAccordion';

// Utils
import DataListingTable from '../utils/DataListingTable';
import Utilities from '../utils/utilities';

const labels = {
  shipment: (<FormattedMessage id="order_shipment" defaultMessage="Shipment" />),
  dateShipped: (<FormattedMessage id="Date Shipped" defaultMessage="Date Shipped" />),
  carrier: (<FormattedMessage id="order_carrier" defaultMessage="Carrier" />),
  tracking: (<FormattedMessage id="order_tracking" defaultMessage="Tracking #" />),
  productName: (<FormattedMessage id="order_productName" defaultMessage="Product Name" />),
  productId: (<FormattedMessage id="order_productId" defaultMessage="Product ID" />),
  shippedQuantity: (<FormattedMessage id="order_shippedQuantity" defaultMessage="Shipped Quantity" />),
};

export default class ShipmentListItem extends React.Component {
  getProductData(product) {
    return [
      {label: labels.productName, value: product.product_name},
      {label: labels.productId, value: product.product_no},
      {label: labels.shippedQuantity, value: product.sched_line_qty}
    ];
  }

  getItemHeading(itemNo, item, typeLabel) {
    return (
      <Box pad={{vertical:'medium'}}>
        <Table className="data-listing-table">
          <tbody>
            <tr>
              <td colSpan="2"><Heading tag="h4" strong={true}>{labels.shipment} {itemNo}</Heading></td>
            </tr>
          </tbody>
        </Table>        
      </Box>
    );
  }
  
  handleTrackClick(url){
    window.open(url,'_system');
  }

  getTrackingUrl(item) {
    return item.carrier_tracking_url ? 
      <Anchor
        label={item.tracking_no}
        onClick={()=>{this.handleTrackClick(item.carrier_tracking_url);}}
        /> :
      <span>{item.tracking_no}</span>;
  }

  getShipmentHeader(item, typeLabel) {
    const trackingNumber = this.getTrackingUrl(item);
    return( <Box pad={{vertical:'medium'}} margin={{horizontal:'medium'}}>
        <Table className="data-listing-table">
          <tbody>
            <tr>
              <td>{typeLabel}:</td>       
              <td><strong>{ Utilities.formatDate(item.date) }</strong></td>
            </tr>
            <tr>
              <td>{labels.carrier}:</td>       
              <td>{item.carrier_name}</td>       
            </tr>
            <tr>
              <td>{labels.tracking}:</td>       
              <td>{trackingNumber}</td>
            </tr>
            
          </tbody>
        </Table>        
      </Box>
    );
  }

  getItemProducts(item) {
    return item.productList.map((product, index) =>
      <Box key={index} margin={{horizontal:'medium'}} separator={(index===item.productList.length-1)?"none":"bottom"}>
        <DataListingTable data={this.getProductData(product)} pad={{vertical:'medium'}} />
      </Box>
    );
  }

  render() {
    const { itemNo, item, typeLabel } = this.props;
    const itemHeading = this.getItemHeading(itemNo, item, typeLabel);
    const itemProducts = this.getItemProducts(item);
    const shipmentHeader = this.getShipmentHeader(item, typeLabel);
    return (
      <CommonAccordion colorIndex="light-1" styling="inner-accordion-heading" separator="none" heading={itemHeading}>
        <Box separator="bottom" colorIndex="neutral-4"></Box>
         {shipmentHeader}
        <Box separator="bottom" colorIndex="neutral-4"></Box>
        {itemProducts}
        <Box separator="bottom" colorIndex="neutral-4"></Box>
      </CommonAccordion>
    );
  }
}
