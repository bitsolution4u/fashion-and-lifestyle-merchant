/**************************************************<<<<ADMIN API ENDPOINT>>>>>**********************************************************/
/***************************************************************************************************************************************/
/***************************************************************************************************************************************/
/***************************************************************************************************************************************/

/* Auth api endpoint */

exports.v1_UserLogin = '/merchant-app-api/v1/food/auth/login';
exports.v1_VerifyUser = '/merchant-app-api/v1/food/manage-user/verify-user';
exports.v1_ChageUserPassword =
  '/merchant-app-api/v1/food/manage-user/change-password';
exports.v1_UserLogout = '/api/v1/auth/logout';
exports.v1_UserCreate = '/api/v1/auth/create';
/* district app dashboard api */
exports.v1_StartUrl = '/merchant-app-api/v1/food/start-app';

exports.v1_StartUrlByShop = '/merchant-app-api/v1/food/start-app/data-by-shop';

exports.v1_productCategoryByShopAdd =
  '/merchant-app-api/v1/food/product-category/add';

exports.v1_productByShopAdd = '/merchant-app-api/v1/food/food-products/add';

exports.v1_productByShopAll = '/merchant-app-api/v1/food/food-products/all';

exports.v1_productByShopDelete =
  '/merchant-app-api/v1/food/food-products/delete';
exports.v1_productByShopStatusChange =
  '/merchant-app-api/v1/food/food-products/status';
exports.v1_productByShopPriceUpdate =
  '/merchant-app-api/v1/food/food-products/price-update';
exports.v1_productByShopInfoUpdate =
  '/merchant-app-api/v1/food/food-products/update';
exports.v1_productByShopInfoSingle =
  '/merchant-app-api/v1/food/food-products/single';

exports.v1_changeCategroyStatus =
  '/merchant-app-api/v1/food/product-category/change-status';

exports.v1_SingleProduct =
  '/merchant-app-api/v1/food/food-products/get-one-product';
exports.v1_SubmitProductDetailsItems =
  '/merchant-app-api/v1/food/food-products/product-details';
exports.v1_Change_ProductDetails_Item_status =
  '/merchant-app-api/v1/food/food-products/details-item/status';
exports.v1_Delete_ProductDetails_Item =
  '/merchant-app-api/v1/food/food-products/details-item/delete';

exports.v1_Food_Category_By_Shop =
  '/merchant-app-api/v1/food/product-category/get-category-by-shop';
exports.v1_Food_Category =
  '/merchant-app-api/v1/food/product-category/get-category';

exports.v1_Food_Store_Config_and_Notice =
  '/merchant-app-api/v1/food/auth/set-store-notice';

exports.v1_Food_Get_Store_Info =
  '/merchant-app-api/v1/food/auth/get-store-info';

exports.v1_Food_Store_OfferAndDeliveryInfo =
  '/merchant-app-api/v1/food/auth/store-offer';
