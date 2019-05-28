import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { ProductService } from './product/product.service';
import { HttpModule } from '@angular/http';
import { BrandComponent } from './brand/brand.component';
import { NgxPaginationModule } from 'ngx-pagination'
import { BrandService } from './brand/brand.service';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { SubmitIfValidDirective } from './product/submit-if-valid.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent, ProductComponent, BrandComponent, SubmitIfValidDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    NgxPaginationModule,
    AlifeFileToBase64Module,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
    }),
  ],
  providers: [ProductService, BrandService],
  bootstrap: [AppComponent]
})
export class AppModule { }
