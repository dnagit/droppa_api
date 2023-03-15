import baseResponse from "../helpers/base-response.helper";
import NavigationgroupsModel from "../model/Navigationgroups";
import NavigationModel from "../model/navigations";
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
    let params = req.body;
    try{
   
     
        const rsDetail = await NavigationgroupsModel.getAllFromDB(params);
        let data = [];
        if(rsDetail.data){
            data =  await Promise.all(
                    rsDetail.data.map(async (data,index) => {
                        let params = {
                            group_id:data.id,
                            order_by:'ordering_count ASC'
                        }
                         let navs = await NavigationModel.getAllFromDB(params);
                         data.navigations = [];
                       if(navs.data){
                            data.navigations = navs.data;

                       }
                        return data;
                        // image.ordering_count = index;
                        // await bannerModel.updateBanneImageOrderingFromDB(image,image.id);
                        
                    })
            );
            

       }
        
       
       
        baseResponse.message = 'Query Done';
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        baseResponse.total = rsDetail.total;
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
result.updateNavigationsGroups = async (req, res)=>{
    let mysql = null;
    let params = {};
    params = req.body
    let id = req.params.id;
    const rsCheck = await NavigationgroupsModel.checkNavigationgroupsUniqueFromDB(params, id);
    if(rsCheck.success == true){
    try{
   
     
        const rsDetail = await NavigationgroupsModel.updateNavigationgroups(id,params);
       
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

result.getNavigationsGroupsDetail = async (req,res) =>{
    const id = req.params.id;
    let mysql = null;
    try{
        const rsDetail = await NavigationgroupsModel.getNavigationgroupsDetailFromDB(id);
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

result.addNavigationsGroups = async (req,res) =>{
    let params = req.body;
    let mysql = null;
    

    const rsDetail = await NavigationgroupsModel.checkNavigationgroupsFromDB(params);
    if(rsDetail.success == true){
        try{
            const rsAdd = await NavigationgroupsModel.addNavigationgroupsFromDB(params);
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

result.deleteNavigationsGroups = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await NavigationgroupsModel.deleteNavigationgroupsfromDB(id);
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