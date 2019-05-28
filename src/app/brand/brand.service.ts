import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from './brand';
import { brandData } from './brandData'
import 'rxjs/add/operator/map'

@Injectable()
export class BrandService{
    constructor(private _httpService: Http){}
    getAllBrands(): Observable<Brand[]>{
        return this._httpService.get("http://localhost:8080/Product/api/brand")
            .map((response: Response) => response.json())
    }

    search(pageId: number, name: String): Observable<brandData> {
        return this._httpService.get('http://localhost:8080/Product/api/product/search/' + pageId + '/' + name)
            .map((response: Response) => response.json());
    }

    getPageBrand(pageId: string): Observable<brandData>{
        return this._httpService.get("http://localhost:8080/Product/api/brand/page/"+pageId)
            .map((response: Response) => response.json())
    }
    addBrand(brand: Brand){
        let body = JSON.stringify(brand);
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        if(brand.id){
            return this._httpService.put("http://localhost:8080/Product/api/brand/"+brand.id,body,options);
        }else{
            return this._httpService.post("http://localhost:8080/Product/api/brand",body, options);
        }
    }
    deleteBrand(brandId: string){
        return this._httpService.delete("http://localhost:8080/Product/api/brand/"+brandId);
    }
    getBrandById(brandID: string): Observable<Brand>{
        return this._httpService.get('http://localhost:8080/Product/api/brand/'+brandID)
            .map((response: Response) => response.json())
    }
    getPager(totalBrands: number, totalPages: number, currentPage: any) {
        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        let startPage: number, endPage: number;
        if (totalPages <= 3) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 2) {
                startPage = 1;
                endPage = 3;
            } else if (currentPage + 1 >= totalPages) {
                startPage = totalPages - 2;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }
        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * 4;
        let endIndex = Math.min(startIndex + 4 - 1, totalBrands - 1);
        // create an array of pages to ng-repeat in the pager control
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
        // return object with all pager properties required by the view
        return {
            currentPage: currentPage,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            pages: pages,
            startIndex: startIndex,
            endIndex: endIndex,
        };
    }
}