import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { forms_url } from 'src/app/utils/helper/url';
import { ClinicalPrescriptionHistoryModalComponent } from '../buttons/clinical-prescription-history-modal/clinical-prescription-history-modal.component';

@Component({
  selector: 'app-clinical-document-form-template',
  templateUrl: './clinical-document-form-template.component.html',
  styleUrls: ['./clinical-document-form-template.component.scss']
})
export class ClinicalDocumentFormTemplateComponent implements OnInit {

  @Output()
  saveForm: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('prescriptionHistoryModal', {static: true})
  prescriptionHistoryModal: ClinicalPrescriptionHistoryModalComponent;

  @Input()
  savingDocument = false;

  patient: any;
  visit: any;
  document: any;

  loading = true;
  uploadUrl = forms_url + '/upload/multiple';
  formGroup: FormGroup;
  documentTemplate: any;
  formLayout: any = {};
  formValidator: any = {};
  sourceDocuments: any;
  values = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  initializeForm(data) {
    this.formGroup = this.fb.group({});

    this.sourceDocuments = data;

    this.documentTemplate.sections.forEach((section) => {
      this.generateFormGroup(section);
    });

    if (this.values) {
      this.patchValue(this.values, this.formGroup);
    }

    setTimeout(() => {
      this.loading = false;
    }, 100);
  }

  generateFormGroup(section: any, formGroup = null) {
    section.elements.forEach((element) => {
      if (element.field) {
        if (formGroup) {
          formGroup.addControl(
            element.element_name,
            this.fb.control(
              this.prepopulatedValue(element.prepopulated_from)
                ? this.prepopulatedValue(element.prepopulated_from)
                : this.conditionalEvent(element.field, 'checked')
                ? true
                : element.default_value,
              element.is_required ? Validators.required : []
            )
          );
          formGroup.updateValueAndValidity();
        } else {
          this.formGroup.addControl(
            element.element_name,
            this.fb.control(
              this.prepopulatedValue(element.prepopulated_from)
                ? this.prepopulatedValue(element.prepopulated_from)
                : this.conditionalEvent(element.field, 'checked')
                ? true
                : element.default_value,
              element.is_required ? Validators.required : []
            )
          );
          this.formGroup.updateValueAndValidity();
        }
        this.formLayout[element.element_name] = `${element.field.field_type}|${element.field.data_type}`;

        if(element?.is_required) {
          this.formValidator[element.element_name] = [Validators.required];
        }
      }

      if (element.section && element.section.type !== 'array') {
        this.generateFormGroup(element.section, formGroup);
      }

      if (
        element.section &&
        (element.section.type === 'array' ||
          element.section.type === 'row-array')
      ) {
        const values = this.prepopulatedValue(element.prepopulated_from);
        const array = [];

        if (values) {
          values.forEach((value) => {
            const group = this.fb.group({});
            Object.keys(value).forEach((key) => {
              group.addControl(key, this.fb.control(value[key]));
            });
            array.push(group);
          });
          this.formGroup.addControl(element.element_name, this.fb.array(array));
        } else {
          const content = this.fb.group({});
          array.push(content);
          this.formGroup.addControl(element.element_name, this.fb.array(array));
          this.generateFormGroup(element.section, content);
        }
      }

      if (element.row && element.row.type === 'microservice') {
        this.formGroup.addControl(element.element_name, this.fb.array([]));
      }
    });
  }

  patchValue(values, formGroup: FormGroup, formGroupKey = null) {
    if (values instanceof Array) {
      const items = (formGroup.get(formGroupKey) as FormArray);

      while (items?.length !== 0) {
        items?.removeAt(0);
      }

      values?.forEach((value) => {
        items.push(
          this.patchValue(value, this.fb.group(value))
        );
      });
    } else if (values instanceof Object) {
      Object.keys(values).forEach((key) => {
        if (values[key] instanceof Array) {
          this.patchValue(values[key], formGroup, key);
        } else if (values[key] instanceof Object) {
          this.patchValue(values[key], formGroup.get(key) as FormGroup);
        } else {
          formGroup.get(key).setValue(values[key]);
          formGroup.get(key).updateValueAndValidity();
        }
      });
      return formGroup;
    }
  }

