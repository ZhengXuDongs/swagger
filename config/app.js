module.exports = {
    cookieOptions: {
        maxAge: 3600 * 24 * 365 * 1000 * 3,
        path: '/',
    },
    mysql: {
        //connectionLimit:10,
        //connectTimeout:10000,
        host: 'localhost',
        user: 'root',
        password: 'zxd123456',
        database: 'daidai',
        port: 3306
    },
    wx: {
        appID: 'wxeb05af11212121073a4be',
        appsecret: 'a86fa721212339f46ef1f7facd1bdb8c39bac',
        noncestr: 'Wm3WZYT21212Pz0wzccnW',
    },
    message: {
        paramErr: {
            isSucc: false,
            code: 203,
            message: '添加失败',
            result: '参数不全'
        },
        addSuccess: {
            isSucc: true,
            code: 200,
            message: '添加成功',
            result: ''
        },
        addFailed: {
            isSucc: false,
            code: 202,
            message: '添加失败',
            result: ''
        },
        deleteSuccess: {
            isSucc: true,
            code: 200,
            message: '删除成功',
            result: ''
        },
        deleteFailed: {
            isSucc: false,
            code: 202,
            message: '删除失败',
            result: ''
        },
        updateSuccess: {
            isSucc: true,
            code: 200,
            message: '更新成功',
            result: ''
        },
        updateFailed: {
            isSucc: false,
            code: 202,
            message: '更新失败',
            result: ''
        },
        searchSuccess: {
            isSucc: true,
            code: 200,
            message: '查询成功',
            result: ''
        },
        searchFailed: {
            isSucc: false,
            code: 202,
            message: '查询失败',
            result: ''
        },
    },
    cryptoDes: {
        KEY: 'WdfgEryt', //密匙
        IV: [0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF], // 向量
    },
    uploadUrl: 'http://l27.0.0.1:3000/upload',
    OSS: {
        region: 'oss-cn-shanghai',
        accessKeyId: '********',
        accessKeySecret: '*********'
    },
    WX:{
        appid:'wxd678efh567hg6787',
        mch_id:'1230000109',
        spbill_create_ip:'123.12.12.123',
        notify_url:'http://www.weixin.qq.com/wxpay/pay.php',
        mchkey:'8r435jVd7yA0354nsvkxb4cN3x7Se4322'
    }
};