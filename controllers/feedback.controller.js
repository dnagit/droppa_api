import baseResponse from "../helpers/base-response.helper";
import feedbackModel from "../model/feedback"
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
   
    let params = {...req.body}
   
    try{
       
     
        const rsDetail = await feedbackModel.getAllFromDB(params);
       
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
result.updateFeedback = async (req, res)=>{
    let mysql = null;
    
    let params = {...req.body}
    let id = req.params.id;
    let cover_image = null;
    if(req.files){
         cover_image = {...req.files}
        
       // cover_image = JSON.parse(JSON.stringify(req.files)).blogFile;
    }
    
   

    if(cover_image){
        params.cover_image  = await feedbackModel.uploadImages(cover_image.feedbackFile,params,req.ref);
        
    }
    try{
   
        
        const rsDetail = await feedbackModel.updateFeedback(id,params);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.total = undefined;
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

result.getFeedbackDetail = async (req,res) =>{
    const id = req.params.id;
    let mysql = null;
    try{
        const rsDetail = await feedbackModel.getFeedbackDetailFromDB(id);
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

result.addFeedback = async (req,res) =>{
    let params = {...req.body};
    let mysql = null;
    let cover_image = null;
    if(req.files){
        cover_image = {...req.files}
       
      // cover_image = JSON.parse(JSON.stringify(req.files)).blogFile;
   }

    
        if(cover_image){
            params.cover_image  = await feedbackModel.uploadImages(cover_image.feedbackFile,params,req.ref);
           
        }
        try{
            const rsAdd = await feedbackModel.addFeedbackFromDB(params);
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
   
  

    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.deleteFeedback = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await feedbackModel.deleteFeedbackfromDB(id);
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