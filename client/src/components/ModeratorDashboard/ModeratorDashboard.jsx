import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from './ModeratorDashboard.module.sass';
import CONSTANTS from './../../constants';
import { getOffersThunk, setPage } from '../../store/slices/offersSlices';
import withRouter from './../../hocs/withRouter';
import NotFound from './../NotFound/NotFound';

const {
  PAGINATION_OFFERS: { DEFAULT_RESULTS, DEFAULT_PAGE },
  MODERATOR,
  publicURL,
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
      window.scrollTo(0, 0);
    }
  };

  nextPage = () => {
    const {
      offers,
      paginate: { page },
    } = this.props;

    if (offers.length <= DEFAULT_RESULTS) {
      return;
    }

    this.props.setPage(page + 1);
    window.scrollTo(0, 0);
  };

  render () {
    const {
      offers,
      paginate: { page },
      userStore: {
        data: { role },
      },
    } = this.props;

    return role === MODERATOR ? (
      <div className={styles.offersContainer}>
        {offers.length > 0 ? (
          <>
            <ul className={styles.offersListContainer}>
              {offers.map(o => {
                const {
                  id,
                  text,
                  status,
                  'Contest.title': contestTitle,
                  'Contest.originalFileName': originalFileName,
                  'Contest.User.firstName': firstName,
                  'Contest.User.lastName': lastName,
                } = o;

                return (
                  <li key={id} className={styles.offerItem}>
                    <h2 className={styles.offerText}>Offer text: {text}</h2>
                    <p>
                      Full name customer:{' '}
                      <span>{`${firstName} ${lastName}`}</span>
                    </p>
                    <p>Contest title: {contestTitle}</p>

                    {originalFileName && (
                      <div>
                        <a
                          target='_blank'
                          className={styles.file}
                          download={originalFileName}
                          href={originalFileName}
                          rel='noreferrer'
                        >
                          {originalFileName}
                        </a>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className={styles.btnPaginationGroup}>
              <button
                className={classNames(
                  styles.btnPagination,
                  'fa fa-arrow-left-long '
                )}
                onClick={() => {
                  this.prevPage();
                }}
              ></button>
              <span>{page}</span>
              <button
                className={classNames(
                  styles.btnPagination,
                  'fa fa-arrow-right-long '
                )}
                onClick={() => {
                  this.nextPage();
                }}
              ></button>
            </div>
          </>
        ) : (
          <p className={styles.noOffersContainer}>
            There are no offers at the moment
          </p>
        )}
      </div>
    ) : (
      <NotFound />
    );
  }
}

const mapStateToProps = ({ offersStore, userStore }) => ({
  offers: offersStore.offers,
  paginate: offersStore.paginate,
  userStore,
});

const mapDispatchToProps = dispatch => ({
  getOffers: data => {
    dispatch(getOffersThunk(data));
  },
  setPage: data => {
    dispatch(setPage(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ModeratorDashboard));
