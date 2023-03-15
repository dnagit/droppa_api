import baseResponse from "../helpers/base-response.helper";
import usersModel from "../model/users";
import settingsModel from "../model/settings";
import mysqlConnector from "../db/mysql-connector";
import nodemailer from 'nodemailer'
import {createHmac} from 'crypto'

const result = {};

function mail_config(host,port,user,pass){
  const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: true,
  auth: {
    user: user,
    pass: pass 
  },
});
  return transporter;
}


result.sendContactus = async (req, res) => {
  let mysql = null;
  const params = req.body;
  try{
    const Config = await settingsModel.getAllbyModuleFromDB('email');
    var host = '';
    var port = '';
    var user = '';
    var pass = '';
    var contact_email = '';
    var server_email = '';
    for(let i=0;i<Config.data.length;i++){
      if(Config.data[i].slug == 'contact_email'){
        contact_email = Config.data[i].value;
      }
      if(Config.data[i].slug == 'server_email'){
        server_email = Config.data[i].value;
      }
       if(Config.data[i].slug == 'mail_smtp_host'){
        host = Config.data[i].value
      }
       if(Config.data[i].slug == 'mail_smtp_port'){
        port = Config.data[i].value
      }
       if(Config.data[i].slug == 'mail_smtp_user'){
        user = Config.data[i].value
      }
       if(Config.data[i].slug == 'mail_smtp_pass'){
        pass = Config.data[i].value
      }
    }
    const Transporter = mail_config(host,port,user,pass);
    var mailOptions = {
      from: `${server_email}`,
      to: contact_email,
     // to: params.to.split(','),
      subject: params.subject,
      html: params.message
    };
    if(params.photo){
      mailOptions.attachments = params.photo;
    }
    if(params.from){
      mailOptions.from = params.from;
    }
    if(params.cc){
      mailOptions.cc = params.cc.split(',');
    }
    if(params.name || params.phone){
      mailOptions.html = 'หัวข้อ : '+params.subject;
    } 
    
    if(params.name){
      mailOptions.html += '<br /> ชื่อ : ' + params.name 
    }
    if(params.to){
      mailOptions.html += '<br /> อีเมล : ' + params.to 
    }
    if(params.phone){
      mailOptions.html +='<br />เบอร์ติดต่อ : '+params.phone;
    }
    if(params.message){
      mailOptions.html += '<br /><br />'+params.message;
    }

    //console.log('params',params);
    //console.log('mailOptions',mailOptions);
   

    
    const data = await Transporter.sendMail(mailOptions);
    
    baseResponse.data = data;
    baseResponse.success = true;
    baseResponse.responseCode = 200;
    baseResponse.message = "Send done.";

  }catch(error){
    console.log('error', error);
    baseResponse.data = error;
    baseResponse.success = false;
    baseResponse.responseCode = 550;
    baseResponse.message = "Failed";
  }finally {
    if(mysql){
        await mysql.release();

    }
  }
  return res.status(baseResponse.responseCode).json(baseResponse);
}
result.resetPassword = async (req, res) => {
  let mysql = null;
  const params = req.body;
  try{
    const Config = await settingsModel.getAllbyModuleFromDB('email');
    var host = '';
    var port = '';
    var user = '';
    var pass = '';
    var contact_email = '';
    var server_email = '';
    for(let i=0;i<Config.data.length;i++){
      if(Config.data[i].slug == 'contact_email'){
        contact_email = Config.data[i].value;
      }
      if(Config.data[i].slug == 'server_email'){
        server_email = Config.data[i].value;
      }
       if(Config.data[i].slug == 'mail_smtp_host'){
        host = Config.data[i].value
      }
       if(Config.data[i].slug == 'mail_smtp_port'){
        port = Config.data[i].value
      }
       if(Config.data[i].slug == 'mail_smtp_user'){
        user = Config.data[i].value
      }
       if(Config.data[i].slug == 'mail_smtp_pass'){
        pass = Config.data[i].value
      }
    }
    const Transporter = mail_config(host,port,user,pass);

    const new_password = Math.random().toString(36).slice(2);
    var mailOptions = {
    from: `${server_email}`,
    to: params.to,
    subject:'Reset Password',
    html: `<body marginheight="0" topmargin="0" marginwidth="0" style="display:inline;margin: 0px; background-color: #f2f3f8;" leftmargin="0">
              <!--100% body table-->
              <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                  style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                  <tr>
                      <td>
                          <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                              align="center" cellpadding="0" cellspacing="0">
                              <tr>
                                  <td style="height:80px;">&nbsp;</td>
                              </tr>
                              <tr>
                        <td style="text-align:center;">
                          <a href="https://smkdevelopment.com/" title="logo" target="_blank">
                            <img width="60" src="https://i.postimg.cc/nhNxxVYW/home.png" title="logo" alt="logo">
                          </a>
                        </td>
                        </tr>
                              <tr>
                                  <td style="height:20px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td>
                                      <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                          style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                          <tr>
                                              <td style="height:40px;">&nbsp;</td>
                                          </tr>
                                          <tr>
                                              <td style="padding:0 35px;">
                                                  <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                      requested to reset your password</h1>
                                                  <span
                                                      style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                  <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                    A unique your new password has been generated for you Can use this password now.
                                                  </p>
                                                  <h5>New Password:</h5>
                                                  <div style="background:#20e277;text-decoration:none !important; font-weight:500;color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">
                                                  <h5>
                                                      ${new_password}</h5>
                                                  </div>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="height:40px;">&nbsp;</td>
                                          </tr>
                                      </table>
                                  </td>
                              <tr>
                                  <td style="height:20px;">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td style="text-align:center;">
                                      <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.smkdevelopment.com</strong></p>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="height:80px;">&nbsp;</td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
              <!--/100% body table-->
          </body>`
    };

    //check email
    params.email = params.to
    const details = await usersModel.getUserCheckFromDB(params);
    if(details.message == 'email is already used'){
      //update user by id encode_password
      params.password = new_password
      const rsAdd = await usersModel.resetPasswordUser(params);
      if(rsAdd.success){
        const data = await Transporter.sendMail(mailOptions);
    
        baseResponse.data = data;
        baseResponse.success = true;
        baseResponse.responseCode = 200;
        baseResponse.message = "Send done.";
        }
    }
    else{
      baseResponse.success = false;
      baseResponse.responseCode = 400;
      baseResponse.message = "no email";
    }
  }
   catch (error) {
      console.log('error', error);
      baseResponse.data = error;
      baseResponse.success = false;
      baseResponse.responseCode = 550;
      baseResponse.message = "Failed";


  } finally {
      if(mysql){
          await mysql.release();

      }
  }
  return res.status(baseResponse.responseCode).json(baseResponse);
}
export default result;