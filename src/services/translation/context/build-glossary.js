"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDomainGlossary = buildDomainGlossary;
exports.buildColumnContext = buildColumnContext;
/**
 * 构建专业词汇表
 * @param excelData Excel数据
 * @param topic 主题
 * @returns 专业词汇表
 */
function buildDomainGlossary(excelData, topic) {
    let domainGlossary = `${topic}领域常见术语对照表：\n`;
    if (excelData.columns) {
        // 收集所有出现的缩写词和专业术语
        const uniqueTerms = new Set();
        for (const [colKey, column] of Object.entries(excelData.columns)) {
            for (const cell of column) {
                if (cell && cell.trim() && !cell.match(/^\d+$/)) { // 非空且非纯数字
                    uniqueTerms.add(cell.trim());
                }
            }
        }
        domainGlossary += Array.from(uniqueTerms).join(', ');
    }
    return domainGlossary;
}
/**
 * 为特定列构建翻译上下文
 * @param columnHeader 列标题
 * @param columnContent 列内容
 * @param topic 主题
 * @param domainGlossary 专业词汇表
 * @returns 列翻译上下文
 */
function buildColumnContext(columnHeader, columnContent, topic, domainGlossary) {
    let columnContext = `${topic}领域中的"${columnHeader}"术语和数据`;
    // 加入词汇表信息
    columnContext += `\n${domainGlossary}`;
    return columnContext;
}
