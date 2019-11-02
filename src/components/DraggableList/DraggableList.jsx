import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getFirstTouch, generateUniqKey } from 'js/functions';

import styles from './DraggableList.scss';
import Icon from '../Icon/Icon';

// let animationFrame = null;

const Item = ({ onMouseDown, onControlClick, transformY, label, cursor, hasControls = false, canDelete = false, ...rest }) => {

    // console.log(transformY);

    return (
        <div className={styles['list-item-wrapper']}>
            <div className={styles['list-item']} style={{ transform: transformY, cursor }}>
                <div className={styles['label']} onMouseDown={onMouseDown}>
                    { label }
                </div>
                { hasControls && <div className={styles['order-controls']}>
                    <button className={styles['order']} onClick={e => { onControlClick(e, 'top') }} style={{cursor: cursor == 'grabbing' ? cursor : undefined}} ><Icon name='chevron-up' /></button>
                    <button className={styles['order']} onClick={e => { onControlClick(e, 'bottom') }} style={{cursor: cursor == 'grabbing' ? cursor : undefined}} ><Icon name='chevron-down' /></button>
                </div> }
                { canDelete && <button className={styles['deleteBtn']} onClick={e => { onControlClick(e, 'delete') }}><Icon name='trash' /></button>}
            </div>
        </div>
    )

}

Item.propTypes = {
    onMouseDown: PropTypes.func,
    onControlClick: PropTypes.func,
    transformY: PropTypes.string,
    label: PropTypes.string.isRequired,
    cursor: PropTypes.string,
    hasControls: PropTypes.bool,
    canDelete: PropTypes.bool,
}

class DraggableList extends Component {

    componentDidMount() {

        this.itemHeight = this.innerRef.current.children[0].getBoundingClientRect().height;

    }

    constructor(props) {
        super(props)
        this.state = {
            dragged: false,
            draggedIndex: -1,
            startY: 0,
            currentY: 0,
            itemsArray: this.props.items,
        }

        // console.log(this.props.items);
        // this._updateUI = this._updateUI.bind(this)
        this._calcTranslate = this._calcTranslate.bind(this)
        this.handleMouse = this.handleMouse.bind(this)
        this.handleActionClick = this.handleActionClick.bind(this)
        this.itemHeight = undefined;
        this.innerRef = React.createRef();
        // this.itemKeys

    }
    // _updateUI() {

    //     console.log('object');

    //     animationFrame = requestAnimationFrame(this._updateUI);

