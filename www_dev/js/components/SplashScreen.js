import React from 'react';
import ReactDOM from 'react-dom';

// grommet components
import Image from 'grommet/components/Image';

var SplashScreen = React.createClass({
	getInitialState: function() {
		var currentYear = new Date().getFullYear();
		return {
		  'current_year': currentYear
		};
	},
	render: function() {
		return (
			<div>
				<Image src={this.props.url} full={true} />
				<p className="copyright-text">&copy; {this.state.current_year} Hewlett Packard Enterprise Company, L.P. </p>
			</div>
		);
	}
});

export default SplashScreen;

// :: Note
// @ index.js
// 
// onDeviceReady: function() {
//     ReactDOM.render(
//         <div>
//             <SplashScreen url={"img/splash/splash_screen_xhdpi.png"} />
//         </div>
//     , document.getElementById('content'));

//     setTimeout(function() {
//         app.receivedEvent('deviceready');
//     }, 3000);
// },