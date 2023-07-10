import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
const result = {};
result.getAllFromDB = async function(params){
    let mysql = null;
    let base = {};
    
    try {
        mysql = await mysqlConnector.connection();
        const from = '`components_group`';
        const from_component = '`components`';
        
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
            const getall = await Promise.all(
                data.map(async (value) => {
                    value.components = await mysql.rawquery(`SELECT * FROM `+from_component+` WHERE group_id=?;`,[value.id]);
                    return value;
                  
                })
            );
            base.total = total[0].total;
            base.data = getall;
            base.success = true;
        }else{
            base.total = 0;
            base.data = [];
            base.success = false;
            

        }
    }catch(error){
        
        error.message = `service groups.getAllFromDB error : ${error}`;
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