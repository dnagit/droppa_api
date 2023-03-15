import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
import fs from 'fs'
const result = {} 

result.getAllFromDB = async function(params){
    let mysql = null;
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = 'http://localhost:3001/';
    }

    try {
        mysql = await mysqlConnector.connection();
        let select = '*, CONCAT("'+host+'",image) src';
        let from = '`widgets_image`';
        let limit = '';
        let where = '';
        let order_by = '';
        if(params.offset != undefined  && params.limit != undefined){
  
            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
          order_by = 'ORDER BY '+params.order_by
        }
        if(params.widget_id){
            where = 'WHERE widget_id = '+params.widget_id;
        }
  
        let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+where+` `+order_by+` `+limit+`;`,[]);
        let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` `+where+`;`,[]);
        if (Array.isArray(data) && data.length > 0) {
            baseResponse.total = total[0].total;
            baseResponse.data = data;
            baseResponse.success = true;
            baseResponse.responseCode = 200;
        }else{
            
            baseResponse.data = [];
            baseResponse.success = false;
            baseResponse.responseCode = 200;
            
  
        }
    }catch(error){
  
        baseResponse.message = `service widgetsImage.getAllFromDB error : ${error}`;
        baseResponse.success = false;
        baseResponse.responseCode = 200;
        baseResponse.data = [];
    }finally{
        if(mysql){
            await mysql.release();
  
        }
    }
    return baseResponse;
  }


  result.getImageDetailFromDB = async function(id){
    let mysql = null;

    try {
        mysql = await mysqlConnector.connection();
        let host = process.env.URLPATH;
        if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
          host = 'http://localhost:3001/';
        }

        let select = '*, CONCAT("'+host+'",image) image'
        //fixed
        let from = 'widgets_image';
        let where = 'WHERE widget_id = '+id;

        let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+where+`;`,[]);
        let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` `+where+`;`,[]);
        if (Array.isArray(data) && data.length > 0) {
            baseResponse.total = total[0].total;
            baseResponse.data = data;
            baseResponse.success = true;
            baseResponse.responseCode = 200;
        }else{
            
            baseResponse.data = [];
            baseResponse.success = false;
            baseResponse.responseCode = 200;
            
  
        }
    }catch(error){
  
        baseResponse.message = `service widgetsImage.getImageDetailFromDB error : ${error}`;
        baseResponse.success = false;
        baseResponse.responseCode = 400;
        baseResponse.data = [];
    }finally{
        if(mysql){
            await mysql.release();
  
        }
    }
    return baseResponse;
  }
  result.addImageFromDB = async function(params,id){
    let table = '`widgets_image`';
    let mysql = null;
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = 'http://localhost:3001/';
    }
    try{
      mysql = await  mysqlConnector.connection();
      let max = await mysql.rawquery(`SELECT COUNT(id) count FROM widgets_image WHERE  widget_id = ?;`,[id]);
      const res = await mysql.rawquery(`INSERT INTO `+table+` (image_name,image,ordering_count,created_by,widget_id) 
      VALUES (?,?,?,?,?)`,
      [
        params.image_name,
        params.image,
        max[0].count,
        params.created_by,
        id
        ]);
        let select = '*, CONCAT("'+host+'",image) src';
        const data = await mysql.rawquery(`SELECT ${select} FROM widgets_image ORDER BY id DESC LIMIT 1 ;`);
        console.log('data',data[0]);
        baseResponse.data = data[0];
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service widgetsImage.addImageFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
  result.getPortfoliosimageCheckFromDB = async function(id){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM widgets_image WHERE  widget_id = ?;`,[id]);
        //limit images store
        if(res.length >= 20){
          baseResponse.data = undefined;
          baseResponse.success = false;
          baseResponse.message = 'limited to 20';
          baseResponse.responseCode = 200;
        }
        
        else{
            baseResponse.data = undefined;
            baseResponse.success = true;
            baseResponse.message = 'avaliable';
            baseResponse.responseCode = 200;
        }
        

    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service widgetsImage.getPortfoliosimageCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteAllImagesfromDB = async function(id){
    let table = '`widgets_image`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE widget_id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service widgetsImage.deleteAllImagesfromDB error : ${error}`;
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
result.deleteImagefromDB = async function(id){
    let table = '`widgets_image`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service widgetsImage.deleteImagefromDB error : ${error}`;
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
result.updateImageFromDB = async function(params,id){
    let table = '`widgets_image`';
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
        baseResponse.message = `service widgetsImage.updateImageFromDB error : ${error}`;
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
                path = 'public/img/'+ref+'/widget/';
                savepath = 'public/img/'+ref+'/widget/';
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
export default result;