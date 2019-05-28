import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { BrandComponent } from './brand/brand.component';


const appRoutes: Routes =[
  { path: 'product', component: ProductComponent },
  { path: 'brand', component: BrandComponent },
  { path: '', redirectTo: '/product', pathMatch: 'full'}
]

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