  prepopulatedValue(populatedName: string) {
    if (populatedName) {
      const source: any = populatedName.split('.');
      const foundDocument: any = this.sourceDocuments.find(
        (document) => document.template_code === source[0]
      );

      if (foundDocument) {
        return foundDocument.values[source[1]];
      } else {
        return this.getObjectProperty(this, source);
      }
    }
    return null;
  }

  insertTextTemplate(field, content) {
    const control = this.formGroup.get(field.name) as FormControl;
    const newContent =
      (control.value ? control.value + '<br><br>' : '') + content;

    control.setValue(newContent);
    control.updateValueAndValidity();
  }

  conditionalEvent(field: any, event: string) {
    const events: any = [];

    if(field?.logics) {
      for (const logic of field?.logics) {
        let i = 0;
        let conditionalPhrase = '';
  
        for (const condition of logic.conditions) {
          const formattedCondition = this.formatCondition(condition);
          const operand = logic.relation === 'all' ? '&&' : '||';
          conditionalPhrase += `(${formattedCondition}) ${
            i + 1 < logic.conditions.length ? operand : ''
          } `;
          i++;
        }
  
        if (eval(conditionalPhrase)) {
          events.push(logic.do);
        }
      }
    }

    return events.includes(event);
  }

  formatCondition(condition) {
    return `'${this.getObjectProperty(
      this,
      (condition.source + '.' + condition.left).split('.')
    )}' ${condition.operator} '${condition.right}'`;
  }

  getObjectProperty(object, properties: any) {
    const property = properties.shift();
    if (typeof object[property] !== 'object' || !object[property]) {
      return object[property];
    } else {
      return this.getObjectProperty(object[property], properties);
    }
  }

  either(type: any, types: any) {
    return types.includes(type);
  }

  addArraySection(element) {
    const content = this.fb.group({});
    const array = this.formGroup.get(element.element_name) as FormArray;
    array.push(content);
    this.generateFormGroup(element.section, content);
  }

  removeArraySection(formArray: FormArray, index) {
    formArray.removeAt(index);
  }

  formula(elementName, text, index = null) {
    let equation: string = '';
    const formula: string = text ? text : '';
    let source = null;

    formula.split(' ').forEach((content) => {
      const arrayContent = content.split('.');
      if (arrayContent.length > 1) {
        source = arrayContent[0];
        equation += this.formGroup.value[source][index][arrayContent[2]];
      } else {
        if (content.match(/[A-Za-z0-9_]+/g)) {
          equation += this.formGroup.value[content];
        } else {
          equation += content;
        }
      }
    });

    if (source) {
      (this.formGroup.get(source) as FormArray)
        .at(index)
        .get(elementName)
        .setValue(eval(equation));
      (this.formGroup.get(source) as FormArray)
        .at(index)
        .get(elementName)
        .updateValueAndValidity();
      this.formGroup.get(source).updateValueAndValidity();
    } else {
      this.formGroup.get(elementName).setValue(eval(equation));
      this.formGroup.get(elementName).updateValueAndValidity();
    }

    return eval(equation);
  }

  componentClick(name, identifier) {
    this[name]?.onOpen(identifier);
  }

  onMicroserviceUpdate() {
    this.saveForm.emit();
    // this.service.updateDocument(this.documentId,{
    //     values : this.formGroup.value
    // }).subscribe((response: any) => {
    //     this.toastr.success(`Successfully updated the clinical document.`);
    //     this.values = this.formGroup.value;
    //     this.cdr.detectChanges();
    // });
  }

  onOpdVitalSignsUpdate() {
    // this.service.updateDocument(this.documentId,{
    //     values : this.formGroup.value
    // }).subscribe((response: any) => {
    //     this.values = this.formGroup.value;
    //     this.cdr.detectChanges();
    // });
  }

  onUpload(elementName, file) {
    const old = this.formGroup?.value[elementName]?.split('|');
    const value = [
      ...file.data.map((fileData) => fileData?.filename),
      ...old,
    ]?.join('|');
    this.formGroup.get(elementName).setValue(value);
    this.formGroup.get(elementName).updateValueAndValidity();
  }

  onRemove(elementName, value) {
    this.formGroup.get(elementName).setValue(value);
    this.formGroup.get(elementName).updateValueAndValidity();
  }
}
