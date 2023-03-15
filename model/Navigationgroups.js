import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";

const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`navigations_groups`';
        let limit = '';
        let order_by = '';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
          order_by = 'ORDER BY '+params.order_by
        }
        
    let data = await mysql.rawquery(`SELECT * FROM `+from+` `+order_by+` `+limit+`;`,[]);
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
        
        error.message = `service Navigationgroups.getAllFromDB error : ${error}`;
        error.success = false;
        error.responseCode = 400;
        error.data = [];
        throw(error);
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return base;
}
result.updateNavigationgroups = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`navigations_groups`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
            title = ?,slug=?,update_at=?
              
              WHERE id= ?`,[
                params.title,
                params.slug,
                params.update_at,
                id,
              ]);
       
    
      
        if (res) {
            
            base.data = res;
            base.success = true;
        }else{
            
            base.data = undefined;
            base.success = false;
            

        }
    }catch(error){
        
        error.message = `service Navigationgroups.updateNavigationgroups error : ${error}`;
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

result.getNavigationgroupsDetailFromDB = async function(id){
    let mysql = null;
    const from = '`navigations_groups`';
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
      console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service Navigationgroups.getNavigationgroupsDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.checkNavigationgroupsFromDB = async function(params){
    let mysql = null;
    const from = '`navigations_groups`';
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE slug = ?`,[params.slug]);
        if(res[0]){
            if(res[0].slug == params.slug){
                baseResponse.data = res[0];
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
    baseResponse.message = `service Navigationgroups.checkNavigationgroupsFromDB error : ${error}`;
    baseResponse.responseCode = 400;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;
}
result.checkNavigationgroupsUniqueFromDB = async function(params,id){
  let mysql = null;
  const from = '`navigations_groups`';
  try{
    mysql = await  mysqlConnector.connection();
    const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE id != ? and slug = ?`,[id,params.slug]);
      if(res[0]){
          if(res[0].slug == params.slug){
              baseResponse.data = res[0];
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
  baseResponse.message = `service Navigationgroups.checkNavigationgroupsFromDB error : ${error}`;
  baseResponse.responseCode = 400;
  

}finally{
  if(mysql){
      await mysql.release();

  }
}
return baseResponse;
}



result.addNavigationgroupsFromDB = async function(params){
    let table = '`navigations_groups`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,created_by,created_at,update_at) VALUES (?,?,?,?,?)`,
      [
        params.title,
        params.slug,
        params.created_by,
        params.created_at,
        params.update_at
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service Navigationgroups.addNavigationgroupsFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
 
result.deleteNavigationgroupsfromDB = async function(id){
    let table = '`navigations_groups`';
    let table_nav = '`navigations`';
    let mysql = null;
    console.log('id',id);
    try{
        mysql = await  mysqlConnector.connection();
        await mysql.rawquery(`DELETE FROM `+table_nav+`  WHERE group_id = ? ;`,[id]);
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service Navigationgroups.deleteNavigationgroupsfromDB error : ${error}`;
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