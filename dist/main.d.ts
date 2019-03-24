export declare function hash(text: string): string;
export declare function getClientToken(client: string): any;
export declare function getAccessToken(clientToken: string, hourDuration?: number): any;
export declare function verifyAccessToken(accessToken: string): Promise<boolean>;
