import mysqlConnector from "../db/mysql-connector";
import baseResponse from "../helpers/base-response.helper";
import {createHmac} from 'crypto'
const result = {};

result.getAllFromDB = async function(params){
    let mysql = null;
    try {
        mysql = await mysqlConnector.connection();
        let select = 'users.*,groups.title group_name'
        let from = '`users`';
        let limit = '';
        let where = '';
        let join = '`groups`';
        let on = 'ON users.group_id = groups.id';
        let order_by = '';
        if(params.offset != undefined  && params.limit != undefined){

            limit = 'LIMIT '+params.offset+','+params.limit;
        }
        if(params.order_by){
            order_by = 'ORDER BY '+params.order_by
        }
        if(params.keywords){
            where = where?' and (first_name LIKE "'+params.keywords+'%" OR last_name "'+params.keywords+'%")':' WHERE (first_name LIKE "'+params.keywords+'%" OR last_name LIKE "'+params.keywords+'%")';
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
            baseResponse.responseCode = 200;
        }else{
            
            baseResponse.data = [];
            baseResponse.success = false;
            baseResponse.responseCode = 200;
            

        }
    }catch(error){
        baseResponse.message = `service users.getAllFromDB error : ${error}`;
        baseResponse.success = false;
        baseResponse.data = [];
        baseResponse.responseCode = 400;
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return baseResponse;
}
result.loginUserFromDB = async function(params){
    let mysql = null;
    const hash = createHmac('sha256','fbr')
                .update(params.password)
                .digest('base64');
    
    try {
        mysql = await mysqlConnector.connection();
        let select = 'SELECT u.id,u.username,u.email,u.first_name, u.last_name,u.group_id,u.phone,g.title role,g.types, g.roles';
        let leftjoin = 'LEFT JOIN `groups` g ON u.group_id = g.id';
        let data = await mysql.rawquery(`
                `+select+`           
                FROM users  u
                `+leftjoin+`
                WHERE u.email=? and u.password=? 
                LIMIT 1;`,[
        params.email,
        hash
        ]);
     
       
        baseResponse.responseCode = 200;
       
    
      
        if (Array.isArray(data) && data.length > 0) {
            let ability=[]
            
            if(data[0].roles){
               
                data[0].roles.forEach(r=>{
                    let abil = {}
                    if(r.module == 'Settings'){
                        if(r.general){
                            abil = {}
                            abil.subject= r.module;
                            abil.action= 'general';
                            ability.push(abil);

                        }
                        if(r.permission){
                            abil = {}
                            abil.subject= r.module;
                            abil.action= 'permission';
                            ability.push(abil);

                        }


                    }else{
                        if(r.read){
                            abil = {}
                            abil.subject= r.module;
                            abil.action= 'read';
                            ability.push(abil);
                        }
                        if(r.create){
                            abil = {}
                            abil.subject= r.module;
                            abil.action= 'create';
                            ability.push(abil);

                        }
                        if(r.update){
                            abil = {}
                            abil.subject= r.module;
                            abil.action= 'update';
                            ability.push(abil);

                        }
                        if(r.delete){
                            abil = {}
                            abil.subject= r.module;
                            abil.action= 'delete';
                            ability.push(abil);

                        }

                    }
                    
                   
                });
            }
            ability.push({action: 'read',subject: 'ACL',});
            ability.push({action: 'read',subject: 'Auth',});
            ability.push({action: 'read',subject: 'Dash',});
           // ability.push({action: 'manage',subject: '',});
            const taskAll = await Promise.all(ability);
            data[0].ability = taskAll;
           
            delete data[0].roles;
            baseResponse.data = data[0];
            baseResponse.success = true;
            baseResponse.message = `Login Done`;
        }else{
            
            baseResponse.data = {};
            baseResponse.message = `Email or Password wrong.`;
            baseResponse.success = false;

        }
    }catch(error){
        baseResponse.message = `service users.loginUserFromDB error : ${error}`;
        baseResponse.success = false;
        baseResponse.responseCode = 400;;
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return baseResponse;

}

result.getUserDetailFromDB = async function(id){
    let mysql = null;
    let join = '`groups`';
    let on = 'ON u.group_id = groups.id';
    try{
      mysql = await  mysqlConnector.connection();
      const data = await mysql.rawquery(`SELECT * FROM users u LEFT JOIN `+join+` `+on+` WHERE u.id = ?;`,[id]);
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
      baseResponse.message = `service users.getUserDetailFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

  result.addUserFromDB = async function(params){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`INSERT INTO users (username,email,group_id,password,first_name,last_name,phone,is_active,created_by,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?);`,[
        params.username,
        params.email,
        params.group_id,
        params.password,
        params.first_name,
        params.last_name,
        params.phone,
        params.is_active,
        params.created_by,
        params.created_at,
        params.updated_at]);
      
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.message = 'added';
        baseResponse.responseCode = 200;

    }catch(error){
      baseResponse.data = undefined;
      baseResponse.success = false;
      baseResponse.message = `service users.addUserFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }


result.getUserCheckFromDB = async function(params){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM users WHERE email = ? OR username = ?;`,[
        params.email,
        params.username]);
        if(res[0]){
            if(res[0].email == params.email && res[0].username == params.username){
                baseResponse.data = undefined;
                baseResponse.success = false;
                baseResponse.message = 'email and username is already used';
                baseResponse.responseCode = 200;

            }
            else if(res[0].username == params.username){
                baseResponse.data = undefined;
                baseResponse.success = false;
                baseResponse.message = 'username is already used';
                baseResponse.responseCode = 200;
            }
            else if(res[0].email == params.email){
                baseResponse.data = undefined;
                baseResponse.success = false;
                baseResponse.message = 'email is already used';
                baseResponse.responseCode = 200;
            }
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
      baseResponse.message = `service users.getUserCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

  result.getUserCheckuniqueFromDB = async function(params,id){
    let mysql = null;
    try{
      mysql = await  mysqlConnector.connection();
      const res = await mysql.rawquery(`SELECT * FROM users WHERE id != ? and (email = ? OR username = ?);`,[
        id,
        params.email,
        params.username
        ]);
        if(res[0]){
            if(res[0].email == params.email && res[0].username == params.username){
                baseResponse.data = undefined;
                baseResponse.success = false;
                baseResponse.message = 'email and username is already used';
                baseResponse.responseCode = 200;

            }
            else if(res[0].username == params.username){
                baseResponse.data = undefined;
                baseResponse.success = false;
                baseResponse.message = 'username is already used';
                baseResponse.responseCode = 200;
            }
            else if(res[0].email == params.email){
                baseResponse.data = undefined;
                baseResponse.success = false;
                baseResponse.message = 'email is already used';
                baseResponse.responseCode = 200;
            }
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
      baseResponse.message = `service users.getUserCheckFromDB error : ${error}`;
      baseResponse.responseCode = 400;
      
  
    }finally{
      if(mysql){
          await mysql.release();
  
      }
    }
    return baseResponse;
  }

result.deleteUserfromDB = async function(id){
    let mysql = null;
    try{
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`DELETE FROM users WHERE id = ? ;`,[id]);
        baseResponse.message = 'Delete Success';
        baseResponse.data = res;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
    }catch(error){
        baseResponse.message = `service users.deleteUserfromDB error : ${error}`;
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
result.resetPasswordUser = async function(params){
    let mysql = null
    try{
        const hash = createHmac('sha256','fbr')
                .update(params.password)
                .digest('base64');
        mysql = await  mysqlConnector.connection();
        const res = await mysql.rawquery(`UPDATE users SET password = ? WHERE email = ?;`,[
          hash,
          params.to
          ]);
        
          baseResponse.data = res;
          baseResponse.success = true;
          baseResponse.message = 'updated';
          baseResponse.responseCode = 200;
  
      }catch(error){
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = `service users.resetPasswordUser error : ${error}`;
        baseResponse.responseCode = 200;
        
    
      }finally{
        if(mysql){
            await mysql.release();
    
        }
      }
      return baseResponse;
    }

    result.updateUser = async function(params,id){
        let mysql = null
        try{
            mysql = await  mysqlConnector.connection();
            const res = await mysql.rawquery(`UPDATE users SET username= ?,email= ?,group_id= ?,password= ?,first_name= ?,last_name= ?,phone= ?,is_active= ?,updated_at= ? WHERE id = ?;`,[
              params.username,
              params.email,
              params.group_id,
              params.password,
              params.first_name,
              params.last_name,
              params.phone,
              params.is_active,
              null,
              id]);
            
              baseResponse.data = res;
              baseResponse.success = true;
              baseResponse.message = 'updated';
              baseResponse.responseCode = 200;
      
          }catch(error){
            baseResponse.data = undefined;
            baseResponse.success = false;
            baseResponse.message = `service users.updateUserFromDB error : ${error}`;
            baseResponse.responseCode = 200;
            
        
          }finally{
            if(mysql){
                await mysql.release();
        
            }
          }
          return baseResponse;
        }
export default result;