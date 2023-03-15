import baseResponse from "../helpers/base-response.helper";
import usersModel from "../model/users";
import mysqlConnector from "../db/mysql-connector";
import {createHmac} from 'crypto'
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
    const params = req.body;
    try{
        const rsDetail = await usersModel.getAllFromDB(params);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = rsDetail.responseCode;
        baseResponse.data = rsDetail.data;
        return res.status(baseResponse.responseCode).json(baseResponse);

    }catch(error){
        baseResponse.message = error.message;
        baseResponse.success = error.success;
        baseResponse.responseCode = 400;
        baseResponse.data = undefined;
        return res.status(baseResponse.responseCode).json(baseResponse);
    }finally{
        if(mysql){
            await mysql.release();

        }

    }
    return res.status(baseResponse.responseCode).json(baseResponse);

}
result.loginUser = async (req,res)=>{
    const params = req.body;
    let mysql = null;
    try{
        const rsDetail = await usersModel.loginUserFromDB(params);
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

result.getUserDetail = async (req,res)=>{
    const id = req.params.id;
    let mysql = null;
    try{
        const rsDetail = await usersModel.getUserDetailFromDB(id);
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

result.addUser = async (req,res) =>{
    const params = req.body;
    let mysql = null;
    if(params.password){
        const password = createHmac('sha256','fbr')
                .update(params.password)
                .digest('base64');
                params.password = password;
    }
    else{
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = 'Please enter password';
        baseResponse.responseCode = 200;
        return res.status(baseResponse.responseCode).json(baseResponse);
    }
    if(!params.username){
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = 'Please enter username';
        baseResponse.responseCode = 200;
        return res.status(baseResponse.responseCode).json(baseResponse);
    }
    if(!params.email){
        baseResponse.data = undefined;
        baseResponse.success = false;
        baseResponse.message = 'Please enter email';
        baseResponse.responseCode = 200;
        return res.status(baseResponse.responseCode).json(baseResponse);
    }
    else{
        const rsDetail = await usersModel.getUserCheckFromDB(params);
    
        if(rsDetail.success == true){
            try{
                const rsAdd = await usersModel.addUserFromDB(params);
                baseResponse.data = rsAdd.data;
                baseResponse.success = rsAdd.success;
                baseResponse.message = rsAdd.message;
                baseResponse.responseCode = rsAdd.responseCode;
                return res.status(baseResponse.responseCode).json(baseResponse);
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
            baseResponse.success = false;
            baseResponse.responseCode = 200;
            baseResponse.message = rsDetail.message;
        }
    }

    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.deleteUser = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await usersModel.deleteUserfromDB(id);
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

result.updateUser = async function(req,res){
    let mysql = null;
    const id = req.params.id;
    const params = req.body;

    if(params.password){
        const password = createHmac('sha256','fbr')
                .update(params.password)
                .digest('base64');
                params.password = password;
    }
    //check email and username is not already used
    const rscheck = await usersModel.getUserCheckuniqueFromDB(params,id);
    
    if(rscheck.success == true){
        if(!params.password){
            
            const rsDetail = await usersModel.getUserDetailFromDB(id);
           
            params.password = rsDetail.data.password;
        }
    
    try {
        //update user by id
        const rsAdd = await usersModel.updateUser(params,id);
        baseResponse.message = rsAdd.message;
        baseResponse.data = rsAdd.data;
        baseResponse.success = rsAdd.success;
        baseResponse.responseCode = rsAdd.responseCode;

  
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
}
    return res.status(baseResponse.responseCode).json(baseResponse);
}

export default result;