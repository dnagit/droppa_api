import baseResponse from "../helpers/base-response.helper";
import mysqlConnector from "../db/mysql-connector";
import settingsModel from '../model/settings'
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
    try{
        const rsDetail = await settingsModel.getAllFromDB();
        let data = []
        if(rsDetail.data){
           data =   await Promise.all(
                rsDetail.data.map(async (data,index) => {
                    let module = data.module;
                    data.module = data.module?data.module:'general';
                
                    let settings = await settingsModel.getAllbyModuleFromDB(module);
                
                    if(settings.data){
                        data.settings = settings.data;
                    }
                    return data;
                

                })
            );

        }
           

       
        
       

        baseResponse.message = 'Query Done';
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        
        baseResponse.data = data;
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
result.updateSetting = async (req, res)=>{
    let params = req.body;
    let mysql = null;
    try{
        const rsDetail = await settingsModel.updateSettingFromDB(params);
        if(rsDetail.success){
            baseResponse.data = rsDetail.data;
            baseResponse.message = 'Query Done';
            baseResponse.success = true;
            baseResponse.responseCode = 200;

        }else{
            baseResponse.data = [];
            baseResponse.message = 'Error';
            baseResponse.success = false;
            baseResponse.responseCode = 200;
    
        }
   
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
export default result;