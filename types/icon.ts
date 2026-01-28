/**
 * 图标数据接口定义
 */
export interface Icon {
  name: string;
  path: string;
  description: {
    zh: string;
    en: string;
  };
  color: string;
  url: string;
}
