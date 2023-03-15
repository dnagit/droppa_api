import baseResponse from '../helpers/base-response.helper';

import mysqlConnector from "../db/mysql-connector";

const result = {};


result.getSitemap = async (req, res)=>{
    console.log('a');
    let mysql = null;
    try {
    mysql = await mysqlConnector.connection();
    const defaulta = [
        {
          url: '/',
          changefreq: 'daily',
          priority: 1,
          lastmod: Date.now()
        },
        
        {
            url: '/awards',
            changefreq: 'daily',
            priority: 2,
            lastmod: Date.now()
          },
        {
          url: '/contact-us',
          changefreq: 'daily',
          priority: 6,
          lastmod: Date.now()
        },
     
        {
          url: '/404',
          changefreq: 'daily',
          priority: 7,
          lastmod: Date.now()
        }
      ];
    const portfolios = await mysql.rawquery("SELECT id,title,slug from portfolios  where is_active = ?;", [1]);
    const sitemap =  portfolios.map(data=>{
        let s = {}
        s.url = '/portfolio-detail/'+data.slug;
        s.changefreq = 'daily';
        s.priority = 1;
        s.lastmod = Date.now();
        return s;
    });
    const blogs = await mysql.rawquery("SELECT id,title,slug from blog  where is_active = ?;", [1]);
    const sitemap_blogs =  blogs.map(data=>{
        let s = {}
        s.url = '/blog-detail/'+data.slug;
        s.changefreq = 'daily';
        s.priority = 1;
        s.lastmod = Date.now();
        return s;
    });
   

    baseResponse.data = [...defaulta,...sitemap,...sitemap_blogs];
    baseResponse.success = true;
    baseResponse.message = 'test';
    } catch (error) {
        console.log('error',error);
        baseResponse.success = false;
        baseResponse.message = `service masterData.getSitemap error : ${error}`;
        console.log(baseResponse.message);
    } finally {
    if (mysql) {
        await mysql.release();
    }
    }
   
   
    baseResponse.responseCode = 200;

    return res.status(baseResponse.responseCode).json(baseResponse);
   
    try {
        const rsDetail = await masterDataModel.getNationalityFromDB();
        if (rsDetail) {
            baseResponse.data = rsDetail.data;
            baseResponse.success = true;
            baseResponse.responseCode = 200;
        } else {
            baseResponse.success = false;
            baseResponse.responseCode = 501;
            baseResponse.message = 'Data not found';
        }
    } catch (error) {
        console.log(`service index error : ${error}`);
    } finally {
        if (mysql) {
            await mysql.release();
        }
    }
    return res.status(baseResponse.responseCode).json(baseResponse);
}



export default result;