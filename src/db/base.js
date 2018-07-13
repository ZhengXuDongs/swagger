import mysql from './sqlHelper';
import conn from './sqlConn';
const log = require('log4js').getLogger('db/base');

class Base {

    /**
     * 详情请看https://www.npmjs.com/package/node-mysql-promise
     * @param table 表名 string
     * @param field 查询的字段 String|Array 要查询的字段，可以是字符串，也可以是数组 field('id, title') (['id', 'title'])
     * @param where Sting|Object 查询条件
     * @param distinct String 去重的字段
     * @param order String|Array|Obeject 排序方式
     * @returns {Promise<any>}
     * @constructor
     */
    static async Search({table,field,where,distinct,order}) {
        return await new Promise((resolve,reject)=>{
            mysql.table(table).field(field).distinct(distinct).order(order).where(where).select().then(function (data, err) {
                if (err) reject(err);
                resolve(data);
            })
        })
    }

    /***
     * data Object 要插入的数据
     * return promise
     * @param data  var data  = {
                        title: 'title',
                        content: 'content'
                    };
     * @returns {Promise<any>}
     * @constructor
     */
    static async Save({table,data}){
        return await new Promise((resolve,reject)=>{
            mysql.table(table).add(data).then(function (insertId) {
                resolve(insertId);//如果插入成功，返回插入的id
            }).catch(function (err) {
                reject(err);//插入失败，err为具体的错误信息
            });
        })
    }

    /**
     *
     * thenAdd(data, where, returnDetail)
     * 当数据表中不存在where条件对应的数据时才进行插入
     * data Object 要插入的数据
     * where String|Array|Object 检测的条件
     * returnDetail Boolean 是否返回详细的信息
     */
    static async SaveThen({table,data,where}) {
        return await new Promise((resolve, reject) => {
            mysql.table(table).thenAdd(data,where,true).then(function (data, err) {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /***
     * 按条件更新
     * @param updatas Object 要更新的数据
     * @returns {Promise}
     */
    static async Update({table, where, updates}) {
        return await new Promise((resolve, reject) => {
            mysql.table(table).where(where).update(updates).then(function (affectRows, err) {
                if (err) reject(err);
                resolve(affectRows);
                console.log(`表的更新行数：${affectRows}`);
            });
        });
    }

    /***
     * 按条件删除
     * @param where
     * @returns {Promise}
     */
    static async Delete({table,where}) {
        return await new Promise((resolve, reject) => {
            mysql.table(table).where(where).delete().then(function (affectRows, err) {
                if (err) reject(err);
                resolve(affectRows);
                console.log(`表的删除行数：${affectRows}`);
            });
        });
    }

    /***
     * 自定义sql语句进行查询
     * @param data
     * @returns {Promise}
     * @constructor
     */
    static async AllTableSerarch(data) {
        return await new Promise((resolve, reject) => {
            mysql.query('SELECT %s FROM %s WHERE %s', data).then(function (data, err) {
                if (err) reject(err);
                resolve(data);
                console.log(`查询出来的结果为：${data}`);
            });
        });
    }

    /***
     * 调用存储过程
     * @param StoreProcedure
     * @returns {Promise}
     */
    static async callStoreProcedure(StoreProcedure) {
        return await new Promise((resolve, reject) => {
            conn.query('CALL ' + StoreProcedure, function (err, rows) {
                if (err) reject(err);
                resolve(rows[0]);
                console.log(`表的存储过程：${rows}`);
            });
        });
    }

    /**
     * 按条件语句查询
     */
    static async search(sqlsearch) {
        return await new Promise((resolve, reject) => {
            conn.query(sqlsearch, function (err, data) {
                if (err) reject(err);
                resolve(data);
                console.log(`从表中查询出来的值为：${JSON.stringify(data)}`);
            });
        });
    }


}

export default  Base;