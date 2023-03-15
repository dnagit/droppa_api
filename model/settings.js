import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";

const result = {};
result.getAllFromDB = async function(){
    let mysql = null;
    let base = {};
    try {
        mysql = await mysqlConnector.connection();
        const from = '`settings`';
        let order_by = 'module ASC';
        let groups = await mysql.rawquery(`SELECT module FROM `+from+` GROUP BY module ORDER BY `+order_by+`;`,[]);
        if (Array.isArray(groups) && groups.length > 0) {
           /*await groups.map(async (data,index) => {
            
                let module = data.module;
                data.module = data.module?data.module:'general';
                data.options = [];
                let options  = await mysql.rawquery(`SELECT * FROM `+from+`WHERE module=? ORDER BY `+order_by+`;`,[module]);
                if (Array.isArray(options) && options.length > 0) {
                    data.options = options;
                }
               
                
                //data.options = options;
                
                
              
                return data;
            });*/
         
           
            base.data = groups;
            base.success = true;
        }else{
            base.total = 0;
            base.data = [];
            base.success = false;
            

        }
    }catch(error){
        
        error.message = `service settings.getAllFromDB error : ${error}`;
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
result.getAllbyModuleFromDB = async function(module){
    let mysql = null;
    let base = {};
    try {
        mysql = await mysqlConnector.connection();
        const from = '`settings`';
        let order_by = 'ordering_count ASC';
        let settings = await mysql.rawquery(`SELECT * FROM `+from+` WHERE module=? ORDER BY `+order_by+`;`,[module]);
        if (Array.isArray(settings) && settings.length > 0) {
           /*await groups.map(async (data,index) => {
            
                let module = data.module;
                data.module = data.module?data.module:'general';
                data.options = [];
                let options  = await mysql.rawquery(`SELECT * FROM `+from+`WHERE module=? ORDER BY `+order_by+`;`,[module]);
                if (Array.isArray(options) && options.length > 0) {
                    data.options = options;
                }
               
                
                //data.options = options;
                
                
              
                return data;
            });*/
         
           
            base.data = settings;
            base.success = true;
        }else{
            base.total = 0;
            base.data = [];
            base.success = false;
            

        }
    }catch(error){
        
        error.message = `service settings.getAllFromDB error : ${error}`;
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
result.updateSettingFromDB =  async function(params){
    let mysql = null;
    let base = {};
    let done = [];
    let table = 'settings';
    try{
        mysql = await mysqlConnector.connection();
        for (const [key, value] of Object.entries(params)) {
            for(const [k, val] of Object.entries(value.settings)){
              
                const res = await mysql.rawquery(`UPDATE ${table} SET  value=? WHERE slug=?;`,[val.value,val.slug]);
                done.push(val.slug);

            }
            
        }
        let taskAll = await Promise.all(done);
        base.data = taskAll;
        base.success = true;
        base.message = 'update done';
    }catch(error){
        console.log('error',error);
        error.message = `service settings.updateSettingFromDB error : ${error}`;
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

export default result;