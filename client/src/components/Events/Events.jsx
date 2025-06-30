import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from './Events.module.sass';
import EventsForm from './EventsForm/EventsForm';
import EventsList from './EventsList/EventsList';
import withRouter from '../../hocs/withRouter';
import CONSTANTS from './../../constants';
import NotFound from '../NotFound/NotFound';

const { CUSTOMER } = CONSTANTS;

class Events extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isCreate: false,
    };
  }

  toggleCreate = () => {
    this.setState(prevState => ({
      isCreate: !prevState.isCreate,
    }));
  };
  render () {
    const { role } = this.props.userStore.data;
    return role === CUSTOMER ? (
      <div className={styles.eventsContainer}>
        <button
          onClick={this.toggleCreate}
          className={classNames(
            styles.toggleEventBtn,
            this.state.isCreate ? 'fa-solid fa-arrow-left' : 'far fa-edit'
          )}
          title={
            this.state.isCreate ? 'Return to the events' : 'Create an event'
          }
        ></button>
        {this.state.isCreate ? <EventsForm /> : <EventsList />}
      </div>
    ) : (
      <NotFound />
    );
  }
}

const mapStateToProps = state => {
  const { userStore } = state;
  return { userStore };
};

export default connect(mapStateToProps)(withRouter(Events));
