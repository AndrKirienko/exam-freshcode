import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import CONSTANTS from '../../../../constants';
import {
  backToDialogList,
  changeChatBlock,
  changeChatFavorite,
  getPreviewChat,
} from '../../../../store/slices/chatSlice';
import styles from './ChatHeader.module.sass';

const ChatHeader = props => {
  const changeFavorite = (data, event) => {
    props.changeChatFavorite(data);
    event.stopPropagation();
  };

  const changeBlackList = (data, event) => {
    props.changeChatBlock(data);
    event.stopPropagation();
  };

  const isFavorite = chatData => {
    return chatData.favoriteList;
  };

  const isBlocked = chatData => {
    return chatData.blackList;
  };

  const backToDialogList = async () => {
    const { getPreviewChat, backToDialogList } = props;
    await getPreviewChat();
    backToDialogList();
  };

  const { avatar, firstName } = props.interlocutor;
  const { chatData } = props;
  return (
    <div className={styles.chatHeader}>
      <div className={styles.buttonContainer} onClick={backToDialogList}>
        <img
          src={`${CONSTANTS.STATIC_IMAGES_PATH}arrow-left-thick.png`}
          alt='back'
        />
      </div>
      <div className={styles.infoContainer}>
        <div>
          <img
            src={
              avatar === 'anon.png'
                ? CONSTANTS.ANONYM_IMAGE_PATH
                : `${CONSTANTS.publicURL}${avatar}`
            }
            alt='user'
          />
          <span>{firstName}</span>
        </div>
        {chatData && (
          <div>
            <i
              onClick={event =>
                changeFavorite(
                  {
                    participants: chatData.participants,
                    favoriteFlag: !isFavorite(chatData),
                  },
                  event
                )
              }
              className={classNames({
                'far fa-heart': !isFavorite(chatData),
                'fa fa-heart': isFavorite(chatData),
              })}
            />
            <i
              onClick={event =>
                changeBlackList(
                  {
                    participants: chatData.participants,
                    blackListFlag: !isBlocked(chatData),
                  },
                  event
                )
              }
              className={classNames({
                'fas fa-user-lock': !isBlocked(chatData),
                'fas fa-unlock': isBlocked(chatData),
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const { interlocutor, chatData } = state.chatStore;
  return { interlocutor, chatData };
};

const mapDispatchToProps = dispatch => ({
  backToDialogList: () => dispatch(backToDialogList()),
  changeChatFavorite: data => dispatch(changeChatFavorite(data)),
  changeChatBlock: data => dispatch(changeChatBlock(data)),
  getPreviewChat: () => dispatch(getPreviewChat()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
