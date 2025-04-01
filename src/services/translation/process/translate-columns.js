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
exports.translateColumns = translateColumns;
const index_1 = require("../../index");
const build_glossary_1 = require("../context/build-glossary");
/**
 * 翻译Excel列数据
 * @param excelData Excel数据
 * @param topic 主题
 * @returns 更新后的Excel数据（包含翻译后的列）
 */
function translateColumns(excelData, topic) {
    return __awaiter(this, void 0, void 0, function* () {
        const services = index_1.Services.getInstance();
        const translatedData = {
            headers: excelData.headers,
            columns: excelData.columns,
            translatedColumns: {}
        };
        // 创建专业领域词汇表
        const domainGlossary = (0, build_glossary_1.buildDomainGlossary)(excelData, topic);
        // 翻译每一列的数据
        if (excelData.columns) {
            for (const [colKey, column] of Object.entries(excelData.columns)) {
                const columnHeader = excelData.headers[colKey];
                console.log(`翻译列: ${columnHeader || colKey}`);
                // 将列数据合并成一个字符串进行翻译
                const columnContent = column.join('\n');
                // 构建列特定的上下文
                const columnContext = (0, build_glossary_1.buildColumnContext)(columnHeader, columnContent, topic, domainGlossary);
                // 调用翻译API
                const translationResult = yield services.deepSeekService.translateContent({
                    content: columnContent,
                    context: columnContext
                });
                if (translationResult.success && typeof translationResult.translatedContent === 'string') {
                    // 将翻译结果拆分回数组
                    const translatedColumnData = translationResult.translatedContent.split('\n');
                    // 确保翻译后的数据长度与原始数据长度相同
                    if (translatedColumnData.length === column.length) {
                        translatedData.translatedColumns[colKey] = translatedColumnData;
                    }
                    else {
                        console.warn(`列 ${columnHeader || colKey} 的翻译结果行数与原始数据不匹配，保留最接近原始长度的行数`);
                        // 如果翻译结果行数超过原始数据，只取前面部分
                        if (translatedColumnData.length > column.length) {
                            translatedData.translatedColumns[colKey] = translatedColumnData.slice(0, column.length);
                        }
                        else {
                            // 如果翻译结果行数不够，使用翻译结果并补充空字符串
                            translatedData.translatedColumns[colKey] = [
                                ...translatedColumnData,
                                ...new Array(column.length - translatedColumnData.length).fill('')
                            ];
                        }
                    }
                }
                else {
                    console.error(`翻译列 ${columnHeader || colKey} 失败: ${translationResult.error || translationResult.message || '未知错误'}`);
                    // 如果翻译失败，使用原始数据
                    translatedData.translatedColumns[colKey] = [...column];
                }
            }
        }
        return translatedData;
    });
}
