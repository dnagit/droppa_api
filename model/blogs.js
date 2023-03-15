import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
import fs from 'fs'
const result = {} 
result.getAllFromDB = async function(params){
  let mysql = null;
  let host = process.env.URLPATH;
  if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
    host = 'http://localhost:3005/';
  }

  try {
   
      mysql = await mysqlConnector.connection();
      let select = 'blog.*, CONCAT("'+host+'",blog.cover_image) fullpath'
      let from = '`blog`';
      let limit = '';
      let where = '';
      let join_table1 = '';
      let on_table1 = '';
      let join = '';
      let on = '';
      let order_by = '';
      if(params.offset != undefined  && params.limit != undefined){

          limit = 'LIMIT '+params.offset+','+params.limit;
      }
      if(params.order_by){
        order_by = 'ORDER BY '+params.order_by
      }
      if(params.keywords){
          where += where?' and (blog.title LIKE "'+params.keywords+'%")':' WHERE (blog.title LIKE "'+params.keywords+'%")';
      }
      if(params.is_active){
        where += where?' and blog.is_active ='+params.is_active:' WHERE blog.is_active = '+params.is_active;
    }
      if(params.category_id){
         join_table1 = 'LEFT JOIN `blog_category_related` bc'
         on_table1 = 'ON blog.id=bc.blog_id';
         join = 'LEFT JOIN `blog_category` c';
         on = 'ON bc.category_id = c.id';
          where += where != ''?' and bc.category_id ='+params.category_id:' WHERE bc.category_id = '+params.category_id;
      }else if(params.cat_slug && params.category_id != '0'){
        join_table1 = 'LEFT JOIN `blog_category_related` bc'
        on_table1 = 'ON blog.id=bc.blog_id';
        join = 'LEFT JOIN `blog_category` c';
        on = 'ON bc.category_id = c.id';
          where += where?' and c.slug ="'+params.cat_slug+'"':' WHERE c.slug = "'+params.cat_slug+'"';
      }

      let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+join_table1+` `+on_table1+` `+join+` `+on+` `+where+` `+order_by+` `+limit+`;`,[]);
      let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` `+join_table1+` `+on_table1+` `+join+` `+on+` `+where+`;`,[]);
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
    console.log('error',error);
      baseResponse.message = `service Blogs.getAllFromDB error : ${error}`;
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
result.getAllContentFromDB = async function(id){
  let base = {};
  let mysql = null;
  let host = process.env.URLPATH;
  if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
    host = 'http://localhost:3005/';
  }

  try {
   
      mysql = await mysqlConnector.connection();
      let select = 'false as `show`,blog_content.*, CONCAT("'+host+'",blog_content.image) fullpath'
      let from = '`blog_content`';
      
      let where = ' WHERE blog_id='+id;
     
    
     
      

      let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+where+`;`,[]);
     
      if (Array.isArray(data) && data.length > 0) {
        
        base.data = data;
        base.success = true;
        base.responseCode = 200;
      }else{
          
        base.data = [];
        base.success = false;
        base.responseCode = 200;
          

      }
  }catch(error){
  
    base.message = `service Blogs.getAllContentFromDB error : ${error}`;
    base.success = false;
    base.responseCode = 400;
    base.data = [];
  }finally{
      if(mysql){
          await mysql.release();

      }
  }
  return base;
}

