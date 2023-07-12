import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
import fs from 'fs'
const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = 'http://localhost:3005/';
    }
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`services_category`';
        let select = '*, CONCAT("'+host+'",icon) fullpath'
        let limit = '';
        let order_by = '';
        let where = '';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
          order_by = 'ORDER BY '+params.order_by
        }
        if(params.keywords){
          where = where?' and (title LIKE "'+params.keywords+'%")':' WHERE (title LIKE "'+params.keywords+'%")';
        }
        if(params.is_active){
          where = where?' and is_active ='+params.is_active:' WHERE is_active = '+params.is_active;
        }
        
    let data = await mysql.rawquery(`SELECT ${select}  FROM `+from+` ${where} `+order_by+` `+limit+`;`,[]);
    let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` ${where} ;`,[]);
    
      
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
        
        error.message = `service services.getAllFromDB error : ${error}`;
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
result.updateServices = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`services_category`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
            title = ?, slug=?,icon = ?,intro = ?, description = ?, is_active = ?, meta_title = ?, meta_description = ?, meta_keywords = ?
            WHERE id= ?`,[
                params.title,
                params.slug,
                params.icon,
                params.intro,
                params.description,
                params.is_active,
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
        
        error.message = `service Services.updateServices error : ${error}`;
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

result.getServicesDetailFromDB = async function(id){
    let mysql = null;
    const from = '`services_category`';
    try{
      mysql = await  mysqlConnector.connection();
      const data = await mysql.rawquery(`SELECT * FROM `+from+` WHERE id = ?`,[id]);
      if (Array.isArray(data) && data.length > 0) {
      
        baseResponse.data = data;
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
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service Services.getServicesDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.checkServicesFromDB = async function(params){
    let mysql = null;
    const from = '`services_category`';
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE slug = ?`,[params.slug]);
        if(res[0]){
            if(res[0].title == params.title){
                baseResponse.data = undefined;
                baseResponse.success = false;
                baseResponse.message = 'title is already used';
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
    baseResponse.message = `service Services.checkServicesFromDB error : ${error}`;
    baseResponse.responseCode = 400;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;
}
result.checkServicesUniqueFromDB = async function(params,id){
  let mysql = null;
  const from = '`services_category`';
  try{
    mysql = await  mysqlConnector.connection();
    const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE id != ? and slug = ?`,[id, params.slug]);
      if(res[0]){
          if(res[0].title == params.title){
              baseResponse.data = undefined;
              baseResponse.success = false;
              baseResponse.message = 'title is already used';
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
  baseResponse.message = `service Services.checkServicesFromDB error : ${error}`;
  baseResponse.responseCode = 400;
  

}finally{
  if(mysql){
      await mysql.release();

  }
}
return baseResponse;
}

result.addServicesFromDB = async function(params){
    let table = '`services_category`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,icon,intro,description,is_active,meta_title,meta_description,meta_keywords,created_by) VALUES (?,?,?,?,?,?,?,?,?,?) ;`,
      [
        params.title,
        params.slug,
        params.icon?params.icon:'',
        params.intro,
        params.description,
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
      console.log('err',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service Services.addServicesFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteServicesfromDB = async function(id){
    let table = '`services_category`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service Services.deleteServicesfromDB error : ${error}`;
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
            path = 'public/img/'+ref+'/services/';
            savepath = 'public/img/'+ref+'/services/';
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
result.addContent = async function(params){
  let table = '`services_content`';
  let mysql = null;
  try{
    mysql = await  mysqlConnector.connection();
    const res = await mysql.rawquery(`INSERT INTO `+table+` (services_id,layout_id,title,description,image) 
    VALUES (?,?,?,?,?)`,
    [
      params.blog_id,
      params.layout_id,
      params.title,
      params.description,
      params.image
     
      ]);
    
      baseResponse.data = res;
      baseResponse.success = true;
      baseResponse.message = 'added';
      baseResponse.responseCode = 200;

  }catch(error){
   
    baseResponse.data = undefined;
    baseResponse.success = false;
    baseResponse.message = `service Blogs.addBlogsFromDB error : ${error}`;
    baseResponse.responseCode = 200;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;

}
result.updateContent = async function(params,id){
  let table = '`services_content` b';
  let mysql = null

  try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`UPDATE `+table+` SET b.layout_id=?,b.title=?,b.description=?,b.image=? WHERE b.id =?;`
      ,[
          params.layout_id,
          params.title,
          params.description,
          params.image,
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
      baseResponse.message = `service updateBlogs.updateBlogs error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
}
result.deleteContent = async function(id){
  let table = '`services_content` b';
  let mysql = null;
  try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE b.id = ? ;`,[id]);
      baseResponse.message = 'Delete Success';
      baseResponse.data = res;
      baseResponse.success = true;
      baseResponse.responseCode = 200;
  }catch(error){
      baseResponse.message = `service Blogs.deleteBlogsfromDB error : ${error}`;
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
    host = 'http://localhost:3005/';
  }

  try {
   
      mysql = await mysqlConnector.connection();
      let select = 'false as `show`,services_content.*, CONCAT("'+host+'",services_content.image) fullpath'
      let from = '`services_content`';
      
      let where = ' WHERE services_id='+id;
     
    
     
      

      let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+where+`;`,[]);
      
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