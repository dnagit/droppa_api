import baseRoute from "./base.routes";
import usersController from '../controllers/users.controller'
import groupsController from '../controllers/groups.controller'
import navigationController from '../controllers/navigations.controller'
import blogsController from '../controllers/blogs.controller'
import blogsCategoryController from '../controllers/blogsCategory.controller'
import navigationsGroupsController from '../controllers/navigationsGroups.controller'
import pagesController from '../controllers/pages.controller'
import servicesController from '../controllers/services.controller'
import portfoliosController from '../controllers/portfolios.controller'
import portfoliosimageController from '../controllers/portfoliosimage.controller'
import portfolioscategoryController from '../controllers/portfolioscategory.controller'
import BuylandController from '../controllers/buyland.controller'
import buylandimageController from '../controllers/buylandimage.controller'
import bannerController from '../controllers/banner.controller'
import widgetAreaController from '../controllers/widgetArea.controller'
import widgetsController from '../controllers/widgets.controller';
import widgetsImageController from '../controllers/widgetsImage.controller'
import settingsController from '../controllers/settings.controller'
import feedbackController from '../controllers/feedback.controller'
import fbrmailController  from '../controllers/fbrmail.controller'
//import masterController from '../controllers/master.controller'
import masterController from '../controllers/master.controller'


import publicationsController from '../controllers/publications.controller'
import publicationsImageController from '../controllers/publicationsImage.controller'
const router = baseRoute.Router();
//Users
router.post("/users/v1/getall", await usersController.getAll);
router.post("/users/v1/login", await usersController.loginUser);
router.get("/users/v1/detail/:id", await usersController.getUserDetail);
router.post("/users/v1/add", await usersController.addUser);
router.delete("/users/v1/delete/:id", await usersController.deleteUser);
router.put("/users/v1/update/:id", await usersController.updateUser);


//groups
router.post("/groups/v1/getall", await groupsController.getAll);
router.put("/groups/v1/update/:id", await groupsController.updatePermissions);
router.put("/groups/v1/updateroles/:id", await groupsController.updatePermissionsroles);
router.get("/groups/v1/detail/:id", await groupsController.getPermissionsDetail);
router.post("/groups/v1/add", await groupsController.addPermissions);
router.delete("/groups/v1/delete/:id", await groupsController.deletePermissions);



//navigations
router.post("/navigations/v1/getall", await navigationController.getAll);
router.get("/navigations/v1/detail/:id", await navigationController.getNavigationsDetail);
router.post("/navigations/v1/add", await navigationController.addNavigations);
router.delete("/navigations/v1/delete/:id", await navigationController.deleteNavigations);
router.put("/navigations/v1/update/:id", await navigationController.updateNavigations);
router.put("/navigations/v1/updateOrdering", await navigationController.updateNavigationOrdering);
//

//navigations_groups
router.post("/navigations/v1/groups/getall", await navigationsGroupsController.getAll);
router.get("/navigations/v1/groups/detail/:id", await navigationsGroupsController.getNavigationsGroupsDetail);
router.post("/navigations/v1/groups/add", await navigationsGroupsController.addNavigationsGroups);
router.delete("/navigations/v1/groups/delete/:id", await navigationsGroupsController.deleteNavigationsGroups);
router.put("/navigations/v1/groups/update/:id", await navigationsGroupsController.updateNavigationsGroups);

//blog
router.post("/blogs/v1/getall", await blogsController.getAll);
router.get("/blogs/v1/detail/:slug", await blogsController.getBlogsDetail);
router.post("/blogs/v1/add", await blogsController.addBlogs);
router.delete("/blogs/v1/delete/:id", await blogsController.deleteBlogs);
router.put("/blogs/v1/update/:id", await blogsController.updateBlogs);
router.post("/blogs/v1/upload/:id", await blogsController.uploadImages);


