import baseResponse from "../helpers/base-response.helper";
import mysqlConnector from "../db/mysql-connector";
import portfolioModel from "../model/portfolios"
import portfolioImageModel from '../model/portfoliosImage'
import { randomBytes } from "crypto";
const result = {};

result.getAll = async (req, res)=>{
    let mysql = null;
    const params = req.body;
    try{
        const rsDetail = await portfolioModel.getAllFromDB(params);
        let rests = [];
        if(rsDetail.data){
            rests  = await Promise.all(
                rsDetail.data.map(async (item) => { 
                        item.categories = await portfolioModel.getPortfolioCategoryFromDB(item.id);
                        item.cats =  item.categories;
                        
                        //console.log('item',item);
                        return item;
                  
                })
            );
        }
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = rsDetail.responseCode;
        baseResponse.data = rests;
        return res.status(baseResponse.responseCode).json(baseResponse);

    }catch(error){
        console.log('er',error);
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = 400;
        baseResponse.data = undefined;
        return res.status(baseResponse.responseCode).json(baseResponse);
    }finally{
        if(mysql){
            await mysql.release();

        }

    }
}

result.getPortfoliosDetail = async (req,res)=>{
    const slug = req.params.slug;
    
    let mysql = null; 
    try{
        const rsDetail = await portfolioModel.getPortfoliosDetailFromDB(slug);
        let images = [];
        rsDetail.data.galleries = [];
        if(rsDetail.data){
            rsDetail.data.categories = await portfolioModel.getPortfolioCategoryFromDB(rsDetail.data.id);
           
            let params = {
                portfolio_id :rsDetail.data.id
            }
           
            images  =  await portfolioImageModel.getAllFromDB(params);
            rsDetail.data.galleries = images.data;
        }
       
        baseResponse.data = rsDetail.data;
        baseResponse.success = rsDetail.success;
        baseResponse.message = rsDetail.message;
        baseResponse.responseCode = rsDetail.responseCode;
    }catch(error){
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.addPortfolios = async (req,res) =>{
    const params = {...req.body};
    const files = {...req.files};
    let mysql = null;

    
    try{
        const rsDetail = await portfolioModel.getPortfoliosCheckFromDB(params);
        if (rsDetail.success == true){
            if(files){
                if(files.bannerFile){
                    params.banner_image  = await portfolioModel.uploadImages(files.bannerFile,params,req.ref);
                  
                }
                if(files.portfolioFile){
               
                    params.cover_image  = await portfolioModel.uploadImages(files.portfolioFile,params,req.ref);
                }
                if(files.logoFile){
               
                    params.logo_image  = await portfolioModel.uploadImages(files.logoFile,params,req.ref);
                }
                
               
            }
            const rsAdd = await portfolioModel.addPortfoliosFromDB(params);
            let cat = [];
      
        
            if(params.categories){
                let cats = params.categories.split(',');
                try{
                    cat =  await Promise.all(
                        cats.map(async (category_id) => {
                              
                        let ras =   await portfolioModel.insertPortfoliosCategoryFromDB(rsAdd.data.insertId,category_id);
                        return ras;
                        
                        })
                    );
                } catch (error) {
                }
            
            }
        
            baseResponse.data = cat;
            baseResponse.success = rsAdd.success;
            baseResponse.message = rsAdd.message;
            baseResponse.responseCode = rsAdd.responseCode;
        }    
        else{
            baseResponse.success = false;
            baseResponse.responseCode = 200;
            baseResponse.message = rsDetail.message;
        }

    }catch(error){
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;
    }finally{
        if(mysql){
            await mysql.release();
        }
    }
   
    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.deletePortfolios = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        await portfolioModel.deletePortfolioCategoryfromDB(id);
        const reDetail = await portfolioModel.deletePortfoliosfromDB(id);
        baseResponse.message = reDetail.message;
        baseResponse.data = reDetail.data;
        baseResponse.success = reDetail.success;
        baseResponse.responseCode = reDetail.responseCode;

  
    } catch (error) {
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;

  
    } finally {
        if(mysql){
            await mysql.release();

        }
    }
    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.updatePortfolios = async function(req,res){
    let mysql = null;
    const id = req.params.id;
    const params = {...req.body};
    const files = {...req.files};
    const rsCheck = await portfolioModel.getPortfoliosCheckUniqueFromDB(params,id);
   
    if (rsCheck.success == true){
        if(files){
            if(files.bannerFile){
                params.banner_image  = await portfolioModel.uploadImages(files.bannerFile,params,req.ref);
              
            }
            if(files.portfolioFile){
           
                params.cover_image  = await portfolioModel.uploadImages(files.portfolioFile,params,req.ref);
            }
            if(files.logoFile){
               
                params.logo_image  = await portfolioModel.uploadImages(files.logoFile,params,req.ref);
            }
            
           
        }
    try {
        await portfolioModel.deletePortfolioCategoryfromDB(id);
       let rsAdd =  await portfolioModel.updatePortfolios(params,id);
       let cat = [];
      
        
        if(params.categories){
            let cats = params.categories.split(',');
            try{
                cat =  await Promise.all(
                    cats.map(async (category_id) => {
                            console.log('category_id',category_id);
                       let ras =   await portfolioModel.insertPortfoliosCategoryFromDB(id,category_id);
                       return ras;
                       
                     })
                 );
            } catch (error) {
            }
           
        }
        
        baseResponse.message = rsAdd.message;
        baseResponse.data = cat;
        baseResponse.success = rsAdd.success;
        baseResponse.responseCode = rsAdd.responseCode;

  
    } catch (error) {
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;

  
    } finally {
        if(mysql){
            await mysql.release();

        }
    }
}
    return res.status(baseResponse.responseCode).json(baseResponse);
}
result.uploadImages = async function(req,res){
    const files = {...req.files};
    console.log('files',files);
    baseResponse.message = 'test';
    baseResponse.success = true;
    baseResponse.responseCode = 200;
    baseResponse.data = undefined;
    return res.status(baseResponse.responseCode).json(baseResponse);
}
export default result;
