import className from 'classnames';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  clearMessageList,
  getDialogMessages,
} from '../../../../store/slices/chatSlice';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';
import styles from './Dialog.module.sass';

class Dialog extends Component {
  componentDidMount () {
    this.props.getDialog(this.props.interlocutor.id);
    this.scrollToBottom();
  }

  messagesEnd = React.createRef();

  scrollToBottom = () => {
    this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
  };

  componentWillUnmount () {
    this.props.clearMessageList();
  }

  componentDidUpdate (nextProps) {
    if (nextProps.interlocutor.id !== this.props.interlocutor.id)
      this.props.getDialog(nextProps.interlocutor.id);

    if (this.messagesEnd.current) this.scrollToBottom();
  }

  renderMainDialog = () => {
    const messagesArray = [];
    const { messages, userId } = this.props;
    let currentTime = moment();
    messages.forEach((message, i) => {
      if (message.createdAt !== null) {
        if (!currentTime.isSame(message.createdAt, 'date')) {
          messagesArray.push(
            <div key={message.createdAt} className={styles.date}>
              {moment(message.createdAt).format('MMMM DD, YYYY')}
            </div>
          );
          currentTime = moment(message.createdAt);
        }
      }
      if (message.body !== null && message.body !== undefined) {
        messagesArray.push(
          <div
            key={i}
            className={className(
              userId === message.sender ? styles.ownMessage : styles.message
            )}
          >
            <span>{message.body}</span>
            <span className={styles.messageTime}>
              {moment(message.createdAt).format('HH:mm')}
            </span>
            <div ref={this.messagesEnd} />
          </div>
        );
      }
    });
    return <div className={styles.messageList}>{messagesArray}</div>;
  };

  blockMessage = () => {
    const {
      chatData: { blackList },
    } = this.props;

    let message;
    if (blackList) {
      message = 'Chat is blocked';
    }
    return <span className={styles.messageBlock}>{message}</span>;
  };

  render () {
    const { chatData, userId } = this.props;

    return (
      <>
        <ChatHeader userId={userId} />
        {this.renderMainDialog()}
        <div ref={this.messagesEnd} />
        {chatData && chatData.blackList ? this.blockMessage() : <ChatInput />}
      </>
    );
  }
}

const mapStateToProps = state => state.chatStore;

const mapDispatchToProps = dispatch => ({
  getDialog: data => dispatch(getDialogMessages(data)),
  clearMessageList: () => dispatch(clearMessageList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
