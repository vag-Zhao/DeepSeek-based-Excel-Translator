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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTranslationResults = saveTranslationResults;
const index_1 = require("../../index");
const path = __importStar(require("path"));
/**
 * 保存翻译结果
 * @param translatedData 翻译后的Excel数据
 * @param outputDir 输出目录
 * @param baseFileName 基本文件名
 * @param originalFilePath 原始Excel文件路径
 */
function saveTranslationResults(translatedData, outputDir, baseFileName, originalFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const services = index_1.Services.getInstance();
        // 保存翻译后的数据到JSON文件 - 启用清理功能以移除注释
        const translatedJsonPath = path.join(outputDir, `${baseFileName}-columns-translate.json`);
        services.excelService.saveToJson(translatedData, translatedJsonPath, true);
        console.log(`翻译后的数据已保存到: ${translatedJsonPath}`);
        // 重构Excel文件（rebuildExcel方法内部已集成清理逻辑）
        const translatedExcelPath = path.join(outputDir, `${baseFileName}-translated${path.extname(originalFilePath)}`);
        yield services.excelService.rebuildExcel(translatedData, originalFilePath, translatedExcelPath);
        console.log(`翻译后的Excel已保存到: ${translatedExcelPath}`);
    });
}
