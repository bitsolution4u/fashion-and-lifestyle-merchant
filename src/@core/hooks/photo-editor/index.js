'use client';
import React from 'react';
import ImageUploader from './single-image-upload';
import MultipleImageUploader from './multiple-img-upload';
import { Typography } from '@mui/material';
import SingleUserImgUpload from './singel-user-img-upload';

const PhotEditorMain = () => {
  return (
    <div className="demo-form-main-page">
      <div className="form-grid-shadow">
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Single Image Upload
        </Typography>
        <ImageUploader />
        <Typography variant="h6" sx={{ fontWeight: 600, my: 5 }}>
          Single Round Upload
        </Typography>
        <SingleUserImgUpload />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, m: 2, textAlign: 'center' }}
        >
          Multi Img Upload
        </Typography>
        <MultipleImageUploader />
      </div>
    </div>
  );
};

export default PhotEditorMain;
