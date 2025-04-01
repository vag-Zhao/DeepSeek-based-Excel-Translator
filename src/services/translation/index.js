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
exports.TranslationService = void 0;
const extract_excel_1 = require("./process/extract-excel");
const analyze_topic_1 = require("./process/analyze-topic");
const translate_headers_1 = require("./process/translate-headers");
const translate_columns_1 = require("./process/translate-columns");
const save_results_1 = require("./process/save-results");
const user_input_1 = require("./ui/user-input");
/**
 * 翻译服务
 */
class TranslationService {
    /**
     * 关闭服务
     */
    close() {
        (0, user_input_1.closeReadline)();
    }
    /**
     * 处理Excel翻译
     * @param excelFilePath Excel文件路径
     * @returns 处理成功或失败
     */
    processExcelTranslation(excelFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('开始处理Excel文件...');
                // 步骤1: 提取Excel数据
                const { excelData, outputDir, baseFileName } = yield (0, extract_excel_1.extractExcelData)(excelFilePath);
                // 步骤2: 分析Excel主题
                const topic = yield (0, analyze_topic_1.analyzeAndConfirmTopic)(excelData.headers);
                // 步骤3: 翻译表头
                let translatedData = yield (0, translate_headers_1.translateHeaders)(excelData, topic);
                // 步骤4: 翻译列数据
                translatedData = yield (0, translate_columns_1.translateColumns)(translatedData, topic);
                // 步骤5: 保存翻译结果
                yield (0, save_results_1.saveTranslationResults)(translatedData, outputDir, baseFileName, excelFilePath);
                return true;
            }
            catch (error) {
                console.error('处理Excel翻译时出错:', error);
                return false;
            }
        });
    }
}
exports.TranslationService = TranslationService;
