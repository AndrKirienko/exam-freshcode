import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import styles from './ModeratorDashboard.module.sass';
import CONSTANTS from './../../constants';
import {
  getOffers,
  setOfferModeratorStatus,
  setPage,
} from '../../store/slices/offersSlices';
import withRouter from './../../hocs/withRouter';
import NotFound from './../NotFound/NotFound';
import SpinnerLoader from '../Spinner/Spinner';

const {
  PAGINATION_OFFERS: { DEFAULT_RESULTS, DEFAULT_PAGE },
  MODERATOR,
  OFFER_MODERATOR_STATUS: { REJECT, RESOLVE },
} = CONSTANTS;

class ModeratorDashboard extends Component {
  componentDidMount () {
    this.props.setPage(DEFAULT_PAGE);
    this.props.getOffers(this.props.paginate);
  }

  componentDidUpdate (prevProps) {
    if (prevProps.paginate !== this.props.paginate) {
      this.props.getOffers(this.props.paginate);
    }
  }

  resolveOffer = id => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.props.setModeratorStatus({
              offerId: id,
              moderatorStatus: RESOLVE,
            });
            window.location.reload();
          },
        },
        {
          label: 'No',
        },
      ],
    });
  };

  rejectOffer = id => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.props.setModeratorStatus({
              offerId: id,
              moderatorStatus: REJECT,
            });
            window.location.reload();
          },
        },
        {
          label: 'No',
        },
      ],
    });
  };

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
      isFetching,
    } = this.props;

    return role === MODERATOR ? (
      <div className={styles.offersContainer}>
        {!isFetching ? (
          offers.length > 0 ? (
            <>
              <ul className={styles.offersListContainer}>
                {offers.map(o => {
                  const {
                    id,
                    text,
                    'Contest.title': contestTitle,
                    'Contest.originalFileName': originalFileName,
                    'Contest.User.firstName': firstName,
                    'Contest.User.lastName': lastName,
                  } = o;

                  return (
                    <li key={id} className={styles.offerItem}>
                      <div className={styles.offersItemDescriptions}>
                        <h2 className={styles.offerText}>Offer text: {text}</h2>
                        <p>
                          <span className={styles.offersDescriptionsItem}>
                            Full name customer:
                          </span>

                          <span>{`${firstName} ${lastName}`}</span>
                        </p>
                        <p>
                          <span className={styles.offersDescriptionsItem}>
                            Contest title:
                          </span>
                          {contestTitle}
                        </p>

                        {originalFileName && (
                          <div>
                            <span className={styles.offersDescriptionsItem}>
                              File:
                            </span>
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
                      </div>
                      <div className={styles.btnsActionsContainer}>
                        <button
                          onClick={() => {
                            this.resolveOffer(id);
                          }}
                          className={styles.resolveBtn}
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => {
                            this.rejectOffer(id);
                          }}
                          className={styles.rejectBtn}
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.btnPaginationContainer}>
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
          )
        ) : (
          <SpinnerLoader />
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
  isFetching: offersStore.isFetching,
  userStore,
});

const mapDispatchToProps = dispatch => ({
  getOffers: data => {
    dispatch(getOffers(data));
  },
  setPage: data => {
    dispatch(setPage(data));
  },
  setModeratorStatus: data => {
    dispatch(setOfferModeratorStatus(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ModeratorDashboard));
