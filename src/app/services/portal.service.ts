import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { DatePipe } from '@angular/common';
import {
  isSaturday,
  isSunday,
  isToday,
  isWithinInterval,
  parse,
} from 'date-fns';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PortalService {
  startTime: Date = parse('09:00:00', 'HH:mm:ss', new Date());
  endTime: Date = parse('16:25:00', 'HH:mm:ss', new Date());
  userdata: any;
  token: any;
  httpHeaders: any;
  private orderPlacedSource = new Subject<void>();
  orderPlaced$ = this.orderPlacedSource.asObservable();

  emitOrderPlaced() {
    this.orderPlacedSource.next();
  }
  constructor(public http: HttpClient) {
    this.userdata = JSON.parse(localStorage.getItem('user') || 'null');
    this.token = this.userdata.accesstoken;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      Authorization: 'Bearer ' + this.token,
    });
  }

  //oi-analysis

  getStockNames() {
    return this.http.get(environment.baseurl + '/options/dropdown/get_stocks');
  }

  getOiAnalysis(
    stockname: any,
    timeframe: any,
    strikeprice: any,
    expiry_selected_date: any,
    selected_date: any,
  ) {
    return this.http.get(
      environment.baseurl +
      '/options/oianalysis?stockname=' +
      stockname +
      '&timeframe=' +
      timeframe +
      '&strikeprice=' +
      strikeprice +
      '&expirydate=' +
      expiry_selected_date +
      '&date=' +
      selected_date,
      this.httpHeaders,
    );
  }
  getOiMixer(stockname: any, timeframe: any, strikeprice: any, expiry_selected_date: any, selected_date: any) {
    return this.http.get(environment.baseurl + '/options/oimixer?stockname=' + stockname +
      '&timeframe=' + timeframe + '&strikeprice=' + strikeprice + '&expirydate=' + expiry_selected_date +
      '&date=' + selected_date
    );
  }

  getOptionChainData(stockname: any, timeframe: any, expiry_selected_date: any, selected_date: any) {
    return this.http.get(environment.baseurl + '/options/v2/optionchain?stockname=' + stockname +
      '&interval=' + timeframe + '&expirydate=' + expiry_selected_date + '&date=' + selected_date);
  }

  getStockIntraday(strategy: any, date: any) {
    return this.http.get(
      environment.baseurl +
      '/stocks_screener/chartink?strategy_name=' +
      strategy +
      '&date=' +
      date,
    );
  }

  deleteAccount() {
    return this.http.delete(environment.baseurl + '/account');
  }
  deleteStockScreenar(id: any) {
    return this.http.delete(environment.baseurl + '/stocks_screener/' + id);
  }

  getMyBilling() {
    return this.http.get(environment.baseurl + '/transactions');
  }

  changePassword(data: any) {
    return this.http.post(environment.baseurl + '/user/change_password', data);
  }
  changeEmail(data: any) {
    return this.http.post(environment.baseurl + '/user/change_email', data);
  }
  changetradingviewid(data: any) {
    return this.http.post(
      environment.baseurl + '/user/change_tradingviewid',
      data,
    );
  }
  submitStock(data: any) {
    return this.http.post(
      environment.baseurl + '/stocks_screener/intraday',
      data,
    );
  }

  // Future dashboard,screener, heatmap apis

  getStocks() {
    return this.http.get(environment.baseurl + '/futures/get_stocks');
  }

  getDate(stockname: any) {
    return this.http.get(
      environment.baseurl + '/futures/get_date?stockname=' + stockname,
    );
  }

  getExpiryDate() {
    return this.http.get(environment.baseurl + '/futures/get_dexpiry');
  }

  getDashboardData(expiryDate: any) {
    return this.http.get(
      environment.baseurl + '/futures/dashboard?expiry=' + expiryDate,
    );
  }

  getScreenerdData(expiryDate: any, type: any) {
    return this.http.get(
      environment.baseurl +
      '/futures/screener?expiry=' +
      expiryDate +
      '&type=' +
      type,
    );
  }

  getHeatmapData(expiryDate: any) {
    return this.http.get(
      environment.baseurl + '/futures/heatmap?expiry=' + expiryDate,
    );
  };

  getOptionsDate(stockname: string) {
    return this.http.get(environment.baseurl + '/options/dropdown/get_date?stockname=' + stockname);
  }
  getOptionsExpiryDates(stockname: string, date: string) {
    return this.http.get(environment.baseurl + '/options/dropdown/get_expiries?stockname=' + stockname +
      '&date=' + date)
  }
  getStrikeprices(stockname: string, selected_date: string, expiry_selected_date: string) {
    return this.http.get(environment.baseurl + '/options/dropdown/get_strikeprices?stockname=' +
      stockname + '&date=' + selected_date + '&expirydate=' + expiry_selected_date)
  }


  //get timerange and today date

  isTodayAndWithinTimeRange(selected_date: any): boolean {
    const currentDate = new Date();
    return (
      isToday(selected_date) &&
      !isSaturday(selected_date) &&
      !isSunday(selected_date) &&
      isWithinInterval(currentDate, {
        start: this.startTime,
        end: this.endTime,
      })
    );
  }

  getAccountData() {
    return this.http.get(environment.accountUrl + '/account');
  }

  updateAcoount(data: any) {
    return this.http.put(environment.accountUrl + '/account', data);
  }

  validateAccount(data: any) {
    return this.http.post(environment.accountUrl + '/validate', data);
  }

  getLoginUrl(data: any) {
    return this.http.post(
      environment.accountUrl + '/broker/get_login_url',
      data,
    );
  }

  createAccount(data: any) {
    return this.http.post(environment.accountUrl + '/account', data);
  }

  getGroupList() {
    return this.http.get(environment.baseurl + '/groups');
  }
  positionaccount(data: any) {
    return this.http.post(environment.baseurl + '/portfolio/squareoff_all', data)
  }
  getClientList() {
    return this.http.get(environment.baseurl + '/accounts');
  }
  getOrdersList() {
    return this.http.post(environment.baseurl + '/portfolio/orderbook/', {});
  }
  searchBySymbol(keyword: any) {
    return this.http.get(environment.baseurl + '/stocks/?search=' + keyword);
  }

  generateTotp(data: any) {
    return this.http.post(environment.baseurl + '/generate_totp', data);
  }

  placeOrder(data: any) {
    return this.http.post(
      environment.baseurl + '/portfolio/place_orders',
      data,
    );
  }
  getGroupIdOrLoginId() {
    let id: string = JSON.parse(localStorage.getItem('selectid') || 'null');
    let data: any;
    if (id != null) {
      if (id.includes('group')) {
        data = {
          groupid: id.replace('group-', ''),
        };
      } else if (id == 'All') {
        data = {
          groupid: 'All',
        };
      } else {
        data = {
          loginid: id,
        };
      }
    } else {
      data = {
        groupid: 'All',
      };
    }

    return data;
  }

  getMarginData() {
    return this.http.post(environment.baseurl + '/portfolio/margin', {});
  }

  getMarketPlaceStrategy() {
    return this.http.get(
      environment.baseurl + '/marketplace/groups/' + environment.pmusername,
    );
  }

  updateMarketplaceStrategy(data: any) {
    return this.http.put(
      environment.baseurl + '/marketplace/groups/update_subscription',
      data,
    );
  }

  validateCoupon(data: any) {
    return this.http
      .post(environment.baseurl + '/validate', data)
      .pipe(catchError(this.handleError));
  }

  getPositionBook() {
    return this.http.post(environment.baseurl + '/portfolio/positionbook', {})
  }

  getOrderBook(data: any) {
    return this.http.post(environment.baseurl + '/portfolio/orderbook', data)

  }

  cancelSelected(data: any) {
    return this.http.post(environment.baseurl + '/portfolio/cancel_orders', data);
  }
  cancelall() {
    return this.http.post(environment.baseurl + '/portfolio/cancel_all_orders', {});
  }
  modifyOrder(data: any) {
    return this.http.post(environment.baseurl + '/portfolio/modify_orders/', data);

  }


  getProfileDetails(id: any) {
    return this.http.get(environment.baseurl + '/users/' + id)
  }

  searchStock(term: any) {
    return this.http.get(environment.baseurl + '/stocks/?search=' + term);
  }


  getWatchList() {
    return this.http.get(environment.baseurl + '/paper_trade/watchlists');
  }
  addToWatchlist(data: any) {
    return this.http.post(environment.baseurl + '/paper_trade/watchlists', data);
  }
  deleteWatchlist(id: any) {
    return this.http.delete(environment.baseurl + '/paper_trade/watchlists/' + id);
  }

  getPaperTradeOrders() {
    return this.http.get(environment.baseurl + '/paper_trade/orders');
  }
  createOrder(data: any) {
    return this.http.post(environment.baseurl + '/paper_trade/orders', data);
  }

  updateOrderInfo(data: any) {
    return this.http.put(environment.baseurl + '/orders/' + data.id, data);
  }

  cancelSelectedPo(data: any) {
    return this.http.delete(environment.baseurl + '/paper_trade/cancel_orders', { body: data })
  }
  cancelAll() {
    return this.http.delete(environment.baseurl + '/paper_trade/cancel_all_orders')
  }
  /* All Positions API */

  getpositions() {
    return this.http.get(environment.baseurl + '/paper_trade/positions');
  }
  positionSqoffPt(data: any) {
    return this.http.post(environment.baseurl + '/paper_trade/squareoff_all/', data)
  }

  /** Get balance */
  getBalance() {
    return this.http.get(environment.baseurl + '/paper_trade/balance');
  }
  resetBalance() {
    return this.http.post(environment.baseurl + '/paper_trade/reset_balance', {});
  }


  //get Date of support_resistance


  getDateofFiiDii() {
    return this.http.get(environment.baseurl + '/fiidii/get_date').pipe(catchError(this.handleError));
  }
  getFiiDiiData(date: string) {
    return this.http.get(environment.baseurl + '/fiidii/participant_oi?date=' + date).pipe(catchError(this.handleError));

  }

  getSymbolFromToken(token: string) {
    return this.http.get(environment.baseurl + '/stock_symbol?token=' + token);
  }
  

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      errorMessage;
    });
  }


}
