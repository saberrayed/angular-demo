
import * as moment from 'moment'

export function getCurrentDate() {
    return moment(new Date()).format('YYYY-MM-DD');
}

export function formatDate(date, format = 'YYYY-MM-DD') {
    return moment(date).format(format);
}