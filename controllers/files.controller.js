import baseResponse from "../helpers/base-response.helper";
import filesModel from '../model/files'
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
   
    let params = {...req.body}
   
   
    try{
       
     
        const rsDetail = await filesModel.getAllFromDB(params);
       
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
result.uploads = async function(req,res){
    let params = {...req.body}
    const files = {...req.files};
    let cover_image = null;
    if(files){
        cover_image =files
   
 
   }
   
   // console.log('uploads',params);
    if(cover_image){
       const res  = await filesModel.uploadImages(cover_image.images,params,req.ref);
       
       params.path = res.path;
       params.filename = res.filename;

       // console.log('params',params.cover_image);
    }
    //const rsDetail = await filesModel.uploadImages(files.images,params,req.ref);
    try{
        const rsAdd = await filesModel.addDataFromDB(params);
            baseResponse.data = rsAdd.data;
            baseResponse.success = rsAdd.success;
            baseResponse.message = rsAdd.message;
            baseResponse.responseCode = rsAdd.responseCode;
    }catch(error){
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;
    }
  
    return res.status(baseResponse.responseCode).json(baseResponse);

}
result.updateDetail = async function(req,res){
    //updateDetailFromDB
    let mysql = null;
   
    let params = {...req.body}
    let id = req.params.id
   // console.log('params',params);
   
    try{
       
     
        const rsDetail = await filesModel.updateDetailFromDB(params,id);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
      
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
result.updateOrder = async function(req,res){
    let mysql = null;
  
    const files = req.body;
    console.log('files',files);
    try {
        const rsAdd = await Promise.all(
            files.map(async (fil,index) => {
                fil.ordering_count = index;
               
                await filesModel.updateOrderFromDB(fil,fil.id);
              
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
    return res.status(baseResponse.responseCode).json(baseResponse);

}
result.deleteData = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    
    
    try {
        const reDetail = await filesModel.deleteDatafromDB(id);
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