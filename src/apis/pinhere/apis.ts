/**
 * @author pontx-generator
 * @description API 类型定义
 */

import type * as schemas from './schemas';

// ============ projects 模块 ============

export declare namespace projects {
  export type ResolveProjectParams = {
    /**
     * @description 当前页面 URL。
     */
    url: string;
  };

}

export type projects = {
  /**
   * GET /projects
   * 列出当前账号的全部项目。
   * @summary: 列出项目
   */
  listProjects: (
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 项目列表。
   */
  data: Array<schemas.Project>
}>;

  /**
   * POST /projects
   * 创建个人项目并可同时设置最多 50 个 Origin。
   * @summary: 创建项目
   */
  createProject: (
    body: schemas.ProjectInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已创建项目。
   */
  data: schemas.Project
}>;

  /**
   * GET /projects/{projectId}
   * 获取项目、Origin 和并发控制版本。
   * @summary: 获取项目
   */
  getProject: (
    /**
     * @description 项目 ID。
     */
    projectId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 项目详情。
   */
  data: schemas.ProjectWithOrigins
}>;

  /**
   * PATCH /projects/{projectId}
   * 使用 If-Match 更新项目名称或说明。
   * @summary: 更新项目
   */
  updateProject: (
    /**
     * @description 项目 ID。
     */
    projectId: string,
    body: schemas.ProjectUpdateInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已更新项目。
   */
  data: schemas.Project
}>;

  /**
   * DELETE /projects/{projectId}
   * 删除项目及其缺陷、历史和截图。
   * @summary: 删除项目
   */
  deleteProject: (
    /**
     * @description 项目 ID。
     */
    projectId: string,
    requestInit?: RequestInit,
  ) => Promise<any>;

  /**
   * POST /projects/{projectId}/origins
   * 为项目添加标准化 Origin 并增加项目版本。
   * @summary: 添加 Origin
   */
  addProjectOrigin: (
    /**
     * @description 项目 ID。
     */
    projectId: string,
    body: schemas.OriginInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description Origin 添加结果。
   */
  data: schemas.OriginResult
}>;

  /**
   * DELETE /projects/{projectId}/origins/{encodedOrigin}
   * 从项目删除 URL 编码后的 Origin。
   * @summary: 删除 Origin
   */
  deleteProjectOrigin: (
    /**
     * @description 项目 ID。
     */
    projectId: string,
    /**
     * @description URL 编码后的标准化 Origin。
     */
    encodedOrigin: string,
    requestInit?: RequestInit,
  ) => Promise<any>;

  /**
   * GET /projects/resolve
   * 只比较页面 URL 的协议、域名和端口。
   * @summary: 按 URL 解析项目
   */
  resolveProject: (
    params: projects.ResolveProjectParams,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 项目解析结果。
   */
  data: schemas.ResolveProjectResult
}>;

};

// ============ issues 模块 ============

export declare namespace issues {
  export type ListIssuesParams = {
    /**
     * @description 上一页返回的 Base64url 时间游标。
     */
    cursor?: string;
    /**
     * @description 每页条数，缺省为 50。
     */
    limit?: number;
    /**
     * @description 按项目过滤。
     */
    projectId?: string;
    status?: schemas.IssueStatus;
    /**
     * @description 仅返回此时间之后更新的缺陷。
     */
    updatedAfter?: string;
  };

}

