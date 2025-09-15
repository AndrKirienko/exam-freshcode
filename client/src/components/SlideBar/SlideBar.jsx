import React from 'react';
import Flickity from 'react-flickity-component';
import carouselConstants from '../../data/carouselConstants';
import './flickity.sass';
import styles from './SlideBar.module.sass';

const SlideBar = props => {
  const options = {
    draggable: true,
    wrapAround: true,
    pageDots: false,
    prevNextButtons: true,
    autoPlay: true,
    groupCells: true,
    lazyLoad: true,
  };

  const getStyleName = () => {
    const { carouselType } = props;
    switch (carouselType) {
      case carouselConstants.MAIN_SLIDER:
        return styles.mainCarousel;
      case carouselConstants.EXAMPLE_SLIDER:
        return styles.exampleCarousel;
      case carouselConstants.FEEDBACK_SLIDER:
        return styles.feedbackCarousel;
    }
  };

  const renderSlides = () => {
    const { carouselType } = props;
    switch (carouselType) {
      case carouselConstants.MAIN_SLIDER: {
        return Object.keys(props.images).map((key, index) => (
          <img
            src={props.images[index]}
            alt='slide'
            key={index}
            className={styles.carouselCell}
          />
        ));
      }
      case carouselConstants.EXAMPLE_SLIDER: {
        return Object.keys(props.data).map((key, index) => (
          <a
            href={`https://${props.data[index].text}`}
            target='_blank'
            className={styles.exampleCell}
            key={index}
          >
            <img
              className={styles.exampleImg}
              src={props.data[index].image}
              alt='slide'
            />
            <p className={styles.exampleText}>{props.data[index].text}</p>
          </a>
        ));
      }
      case carouselConstants.FEEDBACK_SLIDER: {
        return Object.keys(props.data).map((key, index) => (
          <div className={styles.feedbackCell} key={index}>
            <img
              className={styles.feedbackImg}
              src={props.data[index].image}
              alt='slide'
            />
            <p className={styles.feedbackMessage}>
              {props.data[index].feedback}
            </p>
            <span className={styles.feedbackName}>
              {props.data[index].name}
            </span>
          </div>
        ));
      }
    }
  };
  return (
    <Flickity className={getStyleName()} elementType='div' options={options}>
      {renderSlides()}
    </Flickity>
  );
};

export default SlideBar;
