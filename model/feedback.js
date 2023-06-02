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
        const from = '`feedback`';
        let select = '*, CONCAT("'+host+'",cover_image) fullpath'
        let limit = '';
        let order_by = 'ORDER BY id DESC';
        let where = '';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
          order_by = 'ORDER BY '+params.order_by
        }
        if(params.is_active){
            where = where?' and (is_active = '+params.is_active+')':' WHERE (is_active = '+params.is_active+')';
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
        
        error.comment = `service feedback.getAllFromDB error : ${error}`;
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
result.updateFeedback = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`feedback`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
            name = ?,cover_image = ?,comment = ?, is_active = ? 
            WHERE id= ?`,[
                params.name,
              
                params.cover_image,
                params.comment,        
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
            
        error.comment = `service feedback.updateFeedback error : ${error}`;
        error.success = false;
        error.responseCode = 200;
        throw(error);
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return base;
}

result.getFeedbackDetailFromDB = async function(id){
    let mysql = null;
    const from = '`feedback`';
    try{
      mysql = await  mysqlConnector.connection();
      const data = await mysql.rawquery(`SELECT * FROM `+from+` WHERE id = ?`,[id]);
      if (Array.isArray(data) && data.length > 0) {
      
        baseResponse.data = data;
        baseResponse.success = true;
        baseResponse.comment = 'Data Found';
        baseResponse.responseCode = 200;
      }else{
       
        baseResponse.data = {};
        baseResponse.success = false;
        baseResponse.comment = 'Data not Found';
        baseResponse.responseCode = 200;
  
      }
    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.comment = `service feedback.getFeedbackDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }



result.addFeedbackFromDB = async function(params){
    let table = '`feedback`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (name,cover_image,comment,is_active,created_by) VALUES (?,?,?,?,?) ;`,
      [
        params.name,
        
        params.cover_image?params.cover_image:'',
        params.comment,
        params.is_active,
        params.created_by
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.comment = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('err',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.comment = `service feedback.addFeedbackFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteFeedbackfromDB = async function(id){
    let table = '`feedback`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.comment = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.comment = `service Services.deleteFeedbackfromDB error : ${error}`;
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
            path = 'public/img/'+ref+'/feedback/';
            savepath = 'public/img/'+ref+'/feedback/';
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
          baseResponse.comment = `service updateBlogs.updateBlogs error : ${error}`;
          baseResponse.responseCode = 400;*/
          
          return '';
        }finally{
          if(mysql){
              await mysql.release();
      
          }
        }
        return '';
}
export default result;