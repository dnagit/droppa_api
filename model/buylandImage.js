import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
const result = {} 

result.getAllFromDB = async function(params){
    let mysql = null;

    try {
        mysql = await mysqlConnector.connection();
        let select = '*';
        let from = 'buyland_image`';
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
            where = 'WHERE buyland_id = '+params.buyland_id;
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
  
        baseResponse.message = `BuylandImage.getAllFromDB error : ${error}`;
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


  result.getBuylandImageDetailFromDB = async function(id){
    let mysql = null;

    try {
        mysql = await mysqlConnector.connection();
        let select = '*';
        let from = 'buyland_image`';
        let where = 'WHERE buyland_id = '+id;
  
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
  
        baseResponse.message = `BuylandImage.getBuylandImageDetailFromDB error : ${error}`;
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
  result.addBuylandImageFromDB = async function(params,id){
    let table = '`buyland_image`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (image_name,image,created_by,buyland_id) 
      VALUES (?,?,?,?)`,
      [
        params.image_name,
        params.image,
        params.created_by,
        id
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `BuylandImage.addBuylandImageFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
  result.getBuylandImageCheckFromDB = async function(id){
    let mysql = null;
    let table = '`buyland_image`';
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM `+table+` WHERE  buyland_id = ?;`,[id]);
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
      baseResponse.message = `BuylandImage.getBuylandImageCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteAllBuylandimage = async function(id){
    let table = '`buyland_image`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE buyland_id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `BuylandImage.deleteAllBuylandimage error : ${error}`;
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
result.deleteBuylandImagefromDB = async function(id){
    let table = '`buyland_image`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `BuylandImage.deleteBuylandImagefromDB error : ${error}`;
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
result.updateBuylandImageFromDB = async function(params,id){
    let table = '`buyland_image`';
    let mysql = null
    try{
        mysql = await  mysqlConnector.connection();    
        const res = await mysql.rawquery(`UPDATE `+table+` SET image_name=?,image=?,buyland_id=? WHERE id =?;`
        ,[
            params.image_name,                
            params.image,
            params.buyland_id,
            id,
            ]);
        
          baseResponse.data = res;
          baseResponse.success = true;
          baseResponse.message = 'updated';
          baseResponse.responseCode = 200;
  
      }catch(error){
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `service BuylandImage.updateBuylandImageFromDB error : ${error}`;
        baseResponse.responseCode = 400;
        
    
      }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
      return baseResponse;
    }

export default result;