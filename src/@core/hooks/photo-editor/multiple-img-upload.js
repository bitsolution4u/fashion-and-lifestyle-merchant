'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const MultipleImageUploader = ({ handleImage, handleImageDelete, docInfo }) => {
  const [selectedImages, setSelectedImages] = useState(docInfo);

  const [firstTimeChanged, setFirstTimeChanged] = useState(false);
  const [uploadFileName, setUploadFileName] = useState([]);

  const handleDrop = (acceptedFiles) => {
    if (!firstTimeChanged) {
      setSelectedImages([]);
      setFirstTimeChanged(true);
    }
    const filesArray = Array.from(acceptedFiles);
    const imagesFile = [];

    filesArray.forEach((file) => {
      const isAllowedMimeType = file.type.startsWith('image/');
      if (isAllowedMimeType) {
        const fileExtension = file.type.split('/')[1];

        const fileExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        const isAllowedExt = fileExts.includes(fileExtension);
        if (isAllowedExt) {
          if (!uploadFileName.includes(file?.path)) {
            setUploadFileName((prevUploads) => [...prevUploads, file?.path]);
            const imgFileObj = {
              url: URL.createObjectURL(file),
              file,
            };
            imagesFile.push(imgFileObj);
          } else {
            console.log('File already exists');
          }
        }
      } else {
        console.log('Invalid file');
      }
    });
    if (imagesFile) {
      handleImage(imagesFile);
      setSelectedImages((prevImages) => [...prevImages, ...imagesFile]);
    }
  };

  const handleDelete = (index) => {
    handleImageDelete(index);
    setSelectedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
    multiple: true,
  });

  const styles = {
    imageUploader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    dropzone: {
      width: '220px',
      height: '130px',
      border: '2px dashed gray',
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.3s ease',
    },
    activeDropzone: {
      borderColor: 'green',
    },
    imagePreview: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '14px',
      marginTop: '20px',
    },
    imageContainer: {
      position: 'relative',
    },
    squareBox: {
      maxWidth: '200px',
    },
    selectedImg: {
      border: '1px solid #ddd',
      objectFit: 'contain',
      padding: '5px 5px',
    },
    deleteButton: {
      position: 'absolute',
      top: '-10px',
      right: '-6px',
      fontWeight: '600',
      // background: 'transparent',
      border: 'none',
      color: 'red',
      fontSize: '24px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.imageUploader}>
      <div
        style={{
          ...styles.dropzone,
          ...(isDragActive ? styles.activeDropzone : {}),
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-small p-2">Drop the files here...</p>
        ) : (
          <p className="text-small p-2">
            Drop or click to upload multiple file
          </p>
        )}
      </div>
      <div style={styles.imagePreview}>
        {selectedImages.map((image, index) => (
          <div style={styles.imageContainer} key={index}>
            <div style={styles.squareBox}>
              <img
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  ...styles.selectedImg,
                }}
                width={200}
                height={150}
                src={image.url}
                alt="Uploaded"
              />
            </div>
            <button
              style={styles.deleteButton}
              onClick={() => handleDelete(index)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleImageUploader;
