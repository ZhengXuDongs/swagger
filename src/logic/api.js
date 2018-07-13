import Base from '../db/base';
const log = require('log4js').getLogger('logic/api');
import cfg from '../../config/app';
import moment from 'moment';
import ReqTool from '../utils/reqTool';
var xmlreader = require("xmlreader");

import {
    request,
    summary,
    query,
    body,
    tags,
    middlewares,
    path,
    description
} from '../lib';
var fs = require('fs');
var co = require('co');
var OSS = require('ali-oss');
var client = new OSS({
    region: cfg.OSS.region,
    accessKeyId: cfg.OSS.accessKeyId,
    accessKeySecret: cfg.OSS.accessKeySecret
});
var ali_oss = {
    bucket: 'imagepath',
    endPoint: 'oss-cn-shanghai.aliyuncs.com',
};
const tag = tags(['UpLoad 文件上传接口']);


class ApiLogic {

    @request('post', '/api/upload-file')
    @summary('文件上传接口')
    @description('example of api')
    @tag
    @body({

    })
    static async UploadFile(ctx) {
        let result = null;
        const param = ctx.req.file;
        console.log(param)
        if(param.filename){
            result = {isSucc:true,code:200,message:'上传成功',result:{file_url:cfg.uploadUrl+'/'+param.filename}}
        }else{
            result = {isSucc:false,code:202,message:'上传失败'}
        }
        ctx.body = result;
    }

    @request('post', '/api/upload-file1')
    @summary('文件上传接口 上传到阿里云')
    @description('example of api')
    @tag
    @body({

    })
    static async UploadFiles(ctx) {
        let result = null;
        // 文件路径
        var filePath = './' + ctx.req.file.path;
        // 文件类型
        var temp = ctx.req.file.originalname.split('.');
        var fileType = temp[temp.length - 1];
        var lastName = '.' + fileType;
        // 构建图片名
        var fileName = Date.now() + lastName;
        console.log(filePath,111,fileName)
        // 图片重命名
        const imgUrl = await ApiLogic.GetImgUrl(filePath,fileName);
        if(imgUrl){
            result = {isSucc:true,code:200,message:'上传成功',result:imgUrl};
        }else{
            result = {isSucc:false,code:202,message:'上传失败'};
        }
        //console.log(imgUrl)
        //console.log(333,result)
        ctx.body = result;
    }

    static async GetImgUrl(filePath, fileName){
        return await new Promise((resolve,reject)=>{
            fs.rename(filePath, fileName, (err) => {
                if (err) {
                    //res.end(JSON.stringify({status:'102',msg:'文件写入失败'}));
                    reject(false);
                }else{
                    var localFile =  fileName;
                    var key = fileName;

                    // 阿里云 上传文件
                    co(function* () {
                        client.useBucket(ali_oss.bucket);
                        var result = yield client.put(localFile,key);
                        var imageSrc = 'http://image.hgdqdev.cn/' + result.name;
                        // 上传之后删除本地文件
                        fs.unlinkSync(localFile);
                        //console.log(11113,imageSrc);
                        //res.end(JSON.stringify({status:'100',msg:'上传成功',imageUrl:imageSrc}));
                        resolve(imageSrc);
                        //console.log(results)
                    }).catch(function (err) {
                        // 上传之后删除本地文件
                        fs.unlinkSync(localFile);
                        //console.log(22223)
                        //res.end(JSON.stringify({status:'101',msg:'上传失败',error:JSON.stringify(err)}));
                        reject(false);
                    });
                }
            });
        })

    }

    static async WxPay(ctx){
        let result = null;
        const param = ctx.request.body;
        let orderNo = param.orderNo;
        let totalFee = param.totalFee;
        let appid = cfg.WX.appid;
        let mch_id = cfg.WX.mch_id;
        let nonce_str = wxpay.createNonceStr();
        let timestamp = wxpay.createTimeStamp();
        let body = '测试微信支付';
        let out_trade_no = orderNo;
        let total_fee = wxpay.getmoney(totalFee);
        let spbill_create_ip = cfg.WX.spbill_create_ip;
        let notify_url = cfg.WX.notify_url;
        let trade_type = 'JSAPI';
        let mchkey = cfg.WX.mchkey;

        let sign = wxpay.paysignjsapi(appid,body,mch_id,nonce_str,notify_url,out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey);
        log.info('sign的值为：',sign);

        //组装xml数据

        var formData  = "<xml>";
        formData  += "<appid>"+appid+"</appid>";  //appid
        formData  += "<body><![CDATA["+body+"]]></body>";
        formData  += "<mch_id>"+mch_id+"</mch_id>";  //商户号
        formData  += "<nonce_str>"+nonce_str+"</nonce_str>"; //随机字符串，不长于32位。
        formData  += "<notify_url>"+notify_url+"</notify_url>";
        formData  += "<out_trade_no>"+out_trade_no+"</out_trade_no>";
        formData  += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>";
        formData  += "<total_fee>"+total_fee+"</total_fee>";
        formData  += "<trade_type>"+trade_type+"</trade_type>";
        formData  += "<sign>"+sign+"</sign>";
        formData  += "</xml>";

        log.info('formData===',formData);

        var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

        const options = {
            url:url,
            method:'post',
            body:formData,
            json:true
        };
        await ReqTool.Request({options}).then(res=>{
            console.log(res)
            if(res){
                xmlreader.read(res.toString("utf-8"),function (errors, response) {
                    if(null !== errors){
                        console.log(errors);
                        return;
                    }

                    console.log('长度===', response.xml.prepay_id.text().length);
                    var prepay_id = response.xml.prepay_id.text();
                    console.log('解析后的prepay_id==',prepay_id);
                    //将预支付订单和其他信息一起签名后返回给前端
                    let finalsign = wxpay.paysignjsapifinal(appid,mch_id,prepay_id,nonce_str,timestamp,mchkey);
                    const datas = {
                        'appId':appid,
                        'partnerId':mchid,
                        'prepayId':prepay_id,
                        'nonceStr':nonce_str,
                        'timeStamp':timestamp,
                        'package':'Sign=WXPay',
                        'sign':finalsign
                    };
                    result = {isSucc:true,code:200,message:'成功',result:datas};
                })
            }
        });

        ctx.body = result;

    }

    static async Test(ctx){
        let result = null;
        const datas = {
            "schedule_content_id": 4,
            "reserve_time": "2017-07-02"
        };
        const options = {
            url:'http://localhost:3000/schedule/search-schedule-reserve',
            body:datas,
            method:'post',
            json:true
        };
        const data = await ReqTool.Request({options}).then(res=>{
            console.log(res);
            result = res;
        })
        ctx.body = result;
    }

}

export default ApiLogic;