export type issues = {
  /**
   * GET /issues
   * 游标分页并支持项目、状态和更新时间过滤，最多返回 100 条。
   * @summary: 列出缺陷
   */
  listIssues: (
    params: issues.ListIssuesParams,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 资源列表。
   */
  data: Array<schemas.Issue>;
  /**
   * @description 分页元数据。
   */
  meta: {
    /**
     * @description 下一页游标；无下一页时为 null。
     */
    nextCursor: string
  }
}>;

  /**
   * POST /issues
   * 创建缺陷并在同一事务写入 issue.created Outbox。
   * @summary: 创建缺陷
   */
  createIssue: (
    body: schemas.IssueInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已创建缺陷。
   */
  data: schemas.Issue
}>;

  /**
   * GET /issues/{issueId}
   * 获取 DOM、截图路径、目标与状态上下文。
   * @summary: 获取缺陷
   */
  getIssue: (
    /**
     * @description 缺陷 ID。
     */
    issueId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 缺陷详情。
   */
  data: schemas.IssueDetail
}>;

  /**
   * PATCH /issues/{issueId}
   * 使用 If-Match 更新缺陷标题或正文。
   * @summary: 更新缺陷
   */
  updateIssue: (
    /**
     * @description 缺陷 ID。
     */
    issueId: string,
    body: schemas.IssueUpdateInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已更新缺陷。
   */
  data: schemas.Issue
}>;

  /**
   * DELETE /issues/{issueId}
   * 删除缺陷、历史与关联截图。
   * @summary: 删除缺陷
   */
  deleteIssue: (
    /**
     * @description 缺陷 ID。
     */
    issueId: string,
    requestInit?: RequestInit,
  ) => Promise<any>;

  /**
   * GET /issues/{issueId}/events
   * 按时间顺序返回缺陷审计事件。
   * @summary: 列出状态历史
   */
  listIssueEvents: (
    /**
     * @description 缺陷 ID。
     */
    issueId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 状态事件列表。
   */
  data: Array<schemas.IssueEvent>
}>;

  /**
   * POST /issues/{issueId}/claim
   * 仅 open 缺陷能被一个调用方原子认领。
   * @summary: 原子认领缺陷
   */
  claimIssue: (
    /**
     * @description 缺陷 ID。
     */
    issueId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已认领缺陷。
   */
  data: schemas.Issue
}>;

  /**
   * POST /issues/claim-next
   * 原子领取项目中最早的 open 缺陷；没有任务时 issue 为 null。
   * @summary: 领取最早缺陷
   */
  claimNextIssue: (
    body: schemas.ClaimNextInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 领取结果。
   */
  data: schemas.ClaimNextResult
}>;

  /**
   * POST /issues/{issueId}/release
   * 领取凭证或网站账号将 in_progress 缺陷恢复为 open。
   * @summary: 释放缺陷
   */
  releaseIssue: (
    /**
     * @description 缺陷 ID。
     */
    issueId: string,
    body: schemas.ReleaseInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已释放缺陷。
   */
  data: schemas.Issue
}>;

  /**
   * POST /issues/{issueId}/complete
   * 领取凭证或网站账号写入完成状态与摘要。
   * @summary: 完成缺陷
   */
  completeIssue: (
    /**
     * @description 缺陷 ID。
     */
    issueId: string,
    body: schemas.CompleteInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已完成缺陷。
   */
  data: schemas.Issue
}>;

  /**
   * POST /issues/{issueId}/reopen
   * 将 done 缺陷恢复为 open。
   * @summary: 重新打开缺陷
   */
  reopenIssue: (
    /**
     * @description 缺陷 ID。
     */
    issueId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已重新打开缺陷。
   */
  data: schemas.Issue
}>;

};

// ============ attachments 模块 ============

export type attachments = {
  /**
   * POST /attachments
   * 上传不超过 2 MiB 的 PNG、JPEG 或 WebP 到私有存储。
   * @summary: 上传截图
   */
  createAttachment: (
    body: schemas.AttachmentInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 截图元数据。
   */
  data: schemas.Attachment
}>;

  /**
   * GET /attachments/{attachmentId}
   * 鉴权后流式读取私有截图。
   * @summary: 读取截图
   */
  downloadAttachment: (
    /**
     * @description 截图 ID。
     */
    attachmentId: string,
    requestInit?: RequestInit,
  ) => Promise<Blob>;

};

// ============ webhooks 模块 ============

