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
exports.extractData = extractData;
const ExcelJS = __importStar(require("exceljs"));
/**
 * 从Excel文件中提取数据
 * @param filePath Excel文件路径
 * @returns 提取的Excel数据
 */
function extractData(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new ExcelJS.Workbook();
        yield workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1); // 获取第一个工作表
        if (!worksheet) {
            throw new Error('无法找到工作表');
        }
        const headers = {};
        const columns = {};
        // 获取列数
        const columnCount = worksheet.actualColumnCount;
        // 提取表头（第一行）
        const headerRow = worksheet.getRow(1);
        for (let colNum = 1; colNum <= columnCount; colNum++) {
            const colKey = `column${colNum}`;
            const headerCell = headerRow.getCell(colNum);
            headers[colKey] = headerCell.text || '';
            // 为每列初始化一个空数组
            columns[colKey] = [];
        }
        // 提取每列的数据（从第二行开始）
        const rowCount = worksheet.actualRowCount;
        for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
            const row = worksheet.getRow(rowNum);
            for (let colNum = 1; colNum <= columnCount; colNum++) {
                const colKey = `column${colNum}`;
                const cell = row.getCell(colNum);
                if (cell.text) {
                    columns[colKey].push(cell.text);
                }
            }
        }
        return {
            headers,
            columns
        };
    });
}
