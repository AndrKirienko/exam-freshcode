import React from 'react';
import { useField, useFormikContext } from 'formik';

const FieldFileInput = ({ classes, ...rest }) => {
  const { fileUploadContainer, labelClass, fileNameClass, fileInput } = classes;
  const { setFieldValue } = useFormikContext();
  const [field] = useField(rest.name);

  const handleFileChange = event => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue(rest.name, file);
    }
  };

  return (
    <div className={fileUploadContainer}>
      <label htmlFor='fileInput' className={labelClass}>
        Choose file
      </label>
      <span id='fileNameContainer' className={fileNameClass}>
        {field.value ? field.value.name : 'No file chosen'}
      </span>
      <input
        id='fileInput'
        type='file'
        className={fileInput}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FieldFileInput;
