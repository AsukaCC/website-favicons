/**
 * 图标数据接口定义
 */
export interface Icon {
  id: string;
  name: string;
  path: string;
  description: {
    zh: string;
    en: string;
  };
  color: string;
  url: string;
}
