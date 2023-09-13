import baseResponse from "../helpers/base-response.helper";
import pagesModel from "../model/pages";
import bannerModel from "../model/banner"
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
    let params = req.body;
    try{
   
        const rsDetail = await pagesModel.getAllFromDB(params);
        const rsAdd = await Promise.all(
            rsDetail.data.map(async (item) => {
               // console.log('rsAdd',item);
                item.contents = [];
                let content = await pagesModel.getAllContentFromDB(item.id);
               // console.log('content',content);
                if(content.success){
                    //fetch banner
                    let rss = await Promise.all(content.data.map(async (element) => {
                        let ele = await Promise.all(element.data.map(async (child) => {
                            if(child.type == 'banner'){
                                let params = {
                                    id: child.value
                                }
                                let banner = await bannerModel.getimageAllFromDB(params);
                                if(banner.success){
                                    child.files = banner.data;
                                }
                                return child;
                            }
                        }));
                        return content.data;
                    }));
        

                    item.contents = rss;
                    //fetch banner
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
        baseResponse.data = rsAdd;
       

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
result.updatepages = async (req, res)=>{
    let mysql = null;
    let params = {};
    params = {...req.body};
    let id = req.params.id;
    let cover_image = null;
    if(req.files){
        cover_image = {...req.files}
        
        // cover_image = JSON.parse(JSON.stringify(req.files)).blogFile;
    }
   
    if(cover_image){
        
        params.banner_image  = await pagesModel.uploadImages(cover_image.pagesFile,params,req.ref);
       
    }
    if(params.contents){
        params.contents = JSON.parse(params.contents);
    }
    if(params.contents_remove){
        params.contents_remove = JSON.parse(params.contents_remove);
    }
   
    try{
   
     
        const rsDetail = await pagesModel.updatePages(id,params);
        if(rsDetail.success){
            if(params.contents.length > 0){
                await Promise.all(
                    params.contents.map(async (value,index) => {
                        value.index = index;
                        if(cover_image){
                            if(cover_image['content_contentFile_'+index]){
                                
                                value.image  = await pagesModel.uploadImages(cover_image['content_contentFile_'+index],params,req.ref);
                                    // if(cover_image.blogFile){
                            }
                        }
                       
                        //cover_image = {...value.files}
                        if(value.id > 0){
                            console.log('contents-'+index,value);
                           await pagesModel.updateContent(value,value.id);
                        }else{
                            await pagesModel.addContent(id,value);
                        }   
                   
                         return value;
                    
                    })
              );
            }
            if(params.contents_remove.length > 0){
                await Promise.all(
                    params.contents_remove.map(async (value) => {
                       
                        await pagesModel.deleteContent(value);
                       
                      
                   
                         return value;
                    
                    })
              );
            }
             

        }
       
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

result.getpagesDetail = async (req,res) =>{
    const slug = req.body.slug;
  
    let mysql = null;
    try{
        const rsDetail = await pagesModel.getPagesDetailFromDB(slug);
        rsDetail.data.contents = [];
        let content = await pagesModel.getAllContentFromDB(rsDetail.data.id);
        if(content.success){
            //fetch banner
            let rsAdd = await Promise.all(content.data.map(async (element) => {
                let ele = await Promise.all(element.data.map(async (child) => {
                    if(child.type == 'banner'){
                        let params = {
                            id: child.value
                        }
                        let banner = await bannerModel.getimageAllFromDB(params);
                        if(banner.success){
                            child.files = banner.data;
                        }
                        return child;
                    }
                }));
                return content.data;
            }));
        
            rsDetail.data.contents = rsAdd[0];
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

result.addpages = async (req,res) =>{
    let params = {...req.body};
    let mysql = null;
    let cover_image = null;
    if(req.files){
        cover_image = {...req.files}
        
        // cover_image = JSON.parse(JSON.stringify(req.files)).blogFile;
    }
   
    if(cover_image){
        
        params.banner_image  = await pagesModel.uploadImages(cover_image.pagesFile,params,req.ref);
       
    }
    if(params.contents){
        params.contents = JSON.parse(params.contents);
    }
   
        try{
            const rsAdd = await pagesModel.addPagesFromDB(params);
            if(params.contents.length > 0){
                await Promise.all(
                    params.contents.map(async (value,index) => {
                        value.index = index;
                        if(cover_image){
                            if(cover_image['content_contentFile_'+index]){
                                
                                value.image  = await pagesModel.uploadImages(cover_image['content_contentFile_'+index],params,req.ref);
                                    // if(cover_image.blogFile){
                            }
                        }
                       
                        //cover_image = {...value.files}
                        if(value.id > 0){
                            
                           await pagesModel.updateContent(value,value.id);
                        }else{
                            await pagesModel.addContent(rsAdd.data.insertId,value);
                        }   
                   
                         return value;
                    
                    })
              );
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
      
    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.deletepages = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await pagesModel.deletePagesfromDB(id);
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