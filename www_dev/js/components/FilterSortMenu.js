// see this component implementation note at the end of file

import React from 'react';
import { FormattedMessage } from 'react-intl';

// grommet components
import Layer  from 'grommet/components/Layer';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor  from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';
import RadioButton from 'grommet/components/RadioButton';

// app components
import IconHelper from './IconHelper';

var FilterSortMenu = React.createClass({
    getInitialState: function() {
      // get prop values from the parent component
      var filterBy = this.props.filterBy;

      // define filter options
      var filters = this.props.filters;

      // set default values for the state variables filterBy and sortBy
      if(filterBy === null || filterBy == "" || filterBy === undefined)
        filterBy = filters;

      // create the filterOptions and SortOptions list
      var filterOptions = [], checked = false;
      filters.forEach(function(item) {
        checked = false;
        if(filterBy.indexOf(item) >= 0) checked = true;
        filterOptions.push({ id: item, name: item, label: item, defaultLabel: item, defaultChecked: checked });
      });

      return {
        defaultFilters: filters,
        filterOptions: filterOptions,
        filterBy: filterBy
      };
    },
    // on button apply click
    apply: function() {
      this.props.apply(this.state.filterBy);

      if(this.props.defaultSort)
        this.props.defaultSort();
      this.props.close();
    },
    // on button reset click
    reset: function() {
      this.props.apply(this.state.defaultFilters);
      
      if(this.props.reset)
        this.props.reset();
      this.props.close();
    },
    // on filter option checked/unchecked
    handleFilterCheck: function(filterOption) {
      var index = this.state.filterBy.indexOf(filterOption);
      if(index < 0)
        this.state.filterBy.push(filterOption);
      else
        this.state.filterBy.splice(index, 1);
    },
    render: function() {
      // loop to create filter list
      var filterOptionList = this.state.filterOptions.map(function(filterOption, i) {
        return (
          <Box key={i} direction="row" colorIndex="light-1" pad="medium" separator="bottom" responsive={false}>
            <CheckBox id={filterOption.id} name={filterOption.name} label={<FormattedMessage id={filterOption.label} defaultMessage={filterOption.defaultLabel} />} defaultChecked={filterOption.defaultChecked} onChange={ () => this.handleFilterCheck(filterOption.defaultLabel) } />
          </Box>
        );
      }, this);

      return (
          <Layer closer={false} align="right" flush={true}>
              <Header className="page-header" pad="none" justify="between" fixed={true} colorIndex="neutral-1">
                <Title className="layer-page-header-title">
                  <FormattedMessage id="cpx_landing_line" defaultMessage="HPE GO" />
                </Title>
                <Anchor className="layer-close-icon" onClick={this.props.close}>
                  <IconHelper iconName='Close' />
                </Anchor>
              </Header>
              <Box direction="row" colorIndex="light-2" pad="medium" responsive={false}>
                <strong>
                  <FormattedMessage id="Filters by" defaultMessage="Filters by" />
                </strong>
              </Box>
              { filterOptionList }
              <Tiles direction="row" colorIndex="light-1" justify="center" responsive={false} fill={true}>
                <Tile pad="medium">
                  <Button label={<FormattedMessage id="Reset" defaultMessage="Reset" />} fill={true} onClick={ this.reset } />
                </Tile>
                <Tile pad="medium">
                  <Button label={<FormattedMessage id="Apply" defaultMessage="Apply" />} fill={true} primary={true} onClick={ this.apply } />
                </Tile>
              </Tiles>
          </Layer>
      );
    }
});


export default FilterSortMenu;

// Implementation Note

// ** Important!! In the parent component, include this function:
//      getInitialState: function() {
//        return {
//          showMenu: false
//        }
//      },
//      onClick: function() {
//          if(this.state.showMenu) {
//              this.setState( {showMenu: false} );
//          } else {
//              this.setState( {showMenu: true} );
//          }
//      },
//      filterSortApply: function(filters, sort) {
//        *do whatever u want with the received filters and sort values here
//      }
//    Then this component should be written like this, close and apply props are compulsary
//      { this.state.showMenu ? <FilterSortMenu close={ this.onClick } apply={ this.filterSortApply } /> : null }

// ** To set the checked options for the filters:
//   <FilterSortMenu onClick={ this.onClick } apply={ this.filterSortApply } filterBy={ array_of_options } />
//   example:
//     <FilterSortMenu onClick={ this.onClick } apply={ this.filterSortApply } filterBy={ ["Submitted", "Accepted"] } />
//     *Only Submitted and Accepted will be checked for filter

// ** To show the component with the default options (all checked for filters):
//   <FilterSortMenu onClick={ this.onClick } apply={ this.filterSortApply } onClick={ this.onClick } />
//   *No need to pass anything lol