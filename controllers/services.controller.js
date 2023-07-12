import baseResponse from "../helpers/base-response.helper";
import servicesModel from "../model/services";
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
   
    let params = {...req.body}
   
    try{
       
     
        const rsDetail = await servicesModel.getAllFromDB(params);
        const rsAdd = await Promise.all(
            rsDetail.data.map(async (item) => {
               
                let content = await servicesModel.getAllContentFromDB(item.id);
                if(content.success){
                    item.content = content.data;
                }else{
                    item.content = [];
                }
                
                return item;
               // image.ordering_count = index;
                //await bannerModel.updateBanneImageOrderingFromDB(image,image.id);
              
            })
        );
      
       
        baseResponse.message = 'Query Done';
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        baseResponse.total = rsDetail.total;
        baseResponse.data =rsAdd;
       

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
result.updateservices = async (req, res)=>{
    let mysql = null;
    
    let params = {...req.body}
    let id = req.params.id;
    let cover_image = null;
    if(req.files){
         cover_image = {...req.files}
        
       // cover_image = JSON.parse(JSON.stringify(req.files)).blogFile;
    }
    
    const rsCheck = await servicesModel.checkServicesUniqueFromDB(params,id);
    if(rsCheck.success == true){

        if(cover_image.servicesFile){
            params.icon  = await servicesModel.uploadImages(cover_image.servicesFile,params,req.ref);
           
        }
    try{
   
        
        const rsDetail = await servicesModel.updateServices(id,params);
        let d = [];
        if(rsDetail.success){
            for(var i = 0; i <params.count_conent;i++){
                let content = {};
                
                content.id = params['content_id_'+i];
                content.blog_id = id;
                content.layout_id = params['content_layout_id_'+i];
                content.title = params['content_title_'+i];
                content.description = params['content_description_'+i];
                content.image = params['content_image_'+i];
               
                if(cover_image){
                    if(cover_image['content_contentFile_'+i]){
                        console.log('img',cover_image['content_contentFile_'+i]);
                    content.image  = await servicesModel.uploadImages(cover_image['content_contentFile_'+i],params,req.ref);
                            // if(cover_image.blogFile){
                    }
                }
              
                
                if(content.id > 0){
                    
                    const resData = await servicesModel.updateContent(content,content.id);
                }else{
                    const resData = await servicesModel.addContent(content);
                }
                d.push(i);
                
            }
            for(var i = 0; i <params.count_conent_remove;i++){
                   
                    
                const resData = await servicesModel.deleteContent(params['content_remove_'+i]);
                d.push('d-'+i);
                
            }

        }
        const rsContent = await Promise.all(d);
       
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

result.getservicesDetail = async (req,res) =>{
    const id = req.params.id;
    let mysql = null;
    try{
        const rsDetail = await servicesModel.getServicesDetailFromDB(id);
        if(rsDetail.data){
            
            let content = await servicesModel.getAllContentFromDB(rsDetail.data.id);
            rsDetail.data.contents = [];
            if(content.success === true){
                rsDetail.data.contents = content.data;
            }
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

result.addservices = async (req,res) =>{
    let params = {...req.body};
    let mysql = null;
    let cover_image = null;
    if(req.files){
        cover_image = {...req.files}
       
      // cover_image = JSON.parse(JSON.stringify(req.files)).blogFile;
   }

    const rsDetail = await servicesModel.checkServicesFromDB(params);
    if(rsDetail.success == true){
        if(cover_image.servicesFile){
            params.icon  = await servicesModel.uploadImages(cover_image.servicesFile,params,req.ref);
           
        }
        try{
            const rsAdd = await servicesModel.addServicesFromDB(params);
            if(rsAdd.success){
                let d = [];
                for(var i = 0; i <params.count_conent;i++){
                    let content = {};
                    
                    content.id = params['content_id_'+i];
                    content.blog_id = blog_id;
                    content.layout_id = params['content_layout_id_'+i];
                    content.title = params['content_title_'+i];
                    content.description = params['content_description_'+i];
                    content.image = params['content_image_'+i];
                   
                    if(cover_image){
                        if(cover_image['content_contentFile_'+i]){
                            
                        content.image  = await servicesModel.uploadImages(cover_image['content_contentFile_'+i],params,req.ref);
                                // if(cover_image.blogFile){
                        }
                    }
                   
                    
                    const resData = await blogModel.addContent(content);
                    d.push(i);
                    
                }
             
                const rsContent = await Promise.all(d);
            }
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

result.deleteservices = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await servicesModel.deleteServicesfromDB(id);
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