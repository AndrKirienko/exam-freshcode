const yup = require('yup');
const CONSTANTS = require('./../../constants');

const {
  PAGINATION_OFFERS: { DEFAULT_PAGE, DEFAULT_RESULTS, DEFAULT_MAX_RESULTS },
} = CONSTANTS;

module.exports.REGISTRATION_SCHEMA = yup.object().shape({
  firstName: yup.string().required().min(1),
  lastName: yup.string().required().min(1),
  displayName: yup.string().required().min(1),
  email: yup.string().email().required().min(4),
  password: yup.string().required().min(1),
  role: yup
    .string()
    .matches(/(customer|creator)/)
    .required(),
});

module.exports.LOGIN_SCHEMA = yup.object().shape({
  email: yup.string().email().required().min(4),
  password: yup.string().required().min(1),
});

module.exports.CONTEST_SCHEMA = yup.object().shape({
  contestType: yup
    .string()
    .matches(/(name|logo|tagline)/)
    .required(),
  fileName: yup.string().min(1),
  originalFileName: yup.string().min(1),
  title: yup.string().required().min(1),
  typeOfName: yup.string().min(1).notRequired(),
  industry: yup.string().required().min(1),
  focusOfWork: yup.string().required().min(1),
  targetCustomer: yup.string().required().min(1),
  styleName: yup.string().min(1).notRequired(),
  nameVenture: yup.string().when('contestType', {
    is: type => type === 'logo' || type === 'tagline',
    then: schema =>
      schema
        .required('require')
        .min(3, 'name of venture must be at least 3 characters'),
    otherwise: schema => schema.notRequired(),
  }),
  typeOfTagline: yup.string().min(1).notRequired(),
  brandStyle: yup.string().min(1),
});

module.exports.PAGE_VALIDATION_SCHEMA = yup
  .number()
  .min(DEFAULT_PAGE)
  .integer();

module.exports.RESULTS_VALIDATION_SCHEMA = yup
  .number()
  .min(DEFAULT_RESULTS)
  .max(DEFAULT_MAX_RESULTS)
  .integer();
