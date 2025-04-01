import { DeepSeekService } from './deepseek';

/** 服务实例类型 */
interface ServiceInstances {
  deepSeekService: DeepSeekService;
  excelService: any;
}

/** 服务聚合对象类型扩展 */
interface ServicesType {
  deepseek: DeepSeekService;
  getInstance: () => ServiceInstances;
}

/** 声明 Services 变量类型 */
declare const Services: ServicesType;

export { Services, ServiceInstances, ServicesType }; 