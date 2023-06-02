import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
import fs from 'fs'
const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
   
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`banner`';
        let select = '*'
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
        
        error.message = `service banner.getAllFromDB error : ${error}`;
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
result.checkBannerFromDB = async function(params){
    let mysql = null;
    const from = '`banner`';
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
    baseResponse.message = `service banner.checkBannerFromDB error : ${error}`;
    baseResponse.responseCode = 400;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;
}
result.checkBannerUniqueFromDB = async function(params,id){
    let mysql = null;
    const from = '`banner`';
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE  id != ? and slug = ?`,[id,params.slug]);
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
    baseResponse.message = `service banner.checkBannerFromDB error : ${error}`;
    baseResponse.responseCode = 400;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;
}

result.addBannerFromDB = async function(params){
    let table = '`banner`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,created_by) VALUES (?,?,?) ;`,
      [
        params.title,
        params.slug,
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
      baseResponse.message = `service banner.addBannerFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
}
result.updateBanner = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`banner`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
            title = ?,slug = ?
            WHERE id= ?`,[
                params.title,
                params.slug,
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
        
        error.message = `service banner.updateBanner error : ${error}`;
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

result.deleteBannerfromDB = async function(id){
    let table = '`banner`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service banner.deleteBannerfromDB error : ${error}`;
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
              path = 'public/img/'+ref+'/banner/';
              savepath = 'public/img/'+ref+'/banner/';
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
            console.log('error',error);
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
result.addBannerImageFromDB = async function(params,id){
    let table = '`banner_images`';
    let mysql = null;
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = 'http://localhost:3005/';
    }
    try{
      mysql = await  mysqlConnector.connection();
      let max = await mysql.rawquery(`SELECT COUNT(id) count FROM ${table} WHERE  banner_id = ?;`,[id]);
      console.log(id,max);
      const res = await mysql.rawquery(`INSERT INTO `+table+` (banner_id,image,title,ordering_count,created_by) 
      VALUES (?,?,?,?,?)`,
      [
        id,
        params.image,
        params.title,
        max?max[0].count:0,
        params.created_by
        ]);
        let select = '*, CONCAT("'+host+'",image) src';
        const data = await mysql.rawquery(`SELECT ${select} FROM ${table} ORDER BY id DESC LIMIT 1 ;`);
       
        baseResponse.data = data[0];
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
        console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service banner.addBannerImageFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
}
result.getimageAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
        host = 'http://localhost:3005/';
    }
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`banner_images`';
        let select = '*, CONCAT("'+host+'",image) src'
        let limit = '';
        let order_by = 'ORDER BY ordering_count asc';
        let where = ' WHERE banner_id = '+params.id;
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
          order_by = 'ORDER BY '+params.order_by
        }
        if(params.keywords){
          where = where?' and (title LIKE "'+params.keywords+'%")':' WHERE (title LIKE "'+params.keywords+'%")';
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
        
        error.message = `service banner.getimageAllFromDB error : ${error}`;
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
result.updateBannerImage = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`banner_images`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
            title = ?,sub_title = ?,short_description=?,url=?,is_active=?
            WHERE id= ?`,[
                params.title,
                params.sub_title,
                params.short_description,
                params.url,
                params.is_active,
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
        
        error.message = `service banner.updateBannerImage error : ${error}`;
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
result.updateBanneImageOrderingFromDB = async function(params,id){
let table = '`banner_images`';
let mysql = null;

    try{
        mysql = await  mysqlConnector.connection();    
        const res = await mysql.rawquery(`UPDATE `+table+` SET ordering_count=? WHERE id=?;`
        ,[
            params.ordering_count,
            id,
            ]);
        
            baseResponse.data = res;
            baseResponse.success = true;
            baseResponse.message = 'updated';
            baseResponse.responseCode = 200;

        }catch(error){
        
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `service banner.updateBanneImageOrderingFromDB error : ${error}`;
        baseResponse.responseCode = 400;
        

        }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return baseResponse;
}
result.deleteBannerImagefromDB = async function(id){
    let table = '`banner_images`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM ${table}  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service banner.deleteBannerImagefromDB error : ${error}`;
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.responseCode = 200;
    }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
    return baseResponse;
}
export default result;