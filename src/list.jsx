import React, { Component } from 'react';
import PropTypes from 'prop-types';
import iScroll from 'iscroll/build/iscroll-lite';
import ReactIScroll from 'react-iscroll';
import { getArrayByMinmax, getIndexByValue } from './util';
import { ITEMHEIGHT, HALFITEMHEIGHT } from './constant';
import ScrollItem from './item';

class List extends React.Component {
    constructor(props) {
        super(props);
        let { min, max, step, options, value, type, itemHeight } = props;
        let list = getArrayByMinmax({ min, max, step });
        let { startY, curIndex } = getIndexByValue(list, value, itemHeight);
        let coptions = {
            ...options
        };
        coptions.startY = startY;
        this.options = coptions;
        this.curIndex = curIndex;
        this.state = {
            list
        };
        this.scrollEnd = this.scrollEnd.bind(this);
    }
    componentDidMount() {
        // console.log('componentDidMount:', this.refs.iscroll);
        let { itemHeight, onSelect, scope, index, type } = this.props;
        let { list } = this.state;
        this.refs.iscroll.withIScroll(true, function (iScroll) {
            console.log('iScroll.y:', iScroll.y);
            const _height = itemHeight || ITEMHEIGHT
            let scrollY = iScroll.y;
            let cur = Math.abs(Math.round(scrollY / _height)) + 3;
            let _value = list[cur];
            onSelect && onSelect({ value: _value, scope, index, type });
        });
    }
    componentWillReceiveProps(nextProps) {
        let { min, max, step, options, value, type } = nextProps;
        let list = getArrayByMinmax({ min, max, step });
        if (list.length != this.state.list.length) {
            this.setState({
                list
            });
        }
    }
    componentDidUpdate() {
        let { value, itemHeight } = this.props;
        let { list } = this.state;
        let { startY } = getIndexByValue(list, value, itemHeight);
        this.refs.iscroll.withIScroll(true, function (iScroll) {
            if (iScroll.y != startY) {
                iScroll.scrollTo(0, startY);
            }
        });
    }
    scrollEnd(iScrollInstance) {
        let { onSelect, scope, index, type, itemHeight } = this.props;
        let y = iScrollInstance.y;
        const _height = itemHeight || ITEMHEIGHT
        const _halfHeight = itemHeight ? Math.round(itemHeight / 2) : HALFITEMHEIGHT
        let spare = y % _height;
        let scrollY = y;
        if (spare != 0) {
            scrollY = Math.abs(spare) > _halfHeight ? (y - spare - _height) : (y - spare);
            iScrollInstance.scrollTo(0, scrollY, 100);
        }
        let cur = Math.abs(Math.round(scrollY / _height)) + 3;
        let value = this.state.list[cur];
        onSelect && onSelect({ value, scope, index, type });
    }
    render() {
        let { options, index, value, suffix } = this.props;
        let { list } = this.state;
        let coptions = this.options;
        let curIndex = this.curIndex;
        return (
            <ReactIScroll ref="iscroll" className="c-timewrap" iScroll={iScroll} options={coptions} onScrollEnd={this.scrollEnd}>
                <ScrollItem suffix={suffix} list={list} cur={curIndex} index={index} />
                <div className="c-time-shade"></div>
                <div className="c-time-indicator"></div>
            </ReactIScroll>
        )
    }
}
export default List;