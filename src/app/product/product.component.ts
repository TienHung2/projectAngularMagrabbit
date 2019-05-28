import { Component, OnInit } from '@angular/core';
import { Product } from './product';
import { ProductService } from './product.service';
import { BrandService } from '../brand/brand.service';
import { Brand } from '../brand/brand';
import { ProductData } from './productData';
import { Pager } from './pager';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent {
    namesearch: string = 'default';
    pricefrom: string = '';
    priceto: string = '';
    products: Product[];
    product = new Product();
    producttodelete = new Product();
    brands: Brand[];
    title: string = "Add Product";
    actions: string = "default";
    pageTotal: number;
    pager = new Pager();
    pagedItems: any[];
    constructor(private _productService: ProductService, private _brandService: BrandService,
        private toastr: ToastrService) { }
    ngOnInit(): void {
        this.getProducts(1);
        this.getBrands();
    }

    /**
     * Get brand name
     */
    getBrands(): void {
        this._brandService.getAllBrands()
            .subscribe((brandData) => {
                this.brands = brandData
            });
    }

    /**
     * Get product list
     */
    getProducts(pageId): void {
        this._productService.getAllProducts(pageId)
            .subscribe((reponse: ProductData) => {
                this.products = this.changeImageLink(reponse.products);
                this.pageTotal = reponse.pageTotal;
                this.pager = this._productService.getPager(this.products.length, this.pageTotal, pageId);
            });
    }

    /**
     * search by brand name, product name, price from, price to
     * 
     * @param pageId 
     * @param name 
     * @param pricefrom 
     * @param priceto 
     */
    search(pageId, name: string, pricefrom: string, priceto: string): void {
        this.actions = "search";
        if (name == '') {
            this.getProducts(pageId);
            this.actions = "default";
        }
        this._productService.search(pageId, name, pricefrom, priceto)
            .subscribe((reponse: ProductData) => {
                this.products = this.changeImageLink(reponse.products);
                this.pageTotal = reponse.pageTotal;
                this.pager = this._productService.getPager(this.products.length, this.pageTotal, pageId);
            })
        this.namesearch = name;
        this.pricefrom = pricefrom;
        this.priceto = priceto;
        this.actions = "search"
    }

    /**
     * Add a product
     */
    addProduct(): void {
        this._productService.addProduct(this.product)
            .subscribe((response) => {
                this.getProducts(1);
                $('#myModal').modal('hide');
                $('#success').modal('show');
            }, (error) => {
                this.toastr.error("Your operation hasn't been confirmed","Failed");
            });
    }

    /**
     * Reset object product
     */
    private reset() {
        this.product.image=null;
        var input = $("#imagea");    
        input.replaceWith(input.val(''));
        this.product.id = null;
        this.product.brandName = null;
        this.product.name = null;
        this.product.openingForsale = null;
        this.product.price = null;
        this.product.quantity = null;
        this.title = "Add Product";
    }

    /**
     * Delete a product
     * 
     * @param productId 
     */
    deleteProduct(productId: string) {
        this._productService.deleteProduct(productId)
            .subscribe((response) => {
                this.getProducts(1);
                $('#success').modal('show');
            });
    }

    /**
     * Get a product by id to edit
     * 
     * @param productId 
     */
    getProductById(productId: string) {
        this._productService.getProductById(productId)
            .subscribe((productData) => {
                productData.image = productData.image.replace("D:","http://localhost:8080/Product"),
                console.log(productData.image),
                this.product = productData
            });
        this.title = "Edit Product";
    }

    /**
     * Get a product by id to delete
     * 
     * @param productID 
     */
    getProductToDelete(productID: string) {
        this._productService.getProductById(productID)
            .subscribe((productData) => {
                this.producttodelete = productData
            });
    }

    /**
     * Convert image to base64
     * 
     * @param evt 
     */
    handleFileSelect(evt) {
        var files = evt.target.files;
        var file = files[0];
        if (files && file) {
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(file);
        }
    }
    _handleReaderLoaded(readerEvt) {
        var binaryString = readerEvt.target.result;
        this.product.image = btoa(binaryString);
    }

    /**
     * Change image link to show image on screen
     * 
     * @param array 
     */
    changeImageLink(array: Product[]): Product[] {
        for (let i of array) {
            if (i.image != null)
                i.image = i.image.replace("D:", "http://localhost:8080/Product");
            else
                i.image = '';
        }
        return array;
    }


    /**
     * Set page
     * 
     * @param page 
     */
    setPage(page: number) {
        // get pager object from service
        this.pager = this._productService.getPager(this.products.length, this.pageTotal, page);

        // get current page of items
        this.pagedItems = this.products.slice(this.pager.startIndex, this.pager.endIndex + 1);
        if (this.actions == 'search') {
            this.search(page, this.namesearch, this.pricefrom, this.priceto)
        } else {
            this.getProducts(page);
        }
    }
}
