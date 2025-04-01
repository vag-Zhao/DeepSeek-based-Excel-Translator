const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const config = {
  outputDir: 'Release-Package',
  buildDir: 'build',
  distFiles: [
    'example.env', // 示例环境变量文件
    '使用说明.txt', // 使用说明
    'samples',     // 示例文件目录
  ],
  targets: [
    { name: 'windows', target: 'node16-win-x64', ext: '.exe' },
    { name: 'macos', target: 'node16-macos-x64', ext: '' },
    { name: 'linux', target: 'node16-linux-x64', ext: '' }
  ]
};

// 创建输出目录
function createDirectories() {
  console.log('创建输出目录...');
  
  if (!fs.existsSync(config.buildDir)) {
    fs.mkdirSync(config.buildDir);
  }
  
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir);
  }
  
  // 为每个目标平台创建子目录
  for (const target of config.targets) {
    const targetDir = path.join(config.outputDir, target.name);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }
  }
}

// 编译TypeScript代码
function buildTypeScript() {
  console.log('编译TypeScript代码...');
  execSync('npm run build', { stdio: 'inherit' });
}

// 使用pkg打包可执行文件
function packageExecutables() {
  console.log('打包可执行文件...');
  
  for (const target of config.targets) {
    const outputFile = `${config.buildDir}/excel翻译工具-${target.name}${target.ext}`;
    
    console.log(`正在打包 ${target.name}...`);
    execSync(`npx pkg . --targets ${target.target} --output ${outputFile}`, { stdio: 'inherit' });
    
    // 将可执行文件复制到对应的发布目录
    const targetDir = path.join(config.outputDir, target.name);
    const destFile = path.join(targetDir, `excel翻译工具${target.ext}`);
    
    fs.copyFileSync(outputFile, destFile);
    console.log(`已复制到 ${destFile}`);
  }
}

// 复制分发文件
function copyDistributionFiles() {
  console.log('复制分发文件...');
  
  for (const target of config.targets) {
    const targetDir = path.join(config.outputDir, target.name);
    
    // 复制所有分发文件
    for (const file of config.distFiles) {
      const sourcePath = path.resolve(file);
      
      if (fs.existsSync(sourcePath)) {
        const fileName = path.basename(file);
        const destPath = path.join(targetDir, fileName);
        
        // 处理目录的情况
        if (fs.statSync(sourcePath).isDirectory()) {
          copyDirectory(sourcePath, destPath);
        } else {
          // 修改example.env为.env
          const finalDestPath = fileName === 'example.env' 
            ? path.join(targetDir, '.env') 
            : destPath;
            
          fs.copyFileSync(sourcePath, finalDestPath);
          console.log(`已复制 ${sourcePath} 到 ${finalDestPath}`);
        }
      } else {
        console.warn(`警告: 找不到文件 ${sourcePath}`);
      }
    }
    
    // 创建空的输出目录
    const outputSamplesDir = path.join(targetDir, 'output');
    if (!fs.existsSync(outputSamplesDir)) {
      fs.mkdirSync(outputSamplesDir);
      console.log(`已创建输出目录 ${outputSamplesDir}`);
    }
  }
}

// 递归复制目录
function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
  
  console.log(`已复制目录 ${source} 到 ${destination}`);
}

// 创建样例CSV文件
function createSampleFile() {
  console.log('创建样例文件...');
  
  const samplesDir = path.resolve('samples');
  if (!fs.existsSync(samplesDir)) {
    fs.mkdirSync(samplesDir);
  }
  
  // 创建一个简单的样例CSV
  const sampleContent = `Header1,Header2,Header3
Data1,Data2,Data3
Information1,Information2,Information3
Example1,Example2,Example3`;
  
  const sampleFile = path.join(samplesDir, 'sample.csv');
  fs.writeFileSync(sampleFile, sampleContent);
  console.log(`已创建样例文件 ${sampleFile}`);
}

// 主函数
function main() {
  console.log('===== 开始打包Excel翻译工具 =====');
  
  try {
    createDirectories();
    buildTypeScript();
    createSampleFile();
    packageExecutables();
    copyDistributionFiles();
    
    console.log('===== 打包完成! =====');
    console.log(`打包文件已保存在 ${path.resolve(config.outputDir)} 目录`);
  } catch (error) {
    console.error('打包过程中出错:', error);
    process.exit(1);
  }
}

// 执行主函数
main(); 