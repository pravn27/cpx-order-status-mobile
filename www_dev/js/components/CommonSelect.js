import React from 'react';
import ReactDOM from 'react-dom';

// Utils

const style = {
  margin: '0.5em 0px',
  width: '100%',
  border: '0px',
  fontSize: '18px',
  fontWeight:600,
  paddingLeft: '20px',
  'white-space': 'nowrap',
  'overflow': 'hidden'
},polygon = {
	'width': '24px',
	'height': '24px'
},buttonStyle = {
  'borderLeft': '1px solid #ccc'
},wrapper = {
  'float': 'left',
  'width': '100%'
},link= {
  'textDecoration':'none'
},list = {
  'listStyleType': 'none',
  'margin': 0,
  'padding': 0
},polygonUp = (<img className="polygon grommetux-input" src={'img/icons/down.png'}/>),
polygonDown = (<img className="polygon grommetux-input" src={'img/icons/up.png'}/>);

var CommonSelect = React.createClass({
	getInitialState: function() {
		return {
      display: false,
      value: this.props.value,
      identity: this.props.identity,
      error: this.props.error,
      data: this.props.list.map((i, index) => {
        return (
          <a id={i.value} style={link} onClick={(e)=>this.selectItem(e,i.value)} key={index}>
            <li id={i.value} className="custom-select-list itemSelect" style={{'maxWidth':'100%'}} onClick={(e)=>this.selectItem(e,i.value)}>{i.label}</li>
          </a>
        );
      })
    }
	},

	componentDidMount: function() {
    window.addEventListener('mousedown', this.pageClick, false);
	},

  componentWillReceiveProps: function(nextProps) {

    this.setState(
      { data: nextProps.list.map((i, index) => {
                          return (
                            <a id={i.value} style={link} onClick={(e)=>this.selectItem(e,i.value)} key={index}>
                              <li id={i.value} className="custom-select-list itemSelect" style={{'maxWidth':'100%'}} onClick={(e)=>this.selectItem(e,i.value)}>{i.label}</li>
                            </a>
                          );
                        }) ,
      error : nextProps.error ,
      value : nextProps.value });
  },

handleClick: function(e) {
   this.setState({display: !this.state.display});
  },

  selectItem: function(e,i){
    this.setState({value: i});
    this.props.onChange(this.state.identity, this.state.value);
  },

  pageClick: function (e) {
    if (!this.state.display || e.srcElement.className === 'grommetux-input grommetux-select__input' || e.srcElement.className === 'grommetux-button__icon' || e.srcElement.className === 'polygon' ) {
        return;
    }
    if (e.srcElement.className === 'custom-select-list itemSelect') {
      this.setState({value: e.srcElement.id});
      this.props.onChange(this.state.identity, this.state.value);
    }
    this.setState({
      display: false,
    });
  },

	render: function() {
    var padStyle = this.props.title ? { padding: '0px 20px', color: '#666' } : { color: '#666' };
    var errorStyle = this.props.error && this.props.error != '' ? { padding: '0px 20px 0px 0px', color: 'rgb(240, 73, 83)', float: 'right' } : { color: '#666' };
    var requiredStyle = this.props.required ? 'required' : null;
    return (
      <div style={{ 'width':'100%' }}>
        <div className="grommetux-form-field grommetux-form-field--size-medium" style={ this.props.error && this.props.error != '' ?  {'borderBottomColor':'red', 'borderTopColor':'red', 'borderLeftColor':'white', 'borderRightColor':'white', 'margin-bottom': '0px!important','overflow':'hidden' }: {'borderLeftColor':'white', 'borderRightColor':'white', 'overflow':'hidden'}}>
          <span className="grommetux-form-field__contents" onClick={this.handleClick}>
            <span className={ requiredStyle } style={ padStyle }> {this.props.title} </span>
            <span style={ errorStyle }> {this.state.error}  </span>
               <div className="grommetux-box grommetux-box--direction-row grommetux-box--justify-start grommetux-box--pad-none grommetux-box--margin-none">
              <label className="grommetux-input grommetux-select__input common-select-input" style={style}>{this.state.value}</label>
              <button type="button" className="grommetux-button grommetux-button--plain grommetux-button--icon grommetux-select__control"
                aria-label="Select Icon" style={buttonStyle}>
                <span className="grommetux-button__icon grommetux-input" style={{'verticalAlign':'middle'}}>
                  {(this.state.display && this.state.data.length!=0) ? polygonDown : polygonUp}
                </span>
              </button>
            </div>
          </span>
        </div>
        <div style={wrapper}>
          <ul className="custom-select-list" style={list}>
            {(this.state.display) ? this.state.data: null}
          </ul>
        </div>
      </div>
		);
	}
});

export default CommonSelect;

// Implementation Note

// <CommonSelect value={defaultValue} list={[]} onChange={} title={title} />
// list = [{value: 1, label: 'label'}]
// onChange will trigger a function that recieve the parameter of the selected item.
