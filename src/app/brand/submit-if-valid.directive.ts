import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[tsSubmitIfValid]'
})
export class SubmitIfValidDirective {
  @Output('tsSubmitIfValid') valid = new EventEmitter<void>(); // tslint:disable-line:no-output-rename

  constructor(private formRef: NgForm, private toastr: ToastrService) {
  }

  @HostListener('click')
  handleClick() {
    this.markFieldsAsDirty();
    this.emitIfValid();
  }

  private markFieldsAsDirty() {
    Object.keys(this.formRef.controls)
      .forEach(fieldName =>
        this.formRef.controls[fieldName].markAsDirty()
      );
  }

  private emitIfValid() {
    if (this.formRef.valid) {
      this.valid.emit();
    }
  }
}
