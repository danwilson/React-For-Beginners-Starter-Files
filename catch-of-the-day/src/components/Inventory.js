import React from 'react';
import AddFish from './AddFish';
import base from '../base';

class Inventory extends React.Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
  }
  componentDidMount() {
    base.onAuth(user => {
      if (user) {
        this.authHandler(null, {user})
      }
    });
  }
  handleChange(e, key) {
    const fish = this.props.fishes[key];
    console.log(key, fish);
    const updatedFish = {...fish, [e.target.name]: e.target.value }
    this.props.updateFish(key, updatedFish);
  }
  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Please sign in</p>
        <button className="github" onClick={() => this.authenticate('github')}>via GitHub</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>via Twitter</button>
      </nav>
    )
  }
  authenticate(type) {
    console.log('Login via', type);
    base.authWithOAuthPopup(type, this.authHandler);
  }
  authHandler(err, authData) {
    console.log('Success?', err, authData);
    if (err) {
      console.error(err);
      return;
    }
    const storeRef = base.database().ref(this.props.storeId);
    storeRef.once('value', snapshot => {
      const data = snapshot.val() || {};
      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        })
      }
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    })

  }
  logout() {
    base.unauth();
    this.setState( {uid: null });
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input name="name" onChange={(e) => this.handleChange(e, key)} value={fish.name} type="text" placeholder="Fish Name"/>
        <input name="price" onChange={(e) => this.handleChange(e, key)} value={fish.price} type="text" placeholder="Fish Price"/>
        <select name="status" onChange={(e) => this.handleChange(e, key)} value={fish.status}>
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out</option>
        </select>
        <textarea name="desc" onChange={(e) => this.handleChange(e, key)} value={fish.desc} placeholder="Fish Desc"/>
        <input name="image" onChange={(e) => this.handleChange(e, key)} value={fish.image} type="text" placeholder="Fish Image"/>
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    );
  }
  render() {
    const logout = <button onClick={this.logout}>Log Out</button>
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }
    if (this.state.uid !== this.state.owner) {
      return (<div><p>You are not the owner of this store.</p> {logout}</div>)
    }
    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {
          Object.keys(this.props.fishes).map(this.renderInventory)
        }
        <AddFish addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples}>Load Sample Fish</button>
      </div>
    );
  }
}
Inventory.PropTypes = {
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  storeId: React.PropTypes.string.isRequired
}

export default Inventory;