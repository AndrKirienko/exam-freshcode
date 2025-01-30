import React, { Component } from 'react';
import { Link } from 'react-scroll';
import styles from './QuestionsCards.module.sass';
import faqData from '../../../data/howItWorksData/faqData';
import iconPlus from '../../../../public/staticImages/how_it_works_img/questions_icon/icon-plus';

class QuestionsCards extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: faqData[0].titleId,
      openQuestions: {},
    };
    this.contentRefs = {};
  }

  getLinkProps = toSection => ({
    to: toSection,
    smooth: 'linear',
    duration: 1200,
    offset: -80,
    delay: 100,
    spy: true,
    onClick: () => this.setState({ activeTab: toSection }),
    className:
      this.state.activeTab === toSection ? styles.activeLink : styles.link,
  });

  toggleAnswer (id) {
    this.setState(prevState => ({
      openQuestions: {
        ...prevState.openQuestions,
        [id]: !prevState.openQuestions[id],
      },
    }));
  }

  initializeContentRefs (id) {
    if (!this.contentRefs[id]) this.contentRefs[id] = React.createRef();
  }

  getClassName (id, class1, class2) {
    return this.state.openQuestions[id] ? class1 : class2;
  }

  getAnswerStyles (id) {
    return {
      ref: this.contentRefs[id],
      style: {
        overflow: 'hidden',
        height: this.state.openQuestions[id]
          ? `${this.contentRefs[id]?.current?.scrollHeight || 0}px`
          : '0px',
        transition: 'height 0.5s ease',
      },
    };
  }

  render () {
    return (
      <>
        <nav className={styles.tabsContainer}>
          {faqData.map(key => (
            <Link {...this.getLinkProps(key.titleId)} key={key.titleId}>
              {key.title}
            </Link>
          ))}
        </nav>

        {faqData.map((key, index) => (
          <section
            id={key.titleId}
            className={styles.faqSection}
            key={key.titleId}
          >
            <h3 className={styles.faqSectionTitle}>{key.title}</h3>
            <div className={styles.answerContainer}>
              {key.faq.map((faqKey, faqIndex) => (
                <div
                  className={`${this.getClassName(
                    faqKey.id,
                    styles.faqItemActive,
                    styles.faqItem
                  )}`}
                  {...this.initializeContentRefs(faqKey.id)}
                  key={faqKey.id || faqIndex}
                >
                  <h4
                    className={styles.faqQuestion}
                    onClick={() => this.toggleAnswer(faqKey.id)}
                  >
                    {faqKey.question}
                    <span
                      className={`${this.getClassName(
                        faqKey.id,
                        styles.iconPlusActive,
                        styles.iconPlus
                      )}`}
                    >
                      {iconPlus}
                    </span>
                  </h4>
                  <div {...this.getAnswerStyles(faqKey.id)}>
                    <p
                      className={`${this.getClassName(
                        faqKey.id,
                        styles.faqAnswerActive,
                        styles.faqAnswer
                      )}`}
                    >
                      {faqKey.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </>
    );
  }
}

export default QuestionsCards;
