import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from './Payments';

class Header extends Component {
  //  Render different info depends on if user is logged in
  renderContent() {
    switch (this.props.auth){
      case null:        
        return;
      case false:           // User is not logged in
        return (
          <li><a href="/auth/google">Login With Google</a></li>
        );
      default:              // User is logged in, auth contain user model
        return [
          <li key="1"><Payments /></li>,
          <li key="3" style={{ margin: '0 10px'}}>
            Credit: {this.props.auth.credits}
          </li>,
          <li key="2"><a href="/api/logout">Logout</a></li>
        ];
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link 
            to={this.props.auth ? '/surveys' : '/'}
            className="left brand-logo"
          >
            Emaily
          </Link>
          <ul className="right">
            {this.renderContent()}
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state){
  return { auth: state.auth };
}

// Use react connector to wire up Header component with redux store(authReducer)
export default connect(mapStateToProps, null)(Header);
