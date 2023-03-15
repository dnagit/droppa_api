import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";

const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`groups`';
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
        
        error.message = `service groups.getAllFromDB error : ${error}`;
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

result.updatePermissions = async function(id,params){
  let mysql = null;
  let base = {};

  try {
      mysql = await mysqlConnector.connection();
      let table = '`groups`';
      const res = await mysql.rawquery(`UPDATE ${table} SET 
            title = ?,
            slug = ?
            
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
      
      error.message = `service groups.updateRoles error : ${error}`;
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

result.updateRoles = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`groups`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
              roles = ?
              
              WHERE id= ?`,[
                JSON.stringify(params),
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
        
        error.message = `service groups.updateRoles error : ${error}`;
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

result.getPermissionsDetailFromDB = async function(id){
    let mysql = null;
    const from = '`groups`';
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
      baseResponse.message = `service groups.getPermissionsDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.checkPermissionsFromDB = async function(params){
    let mysql = null;
    const from = '`groups`';
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
    console.log('error',error);
    baseResponse.data = undefined;
    baseResponse.success = false;
    baseResponse.message = `service groups.checkPermissionFromDB error : ${error}`;
    baseResponse.responseCode = 400;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;
}
result.checkPermissionsUniqueFromDB = async function(params,id){
  let mysql = null;
  const from = '`groups`';
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
  console.log('errpr',error);
  baseResponse.data = undefined;
  baseResponse.success = false;
  baseResponse.message = `service groups.checkPermissionFromDB error : ${error}`;
  baseResponse.responseCode = 400;
  

}finally{
  if(mysql){
      await mysql.release();

  }
}
return baseResponse;
}


result.addPermissionsFromDB = async function(params){
    let table = '`groups`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,types) VALUES (?,?,?)`,
      [
        params.title,
        params.slug,
        params.types?params.types:'admin'
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('addPermissionFromDB',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service groups.addPermissionFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deletePermissionsfromDB = async function(id){
    let table = '`groups`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service groups.deletePermissionsfromDB error : ${error}`;
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