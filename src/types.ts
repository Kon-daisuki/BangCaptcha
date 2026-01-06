// 验证码接口
export interface CaptchaChallenge {
  id: string;          // 验证码ID 
  targetName: string;  // 角色名
  images: string[];    // 图片URL列表
}

// 行为轨迹点 [timestamp, x, y]
export type TracePoint = [number, number, number];

// 验证请求接口
export interface CaptchaVerifyRequest {
  id: string;          // ID
  selectedIndexes: number[]; // 选中图片索引 (0-8)
  traceData: TracePoint[];   // 鼠标移动轨迹
  startTime: number;         // 开始时间戳
}

// 验证响应接口
export interface CaptchaVerifyResponse {
  success: boolean;
  message: string;
}

// 角色数据定义
export interface Character {
  id: string;
  name: string;
  band: string;      // 乐队/番名
  images: string[];  // 图片库
}
