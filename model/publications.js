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
      //let select = 'publications.*,c.title category_name,m.image_name,m.image';
      let select = 'publications.*, CONCAT("'+host+'",publications.cover_image) fullpath, CONCAT("'+host+'",publications.banner_image) fullbannerpath, CONCAT("'+host+'",publications.logo_image) fulllogopath';
      let from = '`publications`';
      let limit = '';
      let where = '';
     // let join_table1 = 'RIGHT JOIN `publications_image` m';
     /*LEFT JOIN (
    select 
       
        pim.property_id,
        pim.filename as imagefile,
        pim.seq
    from property_image pim
    where
		pim.is_active = 1  
   
     order by 
         pim.seq ASC
  	limit 0,1
	
  
) as pii on p.id = pii.property_id*/
     let join_table1 = '';
      let on_table1 = '';
      let join_table2 = '';
      let on_table2 = '';

      //let join_table1 = 'LEFT JOIN (SELECT portfolio_id, category_id FROM publications_category_related) pc  ON publications.id = pc.portfolio_id';
      //let on_table1 = '';
      
      let order_by = 'ORDER BY publications.id DESC';
      let group_by = '';
      if(params.offset != undefined  && params.limit != undefined){

          limit = 'LIMIT '+params.offset+','+params.limit;
      }
      if(params.order_by){
        order_by = 'ORDER BY '+params.order_by
      }
      if(params.keywords){
          where += where?' and (publications.title LIKE "'+params.keywords+'%")':' WHERE (publications.title LIKE "'+params.keywords+'%")';
      }
      if(params.is_active){
          where += where?' and publications.is_active ='+params.is_active:' WHERE publications.is_active = '+params.is_active;
      }
      if(params.not_cat_id){
        where += where?' and publications.category_id !='+params.not_cat_id:' WHERE publications.category_id != '+params.not_cat_id;
    }
      if(params.category_id){
         join_table1 = 'LEFT JOIN `publications_category_related` pc';
         on_table1 = 'ON publications.id=pc.portfolio_id';
         join_table2 = 'LEFT JOIN `publications_category` c';
         on_table2 = 'ON pc.category_id = c.id';
          where += where?' and pc.category_id ='+params.category_id:' WHERE pc.category_id = '+params.category_id;
      }else if(params.cat_slug && params.category_id != '0'){
        join_table1 = 'LEFT JOIN `publications_category_related` pc';
        on_table1 = 'ON publications.id=pc.portfolio_id';
        join_table2 = 'LEFT JOIN `publications_category` c';
       on_table2 = 'ON pc.category_id = c.id';
        where += where?' and c.slug ="'+params.cat_slug+'"':' WHERE c.slug = "'+params.cat_slug+'"';
      }

      let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+join_table1+` `+on_table1+` `+join_table2+` `+on_table2+` `+where+` `+order_by+` `+group_by+` `+limit+`;`,[]);
      console.log('data',data);
      let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` `+join_table1+` `+on_table1+` `+join_table2+` `+on_table2+` `+where+`;`,[]);
      if (Array.isArray(data) && data.length > 0) {
          baseResponse.total = total[0].total;
          baseResponse.data = data;
          baseResponse.success = true;
          baseResponse.responseCode = 200;
      }else{
          baseResponse.total = 0
          baseResponse.data = [];
          baseResponse.success = false;
          baseResponse.responseCode = 200;
          

      }
  }catch(error){
    console.log('err'.error)
      baseResponse.message = `publications.getAllFromDB error : ${error}`;
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

result.getpublicationsDetailFromDB = async function(slug){
  let host = process.env.URLPATH;
  if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
    host = 'http://localhost:3001/';
  }
    let mysql = null;
    let select = 'publications.*,publications.title, CONCAT("'+host+'",cover_image) cover_fullpath, CONCAT("'+host+'",banner_image) banner_fullpath, CONCAT("'+host+'",logo_image) logo_fullpath';
    let from = '`publications`';

    let join_table2 = '';
    let on_table2 = '';
    try{                                                
      mysql = await  mysqlConnector.connection();
      const data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+join_table2+` `+on_table2+` WHERE publications.slug = ?;`,[slug]);
     
      if (Array.isArray(data) && data.length > 0) {
        let portfolio = data[0];
        const prev = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+join_table2+` `+on_table2+` WHERE publications.is_active = 1 AND category_id != 4  AND publications.id < ? ORDER BY publications.id DESC LIMIT 1;`,[portfolio.id]);
        const next = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+join_table2+` `+on_table2+` WHERE publications.is_active = 1 AND category_id != 4 AND publications.id > ? ORDER BY publications.id ASC LIMIT 1;`,[portfolio.id]);
        
        portfolio.prev = {};
        portfolio.next = {};
        if (Array.isArray(prev) && prev.length > 0) {
          portfolio.prev = prev[0];
        }
        if (Array.isArray(next) && next.length > 0) {
          portfolio.next = next[0];
        }
       
        baseResponse.data = portfolio;
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
      baseResponse.message = `publications.getpublicationsDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

  result.addpublicationsFromDB = async function(params){
    let table = '`publications`';
    let mysql = null;
  
   
    
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,year,client,country,sub_title,short_description,title_2,description,meta_title,meta_description,meta_keywords,is_active,cover_image,banner_image,logo_image,created_by) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        params.title,
        params.slug,
        params.year,
        params.client,
        params.country,
        params.sub_title,
        params.short_description,
        params.title_2,
        params.description,
        params.meta_title,
        params.meta_description,
        params.meta_keywords,
        params.is_active,
        params.cover_image,
        params.banner_image,
        params.logo_image,
        params.created_by
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `publications.addpublicationsFromDB error : ${error}`;
      baseResponse.responseCode = 200;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
  result.getpublicationsCheckFromDB = async function(params){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM publications WHERE slug = ?;`,[params.slug]);
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
      baseResponse.message = `publications.getpublicationsCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
 
  result.getPublicationsCheckUniqueFromDB = async function(params,id){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM publications WHERE id!=? and slug = ?;`,[id, params.slug]);
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
      baseResponse.message = `publications.getpublicationsCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deletepublicationsfromDB = async function(id){
    let table = '`publications`';
    let table_image = '`publications_image`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        await mysql.rawquery(`DELETE FROM `+table_image+`  WHERE publications_id = ? ;`,[id]);
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
       
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
      console.log('error',error);
        baseResponse.message = `publications.deletepublicationsfromDB error : ${error}`;
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

result.updatePublications = async function(params,id){
    let table = '`publications`';
    
   

    let mysql = null
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET title=?,slug=?, year=?, client=?, country=?, sub_title=?, short_description=?, title_2=?, description=?, meta_title=?, meta_description=?,meta_keywords=?, cover_image=?,banner_image=?,logo_image=?,is_active=? WHERE id =?;`
        ,[
            params.title,
            params.slug,
            params.year,
            params.client,
            params.country,
            params.sub_title,
            params.short_description,
            params.title_2,
            params.description,
            params.meta_title,
            params.meta_description,
            params.meta_keywords,
            params.cover_image,
            params.banner_image,
            params.logo_image,
            params.is_active,
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
        baseResponse.message = `publications.updatepublications error : ${error}`;
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
                path = 'public/img/'+ref+'/publications/';
                savepath = 'public/img/'+ref+'/publications/';
            }
           
            if (!fs.existsSync(path)) {
              fs.mkdirSync(path);
            }
            let now = Date.now();
            let filename  = now+'-'+cover_image.name.replace(/\s+/g,'-');
            let  uploadPath = path+filename;
           
             await cover_image.mv(uploadPath, function(err) {
              console.log('cover_image',uploadPath);
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

export default result;