//blog_category
router.post("/blogs/v1/category/getall", await blogsCategoryController.getAll);
router.get("/blogs/v1/category/detail/:id", await blogsCategoryController.getBlogsCategoryDetail);
router.post("/blogs/v1/category/add", await blogsCategoryController.addBlogsCategory);
router.delete("/blogs/v1/category/delete/:id", await blogsCategoryController.deleteBlogsCategory);
router.put("/blogs/v1/category/update/:id", await blogsCategoryController.updateBlogsCategory);


//pages
router.post("/pages/v1/getall", await pagesController.getAll);
router.put("/pages/v1/update/:id", await pagesController.updatepages);
router.post("/pages/v1/detail", await pagesController.getpagesDetail);
router.post("/pages/v1/add", await pagesController.addpages);
router.delete("/pages/v1/delete/:id", await pagesController.deletepages);

//services_category
router.post("/services/v1/getall", await servicesController.getAll);
router.put("/services/v1/update/:id", await servicesController.updateservices);
router.get("/services/v1/detail/:id", await servicesController.getservicesDetail);
router.post("/services/v1/add", await servicesController.addservices);
router.delete("/services/v1/delete/:id", await servicesController.deleteservices);

//portfolios
router.post("/portfolios/v1/getall", await portfoliosController.getAll);
router.put("/portfolios/v1/update/:id", await portfoliosController.updatePortfolios);
router.get("/portfolios/v1/detail/:slug", await portfoliosController.getPortfoliosDetail);
router.post("/portfolios/v1/add", await portfoliosController.addPortfolios);
router.delete("/portfolios/v1/delete/:id", await portfoliosController.deletePortfolios);


//portfolios_image
router.post("/portfolios/v1/image/getall", await portfoliosimageController.getAll);
router.get("/portfolios/v1/image/detail/:id", await portfoliosimageController.getPortfoliosimageDetail);
router.put("/portfolios/v1/image/update/:id", await portfoliosimageController.updatePortfoliosimage);
router.post("/portfolios/v1/image/add/:id", await portfoliosimageController.addPortfoliosimage);
router.delete("/portfolios/v1/image/deleteAll/:id", await portfoliosimageController.deleteAllPortfoliosimage);
router.delete("/portfolios/v1/image/delete/:id", await portfoliosimageController.deletePortfoliosimage);
router.put("/portfolios/v1/image/updateOrdering", await portfoliosimageController.updatePortfoliosimageOrdering);


//portfolios_category
router.post("/portfolios/v1/category/getall", await portfolioscategoryController.getAll);
router.put("/portfolios/v1/category/update/:id", await portfolioscategoryController.updatePortfolioscategory);
router.get("/portfolios/v1/category/detail/:id", await portfolioscategoryController.getPortfolioscategoryDetail);
router.post("/portfolios/v1/category/add", await portfolioscategoryController.addPortfolioscategory);
router.delete("/portfolios/v1/category/delete/:id", await portfolioscategoryController.deletePortfolioscategory);



//buyland
router.post("/buyland/v1/getall", await BuylandController.getAll);
router.put("/buyland/v1/update/:id", await BuylandController.updateBuyland);
router.get("/buyland/v1/detail/:id", await BuylandController.getBuylandDetail);
router.post("/buyland/v1/add", await BuylandController.addBuyland);
router.delete("/buyland/v1/delete/:id", await BuylandController.deleteBuyland);

//buyland_image
router.post("/buyland/v1/image/getall", await buylandimageController.getAll);
router.get("/buyland/v1/image/detail/:id", await buylandimageController.getBuylandimageDetail);
router.put("/buyland/v1/image/update/:id", await buylandimageController.updateBuylandimage);
router.post("/buyland/v1/image/add/:id", await buylandimageController.addBuylandimage);
router.delete("/buyland/v1/image/deleteAll/:id", await buylandimageController.deleteAllBuylandimage);
router.delete("/buyland/v1/image/delete/:id", await buylandimageController.deleteBuylandimage);


