import { AbstractControl } from '@angular/forms';

export function ValidateContactRequirement(control) {
    
    if(control?.value?.filter((item) => item?.type_code === 'M' && item?.contact_details )?.length < 1 && control?.value?.filter((item) => item?.type_code === 'E' && item?.contact_details )?.length < 1){
        return { mobile_email_required: true };
    }

    if(control?.value?.filter((item) => item?.type_code === 'M' && item?.contact_details )?.length < 1){
        return { mobile_required: true };
    }

    if(control?.value?.filter((item) => item?.type_code === 'E' && item?.contact_details )?.length < 1) {
        return { email_required: true };
    }

    return null;
}