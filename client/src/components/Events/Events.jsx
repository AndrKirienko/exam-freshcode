import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import withRouter from '../../hocs/withRouter';
import NotFound from '../NotFound/NotFound';
import CONSTANTS from './../../constants';
import styles from './Events.module.sass';
import EventsForm from './EventsForm/EventsForm';
import EventsList from './EventsList/EventsList';

const { CUSTOMER } = CONSTANTS;

class Events extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isCreate: false,
      editingEvent: null,
      editingIndex: null,
    };
  }

  toggleCreate = () => {
    this.setState(prevState => ({
      isCreate: !prevState.isCreate,
    }));
  };

  editEvent = (event, index) => {
    this.setState({
      isCreate: true,
      editingEvent: event,
      editingIndex: index,
    });
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
        {this.state.isCreate ? (
          <EventsForm
            event={this.state.editingEvent}
            index={this.state.editingIndex}
            onBack={this.toggleCreate}
          />
        ) : (
          <EventsList onEdit={this.editEvent} />
        )}
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
