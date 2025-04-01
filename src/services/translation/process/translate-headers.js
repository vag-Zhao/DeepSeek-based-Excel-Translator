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
exports.translateHeaders = translateHeaders;
const index_1 = require("../../index");
/**
 * 翻译Excel表头
 * @param excelData Excel数据
 * @param topic 主题
 * @returns 更新后的Excel数据（包含翻译后的表头）
 */
function translateHeaders(excelData, topic) {
    return __awaiter(this, void 0, void 0, function* () {
        const services = index_1.Services.getInstance();
        const translatedData = {
            headers: excelData.headers,
            columns: excelData.columns,
            translatedColumns: {}
        };
        // 创建一个副本用于翻译列标题
        const headerKeysArray = Object.keys(excelData.headers);
        const headerValuesArray = Object.values(excelData.headers);
        // 翻译列标题
        console.log('翻译列标题...');
        const headerContent = headerValuesArray.join('\n');
        // 为表头翻译提供更具体的专业背景
        const headerTranslationContext = `这是${topic}领域的专业表格的列标题，包含各种行业术语和缩写。要求每一个表头都必须完整翻译成中文，不能漏掉任何一个。`;
        const headerTranslationResult = yield services.deepSeekService.translateContent({
            content: headerContent,
            context: headerTranslationContext
        });
        if (headerTranslationResult.success) {
            if (typeof headerTranslationResult.translatedContent === 'string') {
                const translatedHeaders = headerTranslationResult.translatedContent.split('\n');
                // 确保标题翻译结果与原始标题长度一致
                if (translatedHeaders.length === headerValuesArray.length) {
                    const translatedHeadersObj = {};
                    headerKeysArray.forEach((key, index) => {
                        translatedHeadersObj[key] = translatedHeaders[index];
                    });
                    translatedData.headers = translatedHeadersObj;
                }
                else {
                    console.warn('标题翻译结果行数不匹配，保留原始标题');
                }
            }
            else {
                console.warn('标题翻译结果格式不正确，保留原始标题');
            }
        }
        else {
            console.warn('标题翻译失败，保留原始标题');
        }
        return translatedData;
    });
}
