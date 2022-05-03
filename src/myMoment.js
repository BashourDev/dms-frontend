import moment from "moment";
import "moment/locale/ar-ma";

moment.locale("ar");
moment().format("YYYY-MM-DD hh:mm a");

export default moment;
