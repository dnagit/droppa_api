import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
import fs from 'fs'
const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = process.env.URLPATHLOCAL
    }
    try {
        mysql = await mysqlConnector.connection();
        const from = '`pages`';
        let limit = '';
        let order_by = '';
        let select = '*, CONCAT("'+host+'",banner_image) fullpath';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
          order_by = 'ORDER BY '+params.order_by
        }
        
    let data = await mysql.rawquery(`SELECT ${select} FROM `+from+` `+order_by+` `+limit+`;`,[]);
    let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+`;`,[]);
    
      
        if (Array.isArray(data) && data.length > 0) {
            base.total = total[0].total;
            base.data = data;
            base.success = true;
        }else{
            base.total = 0;
            base.data = [];
            base.success = false;
            

        }
    }catch(error){
        
        error.message = `service pages.getAllFromDB error : ${error}`;
        error.success = false;
        error.responseCode = 400;
        throw(error);
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return base;
}
result.updatePages = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`pages`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
            title = ?,slug = ?,short_description=?,description = ?, is_active=?, banner_image=?,meta_title = ?,meta_description = ?,meta_keywords = ?
              
            WHERE id= ?`,[
                params.title,
                params.slug,
                params.short_description,
                params.description,
                params.is_active,
                params.banner_image,
                params.meta_title,
                params.meta_description,
                params.meta_keywords,
                
                id
              ]);
       
    
      
        if (res) {
            
            base.data = res;
            base.success = true;
        }else{
            
            base.data = undefined;
            base.success = false;
            

        }
    }catch(error){
        
        error.message = `service Pages.updatePages error : ${error}`;
        error.success = false;
        error.responseCode = 400;
        throw(error);
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return base;
}

result.getPagesDetailFromDB = async function(slug){
    let mysql = null;
    const from = '`pages`';
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = process.env.URLPATHLOCAL
    }
    try{
      let select = '*, CONCAT("'+host+'",banner_image) fullpath';
      mysql = await  mysqlConnector.connection();
      const data = await mysql.rawquery(`SELECT ${select} FROM `+from+` WHERE slug = ?`,[slug]);
      if (Array.isArray(data) && data.length > 0) {
      
        baseResponse.data = data[0];
        baseResponse.success = true;
        baseResponse.message = 'Data Found';
        baseResponse.responseCode = 200;
      }else{
       
        baseResponse.data = {};
        baseResponse.success = false;
        baseResponse.message = 'Data not Found';
        baseResponse.responseCode = 200;
  
      }
    }catch(error){
      console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service pages.getPagesDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.checkPagesFromDB = async function(params){
    let mysql = null;
    const from = '`pages`';
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE slug = ?`,[params.slug]);
        if(res[0]){
            if(res[0].slug == params.slug){
                baseResponse.data = undefined;
                baseResponse.success = false;
                baseResponse.message = 'slug is already used';
                baseResponse.responseCode = 200;

            }
        }
        else{
            baseResponse.data = undefined;
            baseResponse.success = true;
            baseResponse.message = 'avaliable';
            baseResponse.responseCode = 200;
        }
    return baseResponse;
  }catch(error){
    baseResponse.data = undefined;
    baseResponse.success = false;
    baseResponse.message = `service pages.checkPagesFromDB error : ${error}`;
    baseResponse.responseCode = 400;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;
}


