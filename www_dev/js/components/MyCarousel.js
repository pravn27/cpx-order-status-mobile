import React, { Component } from 'react';
import PageHeader from './PageHeader';
import { FormattedMessage } from 'react-intl';
import Carousel from 'grommet/components/Carousel';
import App from 'grommet/components/App';


class MyCarousel extends Carousel {
	
	_slidePrev(){
      var children = this.props.children;
      var activeIndex = this.state.activeIndex;
	  var slideInfinite = this.props.slideInfinite;
      var numSlides = children.length;

	  if(!slideInfinite && (activeIndex == 0)){
		  return;		  
	  }
	  
	  
      this.setState({
        activeIndex: (activeIndex + numSlides - 1) % numSlides
      });
	}
	
	_slideNext(){
      var children = this.props.children;
      var activeIndex = this.state.activeIndex;
	  var slideInfinite = this.props.slideInfinite;

      var numSlides = children.length;

	  if(!slideInfinite && (activeIndex == (numSlides-1))){
		  return;		  
	  }
	  
	  
      this.setState({
        activeIndex: (activeIndex + 1) % numSlides
      });
	}
	
}

export default MyCarousel;

