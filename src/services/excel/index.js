"use strict";
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
exports.ExcelService = void 0;
const extract_data_1 = require("./extract-data");
const save_to_json_1 = require("./save-to-json");
const read_from_json_1 = require("./read-from-json");
const rebuild_excel_1 = require("./rebuild-excel");
const read_excel_1 = require("./read-excel");
const write_excel_1 = require("./write-excel");
/**
 * Excel处理服务
 */
class ExcelService {
    /**
     * 从Excel文件中提取数据
     * @param filePath Excel文件路径
     * @returns 提取的Excel数据
     */
    extractData(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, extract_data_1.extractData)(filePath);
        });
    }
    /**
     * 保存Excel数据到JSON文件
     * @param data Excel数据
     * @param filePath 目标文件路径
     * @param cleanData 是否清理注释内容
     */
    saveToJson(data, filePath, cleanData = false) {
        (0, save_to_json_1.saveToJson)(data, filePath, cleanData);
    }
    /**
     * 从JSON文件中读取Excel数据
     * @param filePath JSON文件路径
     * @returns Excel数据
     */
    readFromJson(filePath) {
        return (0, read_from_json_1.readFromJson)(filePath);
    }
    /**
     * 重构Excel文件
     * @param data 翻译后的Excel数据
     * @param originalFilePath 原始Excel文件路径
     * @param outputFilePath 输出Excel文件路径
     */
    rebuildExcel(data, originalFilePath, outputFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, rebuild_excel_1.rebuildExcel)(data, originalFilePath, outputFilePath);
        });
    }
    /**
     * 读取Excel文件
     * @param filePath 文件路径
     * @returns Excel数据
     */
    readExcel(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, read_excel_1.readExcel)(filePath);
        });
    }
    /**
     * 写入翻译后的数据到Excel
     * @param sourceFilePath 源文件路径
     * @param translatedData 翻译后的数据
     * @param targetFolder 目标文件夹
     * @returns 处理结果
     */
    writeTranslatedData(sourceFilePath, translatedData, targetFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, write_excel_1.writeTranslatedData)(sourceFilePath, translatedData, targetFolder);
        });
    }
}
exports.ExcelService = ExcelService;
