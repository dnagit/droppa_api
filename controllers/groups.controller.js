import baseResponse from "../helpers/base-response.helper";
import groupsModel from "../model/groups";
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
    let params = req.body;
    try{
   
     
        const rsDetail = await groupsModel.getAllFromDB(params);
       
        baseResponse.message = 'Query Done';
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        baseResponse.total = rsDetail.total;
        baseResponse.data = rsDetail.data;
       

    }catch(error){
        baseResponse.total = 0;
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = 400;
        baseResponse.data = undefined;
        
    }finally{
        if(mysql){
            await mysql.release();

        }

    }


    return res.status(baseResponse.responseCode).json(baseResponse);
} 
result.updatePermissions = async(req,res)=>{
    let mysql = null;
    let params = {};
    params = req.body
    let id = req.params.id;
    const rsCheck = await groupsModel.checkPermissionsUniqueFromDB(params,id);
    if(rsCheck.success == true){
    try{
   
     
        const rsDetail = await groupsModel.updatePermissions(id,params);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.total = undefined;
        baseResponse.data = [];
       

    }catch(error){
        console.log('error',error);
        baseResponse.total = 0;
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;
      
    }finally{
        if(mysql){
            await mysql.release();

        }

    }
}

    return res.status(baseResponse.responseCode).json(baseResponse);

}
result.updatePermissionsroles = async (req, res)=>{
    let mysql = null;
    let params = {};
    params = req.body
    let id = req.params.id;
    //params.roles = JSON.stringify(req.body);
    try{
   
     
        const rsDetail = await groupsModel.updateRoles(id,params);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.total = undefined;
        baseResponse.data = [];
       

    }catch(error){
        console.log('error',error);
        baseResponse.total = 0;
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;
      
    }finally{
        if(mysql){
            await mysql.release();

        }

    }


    return res.status(baseResponse.responseCode).json(baseResponse);

}

result.getPermissionsDetail = async (req,res) =>{
    const id = req.params.id;
    let mysql = null;
    try{
        const rsDetail = await groupsModel.getPermissionsDetailFromDB(id);
        baseResponse.data = rsDetail.data;
        baseResponse.success = rsDetail.success;
        baseResponse.message = rsDetail.message;
        baseResponse.responseCode = rsDetail.responseCode;
    }catch(error){
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;
    }finally{
        if(mysql){
            await mysql.release();

        }
    }
    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.addPermissions = async (req,res) =>{
    let params = req.body;
    let mysql = null;

    const rsDetail = await groupsModel.checkPermissionsFromDB(params);
    console.log('addPermissionFromDB',rsDetail);
    if(rsDetail.success == true){
        try{
            const rsAdd = await groupsModel.addPermissionsFromDB(params);
            baseResponse.data = rsAdd.data;
            baseResponse.success = rsAdd.success;
            baseResponse.message = rsAdd.message;
            baseResponse.responseCode = rsAdd.responseCode;
        }catch(error){
            baseResponse.message = error.message;
            baseResponse.success = error.success;
            baseResponse.responseCode = error.responseCode;
            baseResponse.data = undefined;
        }finally{
            if(mysql){
                await mysql.release();

            }
        }
    }
    else{
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.message = rsDetail.message;
    }
    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.deletePermissions = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await groupsModel.deletePermissionsfromDB(id);
        baseResponse.message = reDetail.message;
        baseResponse.data = reDetail.data;
        baseResponse.success = reDetail.success;
        baseResponse.responseCode = reDetail.responseCode;

  
    } catch (error) {
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = error.responseCode;
        baseResponse.data = undefined;

  
    } finally {
        if(mysql){
            await mysql.release();

        }
    }
    return res.status(baseResponse.responseCode).json(baseResponse);
}
export default result;