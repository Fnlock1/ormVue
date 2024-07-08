interface QueryBuilder {
    collection: (name: string) => CollectionQuery;
    prefix: (prefix: string) => QueryBuilder;
    timeout: (time: number) => QueryBuilder;
}

interface WhereQuery {
    where: (columnName: string, value: any) => WhereQuery;
    get: () => Promise<any>;
    first: () => Promise<any>;
    add: (data:object) => Promise<any>;
    update: (data:object) => Promise<any>;
    Delete: () => Promise<any>;
    whereIn: (PrimaryKey: string, data: any) => WhereQuery;
    sql: (sql: string) => Promise<any>;
}

interface CollectionQuery {
    where: (columnName: string, value: any) => WhereQuery;
    whereIn: (PrimaryKey: string, data: any) => any;
    get: () => Promise<any>;
    add: (data: object) => Promise<any>; // 修改 add 方法接收参数
    collection: (name: string) => CollectionQuery;
    action: (nextActionName: string) => any;
    sql: (sql: string) => Promise<any>;
}




//导出
export type{
    QueryBuilder,
    WhereQuery,
    CollectionQuery
}
