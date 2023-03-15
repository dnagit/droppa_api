import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
const result = {} 
result.getAllFromDB = async function(params){
  let mysql = null;

  try {
      mysql = await mysqlConnector.connection();
      let select = 'navigations.*,navigations_groups.slug'
      let from = '`navigations`';
      let limit = '';
      let where = '';
      let join = '`navigations_groups`';
      let on = 'ON group_id = navigations_groups.id';
      let order_by = '';
      if(params.offset != undefined  && params.limit != undefined){

          limit = 'LIMIT '+params.offset+','+params.limit;
      }
      if(params.order_by){
        order_by = 'ORDER BY '+params.order_by
      }
      if(params.keywords){
          where = where?' and (title LIKE "'+params.keywords+'%")':' WHERE (title LIKE "'+params.keywords+'%")';
      }
      if(params.group_id){
          where = where?' and group_id ='+params.group_id:' WHERE group_id = '+params.group_id;
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

      baseResponse.message = `service navigations.getAllFromDB error : ${error}`;
      baseResponse.success = false;
      baseResponse.responseCode = 400;
  }finally{
      if(mysql){
          await mysql.release();

      }
  }
  return baseResponse;
}

result.getNavigationsDetailFromDB = async function(id){
    let mysql = null;
    const from = '`navigations` n';
    let join = '`navigations_groups`';
    let on = 'ON n.group_id = navigations_groups.id';
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
      baseResponse.message = `service navigations.getNavigationsDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

  result.addNavigationsFromDB = async function(params){
    let table = '`navigations`';
    let select = 'COUNT(id) count'
    let from = '`navigations`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
     
      const data = await mysql.rawquery(`SELECT ${select} FROM `+from+`  WHERE group_id = ? `,[params.group_id]);
      console.log('data',data);
      const res = await mysql.rawquery(`INSERT INTO `+table+` (group_id,title,uri,icon,parent,is_active,created_by,created_at,ordering_count) 
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        params.group_id,
        params.title,
        params.uri,
        params.icon,
        params.parent,
        params.is_active,
        params.created_by,
        params.created_at,
        data[0]?data[0].count:0,
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service navigations.addNavigationsFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteNavigationsfromDB = async function(id){
    let table = '`navigations`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service navigations.deleteNavigationsfromDB error : ${error}`;
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

result.updateNavigations = async function(params,id){
    let table = '`navigations`';
    let mysql = null
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET title= ?,uri= ?,icon= ?,parent= ?,is_active= ?,updated_at= ?
        WHERE id= ?;`,[
            params.title,
            params.uri,
            params.icon,
            params.parent,
            params.is_active,
            params.updated_at,
            id
            ]);
        
          baseResponse.data = res;
          baseResponse.success = true;
          baseResponse.message = 'updated';
          baseResponse.responseCode = 200;
  
      }catch(error){
       
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `service navigations.updateNavigations error : ${error}`;
        baseResponse.responseCode = 400;
        
    
      }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
      return baseResponse;
}
result.updateNavigationOrderingFromDB = async function(params,id){
  let table = '`navigations`';
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
          baseResponse.message = `service navigations.updateNavigationOrderingFromDB error : ${error}`;
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
            path = 'public/img/'+ref+'/navigation/';
            savepath = 'public/img/'+ref+'/navigation/';
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