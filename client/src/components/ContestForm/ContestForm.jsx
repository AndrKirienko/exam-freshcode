import React, { Component } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import CONSTANTS from '../../constants';
import { getDataForContest } from '../../store/slices/dataForContestSlice';
import styles from './ContestForm.module.sass';
import withRouter from '../../hocs/withRouter';
import Spinner from '../Spinner/Spinner';
import FormInput from '../FormInput/FormInput';
import SelectInput from '../SelectInput/SelectInput';
import FieldFileInput from '../InputComponents/FieldFileInput/FieldFileInput';
import FormTextArea from '../InputComponents/FormTextArea/FormTextArea';
import TryAgain from '../TryAgain/TryAgain';
import Schems from '../../utils/validators/validationSchems';
import OptionalSelects from '../OptionalSelects/OptionalSelects';
import DomainOptions from './DomainOptions/DomainOptions';

const { NAME_CONTEST, LOGO_CONTEST, TAGLINE_CONTEST } = CONSTANTS;

const variableOptions = {
  [NAME_CONTEST]: {
    styleName: '',
    typeOfName: '',
  },
  [LOGO_CONTEST]: {
    nameVenture: '',
    brandStyle: '',
  },
  [TAGLINE_CONTEST]: {
    nameVenture: '',
    typeOfTagline: '',
  },
};

class ContestForm extends Component {
  getPreference = () => {
    const { contestType } = this.props;
    switch (contestType) {
      case NAME_CONTEST: {
        this.props.getData({
          characteristic1: 'nameStyle',
          characteristic2: 'typeOfName',
        });
        break;
      }
      case TAGLINE_CONTEST: {
        this.props.getData({ characteristic1: 'typeOfTagline' });
        break;
      }
      case LOGO_CONTEST: {
        this.props.getData({ characteristic1: 'brandStyle' });
        break;
      }
    }
  };

  componentDidMount () {
    this.getPreference();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.contestType !== this.props.contestType) {
      this.getPreference();
    }
  }

  render () {
    const initialValues = {
      title: '',
      industry: '',
      focusOfWork: '',
      targetCustomer: '',
      file: '',
      ...variableOptions[this.props.contestType],
      ...this.props.initialValues,
    };

    const { isFetching, error } = this.props.dataForContest;
    if (error) {
      return <TryAgain getData={this.getPreference} />;
    }
    if (isFetching) {
      return <Spinner />;
    }
    return (
      <>
        <div className={styles.formContainer}>
          <Formik
            initialValues={initialValues}
            onSubmit={this.props.handleSubmit}
            validationSchema={Schems.ContestSchem}
            innerRef={this.props.formRef}
            enableReinitialize
          >
            <Form>
              <div className={styles.inputContainer}>
                <span className={styles.inputHeader}>Title of contest</span>
                <FormInput
                  name='title'
                  type='text'
                  label='Title'
                  classes={{
                    container: styles.componentInputContainer,
                    input: styles.input,
                    warning: styles.warning,
                  }}
                />
              </div>
              <div className={styles.inputContainer}>
                <SelectInput
                  name='industry'
                  classes={{
                    inputContainer: styles.selectInputContainer,
                    inputHeader: styles.selectHeader,
                    selectInput: styles.select,
                    warning: styles.warning,
                  }}
                  header='Describe industry associated with your venture'
                  optionsArray={this.props.dataForContest.data.industry}
                />
              </div>
              <div className={styles.inputContainer}>
                <span className={styles.inputHeader}>
                  What does your company / business do?
                </span>
                <FormTextArea
                  name='focusOfWork'
                  type='text'
                  label='e.g. We`re an online lifestyle brand that provides stylish and high quality apparel to the expert eco-conscious shopper'
                  classes={{
                    container: styles.componentInputContainer,
                    inputStyle: styles.textArea,
                    warning: styles.warning,
                  }}
                />
              </div>
              <div className={styles.inputContainer}>
                <span className={styles.inputHeader}>
                  Tell us about your customers
                </span>
                <FormTextArea
                  name='targetCustomer'
                  type='text'
                  label='customers'
                  classes={{
                    container: styles.componentInputContainer,
                    inputStyle: styles.textArea,
                    warning: styles.warning,
                  }}
                />
              </div>
              <OptionalSelects {...this.props} />
              <DomainOptions />
              <FieldFileInput
                name='file'
                classes={{
                  fileUploadContainer: styles.fileUploadContainer,
                  labelClass: styles.label,
                  fileNameClass: styles.fileName,
                  fileInput: styles.fileInput,
                  warning: styles.warning,
                }}
                type='file'
              />
              {this.props.isEditContest ? (
                <button type='submit' className={styles.changeData}>
                  Set Data
                </button>
              ) : null}
            </Form>
          </Formik>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { isEditContest } = state.contestByIdStore;
  return {
    isEditContest,
    contestCreationStore: state.contestCreationStore,
    dataForContest: state.dataForContest,
    initialValues: ownProps.defaultData,
  };
};
const mapDispatchToProps = dispatch => ({
  getData: data => dispatch(getDataForContest(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ContestForm)
);
