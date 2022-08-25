'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CSSTransition = require('react-transition-group/CSSTransition');

var _CSSTransition2 = _interopRequireDefault(_CSSTransition);

var _util = require('./util');

var _list = require('./list');

var _list2 = _interopRequireDefault(_list);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimePicker = function (_Component) {
    (0, _inherits3.default)(TimePicker, _Component);

    function TimePicker(props) {
        (0, _classCallCheck3.default)(this, TimePicker);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TimePicker.__proto__ || (0, _getPrototypeOf2.default)(TimePicker)).call(this, props));

        var show = props.show,
            minuteStep = props.minuteStep,
            yearRange = props.yearRange,
            value = props.value,
            currentTime = props.currentTime,
            format = props.format,
            minDate = props.minDate,
            maxDate = props.maxDate,
            enterTime = props.enterTime,
            itemHeight = props.itemHeight,
            selectClass = props.selectClass,
            maskClass = props.maskClass;

        var formats = _this.formats = (0, _util.getForm)(format);
        var curTime = currentTime || Date.now();
        var curFormatTime = _this.curFormatTime = (0, _util.formatDate)(curTime);
        var times = value || [curTime];
        times = times instanceof Array ? times : [times];
        var timeobj = { times: times, formats: formats, minuteStep: minuteStep, yearRange: yearRange, curTime: curFormatTime };
        if (minDate) {
            _this.minDate = (0, _util.formatDate)(minDate);
            timeobj.minDate = _this.minDate;
        }
        if (maxDate) {
            _this.maxDate = (0, _util.formatDate)(maxDate);
            timeobj.maxDate = _this.maxDate;
        }
        var timearr = (0, _util.getTimePoint)(timeobj);

        _this.close = _this.close.bind(_this);
        _this.show = _this.show.bind(_this);
        _this.save = _this.save.bind(_this);
        _this.accept = _this.accept.bind(_this);
        _this.state = {
            show: typeof show != 'undefined' ? show : false,
            times: timearr
        };
        return _this;
    }

    (0, _createClass3.default)(TimePicker, [{
        key: 'accept',
        value: function accept(_ref) {
            var value = _ref.value,
                scope = _ref.scope,
                index = _ref.index,
                type = _ref.type;

            var curFormatTime = this.curFormatTime;
            var times = this.state.times;

            times[scope][index].value = value;

            var dIndex = (0, _util.getValueByType)(times[scope], 'date').index;
            /*
                选择的是年和月，需要处理日的最大值，如2月份可能是28或29，没有30和31
                且用户有配置天的选项
            */
            if (dIndex > -1 && (type == 'month' || type == 'year')) {
                var year = (0, _util.getValueByType)(times[scope], 'year').value || curFormatTime.year;
                var month = (0, _util.getValueByType)(times[scope], 'month').value || curFormatTime.month;
                var max = (0, _util.getCurrentMonthLastDay)(year, month);
                times[scope][dIndex].max = max;
                if (times[scope][dIndex].value > max) {
                    times[scope][dIndex].value = max;
                }
            }
            /*
                如果设置了minDate和maxDate，则需要处理边界日期
                先获取times数组中第一个type是什么，年或月，时或分
                如果数组长度小于2，不需要处理
            */
            var minDate = this.minDate;
            var maxDate = this.maxDate;
            var frarr = times[scope];
            if (minDate) {
                if (frarr.length > 1) {
                    var firstType = frarr[0].type;
                    var mIndex = (0, _util.getValueByType)(frarr, type).index;
                    var firstValue = type == firstType ? value : (0, _util.getValueByType)(times[scope], firstType).value;
                    for (var i = mIndex, len = frarr.length; i < len; i++) {
                        if (frarr[i].type != firstType) {
                            var minvl = (0, _util.resetMin)({ type: frarr[i].type, minDate: minDate, firstType: firstType, firstValue: firstValue });
                            frarr[i].min = minvl;
                            if (frarr[i].value < minvl) {
                                frarr[i].value = minvl;
                            }
                        }
                    }
                }
            }
            if (maxDate) {
                if (frarr.length > 1) {
                    var ayear = (0, _util.getValueByType)(times[scope], 'year').value || curFormatTime.year;
                    var amonth = (0, _util.getValueByType)(times[scope], 'month').value || curFormatTime.month;
                    var dateMax = (0, _util.getCurrentMonthLastDay)(ayear, amonth);

                    var _firstType = frarr[0].type;
                    var _mIndex = (0, _util.getValueByType)(frarr, type).index;
                    var _firstValue = type == _firstType ? value : (0, _util.getValueByType)(times[scope], _firstType).value;
                    for (var _i = _mIndex, _len = frarr.length; _i < _len; _i++) {
                        if (frarr[_i].type != _firstType) {
                            var maxvl = (0, _util.resetMax)({ type: frarr[_i].type, maxDate: maxDate, firstType: _firstType, firstValue: _firstValue, dateMax: dateMax });
                            frarr[_i].max = maxvl;
                            if (frarr[_i].value > maxvl) {
                                frarr[_i].value = maxvl;
                            }
                        }
                    }
                }
            }
            //console.log(times);
            this.setState({
                times: times
            });
        }
    }, {
        key: 'close',
        value: function close() {
            this.setState({
                show: false
            });
        }
    }, {
        key: 'show',
        value: function show() {
            this.setState({
                show: true
            });
        }
    }, {
        key: 'save',
        value: function save() {
            var _props = this.props,
                onDone = _props.onDone,
                format = _props.format;
            var times = this.state.times;

            var curFormatTime = this.curFormatTime;
            var result = [];
            for (var i = 0, len = times.length; i < len; i++) {
                result.push((0, _util.getTimeValue)(times[i], format, curFormatTime));
            }
            if (onDone) {
                result = result.length == 1 ? result[0] : result;
                var immplement = onDone(result);
                immplement = typeof immplement != 'undefined' ? immplement : true;
                if (immplement) {
                    this.close();
                }
            } else {
                this.close();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var self = this;
            var _self$props = self.props,
                options = _self$props.options,
                title = _self$props.title,
                enterTime = _self$props.enterTime,
                itemHeight = _self$props.itemHeight,
                selectClass = _self$props.selectClass,
                maskClass = _self$props.maskClass;
            var _self$state = self.state,
                times = _self$state.times,
                show = _self$state.show;

            var SelectNode = void 0;
            var timeNode = times.map(function (citem, n) {
                return citem.map(function (item, index) {
                    return _react2.default.createElement(_list2.default, (0, _extends3.default)({ onSelect: self.accept, key: n + '_' + index, scope: n, index: index, options: options }, item, { itemHeight: itemHeight }));
                });
            });
            SelectNode = _react2.default.createElement(
                'div',
                { className: 'c-timeselect ' + selectClass },
                _react2.default.createElement(
                    'div',
                    { className: 'c-timeopa' },
                    _react2.default.createElement(
                        'div',
                        { className: 'c-timebton', onClick: self.close },
                        '\u53D6\u6D88'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'c-timetitle' },
                        title
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'c-timebton', onClick: self.save },
                        '\u786E\u5B9A'
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'c-timecont' },
                    timeNode
                )
            );
            return _react2.default.createElement(
                'div',
                { className: 'c-timeroot', style: show ? { display: 'block' } : { display: 'none', overflow: 'hidden' } },
                _react2.default.createElement(
                    _CSSTransition2.default,
                    { 'in': show, classNames: 'timemask', timeout: enterTime, mountOnEnter: true, unmountOnExit: true },
                    _react2.default.createElement('div', { className: 'c-timemask ' + maskClass, onClick: self.close })
                ),
                _react2.default.createElement(
                    _CSSTransition2.default,
                    { 'in': show, classNames: 'timecont', timeout: enterTime, mountOnEnter: true, unmountOnExit: true },
                    SelectNode
                )
            );
        }
    }]);
    return TimePicker;
}(_react.Component);

TimePicker.proptypes = {
    title: _propTypes2.default.string,
    format: _propTypes2.default.string,
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.array]),
    options: _propTypes2.default.object,
    currentTime: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    minuteStep: _propTypes2.default.number,
    yearRange: _propTypes2.default.number,
    show: _propTypes2.default.bool,
    minDate: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    maxDate: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    onDone: _propTypes2.default.func
};
TimePicker.defaultProps = {
    title: '选择日期',
    format: '{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}',
    options: {
        disablePointer: true,
        disableTouch: false,
        disableMouse: true,
        startX: 0,
        startY: 0
    },
    minuteStep: 1,
    yearRange: 10,
    show: false,
    enterTime: 300
};
exports.default = TimePicker;