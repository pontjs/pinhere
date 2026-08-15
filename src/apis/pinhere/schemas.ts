/**
 * @title 错误响应
 * @description 所有失败响应使用的稳定错误封装。
 */
export type ErrorResponse = {
  /**
   * @description 错误详情。
   */
  error: {
    /**
     * @description 机器可读错误码。
     */
    code: string;
    /**
     * @description 面向调用方的错误说明。
     */
    message: string;
    /**
     * @description 用于排障的请求标识。
     */
    requestId: string
  };
}

/**
 * @title 项目
 * @description 属于当前账号的 Pinhere 项目。
 */
export type Project = {
  /**
   * @description 项目 ID。
   */
  id: string;
  /**
   * @description 项目所有者 ID。
   */
  userId: string;
  /**
   * @description 项目名称。
   */
  name: string;
  /**
   * @description 项目说明。
   */
  description: string;
  /**
   * @description 创建时间。
   */
  createdAt: string;
  /**
   * @description 最后更新时间。
   */
  updatedAt: string;
  /**
   * @description 用于 ETag 与 If-Match 的资源版本。
   */
  version: number;
}

/**
 * @title 项目详情
 * @description 项目及其标准化 Origin。
 */
export type ProjectWithOrigins = any

/**
 * @title 创建项目输入
 * @description 创建项目并可同时设置 Origin。
 */
export type ProjectInput = {
  /**
   * @description 去除首尾空白后的项目名称。
   */
  name: string;
  /**
   * @description 项目说明，缺省为空字符串。
   */
  description?: string;
  /**
   * @description 要归属于项目的页面 Origin。
   */
  origins?: Array<string>;
}

/**
 * @title 更新项目输入
 * @description 可选更新项目名称或说明。
 */
export type ProjectUpdateInput = {
  /**
   * @description 新的项目名称。
   */
  name?: string;
  /**
   * @description 新的项目说明。
   */
  description?: string;
}

/**
 * @title Origin 输入
 * @description 要添加到项目的 Origin。
 */
export type OriginInput = {
  /**
   * @description 将按协议、域名和端口进行标准化的 URL。
   */
  origin: string;
}

/**
 * @title Origin 结果
 * @description 已添加 Origin 与新的项目版本。
 */
export type OriginResult = {
  /**
   * @description 标准化后的 Origin。
   */
  origin: string;
  /**
   * @description 添加后的项目版本。
   */
  projectVersion: number;
}

/**
 * @title 项目解析结果
 * @description 匹配项目及标准化 Origin。
 */
export type ResolveProjectResult = {
  /**
   * @description 匹配项目；未匹配时为 null。
   */
  project: Project;
  /**
   * @description 从页面 URL 提取的标准化 Origin。
   */
  origin: string;
}

/**
 * @title DOM 上下文
 * @description 浏览器扩展采集并清洗的目标元素上下文。
 */
export type DomContext = {
  /**
   * @description 目标元素 CSS 选择器。
   */
  cssSelector: string;
  /**
   * @description 目标元素 XPath。
   */
  xpath: string;
  /**
   * @description 大写 HTML 标签名。
   */
  tagName: string;
  /**
   * @description 清洗后的元素属性；每个值最多 2000 字符。
   */
  attributes: Record<any, string>;
  /**
   * @description 目标元素文本。
   */
  text: string;
  /**
   * @description 清洗后的目标元素 HTML。
   */
  outerHTML: string;
  /**
   * @description 采集时的视口。
   */
  viewport: {
    /**
     * @description CSS 像素宽度。
     */
    width: number;
    /**
     * @description CSS 像素高度。
     */
    height: number;
    /**
     * @description 设备像素比。
     */
    devicePixelRatio: number
  };
  /**
   * @description 元素相对视口的矩形。
   */
  boundingRect: {
    /**
     * @description 左侧坐标。
     */
    x: number;
    /**
     * @description 顶部坐标。
     */
    y: number;
    /**
     * @description 矩形宽度。
     */
    width: number;
    /**
     * @description 矩形高度。
     */
    height: number
  };
}

/**
 * @title 缺陷状态
 * @description 缺陷状态机的固定状态。
 */
export type IssueStatus = 'open' | 'in_progress' | 'done'

/**
 * @title 缺陷来源
 * @description 创建缺陷的调用来源。
 */
export type IssueSource = 'extension' | 'web' | 'api'

/**
 * @title 缺陷
 * @description 包含页面上下文与处理状态的私有缺陷。
 */
