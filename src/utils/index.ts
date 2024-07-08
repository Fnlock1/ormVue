import axios from "axios";
// 自己 写的工具包
import {configUrl, encryption, encryptObjectData} from "@/utils/tool";
import type {CollectionQuery, QueryBuilder, WhereQuery} from "@/utils/interfaceRule";


class QueryBuilderImpl implements QueryBuilder {
    private readonly url: string;
    private request: any;
    public config: object = {}

    constructor(baseurl: string, port: string) {
        this.url = `http://${baseurl}:${port}`;
        this.request = axios.create({
            baseURL: this.url,
        });

        this.config = {
            // 密钥
            secretKey: "x1"
        }

        // 进行 config 配置
        this.request.interceptors.request.use((config: any) => {
            config = {
                ...config,
                url: configUrl(config.url),
            }
            return config;
        })
    }

    // 设置 前缀
    prefix(prefix: string): QueryBuilder {
        let tempUrl = `/${prefix}`;
        this.request.defaults.baseURL = this.url + tempUrl;
        return this
    }


    // 设置 连接 表
    collection(name: string): CollectionQuery {
        let paramUrl = '?';
        this.request.defaults.baseURL += name;

        let sql = (sqlString: string): Promise<any> => {
            return this.request.post(paramUrl, {sql: encryption(sqlString, this.config)});
        }

        // 进行 where 查询 把数据 放大 params 中
        const where = (columnName: string, value: any): WhereQuery => {
            let xKey = encryption(columnName, this.config);
            let xValue = encryption(JSON.stringify(value), this.config);
            paramUrl = paramUrl + xKey + '=' + xValue + '&&&';
            paramUrl = paramUrl.substring(0, paramUrl.length - 1)


            return {
                where: (nextColumnName: string, nextValue: any) => where(nextColumnName, nextValue),   // where 原理 是 放到 params 中
                get: () => { // get 请求
                    return this.request.get(paramUrl);
                },
                first: async () => await first(), // first 请求
                add: (data: object) => add(data), // add 请求\
                update: (data: object) => update(data), // update 请求
                Delete: () => Delete(), // Delete 请求
                whereIn: (PrimaryKey: string, data: any) => whereIn(PrimaryKey, data),
                sql
            };
        };


        const first = async (): Promise<any> => {
            try {
                // 需要 加 name
                const response = await this.request.get(paramUrl);
                if (response.data.length === 0) {
                    return null;
                } else if (Array.isArray(response.data) && response.data.length >= 1) { // 如果 是 数组 且有数据
                    return response.data[0];
                } else {
                    return response.data;
                }
            } catch (error) {
                return null;
            }
        };

        const action = (actionName: string) => {
            let tempUrl = `/${actionName}`;
            this.request.defaults.baseURL += tempUrl;
            return {
                where: (columnName: string, value: any) => where(columnName, value),
                action: (nextActionName: string) => action(nextActionName),
            }
        }

        const get = (): Promise<any> => {
            return this.request.get(name);
        };


        const add = (data: object): Promise<any> => {
            return this.request.post(paramUrl, encryptObjectData(data, this.config));
        }

        const update = (data: object): Promise<any> => {
            return this.request.put(paramUrl, encryptObjectData(data, this.config));
        }

        const Delete = (): Promise<any> => {
            return this.request.delete(paramUrl);
        }


        let whereIn = (PrimaryKey: string, data: any) => {
            let xKey = encryption(PrimaryKey, this.config);
            let xValue = encryption(JSON.stringify(data), this.config);
            paramUrl = paramUrl + xKey + '=' + JSON.stringify(xValue) + '&';


            return {
                where: (nextColumnName: string, nextValue: any) => where(nextColumnName, nextValue),   // where 原理 是 放到 params 中
                get: () => { // get 请求
                    return this.request.get(paramUrl);
                },
                first: async () => await first(), // first 请求
                add: async () => await add(data),  // add 请求 post
                update: async () => await update(data), // update 请求 put
                Delete: async () => await Delete(), // delete 请求 delete
                whereIn: (PrimaryKey: string, data: any) => whereIn(PrimaryKey, data),
                sql
            };
        }


        return <CollectionQuery>{
            where,
            get,
            add,
            collection: (nextName: string) => this.collection(nextName),
            action: (nextActionName: string) => action(nextActionName),
            whereIn,
            sql
        };
    }

    // 设置 超时时间
    timeout(time: number): QueryBuilder {
        this.request.timeout = time;
        return this;
    }
}

function db(baseurl: string, port: string): QueryBuilder {
    return new QueryBuilderImpl(baseurl, port);
}

export {db};
