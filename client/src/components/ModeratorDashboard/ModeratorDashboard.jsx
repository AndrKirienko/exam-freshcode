import React, { Component } from 'react';
import styles from './ModeratorDashboard.module.sass';
import { connect } from 'react-redux';
import CONSTANTS from './../../constants';
import { getOffersThunk, setPage } from '../../store/slices/offersSlices';

const {
  PAGINATION_OFFERS: { DEFAULT_RESULTS, DEFAULT_PAGE },
} = CONSTANTS;

class ModeratorDashboard extends Component {
  componentDidMount () {
    this.props.getOffers(this.props.paginate);
  }

  componentDidUpdate (prevProps) {
    if (prevProps.paginate !== this.props.paginate) {
      this.props.getOffers(this.props.paginate);
    }
  }

  prevPage = () => {
    const { page } = this.props.paginate;
    if (page > DEFAULT_PAGE) {
      this.props.setPage(page - 1);
    }
  };

  nextPage = () => {
    const {
      offers,
      paginate: { page },
    } = this.props;

    if (offers.length === DEFAULT_RESULTS) {
      this.props.setPage(page + 1);
    }
  };

  render () {
    const {
      offers,
      paginate: { page },
    } = this.props;

    return (
      <div>
        <ul>
          {offers.map(o => (
            <li key={o.id} className={styles.offerItem}>
              <h2>{o.text}</h2>
              <p>{o.status}</p>
            </li>
          ))}
        </ul>
        <div>
          <button
            onClick={() => {
              this.prevPage();
            }}
          >
            prev
          </button>
          <p>{page}</p>
          <button
            onClick={() => {
              this.nextPage();
            }}
          >
            next
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ offersStore }) => ({
  offers: offersStore.offers,
  paginate: offersStore.paginate,
});

const mapDispatchToProps = dispatch => ({
  getOffers: data => {
    dispatch(getOffersThunk(data));
  },
  setPage: data => {
    dispatch(setPage(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
