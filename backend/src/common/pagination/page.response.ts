export class PageResponse<T> {
  pageSize: number;
  total: number;
  totalPage: number;
  list: T[];

  constructor(total: number, pageSize: number, list: T[]) {
    this.pageSize = pageSize;
    this.total = total;
    this.totalPage = total === 0 ? 0 : Math.ceil(total / pageSize);
    this.list = list;
  }
}
