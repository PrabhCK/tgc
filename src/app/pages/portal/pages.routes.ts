import { Routes } from '@angular/router';

import { Empty } from '../empty/empty';
import { AuthGuard } from '@/guards/auth.guard';
import { PreopenMarketComponent } from './preopen-market/preopen-market.component';
import { PrevFiiDiiActivity } from './prev-fii-dii-activity/prev-fii-dii-activity';
import { OptionChain } from './option-chain/option-chain';
import { StreamingData } from './streaming-data/streaming-data';
import { OiAnalysis } from './oi-analysis/oi-analysis';
import { OiMixer } from './oi-mixer/oi-mixer';
import { ManageAccount } from './manage-account/manage-account';
import { DerivateAlgo } from './derivate-algo/derivate-algo';
import { TradingTerminal } from './trading-terminal/trading-terminal';
import { PaperTradingComponent } from './paper-trading/paper-trading.component';
import { AdvSupportResistance } from './adv-support-resistance/adv-support-resistance';
import { TradeAnalysis } from './trade-analysis/trade-analysis';
import { EmaCrossOver } from './stocks-scan/ema-cross-over/ema-cross-over';
import { Rsi } from './stocks-scan/rsi/rsi';
import { Candlesticks } from './stocks-scan/candlesticks/candlesticks';
import { Breaksout } from './stocks-scan/breaksout/breaksout';
import { Profile } from './profile/profile';

export default [
    {
        path: 'pre-open-market',
        component: PreopenMarketComponent,
        canActivate: [AuthGuard],
      },
       {
        path: 'fii-dii-activity',
        component: PrevFiiDiiActivity,
        canActivate: [AuthGuard],
      },
       {
        path: 'option-chain',
        component: OptionChain,
        canActivate: [AuthGuard],
      },
       {
        path: 'streaming-data',
        component: StreamingData,
        canActivate: [AuthGuard],
      },
       {
        path: 'oi-analysis',
        component: OiAnalysis,
        canActivate: [AuthGuard],
      },
      {
        path: 'oi-mixer',
        component: OiMixer,
        canActivate: [AuthGuard],
      },
      {
        path: 'account',
        component: ManageAccount,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: Profile,
        canActivate: [AuthGuard],
      },
      {
        path: 'derivative-algo',
        component: DerivateAlgo,
        canActivate: [AuthGuard],
      },
      {
        path: 'trading-terminal',
        component: TradingTerminal,
        canActivate: [AuthGuard],
      },
      {
        path: 'paper-trading',
        component: PaperTradingComponent,
        canActivate: [AuthGuard],
      },
       {
        path: 'adv-support-resistance',
        component: AdvSupportResistance,
        canActivate: [AuthGuard],
      },
      {
        path: 'trade-analysis',
        component: TradeAnalysis,
        canActivate: [AuthGuard],
      },
      {
        path: 'ema-cross-over',
        component: EmaCrossOver,
        canActivate: [AuthGuard],
      },
      {
        path: 'breaks-out',
        component: Breaksout,
        canActivate: [AuthGuard],
      },
      {
        path: 'candlesticks',
        component: Candlesticks,
        canActivate: [AuthGuard],
      },
      {
        path: 'rsi',
        component: Rsi,
        canActivate: [AuthGuard],
      },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