export type Issue = {
  /**
   * @description 缺陷 ID。
   */
  id: string;
  /**
   * @description 缺陷所有者 ID。
   */
  userId: string;
  /**
   * @description 所属项目 ID。
   */
  projectId: string;
  /**
   * @description 缺陷标题。
   */
  title: string;
  /**
   * @description 缺陷正文。
   */
  description: string;
  /**
   * @description 去除敏感查询参数后的页面 URL。
   */
  pageUrl: string;
  dom: DomContext;
  status: IssueStatus;
  source: IssueSource;
  /**
   * @description 关联截图 ID。
   */
  attachmentId?: string;
  /**
   * @description 当前领取方的凭证或账号标识。
   */
  claimedByTokenId?: string;
  /**
   * @description 领取时间。
   */
  claimedAt?: string;
  /**
   * @description 完成时间。
   */
  completedAt?: string;
  /**
   * @description 完成摘要。
   */
  completionSummary?: string;
  /**
   * @description 创建时间。
   */
  createdAt: string;
  /**
   * @description 最后更新时间。
   */
  updatedAt: string;
  /**
   * @description 用于并发控制的资源版本。
   */
  version: number;
}

/**
 * @title 缺陷详情
 * @description 缺陷及鉴权截图下载路径。
 */
export type IssueDetail = any

/**
 * @title 创建缺陷输入
 * @description 浏览器、网站或 API 提交的完整缺陷上下文。
 */
export type IssueInput = {
  /**
   * @description 页面 Origin 已归属的项目 ID。
   */
  projectId: string;
  /**
   * @description 缺陷标题。
   */
  title: string;
  /**
   * @description 缺陷正文。
   */
  description: string;
  /**
   * @description 产生缺陷的页面 URL。
   */
  pageUrl: string;
  dom: DomContext;
  /**
   * @description 尚未绑定的私有截图 ID。
   */
  attachmentId?: string;
  source?: IssueSource;
}

/**
 * @title 更新缺陷输入
 * @description 可选更新缺陷标题或正文。
 */
export type IssueUpdateInput = {
  /**
   * @description 新的缺陷标题。
   */
  title?: string;
  /**
   * @description 新的缺陷正文。
   */
  description?: string;
}

/**
 * @title 缺陷事件
 * @description 缺陷状态与内容变化的审计事件。
 */
export type IssueEvent = {
  /**
   * @description 事件 ID。
   */
  id: string;
  /**
   * @description 缺陷 ID。
   */
  issueId: string;
  /**
   * @description 账号 ID。
   */
  userId: string;
  /**
   * @description 执行方类型。
   */
  actorType: 'user' | 'api_token' | 'extension';
  /**
   * @description 执行方标识。
   */
  actorId?: string;
  /**
   * @description 事件类型。
   */
  type: string;
  /**
   * @description 事件特定的非敏感结构化数据。
   */
  data: Record<any, any>;
  /**
   * @description 事件时间。
   */
  createdAt: string;
}

/**
 * @title 领取下一条缺陷输入
 * @description 限定待领取缺陷所属项目。
 */
export type ClaimNextInput = {
  /**
   * @description 项目 ID。
   */
  projectId: string;
}

/**
 * @title 领取下一条缺陷结果
 * @description 原子领取的缺陷；无待处理缺陷时为 null。
 */
export type ClaimNextResult = {
  /**
   * @description 已领取缺陷或 null。
   */
  issue: Issue;
}

/**
 * @title 释放缺陷输入
 * @description 可选记录释放原因。
 */
export type ReleaseInput = {
  /**
   * @description 释放原因。
   */
  reason?: string;
}

/**
 * @title 完成缺陷输入
 * @description 记录完成处理的摘要。
 */
export type CompleteInput = {
  /**
   * @description 完成摘要。
   */
  summary: string;
}

/**
 * @title 截图上传输入
 * @description 最多 2 MiB 的 Base64 PNG、JPEG 或 WebP。
 */
export type AttachmentInput = {
  /**
   * @description 安全显示的文件名。
   */
  fileName: string;
  /**
   * @description 允许的图片媒体类型。
   */
  contentType: 'image/png' | 'image/jpeg' | 'image/webp';
  /**
   * @description 原始 Base64 或 data URL 形式的图片字节；不得在日志中记录。
   */
  base64: string;
}

/**
 * @title 截图元数据
 * @description 已私有保存的截图元数据。
 */
export type Attachment = {
  /**
   * @description 截图 ID。
   */
  id: string;
  /**
   * @description 文件名。
   */
  fileName: string;
  /**
   * @description 图片媒体类型。
   */
  contentType: string;
  /**
   * @description 解码后的字节数。
   */
  byteSize: number;
}

/**
 * @description 接收 issue.created 事件的 HTTPS Webhook。
 */
export type Webhook = {
  /**
   * @description Webhook ID.
   */
  id: string;
  /**
   * @description 可选项目过滤器。
   */
  projectId?: string;
  /**
   * @description 显示名称。
   */
  name: string;
  /**
   * @description 通过 SSRF 校验的公网 HTTPS URL。
   */
  url: string;
  /**
   * @description 是否接收新投递。
   */
  enabled: boolean;
  /**
   * @description 创建时间。
   */
  createdAt: string;
  /**
   * @description 最后更新时间。
   */
  updatedAt: string;
  /**
   * @description 用于 If-Match 的资源版本。
   */
  version: number;
}

/**
 * @title 创建 Webhook 输入
 * @description 创建账号级或项目级 Webhook。
 */
