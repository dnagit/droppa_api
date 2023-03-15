import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";

const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    
    try {
        mysql = await mysqlConnector.connection();
        let from = '`portfolios_category`';
        let limit = '';
        let order_by = '';
        let where = '';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
          order_by = 'ORDER BY '+params.order_by
        }
        if(params.is_active){
          where = where?' and is_active ='+params.is_active:' WHERE is_active = '+params.is_active;
        }
        
    let data = await mysql.rawquery(`SELECT * FROM `+from+` `+order_by+` `+where+` `+limit+`;`,[]);
    let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` `+where+`;`,[]);
    
      
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
        
        error.message = `portfolioCategory.getAllFromDB error : ${error}`;
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
result.updatePortfolioscategory = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`portfolios_category`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
            title = ?,slug = ?,is_active = ?
            WHERE id= ?`,[
                params.title,
                params.slug,
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
        
        error.message = `portfolioCategory.updatePortfolioscategory error : ${error}`;
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

result.getPortfolioscategoryDetail = async function(id){
    let mysql = null;
    const from = '`portfolios_category`';
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
      baseResponse.message = `portfolioCategory.getPortfolioscategoryDetail error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.checkPortfolioscategoryFromDB = async function(params){
    let mysql = null;
    const from = '`portfolios_category`';
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
    baseResponse.message = `portfolioCategory.checkPortfolioscategoryFromDB error : ${error}`;
    baseResponse.responseCode = 400;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;
}
result.checkPortfolioscategoryUniqueFromDB = async function(params,id){
  let mysql = null;
  const from = '`portfolios_category`';
  try{
    mysql = await  mysqlConnector.connection();
    const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE id!=? and slug = ?`,[id, params.slug]);
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
  baseResponse.message = `portfolioCategory.checkPortfolioscategoryFromDB error : ${error}`;
  baseResponse.responseCode = 400;
  

}finally{
  if(mysql){
      await mysql.release();

  }
}
return baseResponse;
}

result.addPortfolioscategoryFromDB = async function(params){
    let table = '`portfolios_category`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,is_active,created_by) VALUES (?,?,?,?) ;`,
      [
        params.title,
        params.slug,
        params.is_active,
        params.created_by,
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `portfolioCategory.addPortfolioscategoryFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deletePortfolioscategoryfromDB = async function(id){
    let table = '`portfolios_category`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `portfolioCategory.deletePortfolioscategoryfromDB error : ${error}`;
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

export default result;