var request = require('request');

class ReqTool {

    static async Request({options}){
        return await new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    //log.info(`data的值为：${JSON.stringify(data)}`);
                    resolve(body);
                } else {
                    reject(new Error(error));
                }
            });
        });
    }

}
export default  ReqTool;