result.getBlogsDetailFromDB = async function(slug){
    let mysql = null;
    
    const from = 'blog b';
    let join = 'blog_category';
    let on = 'ON b.category_id = blog_category.id';
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
      host = 'http://localhost:3005/';

      // CONCAT("'+host+'",blog.cover_image) fullpath
    }
    let select = 'b.*, blog_category.title category_name, CONCAT("'+host+'",cover_image) cover_fullpath';
    try{
      mysql = await  mysqlConnector.connection();
      const data = await mysql.rawquery(`SELECT ${select} FROM `+from+` LEFT JOIN `+join+` `+on+` WHERE b.slug = ?`,[slug]);
      if (Array.isArray(data) && data.length > 0) {
      
        baseResponse.data = data[0];
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
      baseResponse.message = `service Blogs.getBlogsDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
result.addContent = async function(params){
  let table = '`blog_content`';
  let mysql = null;
  try{
    mysql = await  mysqlConnector.connection();
    const res = await mysql.rawquery(`INSERT INTO `+table+` (blog_id,layout_id,title,description,image) 
    VALUES (?,?,?,?,?)`,
    [
      params.blog_id,
      params.layout_id,
      params.title,
      params.description,
      params.image
     
      ]);
    
      baseResponse.data = res;
      baseResponse.success = true;
      baseResponse.message = 'added';
      baseResponse.responseCode = 200;

  }catch(error){
   
    baseResponse.data = undefined;
    baseResponse.success = false;
    baseResponse.message = `service Blogs.addBlogsFromDB error : ${error}`;
    baseResponse.responseCode = 200;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return baseResponse;

}
  result.addBlogsFromDB = async function(params){
    let table = '`blog`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (category_id,title,short_description,description,slug,is_active,cover_image,meta_title,meta_description,meta_keywords,ordering_count,created_by,created_at,updated_at) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        0,
        params.title,
        params.short_description,
        params.description,
        params.slug,
        params.is_active?1:0,
        params.cover_image?params.cover_image:null,
        params.meta_title,
        params.meta_description,
        params.meta_keywords,
        params.ordering_count?params.ordering_count:0,
        params.created_by,
        null,
        null,
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
     
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service Blogs.addBlogsFromDB error : ${error}`;
      baseResponse.responseCode = 200;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
  result.getBlogsCheckFromDB = async function(params){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM blog b WHERE b.slug = ?;`,[params.slug]);
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
      baseResponse.message = `service Blogs.getBlogsCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
  result.getBlogsCheckuniqueFromDB = async function(params,id){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM blog b WHERE id != ? and  b.slug = ?;`,[id,params.slug]);
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
      baseResponse.message = `service Blogs.getBlogsCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
  
result.deleteContent = async function(id){
  let table = '`blog_content` b';
  let mysql = null;
  try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE b.id = ? ;`,[id]);
      baseResponse.message = 'Delete Success';
      baseResponse.data = res;
      baseResponse.success = true;
      baseResponse.responseCode = 200;
  }catch(error){
      baseResponse.message = `service Blogs.deleteBlogsfromDB error : ${error}`;
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

result.deleteBlogsfromDB = async function(id){
    let table = '`blog` b';
    let table_content = '`blog_content` bc';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res_content = await mysql.rawquery(`DELETE FROM `+table_content+`  WHERE bc.blog_id = ? ;`,[id]);
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE b.id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service Blogs.deleteBlogsfromDB error : ${error}`;
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

result.updateBlogs = async function(params,id){
    let table = '`blog` b';
    let mysql = null
    console.log('blog_desc',params.description);   
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET b.category_id=?,b.title=?,b.short_description=?,b.description=?,b.slug=?,b.is_active=?,b.cover_image=?,b.meta_title=?,b.meta_description=?,b.meta_keywords=?,b.ordering_count=?,b.updated_at=? WHERE b.id =?;`
        ,[
            0,
            params.title,
            params.short_description,
            params.description,
            params.slug,
            params.is_active,
            params.cover_image?params.cover_image:null,
            params.meta_title,
            params.meta_description,
            params.meta_keywords,
            params.ordering_count?params.ordering_count:0,
           null,
            id,
            ]);
        
          baseResponse.data = res;
          baseResponse.success = true;
          baseResponse.message = 'updated';
          baseResponse.responseCode = 200;
  
      }catch(error){
        console.log('error',error);
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `service updateBlogs.updateBlogs error : ${error}`;
        baseResponse.responseCode = 400;
        
    
      }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
      return baseResponse;
    }

result.updateContent = async function(params,id){
  let table = '`blog_content` b';
  let mysql = null

  try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`UPDATE `+table+` SET b.layout_id=?,b.title=?,b.description=?,b.image=? WHERE b.id =?;`
      ,[
          params.layout_id,
          params.title,
          params.description,
          params.image,
          id,
          ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'updated';
        baseResponse.responseCode = 200;

    }catch(error){
      console.log('error',error);
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service updateBlogs.updateBlogs error : ${error}`;
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
            path = 'public/img/'+ref+'/blog/';
            savepath = 'public/img/'+ref+'/blog/';
            
        }
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        let now = Date.now();
        let filename  = now+'-'+cover_image.name.replace(/\s+/g,'-')
        let  uploadPath = path+filename;
       
        console.log('uploadPath',uploadPath);
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


result.getBlogCategoryFromDB  =  async function(id){
  let mysql = null;
  let data = [];
  let select = 'blog_category_related.*, c.title, c.slug';
  let from = '`blog_category_related`';
  let left_join = 'LEFT JOIN `blog_category` c ON blog_category_related.category_id = c.id';
  try{   
    mysql = await  mysqlConnector.connection();
    
    data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+left_join+`  WHERE blog_id = ?;`,[id]);

    
  }catch(error){
    console.log('error',error);
  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return data;
}
result.insertBlogCategoryFromDB  = async function(blog_id,category_id){
  let table = '`blog_category_related`';
  let base = {};
  let mysql = null;
  try{
    mysql = await  mysqlConnector.connection();
    const res = await mysql.rawquery(`INSERT INTO `+table+` (blog_id,category_id) 
    VALUES (?,?)`,
    [
      blog_id,
      category_id
    ]);
    
      base.data = res;
      base.success = true;
      base.message = 'added';
      base.responseCode = 200;

  }catch(error){
    console.log('insertBlogCategoryFromDB',error);
    base.data = undefined;
    base.success = false;
    base.message = `blog.insertBlogCategoryFromDB error : ${error}`;
    base.responseCode = 200;
    

  }finally{
    if(mysql){
        await mysql.release();

    }
  }
  return base;

}
result.deleteBlogCategoryfromDB = async function(blog_id){
  let table = '`blog_category_related`';
  
  let mysql = null;
  let base = {};
  try{
      mysql = await  mysqlConnector.connection();
      
      const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE blog_id = ? ;`,[blog_id]);
     
      base.message = 'Delete Success';
      base.data = res;
      base.success = true;
      base.responseCode = 200;
  }catch(error){
    console.log('error',error);
    base.message = `blog.deleteBlogCategoryfromDB error : ${error}`;
      base.data = undefined;
      base.success = false;
      base.responseCode = 400;
  }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
  return base;
}
export default result;