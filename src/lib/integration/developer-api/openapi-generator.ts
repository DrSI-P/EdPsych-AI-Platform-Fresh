/**
 * OpenAPI Specification Generator
 * 
 * This service generates OpenAPI specification for the external developer API.
 */

import { ApiVersionService, ApiVersion } from './api-version-service';
import { ApiPermission } from './types';

export interface OpenApiInfo {
  title: string;
  description: string;
  version: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

export class OpenApiGenerator {
  private static instance: OpenApiGenerator;
  private versionService: ApiVersionService;
  
  private constructor() {
    // Private constructor for singleton pattern
    this.versionService = ApiVersionService.getInstance();
  }
  
  /**
   * Get the singleton instance of the OpenAPI Generator
   */
  public static getInstance(): OpenApiGenerator {
    if (!OpenApiGenerator.instance) {
      OpenApiGenerator.instance = new OpenApiGenerator();
    }
    return OpenApiGenerator.instance;
  }
  
  /**
   * Generate OpenAPI specification for a specific version
   * 
   * @param version The API version
   * @param info The API info
   */
  public generateOpenApiSpec(version: ApiVersion, info?: Partial<OpenApiInfo>): any {
    const apiInfo: OpenApiInfo = {
      title: info?.title || 'EdPsych Connect Developer API',
      description: info?.description || 'API for integrating with the EdPsych Connect platform',
      version: info?.version || version,
      contact: info?.contact || {
        name: 'EdPsych Connect Support',
        url: 'https://edpsych-connect.com/support',
        email: 'api-support@edpsych-connect.com'
      },
      license: info?.license || {
        name: 'Proprietary',
        url: 'https://edpsych-connect.com/terms'
      }
    };
    
    // Generate OpenAPI spec
    const spec = {
      openapi: '3.0.3',
      info: apiInfo,
      servers: [
        {
          url: 'https://api.edpsych-connect.com',
          description: 'Production API server'
        },
        {
          url: 'https://api.sandbox.edpsych-connect.com',
          description: 'Sandbox API server'
        }
      ],
      paths: this.generatePaths(version),
      components: this.generateComponents(),
      security: [
        {
          bearerAuth: []
        }
      ],
      tags: this.generateTags()
    };
    
    return spec;
  }
  
  // Private helper methods
  
