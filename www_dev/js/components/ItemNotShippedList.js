import React from 'react';
import ReactDOM from 'react-dom';

// utils
import { FormattedMessage } from 'react-intl';

// grommet components
import Box from 'grommet/components/Box';

// required component
import CommonAccordion from './CommonAccordion';
import ItemNotShippedListItem from './ItemNotShippedListItem';

var ItemNotShippedList = React.createClass({
  getItemNotShippedList: function(shipmentList) {
    return shipmentList.map((itemNotYetShippedList, i) =>
      this.getItemNotShipped(itemNotYetShippedList.productList)
    );
  },
  getItemNotShipped: function(itemNotYetShippedList) {
    var itemNotYetShippedListLength = itemNotYetShippedList.length-1;
    return itemNotYetShippedList.map((itemNotYetShipped, j) =>
      <Box key={j} margin={{horizontal:'medium'}} separator={(j===itemNotYetShippedListLength)?"none":"bottom"}>
        <ItemNotShippedListItem item={itemNotYetShipped} />
      </Box>
    );
  },
	render: function() {
		var shipmentList = this.props.data;
    var itemNotYetShippedListItems = this.getItemNotShipped(shipmentList);

		return (
      <CommonAccordion active={0} heading={<FormattedMessage id={"Item Not Yet Shipped"} defaultMessage={"Item(s) Not Yet Shipped"} />} >
        { itemNotYetShippedListItems }
      </CommonAccordion>
		);
	}
});

export default ItemNotShippedList;

// Implementation Note

// Properties needed:
//   1 data
//       The itemNotYetShippedObject

// Example
//   import ItemNotShippedList from 'ItemNotShippedList';
//     <ItemNotShippedList data={[itemNotYetShippedList]} >
//   }
