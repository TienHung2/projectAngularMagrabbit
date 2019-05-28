import { Component, OnInit } from '@angular/core';
import { BrandService } from './brand.service';
import { Brand } from './brand';
import { Pager } from './pager';
import { brandData } from './brandData';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent{
  namesearch: string = 'default';
  brands: Brand[];
  brand = new Brand();
  brandtodelete = new Brand();
  title: string = "Add Brand";
  pageTotal: number;
  pager = new Pager();
  pagedItems: any[];
  actions: string = "default";
  constructor(private _brandService: BrandService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getBrands(1);
  }

  getBrands(pageId): void{
    this._brandService.getPageBrand(pageId)
      .subscribe((reponse: brandData) => {
        this.brands = this.changeImageLink(reponse.brands);
        this.pageTotal = reponse.pageTotal;
        this.pager = this._brandService.getPager(this.brands.length, this.pageTotal, pageId);
      });
  }

  search(pageId, name: string): void{
    this.actions = "search";
        if (name == '') {
            this.getBrands(pageId);
            this.actions = "default";
        }
        this._brandService.search(pageId, name)
            .subscribe((reponse: brandData) => {
                this.brands = this.changeImageLink(reponse.brands);
                this.pageTotal = reponse.pageTotal;
                this.pager = this._brandService.getPager(this.brands.length, this.pageTotal, pageId);
            })
        this.namesearch = name;
        this.actions = "search"
  }

  addBrand(): void{
    this._brandService.addBrand(this.brand)
      .subscribe((response) => {
        this.getBrands(1);
        $('#myModal').modal('hide');
        $('#success').modal('show');
      });
  }

  deleteBrand(brandId: string){
    this._brandService.deleteBrand(brandId)
      .subscribe((response) => {
        $('#success').modal('show');
        this.getBrands(1);
      });
  }

  getBrandById(brandId: string){
    this._brandService.getBrandById(brandId)
      .subscribe((brandData) => {
        this.brand = brandData;
      });
      this.title="Edit Brand";
  }

  getBrandToDelete(brandId: string) {
    this._brandService.getBrandById(brandId)
        .subscribe((productData) => {
            this.brandtodelete = productData
        });
}

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
  this.brand.logo = btoa(binaryString);
}

  private reset(){
    var input = $("#imagea");    
    input.replaceWith(input.val(''));
    this.brand.id = null;
    this.brand.description = null;
    this.brand.name = null;
    this.title = "Add Brand";
  }

  changeImageLink(array: Brand[]): Brand[] {
    for (let i of array) {
      if (i.logo != null)
        i.logo = i.logo.replace("D:", "http://localhost:8080/Product");
      else
        i.logo = '';
    }
    return array;
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this._brandService.getPager(this.brands.length, this.pageTotal, page);

    // get current page of items
    this.pagedItems = this.brands.slice(this.pager.startIndex, this.pager.endIndex + 1);
    if (this.actions == 'search') {
      this.search(page, this.namesearch)
    } else {
      this.getBrands(page);
    }
  }
}
