import classNames from 'classnames';
import { useField, useFormikContext } from 'formik';
import React from 'react';

const ImageUpload = props => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props.name);
  const { uploadContainer, inputContainer, imgStyle } = props.classes;

  const onChange = e => {
    const file = e.target.files[0];

    if (!file) return;

    const imageType = /image.*/;
    if (!file.type.match(imageType)) {
      e.target.value = '';
      return;
    }

    setFieldValue(props.name, file);

    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('imagePreview').src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          id='fileInput'
          type='file'
          accept='.jpg, .png, .jpeg'
          onChange={onChange}
        />
        <label htmlFor='fileInput'>Choose file</label>
      </div>
      <img
        id='imagePreview'
        className={classNames({ [imgStyle]: !!field.value })}
        alt='user'
      />
    </div>
  );
};

export default ImageUpload;
