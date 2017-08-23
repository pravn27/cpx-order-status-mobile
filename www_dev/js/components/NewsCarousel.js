import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// [Grommet Components]
import Section  from 'grommet/components/Section';
import Carousel from 'grommet/components/Carousel';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';

const newsTitle = (<FormattedMessage id="cpx_newscarousel_title" defaultMessage="What's New from HPE" />);

export default class NewsCarousel extends Component {
    constructor() {
        super();
    }
    getData() {
        return this.props.images.map((imgName, index) => <img key={index} src={["./img/", imgName].join('')} />);
    }
    render() {
        const Images = this.getData();
        return (
            <Box>
                <div className="order-title">
                    <Header size="small" justify="between" colorIndex="neutral-1" pad={{"horizontal": "medium"}}>
                        <Title>{newsTitle}</Title>
                        <span style={{fontSize:15,fontWeight:100}}>1 of 2</span>
                    </Header>
                </div>
                <Carousel>{Images}</Carousel>
            </Box>
        );
    }
}
