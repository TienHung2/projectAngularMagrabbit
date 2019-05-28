import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { ProductData } from './productData';

@Injectable()
export class ProductService {
    constructor(private _httpService: Http) { }
    /**
     * Get product list
     */
    getAllProducts(pageId: string): Observable<ProductData> {
        return this._httpService.get('http://localhost:8080/Product/api/product/page/' + pageId)
            .map((response: Response) => response.json());
    }

    /**
     * search by brand name, product name, price from, price to
     * 
     * @param pageId 
     * @param name 
     * @param pricefrom 
     * @param priceto 
     */
    search(pageId: number, name: String, pricefrom: string, priceto: string): Observable<ProductData> {
        return this._httpService.get('http://localhost:8080/Product/api/product/search/' + pageId + '/' + name + '/'
            + pricefrom + '/' + priceto)
            .map((response: Response) => response.json());
    }

    /**
     * Add a product
     * 
     * @param product 
     */
    addProduct(product: Product) {
        let body = JSON.stringify(product);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        if (product.id) {
            return this._httpService.put('http://localhost:8080/Product/api/product/' + product.id, body, options);
        }
        else {
            return this._httpService.post("http://localhost:8080/Product/api/product", body, options);
        }
    }

    /**
     * Delete a product
     * 
     * @param productId 
     */
    deleteProduct(productId: string) {
        return this._httpService.delete('http://localhost:8080/Product/api/product/' + productId);
    }

    /**
     * Get a product by id
     * 
     * @param productId 
     */
    getProductById(productId: string): Observable<Product> {
        return this._httpService.get('http://localhost:8080/Product/api/product/' + productId)
            .map((response: Response) => response.json())
    }

    /**
     * Get Pager
     * 
     * @param totalItems 
     * @param currentPage 
     * @param pageSize 
     */
    getPager(totalProducts: number, totalPages: number, currentPage: any) {
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
        let endIndex = Math.min(startIndex + 4 - 1, totalProducts - 1);
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
