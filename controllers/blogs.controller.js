import baseResponse from "../helpers/base-response.helper";
import mysqlConnector from "../db/mysql-connector";
import blogModel from "../model/blogs"
const result = {};
import fs from 'fs'




result.getAll = async (req, res)=>{
    let mysql = null;
    const params = req.body;
   
    try{
        const rsDetail = await blogModel.getAllFromDB(params);
        const rsAdd = await Promise.all(
            rsDetail.data.map(async (item) => {
                let content = await blogModel.getAllContentFromDB(item.id);
                if(content.success){
                    item.content = content.data;
                }else{
                    item.content = [];
                }
                item.categories = await blogModel.getBlogCategoryFromDB(item.id);
                item.cats =  item.categories;
               
                return item;
               // image.ordering_count = index;
                //await bannerModel.updateBanneImageOrderingFromDB(image,image.id);
              
            })
        );
        console.log('rsAdd',rsAdd);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = rsDetail.responseCode;
        baseResponse.data = rsAdd;
        return res.status(baseResponse.responseCode).json(baseResponse);

    }catch(error){
        
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

result.getBlogsDetail = async (req,res)=>{
    const slug = req.params.slug;
    let mysql = null; 
    try{
        let rst = await blogModel.getBlogsDetailFromDB(slug);
        if(rst.data){
            rst.data.categories = await blogModel.getBlogCategoryFromDB(rst.data.id);
            let content = await blogModel.getAllContentFromDB(rst.data.id);
            rst.data.contents = [];
            if(content.success === true){
                rst.data.contents = content.data;
            }
            //console.log('content',content);
           // rsDetail.data.content = await blogModel.getAllContentFromDB(rsDetail.data.id);
        }
        baseResponse.data = rst.data;
        baseResponse.success = rst.success;
        baseResponse.message = rst.message;
        baseResponse.responseCode = rst.responseCode;
    }catch(error){
        console.log('error',error);
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

result.addBlogs = async (req,res) =>{
    let params  = {...req.body};
    let cover_image = null;
    if(req.files){
         cover_image = {...req.files}
    
  
    }
    
    let mysql = null;

    
    try{
        const rsDetail = await blogModel.getBlogsCheckFromDB(params);
        if (rsDetail.success == true){
            if(cover_image){
                params.cover_image  = await blogModel.uploadImages(cover_image.blogFile,params,req.ref);
               // console.log('params',params.cover_image);
            }
            const rsAdd = await blogModel.addBlogsFromDB(params);
            const blog_id = rsAdd.data.insertId;
            if(rsAdd.success){
                console.log('count',params.count_conent)
                try{
                    let d = [];

                    let cat = [];
                    if(params.categories){
                        let cats = params.categories.split(',');
                        try{
                            cat =  await Promise.all(
                                cats.map(async (category_id) => {
                                      
                                let ras =   await blogModel.insertBlogCategoryFromDB(rsAdd.data.insertId,category_id);
                                return ras;
                                
                                })
                            );
                        } catch (error) {
                        }
                    
                    }
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
                                
                            content.image  = await blogModel.uploadImages(cover_image['content_contentFile_'+i],params,req.ref);
                                    // if(cover_image.blogFile){
                            }
                        }
                       
                        
                        const resData = await blogModel.addContent(content);
                        d.push(i);
                        
                    }
                 
                    const rsContent = await Promise.all(d,cat);
                    baseResponse.message = rsAdd.message;
                    baseResponse.data = rsContent;
                    baseResponse.success = rsAdd.success;
                    baseResponse.responseCode = rsAdd.responseCode;
                } catch (error) {    
                    console.log('error',error);
                    baseResponse.message = error.message;
                    baseResponse.success = error.success;
                    baseResponse.responseCode = error.responseCode;
                    baseResponse.data = undefined;
                }
                
            }else{
                console.log('error',error);
                baseResponse.message = 'บันทึกไม่สำเร็จ';
                baseResponse.success = false;
                baseResponse.responseCode = 200;
                baseResponse.data = undefined;
            }
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

result.deleteBlogs = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await blogModel.deleteBlogsfromDB(id);
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

result.updateBlogs = async function(req,res){
    let mysql = null;
    //const par = JSON.parse(JSON.stringify(req.body));
  


   
    
    const id = req.params.id;
    const params  = {...req.body};
    let cover_image = null;
    //console.log('params',params);
    //console.log('file',req.files);
   
    if(req.files){
         cover_image = {...req.files}
        
       // cover_image = JSON.parse(JSON.stringify(req.files)).blogFile;
    }
    
    const rsCheck = await blogModel.getBlogsCheckuniqueFromDB(params,id);

    if (rsCheck.success == true){
       
        if(cover_image){
            if(cover_image.blogFile){
                params.cover_image  = await blogModel.uploadImages(cover_image.blogFile,params,req.ref);
            }
            
           // console.log('params',params.cover_image);
        }
       
       
    try {
        await blogModel.deleteBlogCategoryfromDB(id);
       
        const rsAdd = await blogModel.updateBlogs(params,id);
        
        if(rsAdd.success){
            
            try{
                let d = [];
                let cat = [];
                if(params.categories){
                    let cats = params.categories.split(',');
                    try{
                        cat =  await Promise.all(
                            cats.map(async (category_id) => {
                                   
                               let ras =   await blogModel.insertBlogCategoryFromDB(id,category_id);
                               return ras;
                               
                             })
                         );
                    } catch (error) {
                    }
                   
                }
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
                        content.image  = await blogModel.uploadImages(cover_image['content_contentFile_'+i],params,req.ref);
                                // if(cover_image.blogFile){
                        }
                    }
                  
                    
                    if(content.id > 0){
                        
                        const resData = await blogModel.updateContent(content,content.id);
                    }else{
                        const resData = await blogModel.addContent(content);
                    }
                    d.push(i);
                    
                }
                for(var i = 0; i <params.count_conent_remove;i++){
                       
                        
                    const resData = await blogModel.deleteContent(params['content_remove_'+i]);
                    d.push('d-'+i);
                    
                }
                const rsContent = await Promise.all(d,cat);
                baseResponse.message = rsAdd.message;
                baseResponse.data = rsAdd.rsContent;
                baseResponse.success = rsAdd.success;
                baseResponse.responseCode = rsAdd.responseCode;
            } catch (error) {    
                console.log('error',error);
                baseResponse.message = error.message;
                baseResponse.success = error.success;
                baseResponse.responseCode = error.responseCode;
                baseResponse.data = undefined;
            }
            
        }else{
            console.log('error',error);
            baseResponse.message = 'บันทึกไม่สำเร็จ';
            baseResponse.success = false;
            baseResponse.responseCode = 200;
            baseResponse.data = undefined;
        }
       

  
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

//uploadImage
result.uploadImages =  async(req,res) =>{
    
    let mysql = null;
    const id = req.params.id;
    const params = req.body;
    const reqUrl = `${req.protocol}://${req.get('host')}`;
    let ref = req.ref;
    console.log('reqUrl',process.env.DEVELOPMENT);

    console.log('files',req.files.images);
    console.log('data',req.ref);
    let images = req.files.images;
    
    //let path = `/var/www/html/uploadfiles/${ref}/blog/`;
    let path = req.body.path;
  
   // let path =  '';
    //path = "/var/www/html/uploadfiles/smk/blog/";
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
        path = 'public/'+ref+'/blog/';
    }
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    let  uploadPath = path+images.name;
    
    let upload = await images.mv(uploadPath, function(err) {
      
       console.log('err',err);
       
      });
     console.log('upload',upload); 
    try{
        
       /* const rsAdd = await blogModel.uploadImages(params,id);
        baseResponse.message = rsAdd.message;
        baseResponse.data = rsAdd.data;
        baseResponse.success = rsAdd.success;
        baseResponse.responseCode = rsAdd.responseCode;*/

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
    baseResponse.message = 'upload';
    baseResponse.data = [];
    baseResponse.success = true;
    baseResponse.responseCode =200;
    return res.status(baseResponse.responseCode).json(baseResponse);

}
export default result;
