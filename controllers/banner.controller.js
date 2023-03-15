import baseResponse from "../helpers/base-response.helper";
import bannerModel from "../model/banner"
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
   
    let params = {...req.body}
   
    try{
       
     
        const rsDetail = await bannerModel.getAllFromDB(params);
       
        baseResponse.message = 'Query Done';
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        baseResponse.total = rsDetail.total;
        baseResponse.data = rsDetail.data;
       

    }catch(error){
        baseResponse.total = 0;
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

result.addbanner = async (req,res) =>{
    let params = {...req.body};
    let mysql = null;
    

    const rsDetail = await bannerModel.checkBannerFromDB(params);
    if(rsDetail.success == true){
        
        try{
            const rsAdd = await bannerModel.addBannerFromDB(params);
            baseResponse.data = rsAdd.data;
            baseResponse.success = rsAdd.success;
            baseResponse.message = rsAdd.message;
            baseResponse.responseCode = rsAdd.responseCode;
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
    }
    else{
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.message = rsDetail.message;
    }
    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.updateBanner = async (req, res)=>{
    let mysql = null;
    
    let params = {...req.body}
    let id = req.params.id;
   
   
    
    const rsCheck = await bannerModel.checkBannerUniqueFromDB(params,id);
    if(rsCheck.success == true){

    try{
   
        
        const rsDetail = await bannerModel.updateBanner(id,params);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.total = undefined;
        baseResponse.data = rsDetail.data;
       

    }catch(error){
        console.log('error',error);
        baseResponse.total = 0;
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;
      
    }finally{
        if(mysql){
            await mysql.release();

        }

    }
}


    return res.status(baseResponse.responseCode).json(baseResponse);

}

result.deleteBanner = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await bannerModel.deleteBannerfromDB(id);
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

//image
result.addBannerImage = async (req,res) =>{
    let params = {...req.body};
    let mysql = null;
    let id = req.params.id;
    console.log('id',id);
    const files = {...req.files};
    const rsDetail = await bannerModel.uploadImages(files.images,params,req.ref);
    if(rsDetail){

        try{
            params.image = rsDetail;
            params.title = files.images.name.replace(/\s+/g,'-');;
            const rsAdd = await bannerModel.addBannerImageFromDB(params,id);
            baseResponse.data = rsAdd.data;
            baseResponse.success = rsAdd.success;
            baseResponse.message = rsAdd.message;
            baseResponse.responseCode = rsAdd.responseCode;
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
    }
    else{
       
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.message = rsDetail.message;
    }
    return res.status(baseResponse.responseCode).json(baseResponse);
}
result.getImageAll = async (req, res)=>{
    let mysql = null;
   
    let params = {...req.body}
    params.id = req.params.id;
   
    try{
       
     
        const rsDetail = await bannerModel.getimageAllFromDB(params);
       
        baseResponse.message = 'Query Done';
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        baseResponse.total = rsDetail.total;
        baseResponse.data = rsDetail.data;
       

    }catch(error){
        baseResponse.total = 0;
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
result.updateBannerImage = async (req, res)=>{
    let mysql = null;
    
    let params = {...req.body}
    let id = req.params.id;
   
    console.log('id',id);

    try{
   
        
        const rsDetail = await bannerModel.updateBannerImage(id,params);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.total = undefined;
        baseResponse.data = rsDetail.data;
       

    }catch(error){
        console.log('error',error);
        baseResponse.total = 0;
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
result.updateBanneImageOrdering = async function(req,res){
    let mysql = null;
    const id = req.params.id;
    const images = req.body;
    try {
        const rsAdd = await Promise.all(
            images.map(async (image,index) => {
                image.ordering_count = index;
                await bannerModel.updateBanneImageOrderingFromDB(image,image.id);
              
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
result.deleteBannerImage = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    
    try {
        const reDetail = await bannerModel.deleteBannerImagefromDB(id);
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
export default result;