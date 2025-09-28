import { Box, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const EditorComponent = dynamic(() => import('../editor'), { ssr: false });

const ProductDescription = ({ handleProductDataChange, productsData }) => {

  const typeId = productsData?.type_info?._id ?? productsData?.type_info;
  const [descriptionData, setDescriptionData] = useState(
    productsData?.description ? productsData?.description : ''
  );
  const [sizeData, setSizeData] = useState(
    productsData?.size_chart
    ? productsData?.size_chart
    : productsData?.ingredients
    ? productsData?.ingredients
    : ''
  );
  const [specipationData, setSpecipationData] = useState(
    productsData?.specification 
    ? productsData?.specification 
    : productsData?.use_directions 
    ? productsData?.use_directions 
    : ''
  );
  return (
    <div className="demo-form-main-page">
      <Box className="px-5 mt-12">
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', fontWeight: '700', p: 3 }}
        >
          Product Description
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <h2 className="my-5 font-bold text-xl text-gray-400 text-center">
              {typeId  === "6880c255098c458993b3267b" ? "Product Ingredients" : "Product Size Description"}
            </h2>
            <EditorComponent
              initialData={sizeData}
              onChange={(data) => {
                setSizeData(data);
                handleProductDataChange(typeId  === "6880c255098c458993b3267b" ? 'ingredients' : "size_chart", data);
              }}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <h2 className="my-5 font-bold text-xl text-gray-400 text-center">
              Product Description
            </h2>
            <EditorComponent
              initialData={descriptionData}
              onChange={(data) => {
                setDescriptionData(data);
                handleProductDataChange('description', data);
              }}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <h2 className="my-5 font-bold text-xl text-gray-400 text-center">
              {typeId  === "6880c255098c458993b3267b" ? "How To Use" : "Product Specification"}
            </h2>
            <EditorComponent
              initialData={specipationData}
              onChange={(data) => {
                setSpecipationData(data);
                handleProductDataChange(typeId  === "6880c255098c458993b3267b" ?'use_directions' : "specification", data);
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ProductDescription;
