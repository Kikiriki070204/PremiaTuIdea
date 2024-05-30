export interface HttpResponse {
    headers: any; // You can specify the type for headers
    status: number;
    statusText: string;
    url: string;
    ok: boolean;
    name: string;
    message: string;
    error: {msg: string};
}
