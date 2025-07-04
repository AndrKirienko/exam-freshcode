import React from 'react';
import styles from './Catalog.module.sass';

const Catalog = props => {
  const { deleteCatalog, goToCatalog } = props;
  const { catalogName, chats, id } = props.catalog;

  return (
    <div
      className={styles.catalogContainer}
      onClick={event => goToCatalog(event, props.catalog)}
    >
      <span className={styles.catalogName}>{catalogName}</span>
      <div className={styles.infoContainer}>
        <span>Chats number: </span>
        <span className={styles.numbers}>{chats?.length ?? 0}</span>
        <i
          className='fas fa-trash-alt'
          onClick={event => deleteCatalog(event, id)}
        />
      </div>
    </div>
  );
};

export default Catalog;
