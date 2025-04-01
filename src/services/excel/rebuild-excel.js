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
exports.rebuildExcel = rebuildExcel;
const ExcelJS = __importStar(require("exceljs"));
const file_1 = require("../../utils/file");
/**
 * 重构Excel文件
 * @param data 翻译后的Excel数据
 * @param originalFilePath 原始Excel文件路径
 * @param outputFilePath 输出Excel文件路径
 */
function rebuildExcel(data, originalFilePath, outputFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // 清理翻译数据中的注释内容
        const cleanedData = (0, file_1.cleanTranslationData)(data);
        // 读取原始Excel获取格式信息
        const originalWorkbook = new ExcelJS.Workbook();
        yield originalWorkbook.xlsx.readFile(originalFilePath);
        const originalWorksheet = originalWorkbook.getWorksheet(1);
        if (!originalWorksheet) {
            throw new Error('无法找到原始工作表');
        }
        // 创建新的工作簿和工作表
        const newWorkbook = new ExcelJS.Workbook();
        const newWorksheet = newWorkbook.addWorksheet('翻译结果');
        // 设置表头
        const headerRow = newWorksheet.getRow(1);
        for (const [colKey, headerValue] of Object.entries(cleanedData.headers)) {
            const colNum = parseInt(colKey.replace('column', ''), 10);
            headerRow.getCell(colNum).value = headerValue;
        }
        headerRow.commit();
        // 填充翻译后的数据
        if (cleanedData.translatedColumns) {
            const columnKeys = Object.keys(cleanedData.translatedColumns);
            // 确保所有列的长度一致，取源数据的长度
            const originalColumnLengths = {};
            if (cleanedData.columns) {
                Object.entries(cleanedData.columns).forEach(([colKey, columnData]) => {
                    originalColumnLengths[colKey] = columnData.length;
                });
            }
            // 计算每列的最大行数，使用原始列长度而不是翻译后的列长度
            const maxRowsPerColumn = Math.max(...columnKeys.map(key => {
                return originalColumnLengths[key] || cleanedData.translatedColumns[key].length;
            }));
            for (let rowNum = 0; rowNum < maxRowsPerColumn; rowNum++) {
                const dataRow = newWorksheet.getRow(rowNum + 2); // 从第二行开始
                for (const [colKey, columnData] of Object.entries(cleanedData.translatedColumns)) {
                    const colNum = parseInt(colKey.replace('column', ''), 10);
                    if (rowNum < columnData.length) {
                        dataRow.getCell(colNum).value = columnData[rowNum];
                    }
                }
                dataRow.commit();
            }
        }
        // 保存新的Excel文件
        yield newWorkbook.xlsx.writeFile(outputFilePath);
    });
}
