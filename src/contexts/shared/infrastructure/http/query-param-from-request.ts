export class QueryParamFromRequest {
  get(request: Request, param: string) {
    const [, querystring] = request.url.split("?");
    const query = new URLSearchParams(querystring);
    return query.get(param);
  }
}
