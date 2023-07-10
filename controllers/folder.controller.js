import baseResponse from "../helpers/base-response.helper";
import folderModel from '../model/folder';
import filesModel from '../model/files'
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
   
    let params = {...req.body}
    console.log('params',params);
    //let resData = {};

    try{
        params.folder_id =params.parent;
     
        const rsDetail = await folderModel.getAllFromDB(params);
        const rsDetailFiles = await filesModel.getAllFromDB(params);
        //const rsAdd = await Promise.all(rsDetail.data,rsDetailFiles.data);
       // resData.comblines = [...rsDetail.data,...rsDetailFiles.data]
        //resData.folders = rsDetail.data;
       // resData.files = rsDetail.files;


        
        let comblines = [...rsDetail.data,...rsDetailFiles.data]
        //console.log('comblines',comblines);
        //console.log('rsAdd',comblines);
       
        baseResponse.message = 'Query Done';
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        baseResponse.total = rsDetail.total;
        baseResponse.data = comblines;
       

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

result.addData = async (req,res) =>{
    let params = {...req.body};
    let mysql = null;
    
   
    //const rsDetail = await folderModel.checkBannerFromDB(params);
    //if(rsDetail.success == true){
        
        try{
            const rsAdd = await folderModel.addDataFromDB(params);
           
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
    /*}
    else{
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.message = rsDetail.message;
    }*/
    return res.status(baseResponse.responseCode).json(baseResponse);
}
result.updateDetail = async function(req,res){
    //updateDetailFromDB
    let mysql = null;
   
    let params = {...req.body}
    let id = req.params.id
   // console.log('params',params);
   
    try{
       
     
        const rsDetail = await folderModel.updateDetailFromDB(params,id);
       
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
  
    const folders = req.body;
 
    try {
        const rsAdd = await Promise.all(
            folders.map(async (item,index) => {
                item.ordering_count = index;
               if(item.types){
                await filesModel.updateOrderFromDB(item,item.id);
               }else{
                await folderModel.updateOrderFromDB(item,item.id);
               }
                
              
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
        const reDetail = await folderModel.deleteDatafromDB(id);
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