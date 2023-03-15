import baseResponse from "../helpers/base-response.helper";
import mysqlConnector from "../db/mysql-connector";
import buylandModel from "../model/buyland"
const result = {};

result.getAll = async (req, res)=>{
    let mysql = null;
    const params = req.body;
    try{
        const rsDetail = await buylandModel.getAllFromDB(params);
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
}

result.getBuylandDetail = async (req,res)=>{
    const id = req.params.id;
    let mysql = null; 
    try{
        const rsDetail = await buylandModel.getBuylandDetailFromDB(id);
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

result.addBuyland = async (req,res) =>{
    let params = req.body;
    let mysql = null;

    
    try{

        const rsAdd = await buylandModel.addBuylandFromDB(params);
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
   
    return res.status(baseResponse.responseCode).json(baseResponse);
}

result.deleteBuyland = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await buylandModel.deleteBuylandfromDB(id);
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

result.updateBuyland = async function(req,res){
    let mysql = null;
    const id = req.params.id;
    const params = req.body;

    try {
        const rsAdd = await buylandModel.updateBuyland(params,id);
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
    return res.status(baseResponse.responseCode).json(baseResponse);
}

export default result;
