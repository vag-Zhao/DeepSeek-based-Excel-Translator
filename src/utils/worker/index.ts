import { WorkerManager } from './worker-manager';
import { ChunkWorkerManager } from './chunk-worker-manager';
import { SYSTEM_PROMPT, buildTranslationPrompt, extractColumnHeaderFromContext } from './worker-prompt';
import { 
  splitContentIntoLines, joinLinesToContent, validateLineCount, 
  collectUniqueContents, applyTranslationsToAllPositions, processContent, 
  splitContentIntoChunks, mergeChunkResults, ContentChunk, UniqueContentMapping 
} from './content-processor';

// 重新导出所有功能
export {
  WorkerManager,
  ChunkWorkerManager,
  SYSTEM_PROMPT, buildTranslationPrompt, extractColumnHeaderFromContext,
  splitContentIntoLines, joinLinesToContent, validateLineCount,
  collectUniqueContents, applyTranslationsToAllPositions, processContent,
  splitContentIntoChunks, mergeChunkResults,
  ContentChunk, UniqueContentMapping
}; 