  private generatePaths(version: ApiVersion): any {
    const paths: any = {};
    
    // Get all endpoints for the specified version
    const endpoints = this.versionService.getEndpointsForVersion(version);
    
    // Authentication endpoints
    paths['/api/developer/auth/{tenantId}'] = {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate API credentials',
        description: 'Authenticates API key and secret, returning a JWT token',
        operationId: 'authenticateApiCredentials',
        parameters: [
          {
            name: 'tenantId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'The tenant ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiAuthRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successful authentication',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiAuthResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse'
                }
              }
            }
          }
        }
      }
    };
    
    // API Key endpoints
    paths['/api/developer/keys/{tenantId}'] = {
      get: {
        tags: ['API Keys'],
        summary: 'List API keys',
        description: 'Lists all API keys for a tenant',
        operationId: 'listApiKeys',
        parameters: [
          {
            name: 'tenantId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'The tenant ID'
          }
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    keys: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ApiKey'
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse'
                }
              }
            }
          }
        },
        security: [
          {
            bearerAuth: []
          }
        ]
      },
      post: {
        tags: ['API Keys'],
        summary: 'Create API key',
        description: 'Creates a new API key for a tenant',
        operationId: 'createApiKey',
        parameters: [
          {
            name: 'tenantId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'The tenant ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'permissions'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of the API key'
                  },
                  permissions: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: Object.values(ApiPermission)
                    },
                    description: 'Permissions for the API key'
                  },
                  createdBy: {
                    type: 'string',
                    description: 'User ID who created the key'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    apiKey: {
                      $ref: '#/components/schemas/ApiKey'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse'
                }
              }
            }
          }
        },
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    };
    
    // OAuth endpoints
    paths['/api/developer/oauth/{tenantId}/authorize'] = {
      get: {
        tags: ['OAuth'],
        summary: 'OAuth 2.0 authorization endpoint',
        description: 'Initiates the OAuth 2.0 authorization flow',
        operationId: 'oauthAuthorize',
        parameters: [
          {
            name: 'tenantId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'The tenant ID'
          },
          {
            name: 'client_id',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'The client ID'
          },
          {
            name: 'redirect_uri',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'The redirect URI'
          },
          {
            name: 'response_type',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              enum: ['code']
            },
            description: 'The response type'
          },
          {
            name: 'scope',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Space-separated list of scopes'
          },
          {
            name: 'state',
            in: 'query',
            required: false,
            schema: {
              type: 'string'
            },
            description: 'State parameter for CSRF protection'
          }
        ],
        responses: {
          '302': {
            description: 'Redirect to consent page',
            headers: {
              Location: {
                schema: {
                  type: 'string'
                },
                description: 'Redirect URL'
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OAuthErrorResponse'
                }
              }
            }
          }
        },
        security: []
      }
    };
    
    paths['/api/developer/oauth/{tenantId}/token'] = {
      post: {
        tags: ['OAuth'],
        summary: 'OAuth 2.0 token endpoint',
        description: 'Exchanges authorization code for access token or refreshes access token',
        operationId: 'oauthToken',
        parameters: [
          {
            name: 'tenantId',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'The tenant ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['grant_type', 'client_id', 'client_secret'],
                properties: {
                  grant_type: {
                    type: 'string',
                    enum: ['authorization_code', 'refresh_token']
                  },
                  client_id: {
                    type: 'string'
                  },
                  client_secret: {
                    type: 'string'
                  },
                  code: {
                    type: 'string',
                    description: 'Required for authorization_code grant type'
                  },
                  redirect_uri: {
                    type: 'string',
                    description: 'Required for authorization_code grant type'
                  },
                  refresh_token: {
                    type: 'string',
                    description: 'Required for refresh_token grant type'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OAuthTokenResponse'
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OAuthErrorResponse'
                }
              }
            }
          }
        },
        security: []
      }
    };
    
    // Add more paths as needed
    
    return paths;
  }
  
  private generateComponents(): any {
    return {
      schemas: {
        ApiKey: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            tenantId: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            key: {
              type: 'string'
            },
            secret: {
              type: 'string',
              description: 'Only returned when key is created'
            },
            permissions: {
              type: 'array',
              items: {
                type: 'string',
                enum: Object.values(ApiPermission)
              }
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'revoked']
            },
            createdBy: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            },
            lastUsedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ApiAuthRequest: {
          type: 'object',
          required: ['apiKey', 'apiSecret'],
          properties: {
            apiKey: {
              type: 'string'
            },
            apiSecret: {
              type: 'string'
            }
          }
        },
        ApiAuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string'
            },
            expiresAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ApiErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                details: {
                  type: 'object'
                }
              }
            }
          }
        },
        OAuthTokenResponse: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string'
            },
            token_type: {
              type: 'string',
              enum: ['Bearer']
            },
            expires_in: {
              type: 'integer'
            },
            refresh_token: {
              type: 'string'
            },
            scope: {
              type: 'string'
            }
          }
        },
        OAuthErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              enum: [
                'invalid_request',
                'invalid_client',
                'invalid_grant',
                'unauthorized_client',
                'unsupported_grant_type',
                'invalid_scope',
                'server_error'
              ]
            },
            error_description: {
              type: 'string'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    };
  }
  
  private generateTags(): any[] {
    return [
      {
        name: 'Authentication',
        description: 'API key authentication endpoints'
      },
      {
        name: 'API Keys',
        description: 'API key management endpoints'
      },
      {
        name: 'OAuth',
        description: 'OAuth 2.0 authentication endpoints'
      },
      {
        name: 'Webhooks',
        description: 'Webhook management endpoints'
      }
    ];
  }
}
