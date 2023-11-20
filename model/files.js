import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
import fs from 'fs'
const result = {};
result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
        host = process.env.URLPATHLOCAL;
    }
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`files`';
        let select = 'files.*, files.name title, CONCAT("'+host+'",files.path) fullpath'
        let limit = '';
        let order_by = '';
        let where = '';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.folder_id != undefined){
            where += where?' and folder_id ='+params.folder_id:' WHERE folder_id='+params.folder_id;
        }
        if(params.order_by){
            order_by = 'ORDER BY '+params.order_by
          }
        
    let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+where+` `+order_by+` `+limit+`;`,[]);
    
    let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+`;`,[]);
    
      
        if (Array.isArray(data) && data.length > 0) {
            
           /* const result = await Promise.all(data.map(async(value)=>{
                //value = await this.getAllChildFromDB(value);
                return value;

            }));*/
            base.total = total[0].total;
            base.data = data;
            base.success = true;
        }else{
            base.total = 0;
            base.data = [];
            base.success = false;
            

        }
    }catch(error){
       
        error.message = `service files.getAllFromDB error : ${error}`;
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
result.addDataFromDB = async function(params){
    let mysql = null;
    let base = {};
    const table = '`files`';
    let ordering_count = 0;
    try{
        mysql = await mysqlConnector.connection();
        let data = await mysql.rawquery(`SELECT * FROM `+table+` WHERE folder_id=? ORDER BY ordering_count DESC;`,[params.folder_id]);
        if (Array.isArray(data) && data.length > 0) {
            ordering_count = data[0].ordering_count+1;
        }
        console.log('params-data',data);
        const res = await mysql.rawquery(`INSERT INTO `+table+` (folder_id,name,path,filename,filesize,mimetype,types,extension,created_by,ordering_count) VALUES (?,?,?,?,?,?,?,?,?,?) ;`,
        [
            params.folder_id,
            params.name,
            params.path,
            params.filename,
            params.filesize,
            params.mimetype,
            params.types,
            params.extension,
            params.created_by,
            ordering_count
        ]);
        base.data = res;
        base.success = true;
        base.message = 'added';
        base.responseCode = 200;

    }catch(error){
     
        error.message = `service files.addDataFromDB error : ${error}`;
        error.success = false;
        error.responseCode = 400;
        throw(error);
    }finally{
        if(mysql){
            await mysql.release()

        }
    }

    return base;

}
result.updateDetailFromDB = async function(params,id){
    let mysql = null;
    let base = {};
    const table = '`files`';
   
    try {
        mysql = await mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET alt_attribute=?,description=? WHERE id=?;`
        ,[
            params.alt_attribute,
            params.description,
            id,
        ]);
        base.data = res;
        base.message = 'Update Success';
        base.success = true;
        base.responseCode = 200;
        
    }catch(error){
        console.log('error',error);
        error.message = `service files.updateDetailFromDB error : ${error}`;
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
result.uploadImages = async function(cover_image,params,ref){
    let mysql = null
   
        try{
          let savepath =  params.savepath;
          let path = params.path;
         
          /*if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
              path = 'public/img/'+ref+'/storage/';
              savepath = 'public/img/'+ref+'/storage/';
          }*/
         
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
              let data = {}
              data.filename = filename;
              data.path = savepath+filename;
              return data
             // return savepath+filename;
            
            
           });
           let data = {}
              data.filename = filename;
              data.path = savepath+filename;
           return data;
      
          }catch(error){
            console.log('error',error);
           /* baseResponse.data = undefined;
            baseResponse.success = false;
            baseResponse.message = `service files.updateBlogs error : ${error}`;
            baseResponse.responseCode = 400;*/
            
            return '';
          }finally{
            if(mysql){
                await mysql.release();
        
            }
          }
          return '';
}
result.updateOrderFromDB = async function(params,id){
    let mysql = null;
    let base = {};
    const table = '`files`';
   
    try {
        mysql = await mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET ordering_count=? WHERE id=?;`
        ,[
            params.ordering_count,
            id,
        ]);
        
    }catch(error){
        //console.log('error',error);
        error.message = `service files.updateOrderFromDB error : ${error}`;
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
result.deleteDatafromDB = async function(id){
    let host = process.env.URLPATH;
    if(process.env.DEVELOPMENT === 'DEVELOPMENT'){
        host = process.env.URLPATHLOCAL;
    }
    let select = 'files.*, CONCAT("'+host+'",files.path) fullpath'
    let table = '`files`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
       
        let data = await mysql.rawquery(`SELECT `+select+` FROM `+table+` WHERE id=?;`,[id]);
        console.log('file-data',data);
        if (Array.isArray(data) && data.length > 0) {
            /*fs.unlink(data[0].path, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });*/
            
        }
        //fs.unlinkSync(filePath)
        const res = await mysql.rawquery(`DELETE FROM ${table}  WHERE id = ? ;`,[id]);
       
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service files.deleteDatafromDB error : ${error}`;
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.responseCode = 200;
    }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
    return baseResponse;
}
export default result;