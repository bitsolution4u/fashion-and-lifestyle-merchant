const useValidation = () => {
  function validateFirstStep(productData) {
    const requiredFields = [
      { name: 'brandName', label: 'Brand' },
      { name: 'productGroup', label: 'Product Group' },
      { name: 'groupByModel', label: 'Group by Model' },
      { name: 'model', label: 'Model' },
      { name: 'type', label: 'Type' },
      { name: 'sbuType', label: 'SBU Type' },
      // Add more field names here as needed
    ];
    let errors = {};
    requiredFields.forEach(({ name, label }) => {
      if (!productData[name]) {
        errors[name] = `Please Enter ${label}`;
      }
    });

    return errors;
  }

  return { validateFirstStep };
};

export default useValidation;
