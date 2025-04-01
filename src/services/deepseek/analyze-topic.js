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
exports.analyzeExcelTopic = analyzeExcelTopic;
const client_1 = require("./client");
/**
 * 分析Excel表格主题
 * @param headers 表头数据
 * @returns 主题分析结果
 */
function analyzeExcelTopic(headers) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const client = (0, client_1.createDeepSeekClient)();
            const model = (0, client_1.getModelName)();
            const headerValues = Object.values(headers).filter(value => value.trim().length > 0);
            if (headerValues.length === 0) {
                return {
                    topic: '未知主题',
                    success: false,
                    error: '表头为空，无法分析主题'
                };
            }
            const prompt = `请根据以下Excel表格列标题，根据标题匹配专业性属性，分析出这个表格的主要主题或用途，直接返回一个简洁的主题名称，不要有任何额外的解释：\n${headerValues.join(', ')}`;
            const response = yield client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: '你是一个专业的数据分析助手。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3
            });
            const topic = ((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) || '未知主题';
            return {
                topic,
                success: true
            };
        }
        catch (error) {
            console.error('分析主题失败:', error);
            return {
                topic: '未知主题',
                success: false,
                error: `分析主题错误: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    });
}
