import React from 'react';
import { FormattedMessage } from 'react-intl';

import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Spinning from 'grommet/components/icons/Spinning';

import utilities from './utilities';

// Return the icon component with the size and color desired
const IconHelper = function(props) {
  const TIcon = require('grommet/components/icons/base/' + props.iconName);
  return <TIcon size={props.size} colorIndex={props.colorIndex} />;
};

// Return a space of varying size that can be used for example to put some space between 2 items
const Space = (props) => (
  <Box pad={props.size} />
);

// Return a text in italic style. 
const Italic = (props) => (
  <span className="italic">{props.value}</span>
);

/* Display the spinner icon with text. 
   By default this component will appear at the middle of page and display "Loading" below the spinner.
   The style of the component as well as the text can be customized by passing the props "className" and "text".
*/
const Spinner = (props) => (
  <Box align="center" className={props.className || "centered"} colorIndex='light-2' pad="small">
    <Spinning />
    <Heading tag="h4" style={ {'margin' : '0' } }>
      {props.text || "Loading"}
    </Heading>
  </Box>
);

const MultipleShipments = () => (
  <span className="italic" style={{color: "#767676", fontSize: "14px"}}>
    <FormattedMessage id="orderValue_multipleShip" defaultMessage="Multiple Shipments" />
  </span>
);

const PreviousDate = ({date}) => (
  <span className="italic" style={{fontSize: '14px'}}>
	  {["(Previously ", date, ")"].join('')}
	</span>
);

module.exports = {
  Italic: Italic,
  Space: Space,
  IconHelper: IconHelper,
  Spinner: Spinner,
  MultipleShipments: MultipleShipments,
  PreviousDate: PreviousDate
};

/*
  Eg. of use:
  import { IconHelper, Space } from "(...)/commonComponents" 
  <Space pad="small" />
*/
