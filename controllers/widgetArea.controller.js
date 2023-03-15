import baseResponse from "../helpers/base-response.helper";
//import WidgetAreaModel from "../model/Navigationgroups";
import WidgetAreaModel from '../model/widgetArea'
import WidgetsModel from '../model/widgets'
import NavigationModel from "../model/navigations";
import mysqlConnector from "../db/mysql-connector";
const result = {};
result.getAll = async (req, res)=>{
    let mysql = null;
    let params = req.body;
    try{
   
     
        const rsDetail = await WidgetAreaModel.getAllFromDB(params);
        let data = [];
        if(rsDetail.data){
            data =  await Promise.all(
                    rsDetail.data.map(async (data,index) => {
                       let params = {
                        area_id:data.id,
                            order_by:'ordering_count ASC'
                        }
                         let widgets = await WidgetsModel.getAllFromDB(params);
                       
                         data.widgets = [];
                       if(widgets.data){
                            data.widgets = widgets.data;

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
result.updateArea = async (req, res)=>{
    let mysql = null;
    let params = {};
    params = req.body
    let id = req.params.id;
    const rsCheck = await WidgetAreaModel.checkAreaUniqueFromDB(params,id);
    if(rsCheck.success == true){
    try{
   
     
        const rsDetail = await WidgetAreaModel.updateArea(id,params);
       
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
        const rsDetail = await WidgetAreaModel.getNavigationgroupsDetailFromDB(id);
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

result.addArea = async (req,res) =>{
    let params = req.body;
    let mysql = null;
    

    const rsDetail = await WidgetAreaModel.checkAreaFromDB(params);
    if(rsDetail.success == true){
        try{
            const rsAdd = await WidgetAreaModel.addAreaFromDB(params);
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

result.deleteArea = async(req,res) =>{
    let mysql = null;
    const id = req.params.id;
    try {
        const reDetail = await WidgetAreaModel.deleteAreafromDB(id);
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