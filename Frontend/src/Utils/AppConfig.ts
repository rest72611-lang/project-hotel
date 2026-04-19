class AppConfig {
    public readonly serverUrl = "http://localhost:4001";
    public readonly baseUrl = `${this.serverUrl}/api`;

    public readonly registerUrl = `${this.baseUrl}/auth/register`;
    public readonly loginUrl = `${this.baseUrl}/auth/login`;

    public readonly vacationsUrl = `${this.baseUrl}/vacations`;
    public readonly likesUrl = `${this.baseUrl}/likes`;
    public readonly imagesUrl = `${this.baseUrl}/images/`;
    public readonly recommendationsUrl = `${this.baseUrl}/recommendations`;

    public readonly aiAskUrl = `${this.baseUrl}/ai/ask`;
    public readonly mcpUrl = `${this.serverUrl}/mcp`;
}

export const appConfig = new AppConfig();
    



