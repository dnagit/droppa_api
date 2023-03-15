import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
const result = {} 
result.getAllFromDB = async function(params){
  let mysql = null;

  try {
      mysql = await mysqlConnector.connection();
      let select = 'widgets.*,widgets_area.slug'
      let from = '`widgets`';
      let limit = '';
      let where = '';
      let join = '`widgets_area`';
      let on = 'ON area_id = widgets_area.id';
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
      if(params.area_id){
          where = where?' and area_id ='+params.area_id:' WHERE area_id = '+params.area_id;
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

      baseResponse.message = `service widgets.getAllFromDB error : ${error}`;
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
    const from = '`widgets` n';
    let join = '`widgets_area`';
    let on = 'ON n.area_id = widgets_area.id';
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
      baseResponse.message = `service widgets.getNavigationsDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

  result.addWidgetsFromDB = async function(params){
    let table = '`widgets`';
    let select = 'COUNT(id) count'
    let from = '`widgets`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
     
      const data = await mysql.rawquery(`SELECT ${select} FROM `+from+`  WHERE area_id = ? `,[params.area_id]);
     
      const res = await mysql.rawquery(`INSERT INTO `+table+` (area_id,title,uri,short_description,created_by,created_at,ordering_count) 
      VALUES (?,?,?,?,?,?,?)`,
      [
        params.area_id,
        params.title,
        params.uri,
        params.short_description,
     
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
      baseResponse.message = `service widgets.addWidgetsFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteWidgetsfromDB = async function(id){
    let table = '`widgets`';
    let table_image = '`widgets_image`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        await mysql.rawquery(`DELETE FROM `+table_image+`  WHERE widget_id = ? ;`,[id]);
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service widgets.deleteNavigationsfromDB error : ${error}`;
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

result.updateWidgetseFromDb = async function(params,id){
    let table = '`widgets`';
    let mysql = null
    console.log('params',params);
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET title= ?,uri= ?,short_description= ?
        WHERE id= ?;`,[
            params.title,
            params.uri,
            params.short_description,
            id
            ]);
        
          baseResponse.data = res;
          baseResponse.success = true;
          baseResponse.message = 'updated';
          baseResponse.responseCode = 200;
  
      }catch(error){
        console.log('error',error);
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `service widgets.updateWidgetseFromDb error : ${error}`;
        baseResponse.responseCode = 400;
        
    
      }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
      return baseResponse;
}
result.updateWidgetOrderingFromDB = async function(params,id){
  let table = '`widgets`';
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
          baseResponse.message = `service widgets.updateWidgetOrderingFromDB error : ${error}`;
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