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
exports.translateContent = translateContent;
const client_1 = require("./client");
/**
 * @param content 要翻译的内容
 * @param context 上下文
 * @returns 构建的提示词
 */
function buildTranslationPrompt(content, context) {
    const basePrompt = `请将以下内容翻译成中文，这是关于"${context || '专业领域'}"的内容。你需要对专业领域的数据进行准确翻译，特别注意：

1. 列标题（属性单元格）是该列所有数据的专业定义核心，必须严格基于列标题来理解和翻译该列中的所有内容
2. 该列中的专业术语、缩写词、代码必须严格按照列标题在该专业领域中的定义和用法来翻译
3. 相同的缩写在不同的列中代表完全不同的专业术语，必须依据当前列标题来确定其精确专业含义
4. 严格保持数据的专业性，避免使用通用解释替代专业术语，尤其对NA、N/A等缩写要基于列标题确定其专业含义
5. 直接给出翻译结果，不要加任何注释、解释或额外说明
6. 保持原始数据的行数和格式
7. 对于数据中的标准代码、型号、编号类内容，如能确定其专业含义则翻译，否则保留原有形式
8. 同一列中的相同内容必须使用相同的翻译，保持一致性
9. 对于缩写词，务必翻译成完整的专业术语，而非保留缩写或使用通用解释
10. 对于数据中的日期、时间、金额等格式，保持原有格式
11. 对于数据中的百分比、小数等格式，保持原有格式
12. 对于数据中的特殊符号，保持原有格式
13，对于表格中所出现的缩写词都需要严格按照列属性来翻译，严禁使用通用解释
14，对于表格中所出现的专业术语，需要严格按照列属性来翻译，严禁使用通用解释
15，对于表格中所出现的日期、时间、金额等格式，需要严格按照列属性来翻译，严禁使用通用解释
16，对于表格中所出现的百分比、小数等格式，需要严格按照列属性来翻译，严禁使用通用解释
17，对于表格中所出现的特殊符号，需要严格按照列属性来翻译，严禁使用通用解释

内容如下：\n\n${content}`;
    return basePrompt;
}
/**
 * 翻译内容
 * @param request 翻译请求
 * @returns 翻译结果
 */
function translateContent(request) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const client = (0, client_1.createDeepSeekClient)();
            const model = (0, client_1.getModelName)();
            const { content, context } = request;
            // 处理内容为对象的情况
            const contentToTranslate = typeof content === 'string'
                ? content
                : JSON.stringify(content);
            const prompt = buildTranslationPrompt(contentToTranslate, context);
            const response = yield client.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: `你是一个${context || '专业领域'}翻译专家。你精通各类领域术语、缩写和代码的翻译，不会遗漏任何内容。你只提供翻译结果，不添加任何解释或注释。` },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2
            });
            const translatedContent = ((_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) || '';
            return {
                translatedContent,
                success: true
            };
        }
        catch (error) {
            console.error('翻译失败:', error);
            return {
                translatedContent: '',
                success: false,
                error: `翻译错误: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    });
}