result.addPagesFromDB = async function(params){
    let table = '`pages`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,short_description,description,banner_image,is_active,meta_title,meta_description,meta_keywords,created_by) VALUES (?,?,?,?,?,?,?,?,?,?);`,
      [
        params.title,
        params.slug,
        params.short_description,
        params.description,
        params.banner_image,
        params.is_active,
        params.meta_title,
        params.meta_description,
        params.meta_keywords,
        params.created_by
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('error-page',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service pages.addPagesFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deletePagesfromDB = async function(id){
    let table = '`pages`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service pages.deletePagesfromDB error : ${error}`;
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.responseCode = 400;
    }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
    return baseResponse;
}
result.uploadImages = async function(cover_image,params,ref){
  let mysql = null
      
      try{
        let savepath =  params.savepath;
        let path = params.path;
        if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
            path = 'public/img/'+ref+'/pages/';
            savepath = 'public/img/'+ref+'/pages/';
        }
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        let now = Date.now();
        let filename  = now+'-'+cover_image.name.replace(/\s+/g,'-');
        let  uploadPath = path+filename;
         await cover_image.mv(uploadPath, function(err) {
       
            if(err){
              return '';
            }
            return savepath+filename;
          
          
         });
         
         return savepath+filename;
    
        }catch(error){
         
         /* baseResponse.data = undefined;
          baseResponse.success = false;
          baseResponse.message = `service updateBlogs.updateBlogs error : ${error}`;
          baseResponse.responseCode = 400;*/
          
          return '';
        }finally{
          if(mysql){
              await mysql.release();
      
          }
        }
        return '';
}

result.addContent = async function(page_id,params){
  let table = '`pages_content`';
  let mysql = null;
  try{
    mysql = await  mysqlConnector.connection();
    const res = await mysql.rawquery(`INSERT INTO `+table+` (page_id,group_id,component_id,component,data,ordering_count) 
    VALUES (?,?,?,?,?,?)`,
    [
      page_id,
      params.group_id,
      params.component_id,
      params.component,
      JSON.stringify(params.data),
      params.index
     
      ]);
    
      baseResponse.data = res;
      baseResponse.success = true;
      baseResponse.message = 'added';
      baseResponse.responseCode = 200;

  }catch(error){
    console.log('page-error',error);
    baseResponse.data = undefined;
    baseResponse.success = false;
    baseResponse.message = `service pages.addContent error : ${error}`;
    baseResponse.responseCode = 200;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;

}
result.updateContent = async function(params,id){
  let table = '`pages_content` p';
  let mysql = null

  console.log('params-update',params);
  try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`UPDATE `+table+` SET p.group_id=?, p.component_id=?, p.component=?, p.data=? WHERE p.id =?;`
      ,[
          params.group_id,
          params.component_id,
          params.component,
          JSON.stringify(params.data),
          id,
          ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'updated';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service pages.updateBlogs error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
}
result.deleteContent = async function(id){
  let table = '`pages_content` p';
  let mysql = null;
  try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE p.id = ? ;`,[id]);
      baseResponse.message = 'Delete Success';
      baseResponse.data = res;
      baseResponse.success = true;
      baseResponse.responseCode = 200;
  }catch(error){
      baseResponse.message = `service pages.deleteContent error : ${error}`;
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.responseCode = 400;
  }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
  return baseResponse;
} 

result.getAllContentFromDB = async function(id){
  let base = {};
  let mysql = null;
  let host = process.env.URLPATH;
  if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
    host = process.env.URLPATHLOCAL;
  }

  try {
   
      mysql = await mysqlConnector.connection();
      //let select = 'false as `show`,pages_content.*, CONCAT("'+host+'",pages_content.image) fullpath'
      let select = 'false as `show`,pages_content.*'
      let from = '`pages_content`';
      
      let where = ' WHERE page_id='+id;
     
    
     
      

      let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+where+` ORDER BY ordering_count ASC;`,[]);
     
      if (Array.isArray(data) && data.length > 0) {
        
        base.data = data;
        base.success = true;
        base.responseCode = 200;
      }else{
          
        base.data = [];
        base.success = false;
        base.responseCode = 200;
          

      }
  }catch(error){
  
    base.message = `service Blogs.getAllContentFromDB error : ${error}`;
    base.success = false;
    base.responseCode = 400;
    base.data = [];
  }finally{
      if(mysql){
          await mysql.release();

      }
  }
  return base;
}

export default result;