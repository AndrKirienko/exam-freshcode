import React, { Component } from 'react';
import styles from './ModeratorDashboard.module.sass';
import { connect } from 'react-redux';

import { getOffersThunk } from '../../store/slices/offersSlices';

class ModeratorDashboard extends Component {
  componentDidMount () {
    this.props.getOffers();
  }

  render () {
    return <div>ModeratorDashboard</div>;
  }
}

const mapStateToProps = ({ offersStore }) => ({
  offers: offersStore.offers,
});

const mapDispatchToProps = dispatch => ({
  getOffers: () => {
    dispatch(getOffersThunk());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