//banner
router.post("/banner/v1/getall", await bannerController.getAll);
router.post("/banner/v1/add", await bannerController.addbanner);
router.put("/banner/v1/update/:id", await bannerController.updateBanner);
router.delete("/banner/v1/delete/:id", await bannerController.deleteBanner);

router.post("/banner/v1/image/add/:id", await bannerController.addBannerImage);
router.post("/banner/v1/image/getall/:id", await bannerController.getImageAll);
router.put("/banner/v1/image/update/:id", await bannerController.updateBannerImage);
router.put("/banner/v1/image/updateOrdering", await bannerController.updateBanneImageOrdering);
router.delete("/banner/v1/image/delete/:id", await bannerController.deleteBannerImage);




//widgets
router.post("/widgets/v1/area/getall", await widgetAreaController.getAll);
router.post("/widgets/v1/area/add", await widgetAreaController.addArea);
router.put("/widgets/v1/area/update/:id", await widgetAreaController.updateArea);
router.delete('/widgets/v1/area/delete/:id', await widgetAreaController.deleteArea);

router.post('/widgets/v1/add', await widgetsController.addWidgets);
router.put('/widgets/v1/update/:id', await widgetsController.updateWidgets);
router.put('/widgets/v1/updateOrdering', await widgetsController.updateWidgeteOrdering);
router.delete('/widgets/v1/delete/:id', await widgetsController.deleteWidgets);

router.post("/widgets/v1/image/getall", await widgetsImageController.getAll);
router.get("/widgets/v1/image/detail/:id", await widgetsImageController.getImagesDetail);
router.put("/widgets/v1/image/update/:id", await widgetsImageController.updateImage);
router.post("/widgets/v1/image/add/:id", await widgetsImageController.addImage);
router.delete("/widgets/v1/image/deleteAll/:id", await widgetsImageController.deleteAllImages);
router.delete("/widgets/v1/image/delete/:id", await widgetsImageController.deleteImage);
router.put("/widgets/v1/image/updateOrdering", await widgetsImageController.updateImageOrdering);


//settings

router.post("/settings/v1/getall", await settingsController.getAll);
router.post("/settings/v1/update", await settingsController.updateSetting);


//feedback
router.post("/feedback/v1/getall", await feedbackController.getAll);
router.put("/feedback/v1/update/:id", await feedbackController.updateFeedback);
router.get("/feedback/v1/detail/:id", await feedbackController.getFeedbackDetail);
router.post("/feedback/v1/add", await feedbackController.addFeedback);
router.delete("/feedback/v1/delete/:id", await feedbackController.deleteFeedback);



//settings
router.post("/email/v1/send", await fbrmailController.sendContactus);
router.post("/email/v1/reset/password", await fbrmailController.resetPassword);


//sitemap
router.get("/master/v1/sitemap", await masterController.getSitemap);



//publications
router.post("/publications/v1/getall", await publicationsController.getAll);
router.put("/publications/v1/update/:id", await publicationsController.updatePublications);
router.get("/publications/v1/detail/:slug", await publicationsController.getPublicationsDetail);
router.post("/publications/v1/add", await publicationsController.addPublications);
router.delete("/publications/v1/delete/:id", await publicationsController.deletePublications);


//publications_image
router.post("/publications/v1/image/getall", await publicationsImageController.getAll);
router.get("/publications/v1/image/detail/:id", await publicationsImageController.getPublicationsimageDetail);
router.put("/publications/v1/image/update/:id", await publicationsImageController.updatePublicationsimage);
router.post("/publications/v1/image/add/:id", await publicationsImageController.addPublicationsimage);
router.delete("/publications/v1/image/deleteAll/:id", await publicationsImageController.deleteAllPublicationsimage);
router.delete("/publications/v1/image/delete/:id", await publicationsImageController.deletePublicationsimage);
router.put("/publications/v1/image/updateOrdering", await publicationsImageController.updatePublicationsimageOrdering);
export default router;