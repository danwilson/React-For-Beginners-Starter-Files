import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes.js';
import base from '../base';

class App extends React.Component {
  constructor() {
    super();
    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    console.log('willmount', `${this.props.params.storeId}/fishes`);
    const order = localStorage.getItem(`order-${this.props.params.storeId}`);
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    if (order) {
      this.setState({order: JSON.parse(order)});
    }
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    const fishes = {...this.state.fishes};
    fishes['fish-' + Date.now()] = fish;
    this.setState({ fishes }); //ES6 way of saying { fishes: fishes }
  }
  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }
  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({ fishes });
  }
  addToOrder(key) {
    const order = {...this.state.order};
    order[key] = (order[key] + 1) || 1;
    this.setState({ order });
  }
  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key]
    this.setState({ order });
  }
  loadSamples() {
    this.setState({
      fishes: sampleFishes
    })
  }
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood" />
          <ul className="list-of-fishes">
            {
              Object.keys(this.state.fishes).map(
                key => <Fish key={key} id={key} details={this.state.fishes[key]} 
                  addToOrder={this.addToOrder}/>
              )
            }
          </ul>
        </div>
        <Order  
           removeFromOrder={this.removeFromOrder}
           fishes={this.state.fishes} order={this.state.order} params={this.props.params}/>
        <Inventory 
          addFish={this.addFish} 
          updateFish={this.updateFish} 
          removeFish={this.removeFish} 
          loadSamples={this.loadSamples} 
          fishes={this.state.fishes}
          storeId={this.props.params.storeId}/>
      </div>
    );
  }
}
App.PropTypes = {
  params: React.PropTypes.object.isRequired
}

export default App;