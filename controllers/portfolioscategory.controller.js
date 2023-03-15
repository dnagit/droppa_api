import baseResponse from "../helpers/base-response.helper";
import portfolioModel from "../model/portfoliosCategory";
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
    let params = req.body;
    try{
   
     
        const rsDetail = await portfolioModel.getAllFromDB(params);
       
        baseResponse.message = 'Query Done';
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        baseResponse.total = rsDetail.total;
        baseResponse.data = rsDetail.data;
       

    }catch(error){
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
result.updatePortfolioscategory = async (req, res)=>{
    let mysql = null;
    let params = {};
    params = req.body
    let id = req.params.id;
    const rsCheck = await portfolioModel.checkPortfolioscategoryUniqueFromDB(params,id);
    if(rsCheck.success == true){
    try{
   
        
        const rsDetail = await portfolioModel.updatePortfolioscategory(id,params);
       
        baseResponse.message = rsDetail.message;
        baseResponse.success = rsDetail.success;
        baseResponse.responseCode = 200;
        baseResponse.total = undefined;
        baseResponse.data = rsDetail.data;
       

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

result.getPortfolioscategoryDetail = async (req,res) =>{
    const id = req.params.id;
    let mysql = null;
    try{
        const rsDetail = await portfolioModel.getPortfolioscategoryDetailFromDB(id);
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

result.addPortfolioscategory = async (req,res) =>{
    let params = req.body;
    let mysql = null;

    const rsDetail = await portfolioModel.checkPortfolioscategoryFromDB(params);
    if(rsDetail.success == true){
        try{
            const rsAdd = await portfolioModel.addPortfolioscategoryFromDB(params);
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

result.deletePortfolioscategory = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await portfolioModel.deletePortfolioscategoryfromDB(id);
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