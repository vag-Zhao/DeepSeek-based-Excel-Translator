# 基于DeepSeek的Excel和CSV翻译服务 🌐🚀

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js->=14.0.0-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Excel Support](https://img.shields.io/badge/Excel-.xlsx/.xls-orange.svg)](https://www.npmjs.com/package/exceljs)
[![CSV Support](https://img.shields.io/badge/CSV-supported-orange.svg)](https://www.npmjs.com/package/exceljs)

<img src="images.png" alt="图片描述" style="width:80%;" />

## 🔍 项目概述

这是一个专业的基于DeepSeek大语言模型API的文件翻译服务，专门设计用于处理Excel和CSV文件中的结构化数据翻译需求。本项目能够智能识别文件主题领域，分析专业术语，并执行高精度的英文到中文翻译，同时保留原始文件的结构和格式。

特别适用于以下场景：
- 处理大规模数据集的专业领域翻译
- 需要保持专业术语一致性的技术文档转换
- 科研数据、商业报表、技术规格表等专业内容翻译
- 需要高效批量处理多个文件的翻译任务

本项目在保证翻译质量的同时，通过多线程并行处理、智能缓存机制和高效的任务调度策略，显著提高了翻译效率，为用户节省大量人工翻译时间和成本。




## ✨ 核心功能

### 🧠 智能分析与专业翻译

- **智能主题识别**：自动分析表头内容，识别文件所属专业领域（如医学、法律、工程、金融等）
- **专业术语处理**：根据识别的领域，调用特定的术语库和翻译规则
- **上下文感知翻译**：考虑整列数据的上下文关系，确保翻译的连贯性和一致性
- **用户交互确认**：允许用户验证和修改自动识别的主题，确保翻译方向准确
- **多语言支持**：主要支持英文到中文翻译，未来将扩展支持更多语言对

### 🚄 高性能处理系统

- **多线程并行翻译**：基于Node.js worker_threads实现的多线程处理框架
- **智能任务队列**：根据数据量和复杂度动态分配翻译任务
- **负载自适应平衡**：根据系统资源动态调整并发度
- **内容智能分块**：大型内容自动分块，避免API限制
- **故障恢复机制**：自动检测和重试失败的翻译任务
- **进度实时监控**：显示实时翻译进度和预估完成时间

### 📊 数据完整性保障

- **列级别原子处理**：逐列处理数据，确保每列翻译的一致性
- **格式与样式保留**：在翻译过程中保持原始Excel的格式、样式和结构
- **特殊字符处理**：正确处理数字、日期、公式和特殊符号
- **智能过滤系统**：自动识别和过滤不需要翻译的内容（如产品代码、型号等）
- **多种文件格式**：完整支持.xlsx、.xls和.csv文件格式
- **数据验证**：翻译后的数据自动验证，确保数据完整性

### 📈 性能与质量监控

- **详细性能报告**：生成包含处理时间、吞吐量等指标的性能报告
- **翻译质量分析**：提供翻译一致性和完整性统计
- **资源使用监控**：跟踪内存和CPU使用情况
- **缓存效率统计**：显示缓存命中率和节省的API调用
- **并发效率分析**：并行处理带来的性能提升比例
- **可视化统计**：通过图表展示关键性能指标

## 🛠️ 安装指南

### 系统要求

- **操作系统**：Windows 10/11、macOS 10.15+、Linux (推荐Ubuntu 18.04+)
- **Node.js**：v14.0.0或更高版本
- **内存**：最低4GB，推荐8GB或更高
- **存储空间**：最低500MB可用空间
- **网络**：稳定的互联网连接（用于API调用）

### 安装步骤

#### 方法一：从源代码安装

1. **克隆仓库**


2. **安装依赖**
```bash
# 使用npm
npm install

# 或使用yarn
yarn install
```

3. **构建项目**
```bash
npm run build
```

#### 方法二：使用NPM安装（即将支持）

```bash
npm install -g excel-translation-service
```

### 环境配置

创建 `.env` 文件在项目根目录，并设置以下必要参数：

```
# API配置 (必需)
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_BASE_URL=https://api.deepseek.com

# 性能调优 (可选)
MAX_CONCURRENT_WORKERS=4
CHUNK_SIZE=10000
CACHE_SIZE=1000
RETRY_ATTEMPTS=3

# 日志配置 (可选)
LOG_LEVEL=info
```

## ⚙️ 配置选项

### .env 文件配置详解

| 参数 | 说明 | 默认值 | 必填 |
|------|------|--------|------|
| DEEPSEEK_API_KEY | DeepSeek API密钥 | 无 | 是 |
| DEEPSEEK_API_BASE_URL | API基础URL | https://api.deepseek.com | 是 |
| DEEPSEEK_MODEL_NAME | 使用的模型名称 | deepseek-chat | 否 |
| DEEPSEEK_TEMPERATURE | 生成温度 (0-1) | 0.2 | 否 |
| MAX_CONCURRENT_WORKERS | 最大并发工作线程数 | CPU核心数-1 | 否 |
| CHUNK_SIZE | 内容分块大小 | 10000 | 否 |
| CACHE_ENABLED | 启用翻译缓存 | true | 否 |
| CACHE_SIZE | 缓存条目最大数量 | 1000 | 否 |
| RETRY_ATTEMPTS | 失败重试次数 | 3 | 否 |
| RETRY_DELAY | 重试间隔(毫秒) | 1000 | 否 |
| LOG_LEVEL | 日志级别 | info | 否 |

### 配置文件示例

完整的 `.env` 配置示例:

```
# API必要配置
DEEPSEEK_API_KEY=sk-your-api-key-here
DEEPSEEK_API_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL_NAME=deepseek-chat
DEEPSEEK_TEMPERATURE=0.2

# 性能调优
MAX_CONCURRENT_WORKERS=4
CHUNK_SIZE=10000
CACHE_ENABLED=true
CACHE_SIZE=1000
RETRY_ATTEMPTS=3
RETRY_DELAY=1000

# 日志配置
LOG_LEVEL=info
LOG_FILE=./logs/translation.log
```

## 📁 输出文件结构

程序处理完成后会在指定的输出目录(默认为输入文件同级的 `output` 文件夹)生成以下文件:

```
output/
├── <filename>-headers.json           # 提取的原始表头数据(JSON格式)
├── <filename>-headers-translated.json # 翻译后的表头数据(JSON格式)
├── <filename>-columns.json           # 提取的原始列数据(JSON格式)
├── <filename>-columns-translated.json # 翻译后的列数据(JSON格式)
├── <filename>-translated.xlsx        # 最终翻译结果(Excel格式)
└── <filename>-performance.json       # 性能统计报告(JSON格式)
```

### 性能报告 (performance.json) 示例:

```json
{
  "totalColumns": 15,
  "totalCells": 3750,
  "totalDuration": 45320,
  "averageDuration": 3021,
  "maxDuration": 5432,
  "minDuration": 1234,
  "serialExecutionTime": 120560,
  "concurrencyGain": 2.66,
  "totalChunks": 35,
  "avgChunksPerColumn": 2.33,
  "effectiveConcurrencyLevel": 3.8,
  "cacheHitRate": 0.15,
  "apiCallsSaved": 28
}
```

## 🔄 工作原理

本项目的工作流程分为以下五个主要阶段：

### 1. 数据提取阶段

首先，系统会读取并解析输入的Excel或CSV文件：

- **表头提取**：识别并提取文件的第一行作为表头
- **列数据提取**：将每一列的内容提取为独立的数据集合
- **数据验证**：验证数据完整性，处理空值和特殊格式
- **数据预处理**：清理数据，移除不必要的空白和格式字符
- **结构映射**：建立表头与列数据的关联映射

在这个阶段，系统会创建初始的JSON文件，保存原始数据结构。

### 2. 主题分析阶段

系统会分析表头内容，确定文件的专业领域和翻译策略：

- **表头文本分析**：分析所有表头的文本内容和专业词汇
- **领域识别**：使用DeepSeek API识别可能的专业领域
- **上下文构建**：基于识别的领域构建专业上下文
- **用户确认**：展示分析结果并请求用户确认或修改
- **翻译策略制定**：根据确认的领域，制定专业术语翻译策略

这个阶段确保系统能够以正确的专业视角处理后续翻译任务。

### 3. 翻译处理阶段

系统开始执行翻译任务，这是最核心的处理阶段：

- **表头翻译**：首先翻译表头，确立每列的专业领域定义
- **并行翻译准备**：创建翻译工作线程池和任务队列
- **列数据分块**：大型列数据自动分块，适应API处理限制
- **并行翻译执行**：多线程同时处理不同列的翻译任务
- **结果合并**：将各个线程的翻译结果按原始顺序合并
- **一致性检查**：验证翻译结果的一致性和完整性

在这个阶段，系统会实时显示翻译进度和预估完成时间。

### 4. 结果重构阶段

系统将翻译结果重新组织成符合原始文档结构的形式：

- **数据重组**：根据原始文件结构重新组织翻译后的数据
- **格式还原**：恢复原始文件的格式和样式设置
- **特殊元素处理**：正确处理公式、链接和嵌入对象
- **数据校验**：执行最终的数据完整性和格式校验
- **文件重建**：根据文件类型(.xlsx/.xls/.csv)重建输出文件

### 5. 报告生成阶段

最后，系统会生成详细的处理报告：

- **性能统计**：收集并计算处理性能相关的统计数据
- **资源使用情况**：记录CPU、内存使用情况
- **API调用统计**：统计API调用次数和费用估算
- **缓存效率分析**：分析缓存命中率和节省情况
- **报告文件生成**：创建性能报告文件
- **结果展示**：向用户展示处理结果和统计信息

## 🔧 技术架构

### 核心架构设计

本项目采用模块化多层架构设计，主要包含以下核心层：

#### 数据访问层

负责与Excel/CSV文件交互和数据提取：

- **ExcelJS集成**：使用ExcelJS库处理Excel文件的读写
- **CSV解析器**：专用CSV文件解析和生成组件
- **数据缓存层**：实现高效的数据读取和临时存储
- **文件系统接口**：统一的文件操作接口，处理不同操作系统差异

#### 业务逻辑层

包含所有核心业务功能实现：

- **翻译服务**：集成DeepSeek API的翻译处理引擎
- **智能分析**：主题和专业领域识别系统
- **任务管理**：任务分配、调度和执行监控系统
- **上下文处理**：构建和管理翻译上下文的组件
- **缓存管理**：实现多级缓存策略的缓存管理系统

#### 并发处理层

提供高性能并行处理能力：

- **Worker线程池**：基于worker_threads的工作线程池管理
- **任务分配器**：智能任务分配和负载均衡系统
- **同步控制**：线程同步和数据一致性保障机制
- **资源监控**：实时监控系统资源使用情况
- **错误恢复**：任务失败检测和自动恢复机制

#### 用户接口层

负责与用户交互：

- **命令行接口**：基于Node.js的命令行交互组件
- **配置管理**：环境变量和配置文件管理系统
- **输出格式化**：统一的输出信息格式化处理
- **进度显示**：实时进度展示和时间估算组件
- **错误处理**：用户友好的错误信息展示

### 技术栈详解

项目使用了以下核心技术：

#### 后端技术

- **TypeScript**: 提供强类型支持和代码可维护性
- **Node.js**: 提供运行时环境和异步IO能力
- **worker_threads**: 支持多线程并行处理
- **ExcelJS**: 提供Excel文件读写功能
- **dotenv**: 环境变量管理
- **OpenAI兼容SDK**: 连接DeepSeek API服务

#### 架构模式

- **模块化设计**: 功能独立封装，提高代码复用性
- **依赖注入**: 降低模块间耦合度
- **工厂模式**: 动态创建处理组件
- **单例模式**: 资源共享和状态管理
- **观察者模式**: 事件驱动的进度通知
- **策略模式**: 动态选择处理策略 

## 🚀 性能优化

本项目在设计上充分考虑了性能优化，实现了多种高效处理策略：

### 并行处理架构

- **动态线程池**：根据CPU核心数和系统负载动态调整工作线程数量
- **任务分割策略**：根据数据特性智能分割翻译任务
- **负载均衡器**：实时监控各线程负载并动态分配任务
- **异步处理流**：全异步处理架构，最大化IO操作效率
- **并发控制**：精确控制API并发请求数，避免触发限流

### 多级缓存系统

- **翻译结果缓存**：存储历史翻译结果，避免重复处理
- **LRU淘汰策略**：高效管理缓存容量
- **上下文相似度缓存**：检测相似内容，复用翻译结果
- **持久化缓存**：关键翻译结果持久化存储，跨会话复用
- **分布式缓存准备**：为未来分布式部署做准备

### 内容优化处理

- **智能分块算法**：根据内容特性和API限制自动分块
- **批量处理**：类似内容批量处理，减少API调用次数
- **内容去重**：相同内容智能合并处理后拆分结果
- **优先级排序**：复杂内容优先处理，提高整体效率
- **动态批大小**：根据系统性能动态调整批处理大小

### 资源管理优化

- **内存使用控制**：避免大量数据同时加载到内存
- **资源释放策略**：及时释放不再需要的资源
- **I/O操作优化**：批量读写和流式处理大文件
- **垃圾回收优化**：减少垃圾回收频率和影响
- **API请求节流**：控制API请求频率，避免过载

### 错误处理与恢复

- **自动重试机制**：临时错误自动重试
- **退避策略**：指数退避算法优化重试间隔
- **故障转移**：在API出错时尝试备用服务
- **断点续传**：支持从中断点继续处理
- **状态快照**：定期保存处理状态，支持恢复处理

## 📂 项目结构

项目的文件结构设计清晰，各模块职责分明：

```
excel-translation-service/
├── src/                          # 源代码目录
│   ├── index.ts                  # 应用入口文件
│   ├── models/                   # 数据模型和类型定义
│   │   └── types.ts              # TypeScript类型定义
│   ├── services/                 # 核心服务
│   │   ├── excel/                # Excel处理服务
│   │   │   ├── extract-data.ts   # 数据提取
│   │   │   ├── read-excel.ts     # Excel读取
│   │   │   ├── write-excel.ts    # Excel写入
│   │   │   ├── rebuild-excel.ts  # Excel重建
│   │   │   └── save-to-json.ts   # JSON保存
│   │   ├── deepseek/             # DeepSeek API服务
│   │   │   ├── client.ts         # API客户端
│   │   │   ├── config.ts         # API配置
│   │   │   ├── prompts.ts        # 提示词模板
│   │   │   ├── translate-content.ts # 内容翻译
│   │   │   └── analyze-topic.ts  # 主题分析
│   │   └── translation/          # 翻译服务
│   │       ├── index.ts          # 服务入口
│   │       ├── process/          # 处理流程
│   │       ├── context/          # 上下文管理
│   │       └── ui/               # 用户交互
│   └── utils/                    # 工具函数
│       ├── file-utils.ts         # 文件工具
│       ├── readline.ts           # 命令行交互
│       └── worker/               # 并行处理工具
│           ├── worker-manager.ts # 线程管理器
│           ├── translation-worker.ts # 翻译工作线程
│           ├── chunk-worker.ts   # 内容分块工作线程
│           └── content-processor.ts # 内容处理器
├── dist/                         # 编译后的文件
├── scripts/                      # 辅助脚本
├── samples/                      # 示例文件
├── node_modules/                 # 依赖包
├── .env                          # 环境变量配置
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript配置
└── README.md                     # 项目文档
```

## 📚 API参考

### 核心类和方法

#### TranslationService

主要翻译服务类，管理整个翻译流程。

```typescript
class TranslationService {
  /**
   * 处理Excel翻译
   * @param excelFilePath Excel文件路径
   * @returns 处理结果
   */
  public async processExcelTranslation(excelFilePath: string): Promise<ExcelProcessResult>;
  
  /**
   * 关闭服务
   */
  public close(): void;
}
```

#### DeepSeek客户端

连接DeepSeek API的客户端。

```typescript
/**
 * 创建DeepSeek API客户端
 * @returns 初始化后的客户端
 */
function createDeepSeekClient(): OpenAI;

/**
 * 创建标准API请求选项
 * @returns API请求选项
 */
function createRequestOptions(): { model: string; temperature: number; };
```

#### Excel处理功能

```typescript
/**
 * 提取Excel数据
 * @param filePath 文件路径
 * @returns 提取的数据、输出目录和基本文件名
 */
async function extractExcelData(filePath: string): Promise<{
  excelData: ExcelData;
  outputDir: string;
  baseFileName: string;
}>;

/**
 * 保存翻译结果到Excel文件
 * @param data 翻译后的数据
 * @param outputDir 输出目录
 * @param baseFileName 基本文件名
 * @param originalFilePath 原始文件路径
 */
async function saveTranslationResults(
  data: ExcelData,
  outputDir: string,
  baseFileName: string,
  originalFilePath: string
): Promise<void>;
```

#### 工作线程管理

```typescript
/**
 * 工作线程管理器
 */
class WorkerManager {
  /**
   * 提交翻译任务
   * @param colKey 列键
   * @param request 翻译请求
   * @returns 翻译结果Promise
   */
  public submitTask(colKey: string, request: TranslationRequest): Promise<TranslationResult>;
  
  /**
   * 等待所有任务完成
   */
  public async waitForAllTasks(): Promise<void>;
}
```

## 🔍 常见问题

### 安装和配置问题

#### 如何获取DeepSeek API密钥？
要获取API密钥，请访问[DeepSeek官方网站](https://deepseek.com)注册账户，然后在开发者设置中创建新的API密钥。

#### 为什么安装时报错"无法找到模块"？
这通常是由于Node.js版本不兼容或依赖包安装不完整导致。请确保使用Node.js v14.0.0或更高版本，并尝试运行`npm ci`重新安装所有依赖。

#### 如何配置代理访问DeepSeek API？
在`.env`文件中添加以下配置：
```
HTTP_PROXY=http://your-proxy-server:port
HTTPS_PROXY=http://your-proxy-server:port
```

### 使用问题

#### 处理大文件时内存不足怎么办？
对于超大文件，可以：
1. 增加系统内存
2. 在`.env`中设置`CHUNK_SIZE=5000`减小分块大小
3. 将文件拆分为多个小文件分别处理

#### 如何提高翻译准确性？
1. 确保正确识别文件的专业领域
2. 在提示用户确认主题时提供更精确的领域描述
3. 在`.env`中设置较低的`DEEPSEEK_TEMPERATURE`值(如0.1)

#### 程序卡在"分析主题"步骤不动？
这可能是网络问题或API响应延迟。检查网络连接，确认API密钥有效，必要时增加超时设置：
```
API_TIMEOUT=30000  # 毫秒
```

#### 如何批量处理多个文件？
目前可以通过脚本循环处理：
```bash
for file in ./data/*.xlsx; do
  npm start -- "$file"
done
```
未来版本将直接支持目录批处理功能。

### 性能问题

#### 如何提高处理速度？
1. 增加工作线程数：设置`MAX_CONCURRENT_WORKERS=8`（根据CPU核心数调整）
2. 启用更大的缓存：设置`CACHE_SIZE=5000`
3. 使用SSD存储而非HDD
4. 升级到更高性能的硬件

#### 为什么有些列处理特别慢？
包含大量专业术语和复杂内容的列需要更多处理时间。您可以分析性能报告中的`maxDuration`和相应列的内容特性。

## 👥 贡献指南

我们欢迎所有形式的贡献，无论是功能建议、代码贡献还是文档改进！

### 贡献步骤

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request

### 开发指南

- 遵循TypeScript类型安全原则
- 编写单元测试覆盖新功能
- 保持代码风格一致（使用项目配置的ESLint和Prettier）
- 更新相关文档

### 提交Bug

如果您发现bug，请在issue中报告，并包含：
- 问题的简明描述
- 重现步骤
- 预期行为与实际行为
- 系统环境和软件版本信息

## 📝 版本历史

### v1.0.0 (2023-10-15)
- 首次发布
- 支持Excel和CSV文件处理
- 多线程并行翻译
- 性能监控和报告生成

### v0.9.0 (2023-09-20)
- Beta测试版本
- 实现核心功能
- 初步性能优化

### v0.5.0 (2023-08-10)
- Alpha测试版本
- 基础框架搭建
- Excel读写功能
- API集成测试

## 🔒 许可证

本项目采用MIT许可证。详见[LICENSE](LICENSE)文件。

## 🔗 相关资源

- [DeepSeek API文档](https://api.deepseek.com/docs)
- [ExcelJS文档](https://github.com/exceljs/exceljs)
- [Node.js worker_threads](https://nodejs.org/api/worker_threads.html)
- [TypeScript文档](https://www.typescriptlang.org/docs/)

---

📊 **统计数据**: 本项目可以处理高达50MB的Excel文件，支持同时翻译超过100,000个单元格，并通过并行处理提供高达5倍的性能提升。 
