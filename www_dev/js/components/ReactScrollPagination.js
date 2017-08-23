/*
 * This component is for pagination of searched orders
 */
import React from 'react';

// ################## React-Scroll-Pagination.  Begin.#########
var ReactScrollPagination = React.createClass({
  isolate: {
    onePageHeight: null,
    timeoutFunc: null,
    excludeHeight: null,
    defaultShowTime: 2000,
    //realpull: false
  },
  pageDivStle: {
    position: 'fixed',
    bottom: '15px',
    left: 0,
    right: 0,
    textAlign: 'center'
  },
  pageContentStyle: {
    display: 'inline-block',
    background: 'rgba(6, 6, 6, 0.54)',
    borderRadius: '5px',
    padding: '3px 15px',
    minWidth: '80px',
    color: '#fff',
    textAlign: 'center',
    margin: '0 auto',
    opacity: 1,
    WebkitTransition: 'opacity 0.8s',
    MozTransition: 'opacity 0.8s',
    OTransition: 'opacity 0.8s',
    transition: 'opacity 0.8s'
  },
  getInitialState: function () {
    return {
      currentPage: 1,
      totalPages: null,
      showPageStatus: false
    }
  },
  showPageDiv: function () {
    if (this.isolate.timeoutFunc) {
      clearTimeout(this.isolate.timeoutFunc)
    }
    this.setState({showPageStatus: true})
    let showTime = this.props.paginationShowTime ? parseInt(this.props.paginationShowTime)
    : this.isolate.defaultShowTime

    this.isolate.timeoutFunc = setTimeout(() => {
      this.setState({showPageStatus: false})
    }, showTime)
  },
  getExcludeHeight: function () {
    if (this.isolate.excludeHeight !== null) {
      return this.isolate.excludeHeight
    }

    // This is the height needs to be excluded, like Header.
    let excludeHeight = 0

    if (this.props.excludeHeight) {
      let propsExcludeHeight = parseInt(this.props.excludeHeight)
      if (isNaN(propsExcludeHeight)) {
        console.error('WARN: Failed to convert the props excludeHeight "' + this.props.excludeHeight +
          '" to Number, please verify. Will take "0" by default.')
      } else {
        excludeHeight = propsExcludeHeight
      }
    } else if (this.props.excludeElement && typeof this.props.excludeElement === 'string') {
      let excludeEle = jQuery(this.props.excludeElement)

      if (excludeEle.size() === 0) {
        console.error('WARN: Failed to get the element with given selectdor "' + this.props.excludeElement +
          '", please veirify. Will take "0" by default.')
      } else {
        excludeHeight = excludeEle.height()
      }
    }
    this.isolate.excludeHeight = excludeHeight

    return excludeHeight
  },
  initialOnePageHeight: function () {
    const documentHeight = jQuery(document).height()

    // When totalPages first has the value, it means List is initialized first time. 
    // At this time the height of page is caculated, the value will act as the height of one page. 
    // Because normally the page will have a header, the height of header needs to be removed.
    
    if (typeof this.props.totalPages === 'number' && this.props.totalPages > 0 && this.isolate.onePageHeight === null) {
      let excludeHeight = this.getExcludeHeight()
      this.isolate.onePageHeight = documentHeight - excludeHeight 
    }
  },
  handlePageValue: function () {

    // When totalPages first has the value, it means List is initialized first time. 
    // At this time the height of page is caculated, the value will act as the height of one page. 
    // Because normally the page will have a header, the height of header needs to be removed.
    this.initialOnePageHeight()

    let windowHeight = jQuery(window).height()
    let scrollTop = jQuery(window).scrollTop() + windowHeight - this.getExcludeHeight()

    if (this.isolate.onePageHeight !== null) {
      let currentPage = Math.ceil(scrollTop / this.isolate.onePageHeight) || 1
      this.setState({currentPage: currentPage})
      this.showPageDiv()
    }
  },
  scrollHanlder: function () {
    let documentHeight = jQuery(document).height()

    let windowHeight = jQuery(window).height()
    let scrollBottom = jQuery(window).scrollTop() + windowHeight

    // When the vertical scroll bar is near to the bottom about 30 px, it will trigger the action.
    if ((scrollBottom + 30) >= documentHeight) {
      this.props.fetchFunc()        
      /*if(this.isolate.realpull == false) {
        this.isolate.realpull = true;
      } else {
        this.isolate.realpull = false;
        this.props.fetchFunc()        
      }*/
    }
    this.handlePageValue()
  },
  componentWillUnmount: function () {
    jQuery(window).unbind('scroll', this.scrollHanlder)
  },
  componentDidMount: function () {
    jQuery(window).scroll(this.scrollHanlder)
  },

  render: function () {
    let acutalPageContentDivStyle = jQuery.extend({}, this.props.innerDivStyle || this.pageContentStyle)

    // Even if the passed innerDiv, it also needs to set opacity, and it is for caller to realize the transition effect of opacity.
    if (!this.state.showPageStatus) {
      acutalPageContentDivStyle.opacity = 0
    }

    // let actualDiv = this.state.showPageStatus ? withPageDiv : null
    return (
      <div style={this.props.outterDivStyle || this.pageDivStle} >
        <div style={acutalPageContentDivStyle} >
          <span >
            {this.state.currentPage}
          </span>
          /
          <span >
            {this.props.totalPages || 1}
          </span>
        </div>
      </div>
    )
  }
});
// ################## React-Scroll-Pagination. End#########

export default ReactScrollPagination;
