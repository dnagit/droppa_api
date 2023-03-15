import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
const result = {} 
result.getAllFromDB = async function(params){
  let mysql = null;
  let base = {};
  
  try {
      mysql = await mysqlConnector.connection();
      const from = '`blog_category`';

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
          base.responseCode = 200;
      }else{
          base.total = 0;
          base.data = [];
          base.success = false;
          base.responseCode = 200;
          

      }
  }catch(error){
      rsDetail.message = `service BlogsCategory.getAllFromDB error : ${error}`;
      rsDetail.success = false;
      base.data = [];
      rsDetail.responseCode = 400;
  }finally{
      if(mysql){
          await mysql.release();

      }
  }
  return base;
}

result.getBlogsCategoryDetailFromDB = async function(id){
    let mysql = null;
    const from = '`blog_category`';
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
      baseResponse.message = `service BlogsCategory.getBlogsCategoryDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.addBlogsCategoryFromDB = async function(params){
    let table = '`blog_category`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,is_active,ordering_count,parent,created_by,created_at,updated_at) 
      VALUES (?,?,?,?,?,?,?,?)`,
      [
        params.title,
        params.slug,  
        params.is_active,
        params.ordering_count,
        params.parent,
        params.created_by,
        params.created_at,
        params.updated_at,
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service BlogsCategory.addBlogsCategoryFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
result.getBlogsCategoryCheckFromDB = async function(params){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM blog_category b WHERE b.slug = ?;`,[params.slug]);
        if(res.length > 0){
          baseResponse.data = undefined;
          baseResponse.success = false;
          baseResponse.message = 'slug is already used';
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
      baseResponse.message = `service BlogsCategory.getBlogsCategoryCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
  result.getBlogsCategoryCheckuniqueFromDB = async function(params,id){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM blog_category b WHERE id != ? and  b.slug = ?;`,[id,params.slug]);
        if(res.length > 0){
          baseResponse.data = undefined;
          baseResponse.success = false;
          baseResponse.message = 'slug is already used';
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
      baseResponse.message = `service BlogsCategory.getBlogsCategoryCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
result.deleteBlogsCategoryfromDB = async function(id){
    let table = '`blog_category` b';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE b.id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service BlogsCategory.deleteBlogsCategoryfromDB error : ${error}`;
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

result.updateBlogsCategoryfromDB = async function(params,id){
    let table = '`blog_category` b';
    let mysql = null
    try{

        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET b.title=?,b.slug=?,b.is_active=?,b.ordering_count=?,b.parent=?,b.updated_at=?
        WHERE b.id=?;`,[
          params.title,
          params.slug,  
          params.is_active,
          params.ordering_count,
          params.parent,
          params.updated_at,
          params.id,
          ]);
        
          baseResponse.data = res;
          baseResponse.success = true;
          baseResponse.message = 'updated';
          baseResponse.responseCode = 200;
  
      }catch(error){
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `service BlogsCategory.updateBlogsCategory error : ${error}`;
        baseResponse.responseCode = 400;
        
    
      }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
      return baseResponse;
    }

export default result;