export type WebhookInput = {
  /**
   * @description 显示名称。
   */
  name: string;
  /**
   * @description 公网 HTTPS 投递 URL。
   */
  url: string;
  /**
   * @description 可选项目过滤器。
   */
  projectId?: string;
}

/**
 * @title 更新 Webhook 输入
 * @description 可选更新名称、URL 或启用状态。
 */
export type WebhookUpdateInput = {
  /**
   * @description 新的显示名称。
   */
  name?: string;
  /**
   * @description 新的公网 HTTPS URL。
   */
  url?: string;
  /**
   * @description 新的启用状态。
   */
  enabled?: boolean;
}

/**
 * @title Webhook 创建结果
 * @description 新 Webhook 与只显示一次的签名 Secret。
 */
export type WebhookWithSecret = any

/**
 * @title Secret 结果
 * @description 只显示一次的新 Webhook Secret。
 */
export type SecretResult = {
  /**
   * @description 只显示一次且不得记录的签名 Secret。
   */
  secret: string;
}

/**
 * @title 投递引用
 * @description 已创建或排队的 Webhook 投递。
 */
export type DeliveryReference = {
  /**
   * @description 投递 ID。
   */
  deliveryId: string;
}

/**
 * @title Webhook 投递
 * @description Webhook 投递状态与受限诊断信息。
 */
export type WebhookDelivery = {
  /**
   * @description 投递 ID。
   */
  id: string;
  /**
   * @description Webhook ID.
   */
  webhookId: string;
  /**
   * @description 事件 ID。
   */
  eventId: string;
  /**
   * @description 当前固定为 issue.created。
   */
  eventType: 'issue.created';
  /**
   * @description 投递负载；可能包含私有缺陷标识。
   */
  payload: Record<any, any>;
  /**
   * @description 投递状态。
   */
  status: 'pending' | 'delivered' | 'failed';
  /**
   * @description 已尝试次数。
   */
  attempt: number;
  /**
   * @description 下次尝试时间。
   */
  nextAttemptAt: string;
  /**
   * @description 目标服务器状态码。
   */
  responseStatus?: number;
  /**
   * @description 受限响应摘要。
   */
  responseBody?: string;
  /**
   * @description 最后一次错误摘要。
   */
  lastError?: string;
  /**
   * @description 成功投递时间。
   */
  deliveredAt?: string;
  /**
   * @description 创建时间。
   */
  createdAt: string;
  /**
   * @description 最后更新时间。
   */
  updatedAt: string;
}

/**
 * @title API Token 元数据
 * @description 不含明文 PAT 的自动化凭证元数据。
 */
export type ApiToken = {
  /**
   * @description Token ID。
   */
  id: string;
  /**
   * @description Token 名称。
   */
  name: string;
  /**
   * @description 用于识别而非认证的安全前缀。
   */
  prefix: string;
  /**
   * @description 固定自动化权限。
   */
  scopes: Array<'projects:read' | 'issues:read' | 'issues:write'>;
  /**
   * @description 最后使用时间。
   */
  lastUsedAt?: string;
  /**
   * @description 过期时间；null 表示不过期。
   */
  expiresAt?: string;
  /**
   * @description 创建时间。
   */
  createdAt: string;
}

/**
 * @title 创建 API Token 输入
 * @description 创建具有固定自动化权限的 PAT。
 */
export type ApiTokenInput = {
  /**
   * @description Token 名称。
   */
  name: string;
  /**
   * @description 可选过期时间。
   */
  expiresAt?: string;
}

/**
 * @title API Token 创建结果
 * @description Token 元数据与只显示一次的 PAT。
 */
export type ApiTokenWithSecret = any

/**
 * @title 扩展授权输入
 * @description 网站 Session 为 Chrome 扩展签发一次性 PKCE 授权码。
 */
export type OAuthAuthorizeInput = {
  /**
   * @description HTTPS chromiumapp.org 扩展回调 URL。
   */
  redirectUri: string;
  /**
   * @description Base64url SHA-256 PKCE challenge。
   */
  codeChallenge: string;
}

/**
 * @title 扩展授权结果
 * @description 包含一次性授权码的扩展回调 URL。
 */
export type OAuthAuthorizeResult = {
  /**
   * @description 调用方应立即打开且不得记录的回调 URL。
   */
  redirectUrl: string;
}

/**
 * @title OAuth Token 交换输入
 * @description 使用授权码与 PKCE verifier，或轮换刷新令牌。
 */
export type OAuthTokenInput = any

/**
 * @title OAuth Token 结果
 * @description 扩展访问与刷新凭证。
 */
export type OAuthTokenResult = {
  /**
   * @description 15 分钟有效的 Bearer Token；不得记录。
   */
  accessToken: string;
  /**
   * @description 轮换式刷新令牌；不得记录。
   */
  refreshToken: string;
  /**
   * @description 访问令牌有效秒数。
   */
  expiresIn: number;
  /**
   * @description 认证方案。
   */
  tokenType: string;
  /**
   * @description 扩展固定权限。
   */
  scopes: Array<'projects:read' | 'issues:create' | 'attachments:write'>;
}