    // }
    _moveItemDown(index) {
        
        const { itemsArray } = this.state;

        const item = itemsArray[index],
            nextItem = itemsArray[index + 1];

        itemsArray[index + 1] = item;
        itemsArray[index] = nextItem;

        this.setState({
            itemsArray,
        })

    }
    _moveItemUp(index) {
        
        const { itemsArray } = this.state;

        const item = itemsArray[index],
            prevItem = itemsArray[index - 1];

        itemsArray[index - 1] = item;
        itemsArray[index] = prevItem;

        this.setState({
            itemsArray,
        })

    }
    _deleteItem(index) {
        
        const { itemsArray } = this.state;

        itemsArray.splice(index, 1)

        this.setState({
            itemsArray,
        })

    }
    handleActionClick(clickEvent, { action, index }) {

        
        const { itemsArray, draggedIndex } = this.state;
        
        if(draggedIndex > -1)
            return;

        switch(action) {
            case 'bottom':
                if(index < itemsArray.length)
                    this._moveItemDown(index)
                break;

            case 'top':
                if(index > 0)
                    this._moveItemUp(index)
                break;

            case 'delete':
                if(typeof itemsArray[index] != 'undefined')
                    this._deleteItem(index)
                break;

            default:
                return;
        }
    }
    handleMouse(mouseEvent, index) {

        const { type } = mouseEvent;
        const { dragged } = this.state;
        let { screenY } = mouseEvent;

        const isTouch = type.includes('touch');
        
        if(isTouch)
            screenY = isTouch ? getFirstTouch(mouseEvent)['screenY'] : screenY;

        // console.log(index);

        if((type == 'mousedown' || type == 'touchstart') && screenY && typeof index == 'number') {
            this.setState({
                startY: screenY,
                currentY: screenY,
                dragged: true,
                draggedIndex: index,
            }/* , () => {
                animationFrame = requestAnimationFrame(this._updateUI)
            } */)
        }
        else if((type == 'mouseup' || type == 'mouseleave' || type == 'touchend' || type == 'touchcancel') && dragged) {
            this.setState({
                startY: 0,
                currentY: 0,
                dragged: false,
                draggedIndex: -1,
            }/*, () => {
                cancelAnimationFrame(animationFrame)
            } */)
        }
        else if((type == 'mousemove' || type == 'touchmove') && dragged) {
            this.setState({
                currentY: screenY,
            }, () => {
                
                const { currentY, startY, draggedIndex, itemsArray } = this.state;
                
                const draggedDist = currentY - startY;

                if(Math.abs(draggedDist) > this.itemHeight)/* draggedIndex ) */ {
                    const newIndex = draggedDist < 0 ? draggedIndex - 1 : draggedIndex + 1; 
                    if(newIndex >= 0 && newIndex < itemsArray.length ) {
                        const itemToMove = itemsArray.splice(draggedIndex, 1)[0];
                        const beforeItem = itemsArray.splice(0, newIndex);
                        this.setState({
                            itemsArray: [
                                ...beforeItem,
                                itemToMove,
                                ...itemsArray,
                            ],
                        }, () => {

                            this.setState({
                                draggedIndex: newIndex,
                                startY: screenY,
                                currentY: screenY,
                            })
                        })
                    }
                }
            })
        }

    }
    _calcSiblingsTranslate() {
        
    }
    _calcTranslate() {

        const { startY, currentY } = this.state;

        return `translateY(${currentY - startY}px)`;

    }
    render() {

        const { keyProp } = this.props;
        const { itemsArray, draggedIndex } = this.state;

        return (
            <div className={styles['draggable-list-outer']}>
                <div ref={this.innerRef} className={styles['list-inner']} onMouseMove={this.handleMouse} onMouseLeave={this.handleMouse} onMouseUp={this.handleMouse}>
                    { itemsArray.map((item, index) => typeof item == 'string' 
                        ? 
                            (
                                <Item key={item} label={ item } 
                                    onMouseDown={(e) => { this.handleMouse(e, index) }}
                                    onControlClick={(e, action) => { this.handleActionClick(e, { action, index }) }}
                                    hasControls={true}
                                    canDelete={true}
                                    cursor={index == draggedIndex ? 'grabbing' : 'grab'}
                                    transformY={index == draggedIndex ? this._calcTranslate() : 'unset' }/> 
                            )
                        :
                            (
                                <Item { ...item } key={item.label.toString(16)} 
                                    onMouseDown={(e) => { this.handleMouse(e, index) }}
                                    onControlClick={(e, action) => { this.handleActionClick(e, { action, index }) }}
                                    hasControls={true}
                                    canDelete={true}
                                    cursor={index == draggedIndex ? 'grabbing' : 'grab'}
                                    transformY={index == draggedIndex ? this._calcTranslate() : 'unset' }/>
                            )
                    )}
                </div>
            </div>
        )
    }
}
DraggableList.propTypes = {
    items: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        })),
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    keyProp: PropTypes.string
}
DraggableList.defaultProps = {
    items: [
        {
            label: 'Label de Test 1Label de Test 1Label de Test 1',
            key: generateUniqKey(),
        },
        {
            label: 'Label de Test 2',
            key: generateUniqKey(),
        },
        {
            label: 'Label de Test 3',
            key: generateUniqKey(),
        },
        {
            label: 'Label de Test 4',
            key: generateUniqKey(),
        },
        {
            label: 'Label de Test 5',
            key: generateUniqKey(),
        },
        {
            label: 'Label de Test 6',
            key: generateUniqKey(),
        },
    ],
    keyProp: 'key',
}
export default DraggableList