// @ts-ignore
import CryptoJS from 'crypto-js';


// 去除 多余 的 &&  例如：http://localhost:8080/#/login?redirect=%2Fdashboard%2Fanalysis&&
function configUrl(ErrorUrl: String): String {
    // 拿到当前的url 去除末尾 的 &&
    return ErrorUrl.substring(0, ErrorUrl.length - 2);

}


// 加密 文字
function encryption(str: String, config: any): String {
    let newStr = str;
    if (config.secretKey != "") {
        newStr = CryptoJS.AES.encrypt(str, config.secretKey).toString();
    } else {
        //     设置 警告
        console.warn("secretKey 为空，不进行加密")
    }
    // 进行 MD5 加密
    return newStr;
}

// 解密 文字
function decryption(str: String, config: any): String {
    let newStr = str;
    if (config.secretKey !== "") {
        newStr = CryptoJS.AES.decrypt(str, config.secretKey).toString(CryptoJS.enc.Utf8);
    }
    return newStr;
}


// 对 对象 里面 任何 数据都进行加密
function encryptObjectData(obj: { [key: string]: any }, config: any): { [key: string]: any } {
    let encryptedObj: { [key: string]: any } = {
    };
    if (config.secretKey !== "") {
        for (let key in obj) {
            let newKey = encryption(key, config);
            let newValue = encryption(JSON.stringify(obj[key]), config);
            // @ts-ignore
            encryptedObj[newKey] = newValue;
        }
    } else {
        encryptedObj = obj;
        console.warn("secretKey 为空，不进行加密")
    }
    return encryptedObj;
}


export {
    configUrl,
    encryption,
    decryption,
    encryptObjectData
}
