import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OauthComponent } from './oauth/oauth.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'oauth',  component: OauthComponent }, 
  { path: '',  component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
