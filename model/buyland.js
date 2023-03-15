import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
const result = {} 
result.getAllFromDB = async function(params){
  let mysql = null;

  try {
      mysql = await mysqlConnector.connection();
      let select = 'buyland.*,m.image_name,m.image';
      let from = '`buyland`';
      let limit = '';
      let where = '';
      let join_table1 = 'RIGHT JOIN `buyland_id_image` m';
      let on_table1 = 'ON buyland.id = m.buyland_id';
      let order_by = '';
      if(params.offset != undefined  && params.limit != undefined){

          limit = 'LIMIT '+params.offset+','+params.limit;
      }
      if(params.order_by){
        order_by = 'ORDER BY '+params.order_by
      }
      if(params.keywords){
          where = where?' and (buyland.first_name LIKE "'+params.keywords+'%")':' WHERE (buyland.last_name LIKE "'+params.keywords+'%")';
      }

      let data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+join_table1+` `+on_table1+` `+join_table2+` `+on_table2+` `+where+` `+order_by+` `+limit+`;`,[]);
      let total = await mysql.rawquery(`SELECT COUNT(*) total FROM `+from+` `+where+`;`,[]);
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

      baseResponse.message = `Portfolios.getAllFromDB error : ${error}`;
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

result.getBuylandDetailFromDB = async function(id){
    let mysql = null;
    let select = 'buyland.*,m.image_name,m.image';
    let from = '`buyland`';
    let join_table1 = 'RIGHT JOIN `buyland_id_image` m';
    let on_table1 = 'ON buyland.id = m.buyland_id';

    try{                                                
      mysql = await  mysqlConnector.connection();
      const data = await mysql.rawquery(`SELECT `+select+` FROM `+from+` `+join_table1+` `+on_table1+` `+` WHERE buyland.id = ?;`,[id]);
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
      baseResponse.message = `Portfolios.getPortfoliosDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

  result.addBuylandFromDB = async function(params){
    let table = '`buyland`';
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO `+table+` (first_name,last_name,email,phone,road,sub_district,district,province,rai,wa,width,length,price,description,map_link,latitude,longitude) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        params.first_name,
        params.last_name,
        params.email,
        params.phone,
        params.road,
        params.sub_district,
        params.district,
        params.province,
        params.rai,
        params.wa,
        params.width,
        params.length,
        params.price,
        params.description,
        params.map_link,
        params.latitude,
        params.longitude
        ]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `Portfolios.addPortfoliosFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }
  

result.deleteBuylandfromDB = async function(id){
    let table = '`portfolios`';
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM `+table+`  WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `Portfolios.deletePortfoliosfromDB error : ${error}`;
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

result.updateBuyland = async function(params,id){
    let table = '`portfolios`';
    let mysql = null
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE `+table+` SET first_name=?,last_name=?,email=?,phone=?,road=?,sub_district=?,district=?,province=?,rai=?,wa=?,width=?,length=?,price=?,description=?,map_link=?,latitude=?,longitude=? WHERE id =?;`
        ,[
          params.first_name,
          params.last_name,
          params.email,
          params.phone,
          params.road,
          params.sub_district,
          params.district,
          params.province,
          params.rai,
          params.wa,
          params.width,
          params.length,
          params.price,
          params.description,
          params.map_link,
          params.latitude,
          params.longitude,
          id,
          ]);
        
          baseResponse.data = res;
          baseResponse.success = true;
          baseResponse.message = 'updated';
          baseResponse.responseCode = 200;
  
      }catch(error){
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `Portfolios.updatePortfolios error : ${error}`;
        baseResponse.responseCode = 400;
        
    
      }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
      return baseResponse;
    }

export default result;