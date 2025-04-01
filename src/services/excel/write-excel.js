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
exports.writeTranslatedData = writeTranslatedData;
const ExcelJS = __importStar(require("exceljs"));
const path = __importStar(require("path"));
const file_1 = require("../../utils/file");
/**
 * 将翻译后的数据写入Excel文件
 * @param sourceFilePath 源Excel文件路径
 * @param translatedData 翻译后的数据
 * @param targetFolder 目标文件夹
 * @returns Excel处理结果
 */
function writeTranslatedData(sourceFilePath, translatedData, targetFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 确保目标目录存在
            (0, file_1.ensureDirectoryExists)(targetFolder);
            // 构建输出文件路径
            const baseName = (0, file_1.getFileNameWithoutExtension)(sourceFilePath);
            const extension = path.extname(sourceFilePath);
            const outputFilePath = path.join(targetFolder, `${baseName}-translated${extension}`);
            // 创建新Excel工作簿
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('翻译结果');
            // 检查数据是否为空
            if (!translatedData || translatedData.length === 0) {
                return {
                    success: false,
                    error: '翻译后的数据为空',
                    message: '翻译后的数据为空，无法写入Excel文件'
                };
            }
            // 获取所有列名
            const headers = Object.keys(translatedData[0]);
            // 添加表头
            worksheet.columns = headers.map(header => ({
                header,
                key: header,
                width: 20
            }));
            // 添加数据行
            for (const row of translatedData) {
                worksheet.addRow(row);
            }
            // 设置样式
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
            // 保存工作簿
            yield workbook.xlsx.writeFile(outputFilePath);
            return {
                success: true,
                outputFilePath,
                message: `翻译后的Excel文件已保存到: ${outputFilePath}`
            };
        }
        catch (error) {
            console.error('写入Excel文件失败:', error);
            return {
                success: false,
                error: `写入Excel文件失败: ${error instanceof Error ? error.message : String(error)}`,
                message: '写入Excel文件时发生错误'
            };
        }
    });
}
