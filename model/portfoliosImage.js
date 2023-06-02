import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
import fs from 'fs'
const result = {} 

result.getAllFromDB = async function(params){
    let base = {};
    let mysql = null;
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = 'http://localhost:3005/';
    }

    try {
        mysql = await mysqlConnector.connection();
        let select = '*, CONCAT("'+host+'",image) src';
        let from = '`portfolios_image`';
        let limit = '';
        let where = '';
        let order_by = '';
        if(params.offset != undefined  && params.limit != undefined){
  
            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
          order_by = 'ORDER BY '+params.order_by
        }
        if(params.portfolio_id){
            where = 'WHERE portfolio_id = '+params.portfolio_id;
        }
  
        let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+where+` `+order_by+` `+limit+`;`,[]);
        let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` `+where+`;`,[]);
        if (Array.isArray(data) && data.length > 0) {
            base.total = total[0].total;
            base.data = data;
            base.success = true;
            base.responseCode = 200;
        }else{
            
          base.data = [];
          base.success = false;
          base.responseCode = 200;
            
  
        }
    }catch(error){
      console.log('error',error);
      base.message = `service PortfoliosImage.getAllFromDB error : ${error}`;
      base.success = false;
      base.responseCode = 200;
      base.data = [];
    }finally{
        if(mysql){
            await mysql.release();
  
        }
    }
    return base;
  }


  result.getPortfoliosImageDetailFromDB = async function(id){
    let mysql = null;

    try {
        mysql = await mysqlConnector.connection();
        let select = '*';
        let from = 'portfolios_image`';
        let where = 'WHERE portfolio_id = '+id;
  
        let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+where+` ;`,[]);
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
  
        baseResponse.message = `service PortfoliosImage.getPortfoliosImageDetailFromDB error : ${error}`;
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
  result.addPortfoliosimageFromDB = async function(params,id){
    let table = '`portfolios_image`';
    let mysql = null;
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = 'http://localhost:3005/';
    }
    try{
      mysql = await  mysqlConnector.connection();
      let max = await mysql.rawquery(`SELECT COUNT(id) count FROM portfolios_image WHERE  portfolio_id = ?;`,[id]);
      const res = await mysql.rawquery(`INSERT INTO `+table+` (image_name,image,ordering_count,created_by,portfolio_id) 
      VALUES (?,?,?,?,?)`,
      [
        params.image_name,
        params.image,
        max[0].count,
        params.created_by,
        id
        ]);
        let select = '*, CONCAT("'+host+'",image) src';
        const data = await mysql.rawquery(`SELECT ${select} FROM portfolios_image ORDER BY id DESC LIMIT 1 ;`);
        console.log('data',data[0]);
        baseResponse.data = data[0];
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service PortfoliosImage.addPortfoliosimageFromDB error : ${error}`;
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
      const res = await mysql.rawquery(`SELECT * FROM portfolios_image WHERE  portfolio_id = ?;`,[id]);
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
      baseResponse.message = `service PortfoliosImage.getPortfoliosimageCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteAllPortfoliosimagefromDB = async function(id){
    let table = '`portfolios_image`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE portfolio_id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service PortfoliosImage.deletePortfoliosimagefromDB error : ${error}`;
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
result.deletePortfoliosimagefromDB = async function(id){
    let table = '`portfolios_image`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service PortfoliosImage.deletePortfoliosimagefromDB error : ${error}`;
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
result.updatePortfoliosImageFromDB = async function(params,id){
    let table = '`portfolios_image`';
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
        baseResponse.message = `service PortfoliosImage.updatePortfoliosImageFromDB error : ${error}`;
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
                path = 'public/img/'+ref+'/portfolio/';
                savepath = 'public/img/'+ref+'/portfolio/';
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