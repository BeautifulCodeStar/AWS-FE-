import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  public temp: any;
  public readonly apiUrl = "http://localhost/router/Router.php";
  public readonly hostUrl = "https://test.sellerseo.com/app/php_api/router/Router.php";
}
