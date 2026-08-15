export const specMeta = {
  name: "Pinhere API",
  hasTags: true,
  url: [
    {
      url: "https://pinhere.dev/api/v1"
    }
  ],
  apis: {
    "projects/listProjects": {
      method: "GET",
      path: "/projects",
      consumes: [],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: null
    },

    "projects/createProject": {
      method: "POST",
      path: "/projects",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "projects/getProject": {
      method: "GET",
      path: "/projects/{projectId}",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["projectId"],
      queryParams: null,
      bodyParams: null
    },

    "projects/updateProject": {
      method: "PATCH",
      path: "/projects/{projectId}",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: ["projectId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "projects/deleteProject": {
      method: "DELETE",
      path: "/projects/{projectId}",
      consumes: [],
      produces: [],
      pathParams: ["projectId"],
      queryParams: null,
      bodyParams: null
    },

    "projects/addProjectOrigin": {
      method: "POST",
      path: "/projects/{projectId}/origins",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: ["projectId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "projects/deleteProjectOrigin": {
      method: "DELETE",
      path: "/projects/{projectId}/origins/{encodedOrigin}",
      consumes: [],
      produces: [],
      pathParams: ["projectId", "encodedOrigin"],
      queryParams: null,
      bodyParams: null
    },

    "projects/resolveProject": {
      method: "GET",
      path: "/projects/resolve",
      consumes: [],
      produces: ["application/json"],
      pathParams: null,
      queryParams: ["url"],
      bodyParams: null
    },

    "issues/listIssues": {
      method: "GET",
      path: "/issues",
      consumes: [],
      produces: ["application/json"],
      pathParams: null,
      queryParams: ["cursor", "limit", "projectId", "status", "updatedAfter"],
      bodyParams: null
    },

    "issues/createIssue": {
      method: "POST",
      path: "/issues",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "issues/getIssue": {
      method: "GET",
      path: "/issues/{issueId}",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["issueId"],
      queryParams: null,
      bodyParams: null
    },

    "issues/updateIssue": {
      method: "PATCH",
      path: "/issues/{issueId}",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: ["issueId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "issues/deleteIssue": {
      method: "DELETE",
      path: "/issues/{issueId}",
      consumes: [],
      produces: [],
      pathParams: ["issueId"],
      queryParams: null,
      bodyParams: null
    },

    "issues/listIssueEvents": {
      method: "GET",
      path: "/issues/{issueId}/events",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["issueId"],
      queryParams: null,
      bodyParams: null
    },

    "issues/claimIssue": {
      method: "POST",
      path: "/issues/{issueId}/claim",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["issueId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "issues/claimNextIssue": {
      method: "POST",
      path: "/issues/claim-next",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "issues/releaseIssue": {
      method: "POST",
      path: "/issues/{issueId}/release",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: ["issueId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "issues/completeIssue": {
      method: "POST",
      path: "/issues/{issueId}/complete",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: ["issueId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "issues/reopenIssue": {
      method: "POST",
      path: "/issues/{issueId}/reopen",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["issueId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "attachments/createAttachment": {
      method: "POST",
      path: "/attachments",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "attachments/downloadAttachment": {
      method: "GET",
      path: "/attachments/{attachmentId}",
      consumes: [],
      produces: ["image/png","image/jpeg","image/webp"],
      pathParams: ["attachmentId"],
      queryParams: null,
      bodyParams: null
    },

    "webhooks/listWebhooks": {
      method: "GET",
      path: "/webhooks",
      consumes: [],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: null
    },

    "webhooks/createWebhook": {
      method: "POST",
      path: "/webhooks",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "webhooks/updateWebhook": {
      method: "PATCH",
      path: "/webhooks/{webhookId}",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: ["webhookId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "webhooks/deleteWebhook": {
      method: "DELETE",
      path: "/webhooks/{webhookId}",
      consumes: [],
      produces: [],
      pathParams: ["webhookId"],
      queryParams: null,
      bodyParams: null
    },

    "webhooks/rotateWebhookSecret": {
      method: "POST",
      path: "/webhooks/{webhookId}/rotate-secret",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["webhookId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "webhooks/testWebhook": {
      method: "POST",
      path: "/webhooks/{webhookId}/test",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["webhookId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "webhooks/listWebhookDeliveries": {
      method: "GET",
      path: "/webhooks/{webhookId}/deliveries",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["webhookId"],
      queryParams: null,
      bodyParams: null
    },

    "webhooks/retryWebhookDelivery": {
      method: "POST",
      path: "/webhooks/{webhookId}/deliveries/{deliveryId}/retry",
      consumes: [],
      produces: ["application/json"],
      pathParams: ["webhookId", "deliveryId"],
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "tokens/listApiTokens": {
      method: "GET",
      path: "/tokens",
      consumes: [],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: null
    },

    "tokens/createApiToken": {
      method: "POST",
      path: "/tokens",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "tokens/revokeApiToken": {
      method: "DELETE",
      path: "/tokens/{tokenId}",
      consumes: [],
      produces: [],
      pathParams: ["tokenId"],
      queryParams: null,
      bodyParams: null
    },

    "oauth/authorizeExtension": {
      method: "POST",
      path: "/oauth/extension/authorize",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    },

    "oauth/exchangeOAuthToken": {
      method: "POST",
      path: "/oauth/token",
      consumes: ["application/json"],
      produces: ["application/json"],
      pathParams: null,
      queryParams: null,
      bodyParams: {
        contentType: "application/json",
        canMerge: false
      }
    }
  }
} as const;
