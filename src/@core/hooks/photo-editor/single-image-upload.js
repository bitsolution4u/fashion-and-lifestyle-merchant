'use client';
import { Box, Button } from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';

const SinngleImgUpload = ({
  width = '200',
  height = '200',
  title = 'Drop or click to upload an image',
  handleImage,
  src,
}) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const styles = {
    dropzoneContainer: {
      padding: '5px',
      width: width,
      height: height,
      border: '2px dashed #aaa',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      padding: '10px 5px',
      objectFit: 'contain',
    },
  };

  const handleDrop = (acceptedFiles) => {
    const isAllowedMimeType = acceptedFiles[0].type.startsWith('image/');

    if (isAllowedMimeType) {
      const fileExtension = acceptedFiles[0].type.split('/')[1];

      const fileExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

      const isAllowedExt = fileExts.includes(fileExtension);
      if (isAllowedExt) {
        // handleImage(acceptedFiles[0]);
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          setSelectedImage(event.target.result);
          handleImage(acceptedFiles[0], event.target.result);
          setIsImageUploaded(true);
        };

        reader.readAsDataURL(file);
      } else {
        console.log('Invalid file');
      }
    } else {
      console.log('Invalid file');
    }
  };

  const handleChange = () => {
    handleImage(null, '');
    setSelectedImage(null);
    setIsImageUploaded(false);
  };

  return (
    <Box>
      <Dropzone onDrop={handleDrop} accept="image/*" multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <div style={styles.dropzoneContainer} {...getRootProps()}>
            <input {...getInputProps({ disabled: isImageUploaded })} />
            {/* {!src && (
              <Image
                width={width}
                height={height}
                style={styles.image}
                src={src}
                alt="Uploaded"
              />
            )} */}
            {src && (
              <img
                width={width}
                height={height}
                style={styles.image}
                src={src}
                alt="Uploaded"
              />
            )}
            {!src && <div className="px-2 text-sm">{title}</div>}
          </div>
        )}
      </Dropzone>
      <Box sx={{ marginTop: 3, textAlign: 'center' }}>
        {!isImageUploaded ? null : (
          <Button
            onClick={() => handleChange()}
            type="button"
            variant="contained"
          >
            Remove
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SinngleImgUpload;
