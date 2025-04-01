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
exports.readExcel = readExcel;
const ExcelJS = __importStar(require("exceljs"));
/**
 * 读取Excel文件
 * @param filePath Excel文件路径
 * @returns 将Excel文件读取为对象数组
 */
function readExcel(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const workbook = new ExcelJS.Workbook();
            yield workbook.xlsx.readFile(filePath);
            const worksheet = workbook.getWorksheet(1);
            if (!worksheet) {
                throw new Error('无法找到工作表');
            }
            const result = [];
            // 获取表头
            const headerRow = worksheet.getRow(1);
            const headers = [];
            headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
                headers[colNumber - 1] = cell.text || `column${colNumber}`;
            });
            // 处理每一行数据
            worksheet.eachRow((row, rowNumber) => {
                // 跳过表头行
                if (rowNumber > 1) {
                    const rowData = {};
                    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
                        const header = headers[colNumber - 1];
                        rowData[header] = cell.text || '';
                    });
                    // 如果行不为空，添加到结果集
                    if (Object.keys(rowData).length > 0) {
                        result.push(rowData);
                    }
                }
            });
            // 将表头作为第一个元素
            const headerObject = {};
            headers.forEach((header, index) => {
                headerObject[`column${index + 1}`] = header;
            });
            result.unshift(headerObject);
            return result;
        }
        catch (error) {
            console.error('读取Excel文件失败:', error);
            throw new Error(`读取Excel文件失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
