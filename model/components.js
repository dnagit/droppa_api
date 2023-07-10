import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
const result = {} 
result.getAllFromDB = async function(params){
  let mysql = null;

  try {
      mysql = await mysqlConnector.connection();
      let select = 'components.*,components_group.title as group_name'
      let from = '`components`';
      let limit = '';
      let where = '';
      let join = '`components_group`';
      let on = 'ON group_id = components_group.id';
      let order_by = '';
      if(params.offset != undefined  && params.limit != undefined){

          limit = 'LIMIT '+params.offset+','+params.limit;
      }
      if(params.order_by){
        order_by = 'ORDER BY '+params.order_by
      }
      if(params.group_id){
        where += where?' and group_id ='+params.group_id:' WHERE group_id = '+params.group_id;
      }

      let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` LEFT JOIN `+join+` `+on+` `+where+` `+order_by+` `+limit+`;`,[]);
      let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` `+where+`;`,[]);
      if (Array.isArray(data) && data.length > 0) {
        baseResponse.total = total[0].total;
          baseResponse.data = data;
          baseResponse.success = true;
          baseResponse.message = 'query done';
          baseResponse.responseCode = 200;
      }else{
          
          baseResponse.data = [];
          baseResponse.success = false;
          baseResponse.message = 'empty';
          baseResponse.responseCode = 200;
          

      }
  }catch(error){

      baseResponse.message = `service components.getAllFromDB error : ${error}`;
      baseResponse.success = false;
      baseResponse.responseCode = 400;
  }finally{
      if(mysql){
          await mysql.release();

      }
  }
  return baseResponse;
}

result.getComponentsDetailFromDB = async function(id){
    let mysql = null;
    const from = '`components` n';
    let join = '`components_group`';
    let on = 'ON n.group_id = components_group.id';
    try{
      mysql = await  mysqlConnector.connection();
      const data = await mysql.rawquery(`SELECT * FROM `+from+` LEFT JOIN `+join+` `+on+` WHERE n.id = ?`,[id]);
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
      baseResponse.message = `service components.getComponentsDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

  result.addComponentsFromDB = async function(params){
    let table = '`components`';
    let select = 'COUNT(id) count'
    let from = '`components`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
     
      const data = await mysql.rawquery(`SELECT ${select} FROM `+from+`  WHERE group_id = ? `,[params.group_id]);
      console.log('data',data);
      const res = await mysql.rawquery(`INSERT INTO `+table+` (group_id,title,is_active,component,short_description,data,created_by) 
      VALUES (?,?,?,?,?,?,?)`,
      [
        params.group_id,
        params.title,
        params.is_active,
        params.component,
        params.short_description,
        params.data,
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
      baseResponse.message = `service components.addComponentsFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteComponentsfromDB = async function(id){
    let table = '`components`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service components.deleteComponentsfromDB error : ${error}`;
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

result.updateComponentsfromDB = async function(params,id){
  console.log(params);
    let table = '`components`';
    let mysql = null
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET title= ?,group_id= ?,component= ?,short_description= ?,is_active= ?,data= ?
        WHERE id= ?;`,[
            params.title,
            params.group_id,
            params.component,
            params.short_description,
            params.is_active,
            params.data,
            id
            ]);
        
          baseResponse.data = res;
          baseResponse.success = true;
          baseResponse.message = 'updated';
          baseResponse.responseCode = 200;
  
      }catch(error){
       
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `service components.updateComponents error : ${error}`;
        baseResponse.responseCode = 400;
        
    
      }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
      return baseResponse;
}
result.updateComponentsOrderingFromDB = async function(params,id){
  let table = '`components`';
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
          baseResponse.message = `service components.updateComponentsOrderingFromDB error : ${error}`;
          baseResponse.responseCode = 400;
          
  
          }finally{
          if(mysql){
              await mysql.release();
  
          }
      }
      return baseResponse;
}

export default result;