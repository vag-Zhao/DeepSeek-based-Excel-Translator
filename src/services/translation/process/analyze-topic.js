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
exports.analyzeAndConfirmTopic = analyzeAndConfirmTopic;
const index_1 = require("../../index");
const user_input_1 = require("../ui/user-input");
/**
 * 分析Excel主题并获取用户确认
 * @param headers Excel表头数据
 * @returns 确认后的主题
 */
function analyzeAndConfirmTopic(headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const services = index_1.Services.getInstance();
        console.log('正在分析Excel表格主题...');
        const topicResult = yield services.deepSeekService.analyzeExcelTopic(headers);
        let topic = '';
        if (topicResult.success) {
            console.log(`AI分析的Excel主题是: ${topicResult.topic}`);
            // 让用户确认或修改主题
            topic = yield (0, user_input_1.getUserConfirmation)(`请确认这个主题是否正确? 输入新的主题或按回车确认 [${topicResult.topic}]: `, topicResult.topic);
        }
        else {
            console.warn(`主题分析失败: ${topicResult.error}`);
            topic = yield (0, user_input_1.getUserConfirmation)('请手动输入Excel表格的主题: ', '未知主题');
        }
        console.log(`确认的主题是: ${topic}`);
        return topic;
    });
}