export type webhooks = {
  /**
   * GET /webhooks
   * 列出当前账号的 Webhook，不返回签名 Secret。
   * @summary: 列出 Webhook
   */
  listWebhooks: (
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description Webhook 列表。
   */
  data: Array<schemas.Webhook>
}>;

  /**
   * POST /webhooks
   * 创建只接收 issue.created 的公网 HTTPS Webhook。
   * @summary: 创建 Webhook
   */
  createWebhook: (
    body: schemas.WebhookInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description Webhook 创建结果。
   */
  data: schemas.WebhookWithSecret
}>;

  /**
   * PATCH /webhooks/{webhookId}
   * 使用 If-Match 更新名称、URL 或启用状态。
   * @summary: 更新 Webhook
   */
  updateWebhook: (
    /**
     * @description Webhook ID.
     */
    webhookId: string,
    body: schemas.WebhookUpdateInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 已更新 Webhook。
   */
  data: schemas.Webhook
}>;

  /**
   * DELETE /webhooks/{webhookId}
   * 删除 Webhook 及其投递记录。
   * @summary: 删除 Webhook
   */
  deleteWebhook: (
    /**
     * @description Webhook ID.
     */
    webhookId: string,
    requestInit?: RequestInit,
  ) => Promise<any>;

  /**
   * POST /webhooks/{webhookId}/rotate-secret
   * 立即轮换 Webhook 签名 Secret 并增加资源版本。
   * @summary: 轮换 Secret
   */
  rotateWebhookSecret: (
    /**
     * @description Webhook ID.
     */
    webhookId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 新 Webhook Secret。
   */
  data: schemas.SecretResult
}>;

  /**
   * POST /webhooks/{webhookId}/test
   * 创建测试投递并立即尝试向外部 URL 发送。
   * @summary: 测试 Webhook
   */
  testWebhook: (
    /**
     * @description Webhook ID.
     */
    webhookId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 测试投递引用。
   */
  data: schemas.DeliveryReference
}>;

  /**
   * GET /webhooks/{webhookId}/deliveries
   * 返回最近 100 条 Webhook 投递与受限错误诊断。
   * @summary: 列出投递记录
   */
  listWebhookDeliveries: (
    /**
     * @description Webhook ID.
     */
    webhookId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 投递记录列表。
   */
  data: Array<schemas.WebhookDelivery>
}>;

  /**
   * POST /webhooks/{webhookId}/deliveries/{deliveryId}/retry
   * 将指定投递恢复为 pending 并在后台重试。
   * @summary: 重试投递
   */
  retryWebhookDelivery: (
    /**
     * @description Webhook ID.
     */
    webhookId: string,
    /**
     * @description 投递 ID。
     */
    deliveryId: string,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 重试投递引用。
   */
  data: schemas.DeliveryReference
}>;

};

// ============ tokens 模块 ============

export type tokens = {
  /**
   * GET /tokens
   * 列出不含明文 PAT 的当前 Token 元数据。
   * @summary: 列出 API Token
   */
  listApiTokens: (
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description Token 元数据列表。
   */
  data: Array<schemas.ApiToken>
}>;

  /**
   * POST /tokens
   * 创建 ph_pat_ PAT；明文只返回一次，固定权限为 projects:read、issues:read、issues:write。
   * @summary: 创建 API Token
   */
  createApiToken: (
    body: schemas.ApiTokenInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description API Token 创建结果。
   */
  data: schemas.ApiTokenWithSecret
}>;

  /**
   * DELETE /tokens/{tokenId}
   * 立即撤销指定 PAT。
   * @summary: 撤销 API Token
   */
  revokeApiToken: (
    /**
     * @description Token ID。
     */
    tokenId: string,
    requestInit?: RequestInit,
  ) => Promise<any>;

};

// ============ oauth 模块 ============

export type oauth = {
  /**
   * POST /oauth/extension/authorize
   * 网站 Session 为允许的 chromiumapp.org 回调签发五分钟有效的一次性 PKCE 授权码。
   * @summary: 授权浏览器扩展
   */
  authorizeExtension: (
    body: schemas.OAuthAuthorizeInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description 扩展授权结果。
   */
  data: schemas.OAuthAuthorizeResult
}>;

  /**
   * POST /oauth/token
   * 使用授权码与 PKCE verifier，或轮换刷新令牌；访问令牌有效 15 分钟，刷新令牌有效 30 天。
   * @summary: 交换 OAuth Token
   */
  exchangeOAuthToken: (
    body: schemas.OAuthTokenInput,
    requestInit?: RequestInit,
  ) => Promise<{
  /**
   * @description OAuth Token 结果。
   */
  data: schemas.OAuthTokenResult
}>;

};

// ============ API 集合类型 ============

/**
 * API 类型定义
 */
export type APIs = {
  /** projects 模块 */
  projects: projects;
  /** issues 模块 */
  issues: issues;
  /** attachments 模块 */
  attachments: attachments;
  /** webhooks 模块 */
  webhooks: webhooks;
  /** tokens 模块 */
  tokens: tokens;
  /** oauth 模块 */
  oauth: oauth;
};

export declare namespace APIs {
  export { projects };
  export { issues };
  export { attachments };
  export { webhooks };
  export { tokens };
  export { oauth };
}
