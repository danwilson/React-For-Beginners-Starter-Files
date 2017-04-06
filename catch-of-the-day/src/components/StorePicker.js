import React from 'react';
import { getFunName } from '../helpers'

class StorePicker extends React.Component {
  constructor() {
    super();
  }
  goToStore(e) {
    e.preventDefault();
    console.log(this.storeInput.value);
    this.context.router.transitionTo(`/store/${this.storeInput.value}`);
  }

  render() {
    return (
      <form action="" className="store-selector" onSubmit={this.goToStore.bind(this)}>
        <h2>Please Enter a Store</h2>
        <input ref={(input) => {this.storeInput = input}} type="text" required placeholder="Store Name" defaultValue={getFunName()} />
        <button type="submit">Visit Store</button>
      </form>
    );
  }
}

StorePicker.contextTypes = {
  router: React.PropTypes.object
};

export default StorePicker;