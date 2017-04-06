import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { formatPrice } from '../helpers';

class Order extends React.Component {
  constructor() {
    super();
    this.renderOrder = this.renderOrder.bind(this);
  }
  renderOrder(key) {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];
    const remover = <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>

    if (!fish || fish.status === 'unavailable') {
      return (<li key={key}>Sorry, {fish ? fish.name : 'fish'} is no longer available.{remover}</li>);
    }

    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup
            component="span"
            className="count"
            transitionName="count"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}>
          <span key={count}>{count}</span>
          </CSSTransitionGroup>
          lbs {fish.name}
        </span>
        <span className="price">{formatPrice(count * fish.price)}</span>
        {remover}
      </li>
    );
  }
  render() {
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      const isAvailable = fish && fish.status === 'available';
      if (isAvailable) {
        return prevTotal + (count * fish.price || 0);
      }
      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2>Your Order</h2>

        <CSSTransitionGroup component="ul" className="order" 
        transitionName="order" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {orderIds.map(this.renderOrder)}
          <li className="total"><strong>Total:</strong>{formatPrice(total)}</li>
        </CSSTransitionGroup>
      </div>
    );
  }
}
Order.PropTypes = {
  removeFromOrder: React.PropTypes.func.isRequired,
  order: React.PropTypes.object.isRequired,
  fishes: React.PropTypes.object.isRequired
}

export default Order;