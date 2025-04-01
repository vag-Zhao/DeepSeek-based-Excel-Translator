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
exports.DeepSeekService = void 0;
const analyze_topic_1 = require("./analyze-topic");
const translate_content_1 = require("./translate-content");
/**
 * DeepSeek API服务
 */
class DeepSeekService {
    /**
     * 分析Excel表格主题
     * @param headers 表头数据
     * @returns 主题分析结果
     */
    analyzeExcelTopic(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, analyze_topic_1.analyzeExcelTopic)(headers);
        });
    }
    /**
     * 翻译内容
     * @param request 翻译请求
     * @returns 翻译结果
     */
    translateContent(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, translate_content_1.translateContent)(request);
        });
    }
}
exports.DeepSeekService = DeepSeekService;
