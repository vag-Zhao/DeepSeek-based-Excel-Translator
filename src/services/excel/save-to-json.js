"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToJson = saveToJson;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const file_1 = require("../../utils/file");
/**
 * 保存Excel数据到JSON文件
 * @param data Excel数据
 * @param filePath 目标文件路径
 * @param cleanData 是否清理注释内容
 */
function saveToJson(data, filePath, cleanData = false) {
    const dirPath = path.dirname(filePath);
    // 确保目录存在
    (0, file_1.ensureDirectoryExists)(dirPath);
    // 如果需要清理数据，先清理注释内容
    const finalData = cleanData ? (0, file_1.cleanTranslationData)(data) : data;
    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2), 'utf8');
}
