import baseResponse from "../helpers/base-response.helper";
import mysqlConnector from "../db/mysql-connector";
import portfolioModel from "../model/portfoliosImage"
const result = {};

result.getAll = async(req,res)=>{
    let params = req.body;
    let mysql = null;
    try{
        const rsDetail = await portfolioModel.getAllFromDB(params);
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

result.getPortfoliosimageDetail = async(req,res)=>{
    const id = req.params.id;
    let mysql = null;
    try{
        const rsDetail = await portfolioModel.getPortfoliosImageDetailFromDB(id);
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
result.addPortfoliosimage = async (req,res) =>{
    const id = req.params.id;
    let params = {...req.body};
    let mysql = null;
    const files = {...req.files};
   // console.log('files',files);
    //console.log('params',params);
  

    
    try{
        const rsDetail = await portfolioModel.uploadImages(files.images,params,req.ref);
        if (rsDetail){
            params.image = rsDetail;
            params.image_name = files.images.name.replace(/\s+/g,'-');
            const rsAdd = await portfolioModel.addPortfoliosimageFromDB(params,id);
            baseResponse.data = rsAdd.data;
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

result.deletePortfoliosimage = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await portfolioModel.deletePortfoliosimagefromDB(id);
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

result.deleteAllPortfoliosimage = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await portfolioModel.deleteAllPortfoliosimagefromDB(id);
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
result.updatePortfoliosimageOrdering = async function(req,res){
    let mysql = null;
    const id = req.params.id;
    const images = req.body;
    try {
        const rsAdd = await Promise.all(
            images.map(async (image,index) => {
                image.ordering_count = index;
                await portfolioModel.updatePortfoliosImageFromDB(image,image.id);
              
            })
        );
        
        //const rsAdd = await portfolioModel.updatePortfoliosImageFromDB(params,id);
        baseResponse.message = rsAdd.message;
        baseResponse.data = rsAdd.data;
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

result.updatePortfoliosimage = async function(req,res){
    let mysql = null;
    const id = req.params.id;
    const params = req.body;
    try {
        const rsAdd = await portfolioModel.updatePortfoliosImageFromDB(params,id);
        baseResponse.message = rsAdd.message;
        baseResponse.data = rsAdd.data;
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

    return res.status(baseResponse.responseCode).json(baseResponse);
}
export default result;
