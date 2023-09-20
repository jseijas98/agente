import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, timeout } from 'rxjs';
import StringUtils from 'src/app/common/util/stringUtils';
import {
  Element,
} from 'src/app/modules/interfaces/model.add-new-element';
import { PayloadType } from 'src/app/services/deleteElement/delete.service';
import { FormMessageService } from 'src/app/services/form-message/form-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-new-element-form',
  templateUrl: './add-new-element-form.component.html',
  styleUrls: ['./add-new-element-form.component.css'],
})
export class AddNewElementFormComponent implements OnInit {
  ngOnInit(): void { }

  onSelectedValueChange(newValue: PayloadType) {
    this.clearForm();
    console.log('Selected value changed to:', newValue);
    this.updateValidatorsForFields(newValue);
  }

  public data$: BehaviorSubject<any> = new BehaviorSubject(null);
  @Output() newItemEvent = new EventEmitter<string>();

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public serv: FormMessageService,
    private Utils: StringUtils,
    private fb: FormBuilder
  ) {
    //formulario inicial
    this.form = this.createForm();
    this.db = this.formDB();
  }

  form: FormGroup;
  db: FormGroup;
  payloadType = PayloadType;
  hide = true;
  selectedValue: string;

  updateValidatorsForFields(type: PayloadType): void {
    // Obtén referencias a los campos que deseas cambiar
    const labelAppControl = this.form.get('labelApp');
    const namespaceControl = this.form.get('namespace');
    const jsonControl = this.form.get('json');
    const channelControl = this.form.get('channel');
    const urlControl = this.form.get('url');

    // Restablece el estado 'disabled' de todos los campos
    labelAppControl?.enable();
    namespaceControl?.enable();
    jsonControl?.enable();
    channelControl?.enable();

    // Deshabilita todos los campos para el tipo LOADBALANCER
    if (type === PayloadType.LOADBALANCER) {
      labelAppControl?.disable();
      namespaceControl?.disable();
      jsonControl?.disable();
      channelControl?.disable();
    } else if (type === PayloadType.API || type === PayloadType.SERVICE) {
      // Deshabilita campos que no son necesarios
      urlControl?.disable();
      jsonControl?.disable();
      channelControl?.disable();
    } else if (type === PayloadType.INTEGRATION) {
      // Deshabilita campos que no son necesarios
      labelAppControl?.disable();
      namespaceControl?.disable();
    }
  }

  newElement: Element[] = [
    { value: PayloadType['INTEGRATION'], viewValue: 'servicios de pic' },
    { value: PayloadType['API'], viewValue: 'apis' },
    { value: PayloadType['SERVICE'], viewValue: 'services' },
    { value: PayloadType['LOADBALANCER'], viewValue: 'load balancer' },
    { value: PayloadType['PERSISTENCE'], viewValue: 'base de datos' },
  ];

  //********************* new element *********************
  createForm(): FormGroup {
    return this.fb.group({
      type: new FormControl({ value: this.selectedValue, disabled: false }, []),
      applicationId: new FormControl(
        { value: parseInt(this.data), disabled: true },
        []
      ),
      url: new FormControl(null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      testInterval: new FormControl(null, [
        Validators.required,
        Validators.max(60000),
        Validators.min(100),
        Validators.pattern(this.Utils.numberRegEx),
      ]),
      description: new FormControl(null, [
        Validators.nullValidator,
        Validators.maxLength(45),
      ]),
      labelApp: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.maxLength(45),
      ]),
      namespace: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(45),
      ]),
      json: new FormControl(null, [Validators.required]),
      channel: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
    });
  }

  onSubmit() {
    let postBody: FormData = this.form.getRawValue();
    console.log('body', postBody);
    this.addNewElement(postBody, this.selectedValue);
    this.clearForm();
  }

  getPayloadTypeValue(type: string): string {
    const typeToValueMap: Record<string, string> = {
      [PayloadType.PERSISTENCE]: '2',
      [PayloadType.API]: '1',
      [PayloadType.SERVICE]: '1',
      [PayloadType.INTEGRATION]: '1',
      [PayloadType.LOADBALANCER]: '1',
    };
    return typeToValueMap[type] || '0';
  }

  clearForm(): void {
    this.form.reset();
    this.form.patchValue({ applicationId: parseInt(this.data) });
    this.form.patchValue({ type: this.selectedValue });
  }

  cancelButton(): boolean {
    return this.serv.buttontoggle(this.selectedValue);
  }

  errorTestInterval(): string {
    return this.serv.getErrorMessage_testInterval(
      this.form.get('testInterval')
    );
  }

  errorUrl(): string {
    return this.serv.max_content255(this.form.get('url'));
  }

  errorJson(): string {
    return this.serv.json_max(this.form.get('json'));
  }

  errorChannel(): string {
    return this.serv.max_content45(this.form.get('channel'));
  }
  errorDescription() {
    return this.serv.max_content45(this.form.get('description'));
  }

  errorlabelApp() {
    return this.serv.max_content45(this.form.get('labelApp'));
  }

  errorNamespace() {
    return this.serv.max_content45(this.form.get('namespace'));
  }

  //***********************persistence or data bases***********************

  // Define el formulario utilizando FormBuilder
  formDB(): FormGroup {
    return this.fb.group({
      applicationId: new FormControl(
        { value: parseInt(this.data), disabled: true },
        []
      ),
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      sqlSentence: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      testInterval: new FormControl('', [
        Validators.required,
        Validators.pattern(this.Utils.numberRegEx),
        Validators.min(100),
        Validators.max(60000),
      ]),
      url: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      dataBaseType: new FormControl('', [
        Validators.required,
        Validators.maxLength(45),
      ]),
      description: new FormControl('', [
        Validators.nullValidator,
        Validators.maxLength(45),
      ]),
    });
  }

  onSubmit_DB() {
    let postBody: FormData = this.db.getRawValue();
    console.log('body', postBody);
    this.addNewElement(postBody, this.selectedValue);
    this.clearForm();
  }


  addNewElement(element: Object, type: string) {
    let url: string = '';
    type === PayloadType['PERSISTENCE']
      ? (url = environment.url.add)
      : (url = environment.url.add);

    this.http.post(url, element).subscribe({
      next: this.success.bind(this),
      error: this.error.bind(this),
    });
  }
  success(response: any) {
    this.data$.next(response);
    console.log('mensaje', response.message, 'resposne', response);
  }

  error(error: any) {
    this.data$.error(error);
    console.log(error);
  }
}
