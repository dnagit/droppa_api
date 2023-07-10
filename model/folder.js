import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`files_folder`';
        let limit = '';
        let order_by = '';
        let where = '';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.parent != undefined){
            where += where?' and parent ='+params.parent:' WHERE parent='+params.parent;
        }
        if(params.order_by){
            order_by = 'ORDER BY '+params.order_by
          }
        
    let data = await mysql.rawquery(`SELECT * FROM `+from+` `+where+` `+order_by+` `+limit+`;`,[]);
    
    let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+`;`,[]);
    
      
        if (Array.isArray(data) && data.length > 0) {
            const result = await Promise.all(data.map(async(value)=>{
                //value = await this.getAllChildFromDB(value);
                return value;

            }));
            base.total = total[0].total;
            base.data = result;
            base.success = true;
        }else{
            base.total = 0;
            base.data = [];
            base.success = false;
            

        }
    }catch(error){
       
        error.message = `service folder.getAllFromDB error : ${error}`;
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



result.getAllSelectFromDB = async function(params){
    let mysql = null;
    let base = {};
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`files_folder`';
        let limit = '';
        let order_by = '';
        let where = '';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.parent != undefined){
            where += where?' and parent ='+params.parent:' WHERE parent='+params.parent;
        }
        if(params.order_by){
            order_by = 'ORDER BY '+params.order_by
          }
        
    let data = await mysql.rawquery(`SELECT * FROM `+from+` `+where+` `+order_by+` `+limit+`;`,[]);
    
    let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+`;`,[]);
    
      
        if (Array.isArray(data) && data.length > 0) {
            const result = await Promise.all(data.map(async(value)=>{
                value = await this.getAllChildSelectFromDB(value);
                return value;

            }));
            base.total = total[0].total;
            base.data = result;
            base.success = true;
        }else{
            base.total = 0;
            base.data = [];
            base.success = false;
            

        }
    }catch(error){
       
        error.message = `service folder.getAllSelectFromDB error : ${error}`;
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
result.getAllChildSelectFromDB = async function(value){
    let mysql = null;
    let base = {};
    
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`files_folder`';
      
       
        
    let data = await mysql.rawquery(`SELECT * FROM `+from+` WHERE parent=? ORDER BY ordering_count ASC;`,[value.id]);
    if (Array.isArray(data) && data.length > 0) {
          // [...rsDetail.data,...rsDetailFiles.data]
          
             value.children = await Promise.all(data.map(async(val)=>{
                                     val = await this.getAllChildFromDB(val);
                                    return val;

                                }));
        /*const result = await Promise.all(data.map(async(value)=>{
            
            value.children = await this.getAllChildFromDB(value.id,[]);
            return value;

        }));*/
        
    }
        return value;
    
    
    
          
    }catch(error){
        console.log('error',error);
        return [];
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
   
    
}


result.getAllChildFromDB = async function(value){
    let mysql = null;
    let base = {};
    
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`files_folder`';
      
       
        
    let data = await mysql.rawquery(`SELECT * FROM `+from+` WHERE parent=? ORDER BY ordering_count ASC;`,[value.id]);
    if (Array.isArray(data) && data.length > 0) {
        
             value.children = await Promise.all(data.map(async(val)=>{
                                     val = await this.getAllChildFromDB(val);
                                    return val;

                                }));
        /*const result = await Promise.all(data.map(async(value)=>{
            
            value.children = await this.getAllChildFromDB(value.id,[]);
            return value;

        }));*/
        
    }
        return value;
    
    
    
          
    }catch(error){
        console.log('error',error);
        return [];
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
   
    
}
result.addDataFromDB = async function(params){
    let mysql = null;
    let base = {};
    const table = '`files_folder`';
    let ordering_count = 0;
    try{
        mysql = await mysqlConnector.connection();
        let data = await mysql.rawquery(`SELECT * FROM `+table+` WHERE parent=? ORDER BY ordering_count DESC;`,[params.parent]);
        if (Array.isArray(data) && data.length > 0) {
            ordering_count = data[0].ordering_count+1;
        }
        
        const res = await mysql.rawquery(`INSERT INTO `+table+` (title,slug,parent,created_by,ordering_count) VALUES (?,?,?,?,?) ;`,
        [
            params.title,
            params.slug,
            params.parent,
            params.created_by,
            ordering_count
        ]);
        base.data = res;
        base.success = true;
        base.message = 'added';
        base.responseCode = 200;

    }catch(error){
     
        error.message = `service folder.addDataFromDB error : ${error}`;
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
    const table = '`files_folder`';
   
    try {
        mysql = await mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET title=?,slug=? WHERE id=?;`
        ,[
            params.title,
            params.slug,
            id,
        ]);
        base.data = res;
        base.message = 'Update Success';
        base.success = true;
        base.responseCode = 200;
        
    }catch(error){
        console.log('error',error);
        error.message = `service folder.updateDetailFromDB error : ${error}`;
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

result.updateOrderFromDB = async function(params,id){
    let mysql = null;
    let base = {};
    const table = '`files_folder`';
   
    try {
        mysql = await mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET ordering_count=? WHERE id=?;`
        ,[
            params.ordering_count,
            id,
        ]);
        
    }catch(error){
        //console.log('error',error);
        error.message = `service folder.updateOrderFromDB error : ${error}`;
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
    let table = '`files_folder`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        let data = await mysql.rawquery(`SELECT * FROM `+table+` WHERE parent=? ORDER BY ordering_count ASC;`,[id]);
        if (Array.isArray(data) && data.length > 0) {
            await Promise.all(data.map(async(val)=>{
                 await this.DeleteChildFromDB(val.id);
                 await mysql.rawquery(`DELETE FROM ${table}  WHERE id = ? ;`,[val.id]);
                
              

           }));
        }
        await mysql.rawquery(`DELETE FROM ${table}  WHERE parent = ? ;`,[id]);
        const res = await mysql.rawquery(`DELETE FROM ${table}  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service folder.deleteDatafromDB error : ${error}`;
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
result.DeleteChildFromDB = async function(id){
    let mysql = null;
    let base = {};
    let table = '`files_folder`';
    
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`files_folder`';
      
       
        
    let data = await mysql.rawquery(`SELECT * FROM `+from+` WHERE parent=? ORDER BY ordering_count ASC;`,[id]);
    if (Array.isArray(data) && data.length > 0) {
        
           await Promise.all(data.map(async(val)=>{
                await mysql.rawquery(`DELETE FROM ${table}  WHERE parent = ? ;`,[val.id]);
                  
                    await mysql.rawquery(`DELETE FROM ${table}  WHERE id = ? ;`,[val.id]);
                    await this.DeleteChildFromDB(val.id);
                

            }));
        /*const result = await Promise.all(data.map(async(value)=>{
            
            value.children = await this.getAllChildFromDB(value.id,[]);
            return value;

        }));*/
        
    }
    await mysql.rawquery(`DELETE FROM ${table}  WHERE parent = ? ;`,[id]);
    await mysql.rawquery(`DELETE FROM ${table}  WHERE id = ? ;`,[id]);
     
    
    
          
    }catch(error){
        console.log('error',error);
        return true;
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
   
    return true;
    
}
export default result;
