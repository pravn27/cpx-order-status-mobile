import React from 'react';
import { FormattedMessage } from 'react-intl';

// Components
import CommonAccordion from './CommonAccordion';
import ShipmentListItem from './ShipmentListItem';

export default class ShipmentList extends React.Component {
    getItems() {
        return this.props.items.map((item, index) =>
            <ShipmentListItem key={index} item={item} itemNo={index+1} typeLabel={this.props.typeLabel} />
        );
    }

    render() {
        const items = this.getItems();

        return (
            <CommonAccordion heading={this.props.accordionHeading}>
                {items}
            </CommonAccordion>
        );
    }
}
