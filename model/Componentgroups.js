import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";

const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`components_group`';
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
        
        error.message = `service Componentgroups.getAllFromDB error : ${error}`;
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
result.updateComponentgroups = async function(id,params){
    let mysql = null;
    let base = {};

    try {
        mysql = await mysqlConnector.connection();
        let table = '`components_group`';
        const res = await mysql.rawquery(`UPDATE ${table} SET 
            title = ?,is_active=?
              
              WHERE id= ?`,[
                params.title,
                params.is_active,
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
        
        error.message = `service Componentgroups.updateComponentgroups error : ${error}`;
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


result.getComponentgroupsDetailFromDB = async function(id){
    let mysql = null;
    const from = '`components_group`';
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
      baseResponse.message = `service Componentgroups.getComponentgroupsDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.checkComponentgroupsFromDB = async function(params){
    let mysql = null;
    const from = '`components_group`';
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE title = ?`,[params.title]);
        if(res[0]){
            if(res[0].title == params.title){
                baseResponse.data = res[0];
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
    baseResponse.message = `service Componentgroups.checkComponentgroupsFromDB error : ${error}`;
    baseResponse.responseCode = 400;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;
}
result.checkComponentgroupsUniqueFromDB = async function(params,id){
  let mysql = null;
  const from = '`components_group`';
  try{
    mysql = await  mysqlConnector.connection();
    const res = await mysql.rawquery(`SELECT * FROM `+from+` WHERE id != ? and title = ?`,[id,params.title]);
      if(res[0]){
          if(res[0].title == params.title){
              baseResponse.data = res[0];
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
  baseResponse.message = `service Componentgroups.checkComponentgroupsFromDB error : ${error}`;
  baseResponse.responseCode = 400;
  

}finally{
  if(mysql){
      await mysql.release();

  }
}
return baseResponse;
}



result.addComponentgroupsFromDB = async function(params){
    let table = '`components_group`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,created_by) VALUES (?,?)`,
      [
        params.title,
        params.created_by
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service Componentgroups.addComponentgroupsFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
 
result.deleteComponentgroupsfromDB = async function(id){
  
    let table = '`components_group`';
    let table_nav = '`component`';
    let mysql = null;
    console.log('id',id);
    try{
        mysql = await  mysqlConnector.connection();
        //await mysql.rawquery(`DELETE FROM `+table_nav+`  WHERE group_id = ? ;`,[id]);
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = [];
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service Componentgroups.deleteComponentgroupsfromDB error : ${error}`;
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

result.updateComponentgroupsisDisplay = async function(id){
  let mysql = null;
  let base = {};

  try {
      mysql = await mysqlConnector.connection();
      let table = '`components_group`';
      const res = await mysql.rawquery(`UPDATE ${table} SET 
            is_display = ?
            WHERE id = ?`,[
              1,
              id,
            ]);
      //แสดงแค่platform เดียว
      const res_2 = await mysql.rawquery(`UPDATE ${table} SET 
            is_display= ?
            WHERE id != ?`,[
              0,
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
      
      error.message = `service Componentgroups.updateComponentgroups error : ${error}`;
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

export default result;