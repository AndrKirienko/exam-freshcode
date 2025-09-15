import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import searchIcon from '../../../../public/staticImages/how_it_works_img/search_icon/search_icon';
import searchData from './../../../data/howItWorksData/searchData.json';
import styles from './SearchForm.module.sass';

class SearchForm extends Component {
  render () {
    return (
      <>
        <form className={styles.searchContainer} action='#' method='GET'>
          <div className={styles.icon}>{searchIcon}</div>
          <input
            name='search'
            type='text'
            placeholder='Search Over 200,000 + Premium Names'
            required
            className={styles.searchInput}
          />
          <button className={styles.searchBtn} type='submit'>
            {searchIcon}
          </button>
        </form>
        <ul className={styles.listTag}>
          {searchData.map((key, index) => (
            <li key={index}>
              <Link to={key.link}>
                <span className={styles.listTagItem}>{key.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default SearchForm;
